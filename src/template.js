/**
 * Replace all {{variable}} placeholders in a string.
 * @param {string} content - Template string
 * @param {Record<string, string|string[]>} variables - Values to substitute
 * @returns {string}
 */
export function render(content, variables) {
    return content.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        if (key in variables) {
            const val = variables[key];
            return String(val);
        }
        return match; // leave unresolved placeholders as-is
    });
}

import { generateBundleCode } from './bundle-codegen.js';

/**
 * Build the flat variables map from a config object.
 * @param {object} config
 * @returns {Record<string, string>}
 */
export function buildVariables(config) {
    const { bundleTypesCode, relationsCode, viewsCode, skillsCode, dependenciesJson, pythonSchemas, bundleTestsCode } = generateBundleCode(config);

    return {
        projectName: config.projectName,
        projectSlug: config.projectSlug,
        projectCapitalized: config.projectCapitalized,
        cliCommand: config.projectName,
        sdkName: `@mxn2020/${config.projectName}-sdk`,
        cliName: `@mxn2020/${config.projectName}-cli`,
        docsName: `${config.projectName}-docs`,
        blogName: `${config.projectName}-blog`,
        webName: `${config.projectName}-web`,
        pythonModule: config.projectName.replace(/-/g, '_'),
        pythonPackage: config.projectName,
        domainHelp: 'docs.minions.wtf',
        domainApp: 'app.minions.wtf',
        domainBlog: 'blog.minions.wtf',
        projectDescription: config.projectDescription,
        authorName: config.authorName,
        authorEmail: config.authorEmail,
        authorUrl: config.authorUrl,
        githubOrg: config.githubOrg,
        githubRepo: config.githubRepo,
        license: config.license,
        keywords: config.keywords.join(', '),
        keywordsJson: JSON.stringify(config.keywords),
        year: config.year,
        bundleTypesCode,
        relationsCode,
        viewsCode,
        skillsCode,
        dependenciesJson,
        accentColor: config.accentColor,
        accentHoverColor: config.accentHoverColor,
        pythonSchemas,
        bundleTestsCode,
    };
}
