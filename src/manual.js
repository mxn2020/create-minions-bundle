/**
 * Generate the MANUAL.md content with project-specific values.
 * @param {object} config - Project configuration
 * @returns {string}
 */
export function generateManual(config) {
    return `# Manual Setup Steps for ${config.projectCapitalized}

This document lists the steps that must be completed manually after scaffolding.
Each step includes specific values for your bundle.

---

## 1. GitHub Repository Secrets

Go to **GitHub → ${config.githubOrg}/${config.projectName} → Settings → Secrets and variables → Actions** and add:

| Secret | Description | Where to get it |
|--------|-------------|-----------------|
| \`NPM_TOKEN\` | npm publish token | [npmjs.com → Access Tokens](https://www.npmjs.com/settings/~/tokens) |

> **Note**: If you share tokens across repos, you can use GitHub Organization secrets instead.

---

## 2. npm Packages — First Publish

Before the CI publish workflow works, you need to publish the initial version manually:

\`\`\`bash
# From the project root
pnpm install
pnpm run build

# Publish bundle
npm publish --access public
\`\`\`

Your package will be available at: [\`${config.projectName}\`](https://www.npmjs.com/package/${config.projectName})

---

## 3. Release Please

Release Please is pre-configured. After your first merge to \`main\`:

1. A "Release PR" will be auto-created
2. Merging the Release PR creates a GitHub Release + git tag
3. The \`publish.yml\` workflow triggers on tags to publish to npm

Verify config:
- [\`release-please-config.json\`](./release-please-config.json)
- [\`.release-please-manifest.json\`](./.release-please-manifest.json)

---

## 4. Branch Protection

Go to **GitHub → Settings → Branches → Add rule**:

- **Branch name pattern**: \`main\`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass (select: \`build-and-test\`)
- ✅ Require branches to be up to date
- ❌ Do not allow force pushes

---

## 5. Add to Minions Ecosystem

Update the main [minions.dev](https://minions.dev) website to include this bundle:

1. Add to the plugins/projects listing page
2. Add the project color to \`color_tracking.md\`

---

## Quick Reference

| Item | Value |
|------|-------|
| Project | \`${config.projectName}\` |
| npm Package | \`${config.projectName}\` |
| GitHub | \`github.com/${config.githubRepo}\` |
| Author | ${config.authorName} <${config.authorEmail}> |
| License | ${config.license} |
`;
}
