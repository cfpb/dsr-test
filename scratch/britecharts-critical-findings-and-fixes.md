# Britecharts Modernization: Critical Findings & Required Fixes

This document details the critical integration findings, root causes, and concrete code fixes required for the **`cfpb-britecharts`** repository following the migration to `tsup`, `rstest`, and native ES modules.

Applying these fixes ensures seamless backward compatibility with existing consumers (such as `explorer-app`), eliminates runtime `TypeError` exceptions, and resolves linter configuration failures.

---

## 1. Critical: Fix UMD / CommonJS Module Exports in `build-umd.mjs`

### Root Cause
`scripts/build-umd.mjs` compiles charts using esbuild's `iife` format and assigns instances to `globalThis.britecharts[name]`. However, it does not assign the compiled factory function to `module.exports` or `module.exports.default`.

When downstream consumers (such as `explorer-app`) import legacy UMD paths (e.g. `import line from 'britecharts/dist/umd/line.min'`), the bundler resolves an empty object `{}` rather than the constructor function, triggering:
```
TypeError: line is not a function
TypeError: stackedArea is not a function
```

### Required Fix
Update `assignExport` in `scripts/build-umd.mjs` to attach CommonJS and AMD export headers in the bundle wrapper:

```javascript
// scripts/build-umd.mjs
function assignExport(globalName, property) {
  return {
    js: [
      'var britecharts = globalThis.britecharts || (globalThis.britecharts = {});',
    ].join('\n'),
    footer: [
      `var __export = (${globalName} && ${globalName}.default) || ${globalName};`,
      `britecharts.${property} = __export;`,
      'if (typeof module === "object" && module.exports) {',
      '    module.exports = __export;',
      '    module.exports.default = __export;',
      '} else if (typeof define === "function" && define.amd) {',
      '    define([], function() { return __export; });',
      '}',
    ].join('\n'),
  };
}
```

---

## 2. High Priority: Map Legacy UMD Paths in `package.json` `exports`

### Root Cause
`explorer-app` currently imports from deep legacy UMD paths (`britecharts/dist/umd/line.min`, `britecharts/dist/umd/stackedArea.min`, etc.). Because Node.js and modern bundlers strictly enforce the `package.json` `exports` field, unmapped subpaths without file extensions fail module resolution.

### Required Fix
Add explicit export mappings for legacy UMD paths in `package.json`. Mapping them to both native ESM (`dist/esm/`) and UMD fallbacks allows downstream consumers to immediately benefit from tree-shaking even before updating their import statements:

```json
{
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/bundled/britecharts.min.js",
      "types": "./dist/types/index.d.ts"
    },
    "./line": {
      "import": "./dist/esm/charts/line.js",
      "require": "./dist/umd/line.min.js",
      "types": "./dist/types/charts/line.d.ts"
    },
    "./stacked-area": {
      "import": "./dist/esm/charts/stacked-area.js",
      "require": "./dist/umd/stackedArea.min.js",
      "types": "./dist/types/charts/stacked-area.d.ts"
    },
    "./stackedArea": {
      "import": "./dist/esm/charts/stacked-area.js",
      "require": "./dist/umd/stackedArea.min.js",
      "types": "./dist/types/charts/stacked-area.d.ts"
    },
    "./row": {
      "import": "./dist/esm/charts/row.js",
      "require": "./dist/umd/row.min.js",
      "types": "./dist/types/charts/row.d.ts"
    },
    "./tooltip": {
      "import": "./dist/esm/charts/tooltip.js",
      "require": "./dist/umd/tooltip.min.js",
      "types": "./dist/types/charts/tooltip.d.ts"
    },
    "./mini-tooltip": {
      "import": "./dist/esm/charts/mini-tooltip.js",
      "require": "./dist/umd/miniTooltip.min.js",
      "types": "./dist/types/charts/mini-tooltip.d.ts"
    },
    "./miniTooltip": {
      "import": "./dist/esm/charts/mini-tooltip.js",
      "require": "./dist/umd/miniTooltip.min.js",
      "types": "./dist/types/charts/mini-tooltip.d.ts"
    },
    "./react": {
      "import": "./dist/esm/react/use-britechart.js",
      "require": "./dist/umd/useBritechart.min.js",
      "types": "./dist/types/react/use-britechart.d.ts"
    },
    "./dist/umd/line.min": {
      "import": "./dist/esm/charts/line.js",
      "require": "./dist/umd/line.min.js",
      "types": "./dist/types/charts/line.d.ts"
    },
    "./dist/umd/stackedArea.min": {
      "import": "./dist/esm/charts/stacked-area.js",
      "require": "./dist/umd/stackedArea.min.js",
      "types": "./dist/types/charts/stacked-area.d.ts"
    },
    "./dist/umd/row.min": {
      "import": "./dist/esm/charts/row.js",
      "require": "./dist/umd/row.min.js",
      "types": "./dist/types/charts/row.d.ts"
    },
    "./dist/umd/tooltip.min": {
      "import": "./dist/esm/charts/tooltip.js",
      "require": "./dist/umd/tooltip.min.js",
      "types": "./dist/types/charts/tooltip.d.ts"
    },
    "./dist/umd/miniTooltip.min": {
      "import": "./dist/esm/charts/mini-tooltip.js",
      "require": "./dist/umd/miniTooltip.min.js",
      "types": "./dist/types/charts/mini-tooltip.d.ts"
    },
    "./dist/umd/*": "./dist/umd/*",
    "./dist/css/*": "./dist/css/*"
  }
}
```

---

## 3. High Priority: Migrate ESLint to v10 Flat Config (`eslint.config.mjs`)

### Root Cause
Running `yarn lint` fails with:
```
ESLint couldn't find an eslint.config.(js|mjs|cjs) file.
```
ESLint v10 does not support `.eslintrc.js` by default and requires flat configuration format.

### Required Fix
1. Remove `.eslintrc.js`.
2. Create `eslint.config.mjs` in the project root:

```javascript
// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jasmine,
        d3: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: 'd3Transition|^_' },
      ],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'docs/**',
      'demos/**',
    ],
  },
];
```

---

## 4. Medium Priority: Deduplicate D3 Dependencies in `package.json`

### Root Cause
`package.json` currently declares `"d3": "^7.9.0"` in `"dependencies"` and `"d3": "^7.0.0"` in `"peerDependencies"`. This risks package managers installing duplicate D3 instances when bundled inside consumer applications.

### Required Fix
1. Remove `"d3"` from `"dependencies"`.
2. Keep `"d3"` in `"peerDependencies"`:
```json
{
  "peerDependencies": {
    "d3": "^7.0.0"
  }
}
```

---

## 5. Low Priority: Update Browserslist Database

### Issue
Running builds and test suites outputs a warning that `caniuse-lite` is outdated.

### Fix
Run the following update command in the repository root:
```bash
yarn dlx update-browserslist-db@latest
```

---

## Verification Checklist

After applying the above fixes in the `britecharts` repository:

1. [ ] **Build Verification:** Run `yarn build` — ensure `dist/esm/`, `dist/cjs/`, `dist/umd/`, `dist/types/`, and `dist/css/` generate cleanly.
2. [ ] **Test Verification:** Run `yarn test` — ensure all 261 tests pass in <1s.
3. [ ] **Lint Verification:** Run `yarn lint` — verify zero ESLint errors under flat config.
4. [ ] **Consumer Verification:** Copy `dist/` and `package.json` to `explorer-app/frontend-react/node_modules/britecharts/` and run:
   ```bash
   yarn test src/components/charts/
   ```
   All chart tests (`LineChart`, `StackedAreaChart`, `RowChart`) must pass with 0 errors.
