import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { render, buildVariables } from './template.js';
import { generateManual } from './manual.js';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATES_DIR = join(__dirname, '..', 'templates');

/**
 * Generate a project from templates.
 * @param {object} config - Project configuration
 * @returns {{ outputDir: string, filesCreated: number, dirsCreated: number }}
 */
export async function generateProject(config) {
    const outputDir = join(process.cwd(), config.projectName);
    const variables = buildVariables(config);

    if (config.dryRun) {
        console.log(chalk.yellow('\n  ── DRY RUN ──\n'));
        const files = collectTemplateFiles(TEMPLATES_DIR);
        for (const file of files) {
            const relPath = relative(TEMPLATES_DIR, file);
            const outputPath = resolveOutputPath(relPath, variables);
            console.log(`  ${chalk.dim('create')} ${outputPath}`);
        }
        console.log(`\n  ${chalk.dim(`${files.length} files would be created`)}\n`);
        return { outputDir, filesCreated: 0, dirsCreated: 0 };
    }

    if (existsSync(outputDir)) {
        throw new Error(`Directory "${config.projectName}" already exists`);
    }

    let filesCreated = 0;
    let dirsCreated = 0;

    // Walk templates and render each file
    const files = collectTemplateFiles(TEMPLATES_DIR);

    for (const templateFile of files) {
        const relPath = relative(TEMPLATES_DIR, templateFile);
        const outputPath = resolveOutputPath(relPath, variables);
        const fullOutputPath = join(outputDir, outputPath);

        // Create parent directories
        const parentDir = dirname(fullOutputPath);
        if (!existsSync(parentDir)) {
            mkdirSync(parentDir, { recursive: true });
            dirsCreated++;
        }

        // Read template and render
        const content = readFileSync(templateFile, 'utf-8');
        const rendered = render(content, variables);

        writeFileSync(fullOutputPath, rendered, 'utf-8');
        filesCreated++;
    }

    // Generate MANUAL.md
    const manualContent = generateManual(config);
    const manualPath = join(outputDir, 'MANUAL.md');
    writeFileSync(manualPath, manualContent, 'utf-8');
    filesCreated++;

    return { outputDir, filesCreated, dirsCreated };
}

/**
 * Recursively collect all files in a directory.
 */
function collectTemplateFiles(dir) {
    const results = [];
    const entries = readdirSync(dir);

    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            results.push(...collectTemplateFiles(fullPath));
        } else {
            results.push(fullPath);
        }
    }

    return results;
}

/**
 * Resolve output path from template path.
 * Template directories use a flat mapping:
 * - templates/root/* → project root
 * - templates/github/* → .github/*
 * - templates/src/* → src/*
 */
function resolveOutputPath(relPath, variables) {
    let outputPath = relPath;

    if (outputPath.startsWith('root/')) {
        outputPath = outputPath.replace(/^root\//, '');
    } else if (outputPath.startsWith('github/')) {
        outputPath = outputPath.replace(/^github\//, '.github/');
    }

    // Remove .template extension if present
    outputPath = outputPath.replace(/\.template$/, '');

    return outputPath;
}
