# STAND DOWN

*Working title.* A turn-based Cold War crisis game on a hex board. You win by getting
through the crisis week **without** a nuclear exchange — reading an opponent you cannot see,
through sensors that can be wrong.

Built on the engine from [INTERCEPT](https://github.com/leoeck17/intercept).
The full design is in [DESIGN.md](DESIGN.md).

**Status:** milestone M0 — engine and a placeholder crisis loop. Playable, but the opponent,
real attacks and retaliation arrive in M1–M4.

## Play

- **Online:** `https://leoeck17.github.io/stand-down/` once Pages is set up (below).
- **Locally:** open `index.html` in a browser. No build step, no dependencies.

## Tests

Headless browser tests live in `tests/` and are the only part that uses npm.

```sh
cd tests
npm ci
npx playwright install chromium   # once
npm test
```

To use a Chromium that is already installed, set `CHROMIUM_PATH` to its executable.

## Deploy

`.github/workflows/ci.yml` runs the tests on every push and pull request. On `main`, a
passing run publishes `index.html` to GitHub Pages.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Layout

| Path | What |
|---|---|
| `index.html` | The whole game — engine half carried over from INTERCEPT, game half per DESIGN.md |
| `DESIGN.md` | Design, milestones, open decisions |
| `tests/` | Playwright tests (`npm test`) |
| `.github/workflows/ci.yml` | Test on every push; deploy `main` to Pages |
