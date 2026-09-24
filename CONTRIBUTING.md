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

The demo runs at `http://localhost:5173` with one page per module (`/mocks/table`, `/mocks/kanban`,
`/mocks/ai`). Add `?theme=dark` to check the dark theme. To try the assistant against a real provider,
copy `.env.example` to `.env.local` and fill in your key.

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

[Theming and styling](docs/theming.md) explains the whole contract.

## Tests

Tests live in `src/test/` and run with Vitest and Testing Library on jsdom. A fix should come with a
test that fails without it. New features need at least a smoke test of the main path.

## Documentation

The docs are written in English with a Spanish copy (`*.es.md`) next to each file. Update both when you
change behaviour. If you only write one of them, say so in the pull request and it will be translated
before the merge.

## Commits and pull requests

- Branch from `main` and keep each pull request about one thing.
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
