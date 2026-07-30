# dsr-test

Kitchen-sink Vite app for trying [`@cfpb/design-system-react`](https://github.com/cfpb/design-system-react) as a standalone consumer — how components look and interact together outside Storybook.

The landing page is a consumerfinance.gov-style welcome layout (SkipNav, Header, Hero, Layout, Tabs, forms, Expandable, Well, FooterCfGov) using **Pattern A**.

## Setup

```bash
yarn install
yarn dev
```

Uses published packages:

- `@cfpb/design-system-react` `^2.0.1`
- `@cfpb/cfpb-design-system` `^5.8.1` (peer)

Styles are loaded in `src/main.tsx` via `import '@cfpb/design-system-react/index.css'` (Pattern A). Edit `src/App.tsx` to add or exercise components.

## GitHub Pages

- **Main:** https://cfpb.github.io/dsr-test/ (deploys on push to `main`)
- **PR previews:** https://cfpb.github.io/dsr-test/pr-previews/pr-N/ (via [`.github/workflows/pr-preview.yml`](.github/workflows/pr-preview.yml))

After the first deploy, set the repo’s Pages source to the `gh-pages` branch (root) if it is not already.
