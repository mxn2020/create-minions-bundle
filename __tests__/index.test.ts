import { test, expect, describe } from 'vitest';
import { render, buildVariables } from '../src/template.js';
import { generateProject } from '../src/generator.js';

// ─── render() ──────────────────────────────────────────────────────────────────

describe('render', () => {
  test('replaces single placeholder', () => {
    expect(render('Hello {{name}}', { name: 'World' })).toBe('Hello World');
  });

  test('replaces multiple placeholders', () => {
    const result = render('{{a}} + {{b}} = {{c}}', { a: '1', b: '2', c: '3' });
    expect(result).toBe('1 + 2 = 3');
  });

  test('handles whitespace inside braces', () => {
    expect(render('{{ name }}', { name: 'Minions' })).toBe('Minions');
  });

  test('leaves unresolved placeholders as-is', () => {
    expect(render('{{known}} {{unknown}}', { known: 'ok' })).toBe('ok {{unknown}}');
  });

  test('handles empty string values', () => {
    expect(render('pre-{{val}}-post', { val: '' })).toBe('pre--post');
  });

  test('returns input unchanged when no placeholders', () => {
    expect(render('no placeholders here', { x: 'y' })).toBe('no placeholders here');
  });
});

// ─── buildVariables() ──────────────────────────────────────────────────────────

describe('buildVariables', () => {
  const config = {
    projectName: 'minions-bundles-test',
    projectSlug: 'test',
    projectCapitalized: 'Minions Bundles Test',
    projectDescription: 'A test bundle',
    authorName: 'Test Author',
    authorEmail: 'test@example.com',
    authorUrl: 'https://example.com',
    githubOrg: 'testorg',
    githubRepo: 'testorg/minions-bundles-test',
    license: 'MIT',
    keywords: ['test', 'bundles'],
    year: '2026',
    accentColor: '#8B5CF6',
    accentHoverColor: '#7C3AED',
    tables: {
      'test-item': {
        description: 'A test MinionType',
        icon: '🧪',
        fields: {
          name: 'string',
          count: 'number',
          active: 'boolean',
        },
      },
    },
  };

  test('produces all required keys', () => {
    const vars = buildVariables(config);
    expect(vars.projectName).toBe('minions-bundles-test');
    expect(vars.projectSlug).toBe('test');
    expect(vars.projectCapitalized).toBe('Minions Bundles Test');
    expect(vars.sdkName).toBe('@minions-bundles-test/sdk');
    expect(vars.cliName).toBe('@minions-bundles-test/cli');
    expect(vars.authorName).toBe('Test Author');
    expect(vars.githubOrg).toBe('testorg');
    expect(vars.license).toBe('MIT');
    expect(vars.year).toBe('2026');
  });

  test('produces keywordsJson as valid JSON', () => {
    const vars = buildVariables(config);
    expect(() => JSON.parse(vars.keywordsJson)).not.toThrow();
    expect(JSON.parse(vars.keywordsJson)).toEqual(['test', 'bundles']);
  });

  test('generates bundleTypesCode from tables', () => {
    const vars = buildVariables(config);
    expect(vars.bundleTypesCode).toBeDefined();
    expect(typeof vars.bundleTypesCode).toBe('string');
    expect(vars.bundleTypesCode.length).toBeGreaterThan(0);
  });

  test('generates derived package names', () => {
    const vars = buildVariables(config);
    expect(vars.pythonModule).toBe('minions_bundles_test');
    expect(vars.pythonPackage).toBe('minions-bundles-test');
  });
});

// ─── generateProject() dry-run ─────────────────────────────────────────────────

describe('generateProject (dry-run)', () => {
  const config = {
    projectName: 'minions-bundles-drytest',
    projectSlug: 'drytest',
    projectCapitalized: 'Minions Bundles Drytest',
    projectDescription: 'Dry run test',
    authorName: 'Test',
    authorEmail: 'test@example.com',
    authorUrl: 'https://example.com',
    githubOrg: 'testorg',
    githubRepo: 'testorg/minions-bundles-drytest',
    license: 'MIT',
    keywords: ['drytest'],
    year: '2026',
    accentColor: '#8B5CF6',
    accentHoverColor: '#7C3AED',
    tables: {},
    dryRun: true,
  };

  test('returns zero files and dirs in dry-run mode', async () => {
    const result = await generateProject(config);
    expect(result.filesCreated).toBe(0);
    expect(result.dirsCreated).toBe(0);
  });

  test('returns correct output directory', async () => {
    const result = await generateProject(config);
    expect(result.outputDir).toContain('minions-bundles-drytest');
  });
});
