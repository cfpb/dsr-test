# dsr-test — Pattern B broken (full DS CSS, **no** `dsr.css`)

This is the **why we need `dsr.css`** demo for
[`design-system-react` `rad-dsr-css-cleanup`](https://github.com/cfpb/design-system-react/tree/rad-dsr-css-cleanup).

Existing CFPB apps (Pattern B) already load full Design System CSS and must
**not** also load DSR’s fat `index.css` (duplicates buttons/forms/fonts).

Before `dsr.css` existed, Pattern B had no clean way to get **Tabs** styles:
Tabs live only in DSR (`tab.scss`), not in `@cfpb/cfpb-design-system`.

## What is wrong on this branch

```ts
import '@fontsource-variable/source-sans-3/index.css'
import './base.scss' // full DS
// Missing: import '@cfpb/design-system-react/dsr.css'
```

| Component | Expected on this branch |
| --- | --- |
| `Button` | Looks correct (DS CSS) |
| `Heading` | Looks correct (DS CSS) |
| `Tab` / `TabList` | Missing / incomplete tab chrome (no `.tablist` rules from DSR) |

## Sibling demos

| Branch | Role |
| --- | --- |
| [`demo/dsr-css-pattern-a`](../tree/demo/dsr-css-pattern-a) | Pattern A — `index.css` (Tabs OK) |
| [`demo/dsr-css-pattern-b-broken`](../tree/demo/dsr-css-pattern-b-broken) (this) | Pattern B without `dsr.css` (Tabs broken) |
| [`demo/dsr-css-pattern-b`](../tree/demo/dsr-css-pattern-b) | Pattern B + `dsr.css` (Tabs fixed) |

## Setup

```bash
yarn install
yarn dev
```

Pins DSR to:

```json
"@cfpb/design-system-react": "git+https://github.com/cfpb/design-system-react.git#rad-dsr-css-cleanup"
```

## GitHub Pages

- **Main:** https://cfpb.github.io/dsr-test/
- **PR previews:** https://cfpb.github.io/dsr-test/pr-previews/pr-N/
