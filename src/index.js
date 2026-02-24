#!/usr/bin/env node

import { Command } from 'commander';
import { runInteractivePrompts } from './prompts.js';
import { generateProject } from './generator.js';
import { setupGitHub } from './github.js';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import * as dotenv from 'dotenv';
import { parse } from 'smol-toml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the CLI's installation directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

const program = new Command();

program
    .name('create-minions-bundle')
    .description('Scaffold a new Minions ecosystem bundle project')
    .version(pkg.version)
    .argument('[config-file]', 'Path to the TOML configuration file (e.g., crm-bundle.toml)')
    .option('-o, --org <org>', 'GitHub org/user', 'mxn2020')
    .option('-a, --author <name>', 'Author name', 'Mehdi Nabhani')
    .option('-e, --email <email>', 'Author email', 'mehdi@the-mehdi.com')
    .option('--github', 'Setup GitHub repository (requires gh CLI)')
    .option('--dry-run', 'Print what would be created without writing files')
    .option('--license <license>', 'License type', 'MIT')
    .action(async (configFile, options) => {
        console.log('');
        console.log(chalk.bold.hex('#8B5CF6')('  🚀 create-minions-bundle'));
        console.log(chalk.dim('  Scaffold a new Minions organized bundle\n'));

        let config;
        let tomlData = null;

        // Ensure we have a config file in non-interactive / mixed mode
        if (configFile && extname(configFile) === '.toml') {
            try {
                const tomlContent = readFileSync(configFile, 'utf-8');
                tomlData = parse(tomlContent);
                console.log(chalk.dim(`  Loaded configuration from ${configFile}`));

                // Merge options with TOML
                if (tomlData.org) options.org = tomlData.org;
                if (tomlData.colors) {
                    if (tomlData.colors.accent) options.accent = tomlData.colors.accent;
                    if (tomlData.colors['accent-hover']) options.accentHover = tomlData.colors['accent-hover'];
                }
            } catch (err) {
                console.error(chalk.red(`  Failed to parse TOML file: ${err.message}`));
                process.exit(1);
            }
        }

        if (tomlData && tomlData.name && tomlData.description) {
            // Non-interactive mode mostly — all required fields provided in TOML
            config = buildConfigFromToml(tomlData, options);
        } else {
            // Interactive mode — prompt for missing values
            config = await runInteractivePrompts(tomlData, options);
        }

        // Attach types, relations, views, and skills if parsed from TOML
        if (tomlData) {
            config.types = tomlData.types || {};
            config.relations = tomlData.relations || {};
            config.views = tomlData.views || {};
            config.skills = tomlData.skills || {};
        }

        // Generate the project
        const spinner = ora({ text: 'Generating bundle...', color: 'magenta' }).start();

        try {
            const result = await generateProject(config);
            spinner.succeed(chalk.green(`Bundle generated at ${chalk.bold(result.outputDir)}`));

            console.log('');
            console.log(chalk.dim('  ─────────────────────────────────────'));
            console.log(`  📁 ${chalk.bold(result.filesCreated)} files created`);
            console.log(`  📂 ${chalk.bold(result.dirsCreated)} directories created`);
            console.log('');

            // Optional GitHub setup
            if (config.setupGitHub) {
                const ghSpinner = ora({ text: 'Setting up GitHub repository...', color: 'cyan' }).start();
                try {
                    await setupGitHub(config);
                    ghSpinner.succeed(chalk.green('GitHub repository configured'));
                } catch (err) {
                    ghSpinner.fail(chalk.red(`GitHub setup failed: ${err.message}`));
                    console.log(chalk.yellow('  You can set up the repo manually. See MANUAL.md'));
                }
            }

            // Print next steps
            console.log(chalk.bold('\n  📋 Next steps:\n'));
            console.log(`  ${chalk.cyan('cd')} ${config.projectName}`);
            console.log(`  ${chalk.cyan('pnpm install')}`);
            console.log(`  ${chalk.cyan('pnpm run build')}`);
            console.log(`  ${chalk.cyan('pnpm run test')}`);
            console.log('');
            console.log(chalk.yellow(`  📖 Read ${chalk.bold('MANUAL.md')} for manual setup steps`));

        } catch (err) {
            spinner.fail(chalk.red(`Failed: ${err.message}`));
            process.exit(1);
        }
    });

function buildConfigFromToml(tomlData, options) {
    const projectName = tomlData.name;
    const slug = projectName.replace(/^minions-bundles-/, '');
    const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);

    return {
        projectName,
        projectSlug: slug,
        projectCapitalized: `Minions Bundle: ${capitalizedSlug}`,
        projectDescription: tomlData.description || `A curated Minions ecosystem bundle for ${slug}`,
        authorName: options.author,
        authorEmail: options.email,
        authorUrl: 'https://the-mehdi.com',
        githubOrg: options.org,
        githubRepo: `${options.org}/${projectName}`,
        license: options.license,
        keywords: [slug, 'bundle', 'ai', 'minions'],
        year: new Date().getFullYear().toString(),
        accentColor: options.accent || '#8B5CF6',
        accentHoverColor: options.accentHover || '#7C3AED',
        setupGitHub: options.github || false,
        dryRun: options.dryRun || false,
    };
}

program.parse();
