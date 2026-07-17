# dsr-test — broken consumer against DSR `main`

Proof-of-concept: a standalone Vite app using **Pattern A** against current [`@cfpb/design-system-react` `main`](https://github.com/cfpb/design-system-react), showing why component styles do not ship correctly to consumers.

This is the **before** case for [design-system-react#618](https://github.com/cfpb/design-system-react/pull/618). Compare with [`demo/pattern-a-dsr-css`](../tree/demo/pattern-a-dsr-css) (fixed barrel).

## What is wrong

On DSR `main` today:

1. **`Heading type="slug"`** emits `.m-slug-header` but never imports DS `slug-header` styles.
2. **`dist/index.css`** (from `_shared.scss`) only includes DS abstracts/base + font overrides — **not** component rules (`.a-btn`, slug, forms, …).
3. **`Pagination`** deep-imports `@cfpb/cfpb-design-system/.../pagination.scss` in the component file — inconsistent and not a pattern apps should rely on.

A greenfield app that only does:

```ts
import '@cfpb/design-system-react/index.css';
```

therefore gets unstyled (or partially styled) React components. Storybook looks fine because it loads styles through its own entry; a real consumer does not.

## Setup

```bash
yarn install
yarn dev
```

Pins DSR to commit [`6595ace`](https://github.com/cfpb/design-system-react/commit/6595ace5d958d7be11d3dfc2b89848baa8bc30d6) on `main`.

## What to look for

| Component | Expected failure on this branch |
| --- | --- |
| Slug `Heading` | Missing teal bar / slug typography |
| `Button` | Missing `.a-btn` styling |
| `Pagination` | May look more styled (deep SCSS import) — contrast with slug/button |

## Related demos

| Branch | Role |
| --- | --- |
| `demo/broken-dsr-main` (this) | Broken: DSR `main` + Pattern A |
| `demo/pattern-a-dsr-css` | Fixed: PR #618 barrel + Pattern A |
| `demo/pattern-b-full-ds-css` | Fixed: full DS Sass + DSR components (Pattern B) |

## GitHub Pages

- **Main:** https://cfpb.github.io/dsr-test/
- **PR previews:** https://cfpb.github.io/dsr-test/pr-previews/pr-N/
