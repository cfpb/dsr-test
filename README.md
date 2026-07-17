# dsr-test — Pattern A (DSR CSS only)

Kitchen-sink Vite app demonstrating **Pattern A** from [`@cfpb/design-system-react`](https://github.com/cfpb/design-system-react) ([PR #618](https://github.com/cfpb/design-system-react/pull/618)).

For apps with no Sass pipeline: load the library’s prebuilt stylesheet once. Do **not** also import `@cfpb/cfpb-design-system/dist/index.css`.

See the sibling branch [`demo/pattern-b-full-ds-css`](../tree/demo/pattern-b-full-ds-css) for Pattern B (full DS CSS + DSR components).

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
import '@cfpb/design-system-react/index.css';
```

| | |
| --- | --- |
| **You get** | DS styles for components covered by DSR’s `ds-components.ts` barrel, Source Sans 3 (embedded), DSR overrides |
| **You still install** | `@cfpb/cfpb-design-system` (peer dependency) |
| **You do not import** | `@cfpb/cfpb-design-system/dist/index.css` or `@use '…/src/index'` |

Docs: [Styles → Pattern A](https://github.com/cfpb/design-system-react/blob/chore/fix-slug-component-578/README.md#pattern-a-dsr-css-only-new-react-apps)

Edit `src/App.tsx` to add or exercise components.

## GitHub Pages

- **Main:** https://cfpb.github.io/dsr-test/ (deploys on push to `main`)
- **PR previews:** https://cfpb.github.io/dsr-test/pr-previews/pr-N/ (via [`.github/workflows/pr-preview.yml`](.github/workflows/pr-preview.yml))

After the first deploy, set the repo’s Pages source to the `gh-pages` branch (root) if it is not already.
