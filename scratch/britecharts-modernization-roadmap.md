# Britecharts Modernization Roadmap & Explorer App Integration Guide

## Executive Summary

This guide outlines the modernization strategy for the **Britecharts** (`cfpb-britecharts`) data visualization library to optimize performance, developer experience, and maintainability across consuming applications (specifically `explorer-app`).

Currently, `explorer-app` consumes Britecharts via legacy pre-compiled UMD bundles (`britecharts/dist/umd/line.min`), lacks first-party TypeScript definitions, and requires extensive imperative D3 lifecycle glue code (~300 lines per chart component). Modernizing Britecharts will unlock native ES module tree-shaking, automated type checking, streamlined chart component wrappers, and full WCAG accessibility compliance.

---

## 1. Current State & Pain Points in Explorer App

| Area | Current Implementation | Pain Points / Inefficiencies |
| :--- | :--- | :--- |
| **Module Format** | Pre-compiled UMD bundles (`dist/umd/*.min.js`) | Cannot be tree-shaken by modern bundlers (Rsbuild / Rspack / Webpack); includes duplicated helper code. |
| **TypeScript Support** | None (pure JS) | Consuming apps must maintain ambient `.d.ts` shims with `any` types; no compile-time checks for chart builder methods or event payloads. |
| **D3 Dependency** | Bundled / Hard dependency (`"d3": "^7.9.0"`) | Potential version duplication and bundle bloat between host app's D3 and Britecharts. |
| **React Integration** | Imperative DOM manipulation with `useRef`, `select`, `setTimeout`, and manual unmount cleanup | Repetitive boilerplate across `LineChart`, `StackedAreaChart`, and `RowChart`; fragile resize handling. |
| **Responsiveness** | Manual width calculations based on viewport/sidebar state | Requires the consuming app to recalculate widths and trigger chart teardown/rebuilds on resize. |

---

## 2. Chart Inventory & Pruning Audit

An audit across CFPB front-end repositories (**`explorer-app`** and **`ccdb5-ui`**) was conducted to determine the exact chart modules required in production. Because `cfpb-britecharts` is an agency fork, maintaining unused upstream charts adds unnecessary build, test, and type maintenance overhead.

### 2.1 Project Audit Summary
* **`explorer-app` (`frontend-react`):** Actively utilizes **5 chart and tooltip modules** for the Trends views.
* **`ccdb5-ui`:** Contains **0 chart dependencies**. `ccdb5-ui` does not import `britecharts` or `d3` and has no chart rendering components.

### 2.2 Charts to Keep (Production Scope)

The following 5 chart/tooltip modules (and their internal `helpers/`) represent the entire active footprint and should be the sole focus of the modernization effort:

| Module | Source Path | Consuming Components (`explorer-app`) | Application Role |
| :--- | :--- | :--- | :--- |
| **`line`** | `src/charts/line.js` | `LineChart.tsx`<br>`LineChartPrintable.js` | Multi-series time trend lines across Company, Product, and Issue lenses. |
| **`stacked-area`** | `src/charts/stacked-area.js` | `StackedAreaChart.tsx`<br>`StackedAreaChartPrintable.js` | Stacked area graphs for complaint volume trends over time. |
| **`row`** | `src/charts/row.js` | `RowChart.tsx`<br>`RowChartPrintable.js` | Horizontal row/bar drill-downs for top categories and sub-categories. |
| **`tooltip`** | `src/charts/tooltip.js` | `LineChart.tsx`<br>`StackedAreaChart.tsx` | Cursor hover calculations and line guide interactions for time-series charts. |
| **`mini-tooltip`** | `src/charts/mini-tooltip.js` | `RowChart.tsx`<br>`RowChartPrintable.js` | Value hover tooltips attached directly to individual horizontal row bars. |
| **`helpers/`** | `src/charts/helpers/*.js` | Internal to above charts | Shared utilities (`axis`, `color`, `constants`, `date`, `export`, `formatters`, `grid`, `number`, `text`). |

### 2.3 Unused Charts to Deprecate / Prune

The remaining **12 chart modules** are not imported or referenced anywhere across CFPB repositories and can be pruned or excluded from modern packaging:

* `bar.js` (Standard vertical bar chart)
* `brush.js` (Time brush selector)
* `bullet.js` (Bullet graph)
* `donut.js` (Donut / Pie chart)
* `grouped-bar.js` (Grouped vertical bar chart)
* `grouped-row.js` (Grouped horizontal row chart)
* `heatmap.js` (Matrix heatmap)
* `legend.js` (Standalone SVG legend component)
* `scatter-plot.js` (Scatter / bubble plot)
* `sparkline.js` (Inline sparklines)
* `stacked-bar.js` (Stacked vertical bar chart)
* `step.js` (Step line chart)

### 2.4 Benefits of Scope Reduction
1. **Targeted TypeScript Typing:** Limits JSDoc `.d.ts` generation and strict type verification strictly to the 5 active chart APIs.
2. **Lean Package Exports:** Keeps the `exports` map clean and lightweight (`./line`, `./stacked-area`, `./row`, `./tooltip`, `./mini-tooltip`).
3. **Reduced Test & Maintenance Burden:** Eliminates dozens of legacy Karma/Jasmine test suites and deprecated chart configurations.

---

## 3. Core Modernization Roadmap for Britecharts

### Phase 1: Modern Packaging & Dual Module Distribution (P0)

#### 1.1 Configure `package.json` Subpath Exports (`exports` map)
Update `package.json` to expose modern standard exports alongside backward-compatible fallbacks:

```json
{
  "name": "cfpb-britecharts",
  "version": "2.6.0",
  "description": "Standards-based charting library for D3 v7",
  "main": "dist/bundled/britecharts.min.js",
  "module": "dist/esm/index.js",
  "types": "dist/types/index.d.ts",
  "sideEffects": false,
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
    "./tooltip": {
      "import": "./dist/esm/charts/tooltip.js",
      "require": "./dist/umd/tooltip.min.js",
      "types": "./dist/types/charts/tooltip.d.ts"
    },
    "./stacked-area": {
      "import": "./dist/esm/charts/stacked-area.js",
      "require": "./dist/umd/stackedArea.min.js",
      "types": "./dist/types/charts/stacked-area.d.ts"
    },
    "./row": {
      "import": "./dist/esm/charts/row.js",
      "require": "./dist/umd/row.min.js",
      "types": "./dist/types/charts/row.d.ts"
    },
    "./mini-tooltip": {
      "import": "./dist/esm/charts/mini-tooltip.js",
      "require": "./dist/umd/miniTooltip.min.js",
      "types": "./dist/types/charts/mini-tooltip.d.ts"
    },
    "./dist/umd/*": "./dist/umd/*"
  }
}
```

#### 1.2 Build Native ES Modules (`dist/esm/`)
Update the build pipeline (Rollup, `tsup`, or Webpack 5) to compile `src/` to `dist/esm/` with preserved ES `import`/`export` syntax and individual chart entrypoints.

---

### Phase 2: First-Class TypeScript Support (`.d.ts`) (P0)

Britecharts already contains extensive JSDoc annotations. TypeScript can generate complete, accurate declaration files directly from existing source files without rewriting the codebase.

#### 2.1 Add `tsconfig.build.json` in Britecharts:
```json
{
  "compilerOptions": {
    "allowJs": true,
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "dist/types",
    "target": "ES2022",
    "moduleResolution": "node",
    "skipLibCheck": true,
    "strictNullChecks": true
  },
  "include": ["src/**/*"],
  "exclude": ["src/**/*.spec.js", "src/doc/*"]
}
```

#### 2.2 Add Build Script:
```json
{
  "scripts": {
    "build:types": "tsc -p tsconfig.build.json"
  }
}
```

This generates `dist/types/index.d.ts`, `dist/types/charts/line.d.ts`, etc., giving consumers full autocomplete and type checking on all builder methods (`.margin()`, `.width()`, `.aspectRatio()`, `.colorSchema()`) and event signatures (`.on('customMouseMove', ...)`).

---

### Phase 3: D3 Dependency Modernization (P1)

#### 3.1 Move D3 to `peerDependencies`
Prevent duplicate D3 instances in the consumer's bundle:
```json
{
  "peerDependencies": {
    "d3": "^7.0.0"
  }
}
```

#### 3.2 Standardize D3 Named Imports
Replace internal vendor bundling or namespace imports in Britecharts source files with modular/named imports:
```javascript
import { select, selectAll } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { max, min } from 'd3-array';
```

---

### Phase 4: React Adapter Utility (`useBritechart` Hook) (P1)

Provide a lightweight React hook in Britecharts (or a subpath like `britecharts/react`) to eliminate repetitive chart mounting boilerplate across React applications.

#### 4.1 React Hook Implementation:
```typescript
import { useEffect, useRef } from 'react';
import { select } from 'd3';

export interface UseBritechartOptions<TChart, TData> {
  chartFactory: () => TChart;
  data: TData;
  configure: (chart: TChart, containerWidth: number) => void;
  onEvents?: Record<string, (...args: any[]) => void>;
  dependencies?: unknown[];
}

export function useBritechart<TChart = any, TData = any>({
  chartFactory,
  data,
  configure,
  onEvents,
  dependencies = [],
}: UseBritechartOptions<TChart, TData>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<TChart | null>(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = chartFactory();
    }

    const chart = chartInstanceRef.current;
    const container = select(containerRef.current);
    const containerWidth = containerRef.current.clientWidth || 700;

    configure(chart, containerWidth);

    if (onEvents) {
      Object.entries(onEvents).forEach(([event, handler]) => {
        (chart as any).on?.(event, handler);
      });
    }

    container.datum(data).call(chart as any);

    return () => {
      container.selectAll('*').remove();
      container.datum([]);
    };
  }, [data, ...dependencies]);

  return containerRef;
}
```

---

### Phase 5: Container Auto-Resize with `ResizeObserver` (P2)

Add an optional `.autoResize(true)` method to charts. When enabled, Britecharts attaches a `ResizeObserver` to its parent container to dynamically update scale ranges and redraw the SVG when layout changes (e.g., sidebar toggling or responsive breakpoints) without requiring host apps to manually compute widths.

---

### Phase 6: Accessibility (WCAG 2.1 AA / Section 508) (P2)

1. **ARIA Roles:** Add `role="graphics-document document"` to root `<svg>` and `role="graphics-symbol"` to data points / bars.
2. **Accessible Descriptions:** Add `.ariaLabel(string)` and `.ariaDescription(string)` builder methods to generate `<title>` and `<desc>` elements in SVG.
3. **Keyboard Navigation:** Add focusable data elements (`tabindex="0"`) with `focus`/`blur` event bindings for screen reader support.

---

## 4. Consuming Modern Britecharts in Explorer App

Once the Britecharts update is published:

### 4.1 Clean Named Imports
```typescript
// Before:
import line from 'britecharts/dist/umd/line.min';
import tooltip from 'britecharts/dist/umd/tooltip.min';

// After (Tree-shakeable ESM with full type definitions):
import { line, tooltip } from 'cfpb-britecharts';
// or
import line from 'cfpb-britecharts/line';
import tooltip from 'cfpb-britecharts/tooltip';
```

### 4.2 Refactored `LineChart` Component Example
```tsx
import { LineChart as BriteLineChart, line, tooltip } from 'cfpb-britecharts';
import { useBritechart } from 'cfpb-britecharts/react';
import { ChartWrapper } from '../chart-wrapper/chart-wrapper';
import { type FormattedLineData, type TooltipData } from '../../../reducers/trends/utils';

export interface LineChartProps {
  data: FormattedLineData;
  colorMap: Record<string, string>;
  onTooltipChange?: (tooltip: TooltipData | null) => void;
}

export const LineChart = ({ data, colorMap, onTooltipChange }: LineChartProps) => {
  const chartRef = useBritechart({
    chartFactory: line,
    data,
    configure: (chart, width) => {
      const colorScheme = data.dataByTopic.map((t) => colorMap[t.topic]);
      chart
        .margin({ left: 60, right: 10, top: 10, bottom: 40 })
        .aspectRatio(0.5)
        .grid('horizontal')
        .width(width)
        .dateLabel('date')
        .colorSchema(colorScheme);
    },
    onEvents: {
      customMouseMove: onTooltipChange,
    },
    dependencies: [colorMap],
  });

  return (
    <ChartWrapper hasKey={true} isEmpty={!data} domId="line-chart">
      <div id="line-chart" ref={chartRef} />
    </ChartWrapper>
  );
};
```

### 4.3 Cleanup in `explorer-app`
- Remove `src/types/britecharts.d.ts` (ambient type definitions).
- Remove imperative `setTimeout` redraw hacks and manual DOM removal logic.
- Remove container width calculation helpers (`getLineChartWidth`, `computeContainerWidth`) in favor of container client widths or built-in auto-resize.

---

## 5. Execution Checklist for the Britecharts Repo

- [ ] **Step 1:** Configure `tsconfig.build.json` for `.d.ts` generation from JSDoc.
- [ ] **Step 2:** Configure ESM output in build configuration (Rollup / `tsup` / Webpack).
- [ ] **Step 3:** Move `d3` to `peerDependencies` in `package.json`.
- [ ] **Step 4:** Define `exports` map in `package.json` for root and subpath modules.
- [ ] **Step 5:** Verify `.d.ts` output accuracy and validate against chart test suites.
- [ ] **Step 6:** Publish new version (`v2.6.0` or next release tag) and test in `explorer-app`.
