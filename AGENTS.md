This file gives AI coding assistants (Claude Code, etc.) and new developers a
fast on-ramp to this repository. Keep it short, factual, and up to date — when
behavior here drifts from the code, update this document in the same PR.

## AI Coding Agent Ground Rules

1. Ask, don't assume. If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements.

2. Simplest solution first. Always implement the simplest thing that could work. Do not add abstractions or flexibility that weren't explicitly requested.

3. Don't touch unrelated code. If a file or function is not directly part of the current task, do not modify it, even if you think it could be improved.

4. Flag uncertainty explicitly. If you are not confident about an approach or technical detail, say so before proceeding. Confidence without certainty causes more damage than admitting a gap.

## Project Overview

Shopgate Connect extension `@shopgate-project/configurable-banner` for the Shopgate PWA
(Engage). It renders configurable banners (image, text, text with background, slider, product
slider) on pages matched by route pattern and IDs, at the positions `topmost`, `top` (default)
and `bottom`. The banner configuration comes either from the static `banners` setting or from an
external endpoint that the backend fetches and caches. The configuration format is documented
in `README.md`, examples in `demo/index.md`.

## Tech Stack

- Frontend (`frontend/`): React 17 components and Redux (reducer, subscriptions, `reselect`
  selectors, `react-redux` connectors), built by the PWA theme's webpack; no own build.
- Styles: `glamor` (`css(...)`).
- Backend (`extension/`): Node.js pipeline step (CommonJS), HTTP via `request`.
- Tooling: npm; ESLint with `@shopgate/eslint-config` (frontend) and `standard` (backend).
- No tests in the repository.

## Common Commands

Run in `frontend/` (lockfile is tracked):

- Install: `npm ci`
- Lint: `npm run lint`

Run in `extension/`:

- Lint: `npm run lint` (`standard`)
- `npm test` only echoes `TBA`; there are no backend tests.

Running the extension in the app or browser goes through the Shopgate Developer Center tooling
(see `docs/CONTRIBUTING.md`); verify the exact commands before use.

## Repository Structure

- `extension-config.json` is the manifest: it registers the portals, the subscriptions and the
  reducer, and defines the settings `banners` (frontend), `configEndpoint` (backend) and
  `configTTL` (both).
- Portals: `frontend/portals/Banners/BannersTopmost.jsx` (`app-bar.content.before`),
  `frontend/portals/Banners` (`index.jsx`, `view.content.before`) and `BannersBottom.jsx`
  (`view.content.after`). `BannersTopmost` and `BannersBottom` render `Banners` with their
  `position`; `index.jsx` is `Banners` itself, without a position, which means `top`.
- Config flow: `frontend/config/subscriptions.js` uses the static `banners` on `appDidStart$`,
  otherwise `fetchConfig` (`frontend/config/actions.js`) calls the pipeline
  `shopgate-project.configurable-banner.getConfig`. Pipeline definition in `pipelines/`, step in
  `extension/getConfig.js`, which caches the endpoint response in extension storage for
  `configTTL` seconds.
- The reducer (`frontend/config/reducers.js`) is persisted via `persistedReducers`.
- Banner selection by route, position and IDs: `frontend/portals/Banners/selectors.js`. Route
  params are hex-decoded with `hex2bin`, except for CMS page routes (`PAGE_PATTERN`).
- `hideOnScroll` logic: `frontend/portals/Banners/useHiddenOnScroll.js` (follows the scroll
  target from `ViewContext`, falls back to `window`).

## Internal Knowledge Base

Additional internal documentation may be available in the Knowledge Base:

https://gitlab.localdev.cc/internal/knowledge-base

Future AI coding assistants and developers should check this Knowledge Base when they need context about cross-service dependencies, shared platform conventions, infrastructure, deployment, authentication/authorization, internal libraries, or service contracts.

Do not copy Knowledge Base content into this file. Keep AGENTS.md focused on this repository.

## Local Development Notes

- `frontend/config.json` and `extension/config.json` are generated from the `configuration` of
  `extension-config.json` and are git-ignored. Frontend code imports `../config.json`; ESLint
  warns while the file doesn't exist yet.
- `frontend/jsconfig.json` extends `@shopgate/engage/tsconfig.extension.json` for editor import
  paths only.

## Testing Notes

- There are no frontend or backend tests and no Jest setup. Check changes in the app or browser.

## Deployment / CI Notes

- No CI configuration in the repository.
- Release versions are tracked in `extension-config.json`, `frontend/package.json` and
  `CHANGELOG.md`; keep the three in sync. `extension/package.json` is not maintained.

## Project-Specific Pitfalls

- `frontend/config/` (Redux code) and `frontend/config.json` (generated settings) are different
  things; import the settings with the `.json` extension.
- `@shopgate/engage` and the other aliased packages are provided by the PWA theme at runtime;
  the versions in `frontend/package.json` only serve lint and the editor.
- `topmost` banners reach into the status bar area only under the conditions in
  `frontend/portals/Banners/index.jsx` (`reachesStatusBar`); the `top` position reserves space
  for the floating search bar via `--sg-search-bar-floating-height`.

## Editing Guidelines for AI Agents

- Do not commit `frontend/config.json` or `extension/config.json`.
- Frontend code only imports its own files and packages declared in `frontend/package.json`;
  nothing from `extension/` or outside `frontend/`.
- Keep `frontend/package-lock.json` in sync with `frontend/package.json`.
- Backend code follows `standard` style (no semicolons); frontend follows
  `@shopgate/eslint-config`.
- Document user-facing changes in `CHANGELOG.md` and configuration changes in `README.md`.
