# sg-grid

A small Vue 3 grid project scaffolded with Vite. This repository contains the source for a grid component and supporting example app used during development.

## Quick start

Prerequisites: Node.js matching the engines in `package.json` (for example Node 20.x or newer / Node 22+).

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:5173 (Vite default) after the server starts.

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Available scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check then build (uses `vue-tsc` + `vite build`)
- `npm run preview` — preview a production build locally
- `npm run test:unit` — run unit tests with Vitest
- `npm run lint` — run ESLint and auto-fix
- `npm run format` — run Prettier on `src/`

## Project layout

- `index.html` — app entry HTML
- `src/` — source code (components, `main.ts`, styles)
- `docs/` — product requirements, tasks, and design notes

See `package.json` for the exact scripts and `vite.config.ts` / `tsconfig.*.json` for build and type-check settings.

## Testing, linting and types

- Unit tests use Vitest. Run `npm run test:unit`.
- Type checking is done by `vue-tsc` and is part of the `build` pipeline (`npm run build`).
- ESLint + Prettier are configured; run `npm run lint` and `npm run format` to keep code consistent.

## Contributing

Please read the notes in `docs/` before working on features. Keep changes small and add tests for new logic. If you add new packages, update `README.md` and `docs/` where appropriate.

## Where to look next

- `docs/grid-prd.md` — product requirements
- `docs/tasks.md` — derived task list and roadmap
- `src/main.ts` — app bootstrap

See `docs/examples-filter-sort.md` for runnable example descriptions (playground and minimal examples).

If you'd like, I can add a short development checklist, PR template, or CI workflow next.
