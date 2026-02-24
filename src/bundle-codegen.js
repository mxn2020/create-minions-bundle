/**
 * Contains the logic to generate TypeScript and Markdown code corresponding 
 * to the types, relations, views, and skills defined in the bundle config.
 */

export function generateBundleCode(config) {
    const { finalCode, importsMap } = generateTypesCode(config.types, config.projectSlug);
    let bundleTypesCode = finalCode;
    let relationsCode = generateRelationsCode(config.relations);
    let viewsCode = generateViewsCode(config.views);
    let skillsCode = generateSkillsCode(config.skills, config.types);

    // Collect dependencies
    const dependenciesObj = {};
    for (const source of importsMap.keys()) {
        dependenciesObj[source] = "latest"; // Use latest for external dependencies
    }
    const dependenciesJson = Object.keys(dependenciesObj).length > 0
        ? ",\n    " + JSON.stringify(dependenciesObj, null, 4).slice(1, -1).trim()
        : "";

    return {
        bundleTypesCode,
        relationsCode,
        viewsCode,
        skillsCode,
        dependenciesJson
    };
}

function generateTypesCode(typesDef, projectSlug) {
    let importsMap = new Map(); // e.g. '@minions-tasks/sdk' => ['taskType', 'taskListType']

    if (!typesDef || Object.keys(typesDef).length === 0) {
        return { finalCode: `export const bundleTypes: MinionType[] = [];\n`, importsMap };
    }
    let inlineTypes = [];
    let exportedTypeNames = [];

    for (const [slug, def] of Object.entries(typesDef)) {
        if (def.source && def.import) {
            // It's a referenced type
            if (!importsMap.has(def.source)) {
                importsMap.set(def.source, new Set());
            }
            importsMap.get(def.source).add(def.import);
            exportedTypeNames.push({ name: def.import, isInline: false });
        } else {
            // It's an inline newly defined type
            const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/[-_]/g, ' ');
            const tsVarName = `${slug.replace(/[-_]/g, '')}Type`;
            const description = def.description || `Bundle type for ${name}`;
            const icon = def.icon || '📦';

            let code = `export const ${tsVarName}: MinionType = {\n`;
            code += `  id: 'bundle-${projectSlug}-${slug}',\n`;
            code += `  name: '${name}',\n`;
            code += `  slug: '${slug}',\n`;
            code += `  description: '${description.replace(/'/g, "\\'")}',\n`;
            code += `  icon: '${icon}',\n`;

            if (def.extends) {
                // Not formally supported by MinionType but good for comments/future
                code += `  // extends: '${def.extends}',\n`;
            }

            code += `  schema: [\n`;
            for (const [fieldName, fieldType] of Object.entries(def.fields || {})) {
                let finalType = fieldType === 'boolean' ? 'boolean' :
                    fieldType === 'number' ? 'number' :
                        fieldType === 'select' ? 'select' :
                            fieldType === 'date' || fieldType === 'datetime' ? 'date' : 'string';

                code += `    { name: '${fieldName}', type: '${finalType}', label: '${fieldName}' },\n`;
            }
            code += `  ],\n};\n`;

            inlineTypes.push(code);
            exportedTypeNames.push({ name: tsVarName, isInline: true });
        }
    }

    let finalCode = `import type { MinionType } from 'minions-sdk';\n\n`;

    // Add imports
    for (const [source, namedImports] of importsMap.entries()) {
        finalCode += `import { ${Array.from(namedImports).join(', ')} } from '${source}';\n`;
    }

    finalCode += `\n// --- Inline Bundle Types ---\n\n`;
    finalCode += inlineTypes.join('\n');

    finalCode += `\n// --- Bundle Export ---\n\n`;
    finalCode += `export const bundleTypes: MinionType[] = [\n`;
    for (const t of exportedTypeNames) {
        finalCode += `  ${t.name},\n`;
    }
    finalCode += `];\n`;

    return { finalCode, importsMap };
}

function generateRelationsCode(relationsDef) {
    if (!relationsDef || !relationsDef.items || relationsDef.items.length === 0) {
        return `export const bundleRelations = [];\n`;
    }

    let code = `export const bundleRelations = [\n`;
    for (const rel of relationsDef.items) {
        code += `  { from: '${rel.from}', relation: '${rel.relation}', to: '${rel.to}' },\n`;
    }
    code += `];\n`;
    return code;
}

function generateViewsCode(viewsDef) {
    if (!viewsDef || Object.keys(viewsDef).length === 0) {
        return `export const bundleViews = {};\n`;
    }

    let code = `export const bundleViews = {\n`;
    for (const [viewName, def] of Object.entries(viewsDef)) {
        code += `  ${viewName}: {\n`;
        if (def.description) code += `    description: '${def.description.replace(/'/g, "\\'")}',\n`;
        if (def.type) code += `    type: '${def.type}',\n`;
        if (def.filter) {
            code += `    filter: ${JSON.stringify(def.filter, null, 6).replace(/\\n/g, '\\n').trim()},\n`;
        }
        if (def.aggregate) {
            code += `    aggregate: ${JSON.stringify(def.aggregate, null, 6).replace(/\\n/g, '\\n').trim()},\n`;
        }
        code += `  },\n`;
    }
    code += `};\n`;
    return code;
}

function generateSkillsCode(skillsDef, typesDef) {
    if (!skillsDef) {
        return `No skills defined.`;
    }

    let code = '';
    if (skillsDef.context) {
        code += `## Your Context\n\n${skillsDef.context}\n\n`;
    }

    const typeNames = Object.keys(typesDef || {});
    if (typeNames.length > 0) {
        code += `Your MinionTypes are: ${typeNames.join(', ')}.\n\n`;
    }

    if (skillsDef.rules && skillsDef.rules.length > 0) {
        code += `## Hard Rules\n\n`;
        for (const rule of skillsDef.rules) {
            code += `- ${rule}\n`;
        }
        code += `\n`;
    }

    if (skillsDef.items && skillsDef.items.length > 0) {
        for (const skill of skillsDef.items) {
            code += `## Skill: ${skill.name}\n`;
            for (let i = 0; i < (skill.steps || []).length; i++) {
                code += `${i + 1}. ${skill.steps[i]}\n`;
            }
            code += `\n`;
        }
    }

    return code.trim();
}
