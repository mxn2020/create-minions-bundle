/**
 * Generate the MANUAL.md content with project-specific values.
 * @param {object} config - Project configuration
 * @returns {string}
 */
export function generateManual(config) {
    return `# Manual Setup Steps for ${config.projectCapitalized}

This document lists the steps that must be completed manually after scaffolding.
Each step includes specific values for your project.

---

## 1. GitHub Repository Secrets

Go to **GitHub → ${config.githubOrg}/${config.projectName} → Settings → Secrets and variables → Actions** and add:

| Secret | Description | Where to get it |
|--------|-------------|-----------------|
| \`NPM_TOKEN\` | npm publish token | [npmjs.com → Access Tokens](https://www.npmjs.com/settings/~/tokens) |
| \`PYPI_TOKEN\` | PyPI API token for \`${config.pythonPackage}\` | [pypi.org → Account Settings → API tokens](https://pypi.org/manage/account/#api-tokens) |

> **Note**: If you share tokens across repos, you can use GitHub Organization secrets instead.

---

## 2. Netlify Sites

Create **3 Netlify sites** — one for each app:

### Web App (Playground)
- **Netlify site name**: \`${config.projectName}-web\`
- **GitHub repo**: \`${config.githubOrg}/${config.projectName}\`
- **Base directory**: \`apps/web\`
- **Build command**: \`pnpm run build\`
- **Publish directory**: \`apps/web/dist\`
- **Custom domain**: \`${config.domainApp}\`

### Documentation
- **Netlify site name**: \`${config.projectName}-docs\`
- **GitHub repo**: \`${config.githubOrg}/${config.projectName}\`
- **Base directory**: \`apps/docs\`
- **Build command**: \`pnpm run build\`
- **Publish directory**: \`apps/docs/dist\`
- **Custom domain**: \`${config.domainHelp}\`

### Blog
- **Netlify site name**: \`${config.projectName}-blog\`
- **GitHub repo**: \`${config.githubOrg}/${config.projectName}\`
- **Base directory**: \`apps/blog\`
- **Build command**: \`pnpm run build\`
- **Publish directory**: \`apps/blog/dist\`
- **Custom domain**: \`${config.domainBlog}\`

---

## 3. DNS Configuration

Add CNAME records at your DNS provider:

| Record | Type | Name | Value |
|--------|------|------|-------|
| Docs | CNAME | \`${config.projectSlug}.minions.help\` | _(Netlify subdomain)_ |
| Blog | CNAME | \`${config.projectSlug}.minions.blog\` | _(Netlify subdomain)_ |
| App  | CNAME | \`${config.projectSlug}.minions.wtf\` | _(Netlify subdomain)_ |

> Get the Netlify subdomain from Netlify → Site settings → Domain management

---

## 4. npm Packages — First Publish

Before the CI publish workflow works, you need to publish initial versions manually:

\`\`\`bash
# From the project root
pnpm install
pnpm run build

# Publish SDK
cd packages/sdk
npm publish --access public
cd ../..

# Publish CLI
cd packages/cli
npm publish --access public
cd ../..
\`\`\`

Your packages:
- SDK: [\`${config.sdkName}\`](https://www.npmjs.com/package/${config.sdkName})
- CLI: [\`${config.cliName}\`](https://www.npmjs.com/package/${config.cliName})

---

## 5. PyPI Package — First Publish

\`\`\`bash
cd packages/python

# Create virtual env
python -m venv .venv
source .venv/bin/activate

# Install build tools
pip install hatch twine

# Build
hatch build

# Upload (you'll be prompted for your PyPI token)
twine upload dist/*
\`\`\`

Your package: [\`${config.pythonPackage}\`](https://pypi.org/project/${config.pythonPackage}/)

---

## 6. Release Please

Release Please is pre-configured. After your first merge to \`main\`:

1. A "Release PR" will be auto-created
2. Merging the Release PR creates a GitHub Release + git tag
3. The \`publish.yml\` workflow triggers on tags to publish to npm/PyPI

Verify config:
- [\`release-please-config.json\`](./release-please-config.json)
- [\`.release-please-manifest.json\`](./.release-please-manifest.json)

---

## 7. Branch Protection

Go to **GitHub → Settings → Branches → Add rule**:

- **Branch name pattern**: \`main\`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass (select: \`build-and-test\`, \`python-sdk\`)
- ✅ Require branches to be up to date
- ❌ Do not allow force pushes

---

## 8. Add to Minions Ecosystem

Update the main [minions.dev](https://minions.dev) website to include this project:

1. Add to the plugins/projects listing page
2. Add the project color to \`color_tracking.md\`
3. Link documentation from the main docs

---

## Quick Reference

| Item | Value |
|------|-------|
| Project | \`${config.projectName}\` |
| SDK (npm) | \`${config.sdkName}\` |
| CLI (npm) | \`${config.cliName}\` |
| Python (PyPI) | \`${config.pythonPackage}\` |
| GitHub | \`github.com/${config.githubRepo}\` |
| Docs domain | \`${config.domainHelp}\` |
| Blog domain | \`${config.domainBlog}\` |
| App domain | \`${config.domainApp}\` |
| Author | ${config.authorName} <${config.authorEmail}> |
| License | ${config.license} |
`;
}
