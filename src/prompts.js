import inquirer from 'inquirer';
import chalk from 'chalk';

/**
 * Run interactive prompts to collect project configuration.
 * Pre-fills with any values already provided via TOML or CLI flags.
 */
export async function runInteractivePrompts(tomlData = null, options = {}) {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name:',
            default: (tomlData && tomlData.name) ? tomlData.name : 'minions-bundles-example',
            validate: (input) => {
                if (!/^minions-bundles-[a-z0-9-]+$/.test(input)) {
                    return 'Must start with "minions-bundles-" followed by lowercase letters/numbers/hyphens';
                }
                return true;
            },
            when: !(tomlData && tomlData.name),
        },
        {
            type: 'input',
            name: 'projectDescription',
            message: 'Short description:',
            default: (ans) => {
                const name = (tomlData && tomlData.name) ? tomlData.name : ans.projectName;
                const slug = name.replace(/^minions-bundles-/, '');
                return `A curated Minions ecosystem bundle for ${slug}`;
            },
            when: !(tomlData && tomlData.description) && !options.description,
        },
        {
            type: 'input',
            name: 'authorName',
            message: 'Author name:',
            default: options.author || 'Mehdi Nabhani',
        },
        {
            type: 'input',
            name: 'authorEmail',
            message: 'Author email:',
            default: options.email || 'mehdi@the-mehdi.com',
        },
        {
            type: 'input',
            name: 'githubOrg',
            message: 'GitHub org/user:',
            default: (tomlData && tomlData.org) ? tomlData.org : (options.org || 'mxn2020'),
        },
        {
            type: 'list',
            name: 'license',
            message: 'License:',
            choices: ['MIT', 'Apache-2.0', 'AGPL-3.0'],
            default: options.license || 'MIT',
        },
        {
            type: 'input',
            name: 'keywords',
            message: 'Keywords (comma-separated):',
            default: (ans) => {
                const name = (tomlData && tomlData.name) ? tomlData.name : ans.projectName;
                const slug = name.replace(/^minions-bundles-/, '');
                return `${slug}, bundle, ai, minions`;
            },
            filter: (input) => input.split(',').map((k) => k.trim()).filter(Boolean),
        },
        {
            type: 'confirm',
            name: 'setupGitHub',
            message: 'Setup GitHub repository? (requires gh CLI)',
            default: false,
            when: options.github === undefined,
        },
    ]);

    const name = (tomlData && tomlData.name) ? tomlData.name : answers.projectName;
    const slug = name.replace(/^minions-bundles-/, '');
    const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);

    const config = {
        projectName: name,
        projectSlug: slug,
        projectCapitalized: `Minions Bundle: ${capitalizedSlug}`,
        projectDescription: (tomlData && tomlData.description) ? tomlData.description : (options.description || answers.projectDescription),
        authorName: answers.authorName || options.author || 'Mehdi Nabhani',
        authorEmail: answers.authorEmail || options.email || 'mehdi@the-mehdi.com',
        authorUrl: 'https://the-mehdi.com',
        githubOrg: answers.githubOrg || options.org || 'mxn2020',
        githubRepo: `${answers.githubOrg || options.org || 'mxn2020'}/${name}`,
        license: answers.license || options.license || 'MIT',
        keywords: answers.keywords || [slug, 'bundle', 'ai', 'minions'],
        year: new Date().getFullYear().toString(),
        accentColor: (tomlData && tomlData.colors && tomlData.colors.accent) ? tomlData.colors.accent : (options.accent || '#8B5CF6'),
        accentHoverColor: (tomlData && tomlData.colors && tomlData.colors['accent-hover']) ? tomlData.colors['accent-hover'] : (options.accentHover || '#7C3AED'),
        setupGitHub: answers.setupGitHub || options.github || false,
        dryRun: options.dryRun || false,
    };

    // Confirmation
    console.log('');
    console.log(chalk.bold('  📦 Bundle Configuration:'));
    console.log(chalk.dim('  ─────────────────────────────────────'));
    console.log(`  Name:         ${chalk.cyan(config.projectName)}`);
    console.log(`  Description:  ${config.projectDescription}`);
    console.log(`  GitHub:       ${chalk.blue(`github.com/${config.githubRepo}`)}`);
    console.log(`  License:      ${config.license}`);
    console.log(`  GitHub setup: ${config.setupGitHub ? chalk.green('Yes') : chalk.dim('No')}`);
    console.log('');

    const { confirmed } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmed',
            message: 'Proceed with these settings?',
            default: true,
        },
    ]);

    if (!confirmed) {
        console.log(chalk.yellow('\n  Aborted.\n'));
        process.exit(0);
    }

    return config;
}
