# Contributing to Gridory

[English](CONTRIBUTING.md) · [Español](CONTRIBUTING.es.md)

Bug reports, ideas and pull requests are welcome. You can write issues and pull requests in English
or Spanish.

## Issues

Search the open issues first, in case someone already reported the same thing.

- **Bug.** Use the bug report template. Include the Gridory commit or version, your React version,
  the browser, what you expected and what happened. A minimal reproduction (a small repository or a
  StackBlitz) saves a lot of back and forth.
- **Feature or change.** Use the feature request template and describe the problem before the
  solution. For anything bigger than a small fix, open the issue before writing code so we can agree
  on the approach.
- **Question.** Open a regular issue.

Do not report security problems in a public issue. Use "Report a vulnerability" in the Security tab
of the repository, which opens a private report.

## Local setup

You need Node 22 (see `.nvmrc`) and npm.

```bash
git clone https://github.com/VictorDiazJauregui/gridory.git
cd gridory
npm ci
npm run dev
```

The demo runs at `http://localhost:5173` with one page per module (`/mocks/table`, `/mocks/kanban`, `/mocks/card-grid`,
`/mocks/ai`, `/mocks/auth`, `/mocks/controls`, `/mocks/sidebar`). Add `?theme=dark` to check the dark theme. To try the assistant against a real provider,
copy `.env.example` to `.env.local`, set `VITE_AI_API_KEY` and restart `npm run dev`. The example
values target Gemini through a Vite proxy that avoids CORS. Without a key the demo renders, but it
makes no calls. The demo shell uses Tailwind for itself only; none of it ships.

`package.json` forces `minimatch` to `^11.0.4` with `overrides`: eslint 9 and typescript-eslint still bring
older releases with a known denial-of-service advisory (GHSA-g3hv-75wg-m249). The override applies only to this
repository, never to the apps that install Gridory. Remove it once both depend on `minimatch` 11 themselves and
`npm audit` stays clean without it.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with the demo. |
| `npm run build` | Type check, ESM bundle in `dist/` and type declarations in `dist/types/`. |
| `npm run lint` | ESLint over the sources and `scripts/`, with the code style rules below. |
| `npm run typecheck` | `tsc -b` without emitting files. |
| `npm test` / `npm run test:watch` | Vitest over `src/test/`; the watch variant reruns on change. |
| `npm run audit:styles` | After `npm run build`: checks the stylesheets against the classes and state attributes the components emit, that `base.css` and the module sheets rebuild `gridory.css`, and that `docs/style-hooks.md` is current. |
| `npm run docs:hooks` | Regenerates `docs/style-hooks.md` and `docs/style-hooks.es.md` from the sources. |

## Code structure

Each module lives in `src/components/<module>/`. The root holds the public surface and contracts
(`index.tsx` or `index.ts`, `types.ts`, `constants.ts` and `styles.css`). The rest is split into
folders by area, never by file type, with 3 to 12 files each and no barrel files inside them.

| Folder | Areas |
|---|---|
| `table/` | `model/`, `header/`, `body/`, `pagination/` |
| `kanban/` | `model/`, `toolbar/`, `board/`, `card/` |
| `card-grid/` | `model/`, `grid/` |
| `ai/` | `chat/`, `completion/`, `sidebar/`, `transcript/`, `actions/` |
| `auth/` | `config/`, `model/`, `fields/`, `password/`, `validation/`, `layout/`, `actions/` |
| `segmented-control/` | `model/`, `parts/` |
| `country-select/` | `model/`, `parts/`, `validation/` |
| `phone-input/` | `model/`, `parts/` |
| `sidebar/` | `model/`, `parts/`, `desktop/`, `mobile/` |
| `shared/` | Common contracts at the root; `controls/`, `rows/`, `toolbar/`, `filter-menu/`, `date-filter-menu/`, `date-pickers/`, `menu/` |
| `ui/` | Primitives over Radix, and the own calendar: `select/`, `toggle-group/`, `calendar/` |
| `mocks/` | Demo data and configuration |

The demo shell is in `src/demo/`, the tests in `src/test/` and the guides in `docs/`. The demo, the
mocks and the tests stay out of the package and out of the style audit.

## Before opening a pull request

Run the same checks as CI:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run audit:styles
```

If you changed a stylesheet or added a class, run `npm run docs:hooks` and commit the regenerated
`docs/style-hooks.md` and `docs/style-hooks.es.md`. The style audit fails when they are out of date.

## Code style

ESLint enforces most of these rules, so `npm run lint` tells you when something is off.

- Functions are `const` arrow functions, with at most 20 lines (markup included) and 3 parameters.
  Group more parameters in an object.
- Early returns instead of nested `if`/`else`. No nested ternaries, at most two levels of nesting.
- Names in English that say what the thing is or does. No `utils`, `helpers` or `data` catch-alls.
- Comments explain why, not what. No commented-out code, unused exports or `console.log`.
- Each module lives in `src/components/<module>/` with its public surface at the root and folders by
  area (`model/`, `header/`, `body/`…). Import the concrete file; there are no barrel files inside the
  areas.

## Styles

Gridory ships plain CSS, no Tailwind and no utility classes.

- Every element the library renders gets a `gdy-*` class. Module parts are named
  `gdy-<module>-<part>`.
- States go in `data-*` or ARIA attributes (`data-selected`, `aria-pressed`), never in classes.
- Colors come from tokens. Literal colors are only allowed in `src/styles/tokens.css`, and component
  tokens are always read with a fallback: `var(--gdy-table-head-bg, var(--gdy-muted))`.
- A new class needs a rule, or an entry in `hookOnly` in `scripts/audit-allowlist.json` when it is a
  hook without default styles.
- A new module with its own `styles.css` gets its per-module sheet by adding its name to `MODULE_NAMES`
  in `scripts/split-stylesheets.mjs`, at the place its rules take in `gridory.css`, and its
  `"./<module>.css"` export to `package.json`. The style audit fails while the order is wrong.

[Theming and styling](docs/theming.md) explains the whole contract.

## Tests

Tests live in `src/test/` and run with Vitest and Testing Library. A fix should come with a test that
fails without it. New features need at least a smoke test of the main path.

`npm test` runs three projects:

- `unit` runs on jsdom and covers behaviour, ARIA and keyboard. Most tests belong here.
- `browser` runs the `*.browser.test.tsx` files in headless Google Chrome, with the real stylesheets,
  to check styles, sizes and positions: focus rings, borders, heights, where a panel opens. jsdom has
  no layout engine, so these checks cannot run there. Keep them few and focused, because they are
  slower.
- `server` runs the `*.server.test.tsx` files on Node, without `window` or `document`, the way Next or
  `renderToString` render, to check that a component renders on a server.

`src/test/` is type checked with `tsconfig.test.json`, which adds the Node types the tests use (`node:fs`,
`process`). The library code is checked with `tsconfig.app.json`, without them, so it cannot reach for Node by
accident.

The helpers in `src/test/browser/` measure boxes and computed styles, and switch the theme and the
screen size (desktop, iPhone 14 Pro and Pixel 7).

In long lists, such as countries or dial codes, pick an option with `getOptionByName` from
`src/test/option-queries.ts` instead of `getByRole("option", { name })`. `getByRole` computes the
accessible name of every option, which in jsdom takes over 100 ms per query on the ~250 countries and
pushes tests past the CI timeout. The helper checks the same things (a single visible option with
that accessible name) on the match only.

The `browser` project uses the Google Chrome installed on your machine, the same way CI uses the one
the GitHub runner ships, so there is no browser to download. You only need Chrome installed.

### Fast browser tests

The browser files share one page per worker, so each test leaves the page as it found it:

- Switch print media, reduced motion or touch only through the helpers in `src/test/browser/`
  (`emulateMediaType`, `emulateReducedMotion`, `emulateTouchScreen`). They note what they changed and the
  setup undoes it after every test, even a failed one, so no file needs its own `afterEach` for that.
  The theme and the screen size go back to light and desktop the same way.
- Tests run with reduced motion. A test of an animation turns motion on with
  `emulateReducedMotion(false)`; the rest never wait for one.
- A file that needs a fresh page goes in `OWN_PAGE_BROWSER_TESTS` in `vitest.config.ts`, with the
  reason: touch emulation, `:focus-visible` after a scripted focus, or a lazy module loaded for the
  first time.
- Wait for a condition, never for a fixed time: `expect.poll` (which retries once per frame in this
  project), `vi.waitFor` or `findBy*`. A `setTimeout` is either slow or flaky.
- Give each test only the data it looks at: a few rows instead of a full table, and `paste` instead of
  typing when the text is only the setup.
- When the component listens to where the pointer is, move the real pointer with `userEvent.hover`: a
  synthetic `pointerenter` does not move it, and the cursor stays where the previous file left it.

## Documentation

The docs are written in English with a Spanish copy (`*.es.md`) next to each file. Update both when you
change behaviour. If you only write one of them, say so in the pull request and it will be translated
before the merge.

## Commits and pull requests

- Branch from `staging`, open the pull request against `staging` and keep it about one thing.
  `main` only receives releases.
- Commit messages in English, starting with an uppercase prefix: `FEAT`, `FIX`, `REFAC`, `STYLE`,
  `DOC`, `TEST`, `CHORE`, `CI` or `DEL`. For example `FIX: keep the page when a filter is cleared`.
  Keep the subject under 50 characters.
- Pull request titles follow `TYPE(scope): Description`, for example
  `FIX(table): Keep the current page when a filter is cleared`.
- Fill in the pull request template: what changed, how you checked it and anything the reviewer should
  look at.

## License

Gridory is released under the [MIT license](LICENSE). By sending a contribution you agree that it is
released under the same license.
