# dsr-test — Pattern B fixed (full DS CSS + `dsr.css`)

Demo for the thin **`dsr.css`** export on
[`design-system-react` `rad-dsr-css-cleanup`](https://github.com/cfpb/design-system-react/tree/rad-dsr-css-cleanup).

**This branch = Pattern B done right** for existing CFPB apps:

1. Load full Design System CSS (and fonts yourself)
2. Load thin `@cfpb/design-system-react/dsr.css` for Tabs / React-only overrides
3. Do **not** load `@cfpb/design-system-react/index.css` (duplicates DS + fonts)

## Sibling demos

| Branch | Role |
| --- | --- |
| [`demo/dsr-css-pattern-a`](../tree/demo/dsr-css-pattern-a) | Pattern A — `index.css` only |
| [`demo/dsr-css-pattern-b-broken`](../tree/demo/dsr-css-pattern-b-broken) | Pattern B without `dsr.css` (Tabs broken) |
| [`demo/dsr-css-pattern-b`](../tree/demo/dsr-css-pattern-b) (this) | Pattern B + `dsr.css` (Tabs fixed) |

## Setup

```bash
yarn install
yarn dev
```

Pins DSR to:

```json
"@cfpb/design-system-react": "git+https://github.com/cfpb/design-system-react.git#rad-dsr-css-cleanup"
```

## How styles are loaded

```ts
import '@fontsource-variable/source-sans-3/index.css'
import './base.scss' // full DS
import '@cfpb/design-system-react/dsr.css'
// No: import '@cfpb/design-system-react/index.css'
```

| | |
| --- | --- |
| **You get** | Full DS molecules + thin DSR-only styles (Tabs, overrides) |
| **You do not import** | `index.css` |

## What to look for

- Tabs match Pattern A / Storybook (dotted-link inactive; gray active chip)
- Buttons still look correct from DS CSS
- CSS payload stays smaller than loading full `index.css` on top of DS

## GitHub Pages

- **Main:** https://cfpb.github.io/dsr-test/
- **PR previews:** https://cfpb.github.io/dsr-test/pr-previews/pr-N/
