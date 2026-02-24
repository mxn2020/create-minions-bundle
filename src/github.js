import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * Setup GitHub repository using the `gh` CLI.
 * @param {object} config - Project configuration
 */
export async function setupGitHub(config) {
    const repoName = `${config.githubOrg}/${config.projectName}`;
    const projectDir = config.projectName;

    // Check if gh CLI is available
    try {
        execSync('gh --version', { stdio: 'ignore' });
    } catch {
        throw new Error(
            'GitHub CLI (gh) not found. Install it from https://cli.github.com/ or run without --github'
        );
    }

    // Check if authenticated
    try {
        execSync('gh auth status', { stdio: 'ignore' });
    } catch {
        throw new Error(
            'Not authenticated with GitHub CLI. Run: gh auth login'
        );
    }

    console.log(chalk.dim(`\n  Creating repository ${repoName}...`));

    // Create repo
    execSync(
        `gh repo create ${repoName} --public --description "${config.projectDescription}" --source ${projectDir} --push`,
        { stdio: 'inherit', cwd: process.cwd() }
    );

    // Initialize git and push
    console.log(chalk.dim('  Initializing git...'));
    execSync('git init', { cwd: projectDir, stdio: 'ignore' });
    execSync('git add .', { cwd: projectDir, stdio: 'ignore' });
    execSync('git commit -m "chore: initial bundle scaffold from create-minions-bundle"', {
        cwd: projectDir,
        stdio: 'ignore',
    });
    execSync('git branch -M main', { cwd: projectDir, stdio: 'ignore' });

    // Push to main
    console.log(chalk.dim('  Pushing to main...'));
    execSync(`git remote add origin https://github.com/${repoName}.git`, {
        cwd: projectDir,
        stdio: 'ignore',
    });
    execSync('git push -u origin main', { cwd: projectDir, stdio: 'inherit' });

    // Create dev branch
    console.log(chalk.dim('  Creating dev branch...'));
    execSync('git checkout -b dev', { cwd: projectDir, stdio: 'ignore' });
    execSync('git push -u origin dev', { cwd: projectDir, stdio: 'inherit' });

    // Switch back to dev as the working branch
    execSync('git checkout dev', { cwd: projectDir, stdio: 'ignore' });

    // Set repo topics
    const topics = config.keywords.slice(0, 10).join(',');
    try {
        execSync(`gh repo edit ${repoName} --add-topic "${topics}"`, { stdio: 'ignore' });
    } catch {
        // topics are best-effort
    }

    // Enable issues and discussions
    try {
        execSync(`gh repo edit ${repoName} --enable-issues --enable-wiki=false`, { stdio: 'ignore' });
    } catch {
        // best-effort
    }

    // Set Secrets from Environment
    if (process.env.NPM_TOKEN) {
        console.log(chalk.dim('  Setting NPM_TOKEN secret...'));
        try {
            execSync(`gh secret set NPM_TOKEN --body "${process.env.NPM_TOKEN}"`, { cwd: projectDir, stdio: 'ignore' });
        } catch (e) {
            console.log(chalk.yellow('  Failed to set NPM_TOKEN secret'));
        }
    }

    console.log(chalk.green(`\n  ✅ Repository created: https://github.com/${repoName}`));
    console.log(chalk.dim(`  Branches: main, dev (currently on dev)`));
    console.log('');
    console.log(chalk.yellow('  ⚠️  Manual steps required:'));
    if (!process.env.NPM_TOKEN) {
        console.log(chalk.dim('  • Add NPM_TOKEN secret to repository'));
    }
    console.log(chalk.dim('  • Enable branch protection on main'));
    console.log(chalk.dim('  • See MANUAL.md for full details'));
}
