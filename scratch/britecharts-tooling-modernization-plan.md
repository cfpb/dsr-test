# Britecharts Tooling Modernization & Dependency Migration Plan

## Executive Summary

This plan outlines the roadmap for modernizing the build, test, and dependency toolchain in **`cfpb-britecharts`** (`britecharts`), aligning it with the modern standards established in **`explorer-app`** (Rsbuild, Rstest, native ES modules, and zero Babel).

Upgrading away from abandoned and deprecated tools—most notably **Karma** (sunset in 2023), the multi-layer **Babel/Webpack** pipeline, and legacy runtime utilities—minimizes build and test latency, eliminates security vulnerabilities, removes unnecessary runtime overhead, and ensures sustainable long-term maintainability.

---

## 1. Dependency Modernization & Replacement Audit

| Legacy / Deprecated Package | Current Role / Status | Modern Replacement | Net Utility & Rationale |
| :--- | :--- | :--- | :--- |
| **`lodash.assign`** (`^4.2.0`) | Object merging (deprecated individual package) | Native `Object.assign()` / Object spread (`{ ... }`) | Eliminates an external runtime dependency; standard ES6+ native feature. |
| **`base-64`** (`^1.0.0`) | SVG/PNG export encoding (stale / unmaintained) | Native `globalThis.btoa()` / `atob()` | Standard native browser and Node.js API; zero runtime footprint. |
| **`karma` + 7 plugins** | Test runner & browser launcher (**Deprecated / Sunset 2023**) | `@rstest/core` or `vitest` (with JSDOM) | Eliminates slow headless Chrome spawning; sub-second in-memory test execution; native ESM support. |
| **`jasmine-core` / `sinon`** | Test assertions and function spies | Modern built-in test matchers & standard spies (`vi.fn()` / `jest.fn()`) | Consolidates test framework into a unified modern API without multi-library mock glue. |
| **`@babel/*` (6 packages)** | Transpilation & CJS interop | `tsup` (esbuild) or `rollup` | Single-step ESM, CJS, and `.d.ts` builds without Babel transform configurations. |
| **`webpack` (library build)** | Multi-file UMD bundling configuration | `tsup` / `rollup` | ~10x faster build speeds; clean native subpath exports; simpler configuration. |
| **`moment`** (`^2.31.0`) | Date parsing and formatting (maintenance mode) | `dayjs` or native D3 time formatters | Drops ~70 KB bundle footprint; matches standard date library in `explorer-app`. |
| **`underscore`** (`^1.13.8`) | Legacy utility library | Native `Array.prototype` & `Object` methods | Removes obsolete 2010s utility baggage. |
| **`standard-version`** | Release & changelog generator (**Archived / Deprecated**) | `release-it` or npm version scripts | Modern release automation and conventional changelog generation. |

---

## 2. Step-by-Step Modernization Execution Plan

### Step 1: Migrate Runtime & Dev Utilities to Native Standards

Eliminate legacy, unmaintained runtime and utility dependencies in favor of modern JavaScript standards:

1. **Replace `lodash.assign` with Native Object Methods:**
   - Replace `lodash.assign` imports across `src/charts/line.js`, `src/charts/stacked-area.js`, `src/charts/row.js`, `src/charts/tooltip.js`, `src/charts/mini-tooltip.js`, and `src/charts/helpers/` with `Object.assign()` or object spread syntax:
     ```javascript
     // Before:
     import assign from 'lodash.assign';
     const config = assign({}, defaults, customConfig);

     // After:
     const config = { ...defaults, ...customConfig };
     ```

2. **Replace `base-64` with Standard Browser APIs:**
   - In `src/charts/helpers/export.js`, replace `base64.encode()` with `globalThis.btoa()`:
     ```javascript
     // Before:
     import base64 from 'base-64';
     const encoded = base64.encode(unescape(encodeURIComponent(svgString)));

     // After:
     const encoded = globalThis.btoa(unescape(encodeURIComponent(svgString)));
     ```

3. **Replace `moment` with `dayjs` / D3 Time Formatting:**
   - Replace `moment` references in date helpers and spec fixtures with `dayjs` (matching `explorer-app`) or native D3 time formatting (`d3-time-format`).

4. **Prune `underscore` and Legacy Helpers:**
   - Replace any remaining `underscore` or custom utility helpers with native `Array.prototype.find()`, `filter()`, `map()`, `some()`, `every()`, and `Object.keys()` / `Object.entries()`.

5. **Update `package.json` Dependencies:**
   - Remove `lodash.assign`, `base-64`, `moment`, and `underscore` from `package.json`.
   - Maintain pure zero-dependency runtime core (`peerDependencies: { "d3": "^7.0.0" }`).

---

### Step 2: Replace Babel and Webpack Library Bundling with `tsup` / Rollup

Replace the heavy, multi-stage Babel + Webpack build pipeline with a fast, modern bundler (`tsup` powered by esbuild or Rollup):

1. **Configure `tsup.config.ts` (or `rollup.config.mjs`):**
   ```typescript
   import { defineConfig } from 'tsup';

   export default defineConfig({
     entry: {
       index: 'src/index.js',
       line: 'src/charts/line.js',
       'stacked-area': 'src/charts/stacked-area.js',
       row: 'src/charts/row.js',
       tooltip: 'src/charts/tooltip.js',
       'mini-tooltip': 'src/charts/mini-tooltip.js',
       'react/use-britechart': 'src/react/use-britechart.js',
     },
     format: ['esm', 'cjs'],
     dts: true,
     sourcemap: true,
     clean: true,
     outDir: 'dist',
     external: ['d3', 'react'],
     treeshake: true,
   });
   ```

2. **Generate Backward-Compatible UMD Bundles:**
   - Provide standalone UMD outputs (`dist/umd/*.min.js`) for legacy script tag or non-module environments using Rollup or esbuild.

3. **Purge Babel Toolchain:**
   - Remove `@babel/core`, `@babel/cli`, `@babel/preset-env`, `@babel/plugin-proposal-class-properties`, `@babel/plugin-proposal-object-rest-spread`, `@babel/plugin-transform-runtime`, and `babel-loader`.
   - Delete `.babelrc`, `babel.esm.json`, and Babel environment overrides.

4. **Streamline SCSS Compilation:**
   - Compile CSS stylesheets (`src/styles/*.scss`) directly to `dist/css/` via `sass` CLI (`sass src/styles:dist/css --style=compressed`).

---

### Step 3: Replace Deprecated Karma / Jasmine Test Suite with In-Memory Runner

Replace the sunset Karma test runner, headless Chrome browser dependencies, and Jasmine/Sinon spies with a fast in-memory test runner (`rstest` or `vitest` with JSDOM):

1. **Install Modern Test Dependencies:**
   - Add `@rstest/core` (or `vitest`), `happy-dom` (or `jsdom`), `@testing-library/dom`, and `@types/jest`.

2. **Configure Test Environment (`rstest.config.ts` or `vitest.config.ts`):**
   ```typescript
   import { defineConfig } from '@rstest/core';

   export default defineConfig({
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: ['./test/setup.ts'],
       include: ['test/specs/**/*.spec.js'],
       coverage: {
         provider: 'istanbul',
         reporter: ['text', 'html', 'lcov'],
       },
     },
   });
   ```

3. **Configure DOM & SVG Mocking in Test Setup (`test/setup.ts`):**
   - Provide standard polyfills for SVG methods (`getBBox`, `getBoundingClientRect`, `createSVGPoint`) in JSDOM:
     ```typescript
     if (!window.SVGElement.prototype.getBBox) {
       window.SVGElement.prototype.getBBox = () => ({
         x: 0,
         y: 0,
         width: 100,
         height: 100,
         top: 0,
         right: 100,
         bottom: 100,
         left: 0,
       });
     }
     ```

4. **Migrate Test Assertions and Spies:**
   - Convert Jasmine `expect(...).toEqual(...)` and `spyOn(...)` to standard Jest/Vitest matchers and `jest.fn()` / `vi.fn()`.
   - Remove `sinon` and replace with built-in mock functions.

5. **Purge Karma Packages:**
   - Remove `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-coverage-istanbul-reporter`, `karma-jasmine`, `karma-sourcemap-loader`, `karma-webpack`, `jasmine-core`, `jasmine-jquery`, and `sinon`.
   - Delete `karma.conf.js` and `test/tools/tests_index.js`.

---

### Step 4: Modernize Demos, Dev Server, and Release Tooling

1. **Fast Sandbox Dev Server (`rsbuild dev` or `vite`):**
   - Replace multi-step legacy Webpack Dev Server and JSDoc sandbox scripts with a fast, lightweight dev server for testing chart interactions and demos locally.

2. **Modern Release Automation:**
   - Replace deprecated `standard-version` with `release-it` or standard npm version scripts.

3. **Repository Configuration Cleanup:**
   - Remove obsolete legacy configuration files: `.sass-lint.yml`, `bower.json`, `.grunt`, or deprecated Gulp artifacts.
   - Standardize ESLint and Prettier configurations to match modern standards.

---

## 3. Architecture Comparison

### Before Modernization (Legacy Pipeline)
```
Source Code (src/)
  │
  ├──> Babel CLI / Babel Loader ──> .babelrc / Webpack ──> dist/bundled (UMD only, no ESM, no types)
  │
  ├──> Karma Runner ──> Spawns Headless Chrome ──> Webpack Preprocessor ──> Jasmine/Sinon (Slow, Deprecated)
  │
  └──> lodash.assign / base-64 / moment (Legacy Runtime Dependencies)
```

### After Modernization (Optimized Pipeline)
```
Source Code (src/)
  │
  ├──> tsup / esbuild (Single Pass) ──> dist/esm (ESM), dist/umd (UMD), dist/types (.d.ts)
  │
  ├──> Rstest / Vitest + JSDOM ──> Fast In-Memory Execution (<1s execution, zero browser launch)
  │
  └──> Pure Native ES APIs + D3 v7 Peer Dependency (Zero Runtime Overhead)
```

---

## 4. Execution Checklist

- [ ] **Phase 1: Native Runtime Migration**
  - [ ] Replace `lodash.assign` with native object spread / `Object.assign`.
  - [ ] Replace `base-64` with `globalThis.btoa()` in export helper.
  - [ ] Replace `moment` with `dayjs` / D3 time formatting.
  - [ ] Remove `underscore` and use native array methods.
  - [ ] Prune packages from `dependencies`.

- [ ] **Phase 2: Bundling & TypeScript Declaration Pipeline**
  - [ ] Set up `tsup` / Rollup configuration for ESM, CJS, UMD, and `.d.ts` outputs.
  - [ ] Verify subpath exports map in `package.json`.
  - [ ] Remove Babel packages and configuration files (`.babelrc`, `babel.esm.json`).
  - [ ] Verify Sass compilation to `dist/css/`.

- [ ] **Phase 3: Test Runner Modernization**
  - [ ] Configure `rstest` / `vitest` with JSDOM.
  - [ ] Add SVG bounding-box polyfill in `test/setup.ts`.
  - [ ] Migrate test specs to standard assertions and spies.
  - [ ] Remove Karma and Jasmine packages and delete `karma.conf.js`.
  - [ ] Verify 100% test pass rate across all chart specs.

- [ ] **Phase 4: Tooling & Release Polish**
  - [ ] Configure lightweight dev server for chart sandbox.
  - [ ] Replace `standard-version` with modern release tooling.
  - [ ] Clean up root dotfiles and legacy config files.
  - [ ] Run full build, test, and typecheck to confirm zero warnings or errors.
