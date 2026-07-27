# dsr-test — Pattern A (`index.css` + Tabs)

Demo for the thin **`dsr.css` / Pattern B** work on
[`design-system-react` `rad-dsr-css-cleanup`](https://github.com/cfpb/design-system-react/tree/rad-dsr-css-cleanup).

**This branch = Pattern A (greenfield):** one stylesheet, Tabs included.

## Sibling demos

| Branch | What it shows |
| --- | --- |
| [`demo/dsr-css-pattern-a`](../tree/demo/dsr-css-pattern-a) (this) | Pattern A: `index.css` only — Tabs look correct |
| [`demo/dsr-css-pattern-b-broken`](../tree/demo/dsr-css-pattern-b-broken) | Pattern B **without** `dsr.css` — Tabs miss DSR-only chrome (why the change is needed) |
| [`demo/dsr-css-pattern-b`](../tree/demo/dsr-css-pattern-b) | Pattern B **with** `dsr.css` — Tabs fixed without loading fat `index.css` |

## Setup

Pins DSR to the GitHub branch:

```json
"@cfpb/design-system-react": "git+https://github.com/cfpb/design-system-react.git#rad-dsr-css-cleanup"
```

```bash
yarn install
yarn dev
```

## How styles are loaded

```ts
import '@cfpb/design-system-react/index.css'
```

| | |
| --- | --- |
| **You get** | Curated DS modules + fonts + Tabs / DSR overrides |
| **You do not import** | Full DS CSS or `dsr.css` (already inside `index.css`) |

## What to look for

- Tabs: inactive = DSR link style (blue, dotted underline); active = gray chip on the baseline
- Buttons / slug heading styled

## GitHub Pages

- **Main:** https://cfpb.github.io/dsr-test/
- **PR previews:** https://cfpb.github.io/dsr-test/pr-previews/pr-N/
