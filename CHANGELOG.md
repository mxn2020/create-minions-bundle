# Changelog

## [0.1.1](https://github.com/mxn2020/create-minions-bundle/compare/create-minions-bundle-v0.1.0...create-minions-bundle-v0.1.1) (2026-02-25)


### Features

* add ideation, portfolio, execution bundle configs and fix pnpm-workspace + CLI package.json templates ([bfb13bf](https://github.com/mxn2020/create-minions-bundle/commit/bfb13bf1977efd79f1d8728a1651d9ef1fb4dd55))
* add PYPI_TOKEN to github.js and .env.example for automatic secret setting ([06e7e59](https://github.com/mxn2020/create-minions-bundle/commit/06e7e596f32fd18cba924dbec9a2ee48ad4879ff))
* bump minions-sdk to 0.2.4 in templates (YamlFileStorageAdapter support) ([4071694](https://github.com/mxn2020/create-minions-bundle/commit/4071694cd004d82eaffb75fd485e30eb6146d689))
* generate vitest unit tests from TOML type definitions; fix CLI package.json keywords ([897dc1f](https://github.com/mxn2020/create-minions-bundle/commit/897dc1fa1dc9ed46172ed935ca05b151e4780641))
* migrate bundle generator to monorepo architecture ([31d1919](https://github.com/mxn2020/create-minions-bundle/commit/31d191969e025eccd149bcf9f9881d929d72134d))


### Bug Fixes

* add generatePythonSchemas() to properly interpolate Python type schemas in generated bundles ([0db5b51](https://github.com/mxn2020/create-minions-bundle/commit/0db5b5184dd8539ba4383a26faa9d565e0545488))
* rename packages/core to packages/sdk and fix scaffolder codegen error ([2637b66](https://github.com/mxn2020/create-minions-bundle/commit/2637b66ac15e71c3553f4bc9d1c7e27a39e01a7a))
* use @{projectName}/sdk naming convention instead of @mxn2020/{name}-sdk ([0267e4c](https://github.com/mxn2020/create-minions-bundle/commit/0267e4ce92b2d5e030a2a29424c5b51d7dceabfa))
