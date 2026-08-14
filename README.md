# Sidebar

The Sidebar appears on all LibreTexts libraries and provides quick navigation around the library and access to helpful related resources.

It is not a standalone app. It compiles to a single self-mounting IIFE (`build/sidebar-<version>.min.js`) that LibreTexts injects into every library page via a `<script>` tag; the widget renders itself next to that tag and reads globals the host page (`reuse.js`) provides.

## Stack

React 18 + [`@libretexts/davis-react`](https://www.npmjs.com/package/@libretexts/davis-react) (styled with Tailwind v4 utilities), written in TypeScript 7, bundled with Vite 6 in library mode. CSS is inlined into the JS bundle, so no separate stylesheet ships.

## Development

- `npm install`
- `npm run dev` — Vite dev server with React Fast Refresh. Serves `index.html`, a standalone harness that renders the sidebar and stubs the host globals (`dev/mocks.ts`), so no LibreTexts page is needed.
- `npm run typecheck` — `tsc --noEmit`. The only type-checking step; Vite/esbuild strips types without checking them.
- `npm run build` — type-checks, then builds `build/sidebar-<version>.min.js`, named for the version in `package.json` (minified IIFE, React and CSS bundled in). The build fails if `typecheck` fails.

There is no test framework or linter. To smoke-test against the real host, build and open `test.html` (it loads jQuery, LibreTexts' `reuse.js`, the built bundle, and `Sidebar.css`).
