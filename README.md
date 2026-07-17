# dsr-test — Pattern B (full DS CSS + DSR components)

Kitchen-sink Vite app demonstrating **Pattern B** from [`@cfpb/design-system-react`](https://github.com/cfpb/design-system-react) ([PR #618](https://github.com/cfpb/design-system-react/pull/618)).

For apps that already load the full Design System: import DSR **components only**. Do **not** import `@cfpb/design-system-react/index.css`.

See the sibling branch [`demo/pattern-a-dsr-css`](../tree/demo/pattern-a-dsr-css) for Pattern A (DSR `index.css` only).

## Setup

```bash
yarn install
yarn dev
```

This branch installs `@cfpb/design-system-react` from GitHub at commit [`89f23bf`](https://github.com/cfpb/design-system-react/commit/89f23bfc00e44a00818efed869804fa61d54eb01) on [`chore/fix-slug-component-578`](https://github.com/cfpb/design-system-react/tree/chore/fix-slug-component-578) (PR #618). Pinning the commit keeps installs reproducible as the branch moves.

To point at the live branch tip instead:

```bash
yarn add @cfpb/design-system-react@git+https://github.com/cfpb/design-system-react.git#chore/fix-slug-component-578
```

## How styles are loaded

In `src/main.tsx`:

```ts
import '@fontsource-variable/source-sans-3/index.css'
import './base.scss'
// Do not import '@cfpb/design-system-react/index.css'
```

In `src/base.scss` (exported Sass entry points — same stack as DS `src/index.scss`):

```scss
@use '@cfpb/cfpb-design-system/src/_abstracts' as *;
@use '@cfpb/cfpb-design-system/src/_base' as *;
@use '@cfpb/cfpb-design-system/src/_components' as *;
@use '@cfpb/cfpb-design-system/src/_utilities' as *;
```

> Note: The DSR README shows `@use '…/dist/index.css'` / `@use '…/src/index'`. Those paths are not in the current `@cfpb/cfpb-design-system` `exports` map, so this demo uses the exported `_abstracts` / `_base` / `_components` / `_utilities` entries instead.

| | |
| --- | --- |
| **You get** | Full DS component CSS (lists, expandables, button groups, …) plus Sass abstracts |
| **You still install** | Both `@cfpb/design-system-react` and `@cfpb/cfpb-design-system` |
| **You do not import** | `@cfpb/design-system-react/index.css` |
| **Fonts** | Load Source Sans yourself (`@fontsource-variable/source-sans-3`) — DS `dist/index.css` does not include fonts |

Docs: [Styles → Pattern B](https://github.com/cfpb/design-system-react/blob/chore/fix-slug-component-578/README.md#pattern-b-full-ds-css--dsr-components-existing-cfpb-apps)

Edit `src/App.tsx` to add or exercise components.

## GitHub Pages

- **Main:** https://cfpb.github.io/dsr-test/ (deploys on push to `main`)
- **PR previews:** https://cfpb.github.io/dsr-test/pr-previews/pr-N/ (via [`.github/workflows/pr-preview.yml`](.github/workflows/pr-preview.yml))

After the first deploy, set the repo’s Pages source to the `gh-pages` branch (root) if it is not already.
