![CI](https://github.com/mxn2020/create-minions-bundle/actions/workflows/ci.yml/badge.svg) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

# create-minions-bundle

CLI tool to scaffold Minions ecosystem **bundles**.
Bundles are curated assemblies of MinionTypes (schemas), relations, and views tailored for a specific domain.

Unlike standard toolboxes, bundles do not have CLI or Python SDKs and use a simpler single-package structure.

## Usage

\`\`\`bash
# Run with a TOML file
node src/index.js path/to/my-bundle.toml

# Test without writing files
node src/index.js path/to/my-bundle.toml --dry-run
\`\`\`
