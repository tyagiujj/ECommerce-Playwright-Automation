# Commands Cheat Sheet

Every command used in this project: what it does, why, and when to use it.
All npm scripts are defined in the `"scripts"` section of `package.json`.

---

## Structure of a script

```json
"test:headed": "playwright test --headed"
   ↑ name (key)         ↑ real command (value)
```

- **Key:** the name you type in the terminal (`npm run test:headed`).
- **Value:** the command npm runs for you.
- npm looks for commands in `node_modules/.bin`, so you do not need `npx`.
- The `:` (colon) is only a naming convention that groups related scripts.

### 3 rules to remember
1. The `test` script: `npm test` (a built-in shortcut, no `run` needed).
2. Every other script: `npm run <name>`.
3. Extra arguments (a file name, `-g`, ...) go **after** `--`. `--` tells npm to pass everything after it to Playwright.

---

## All scripts

| Script | Command | In one line |
|---|---|---|
| `npm test` | `playwright test` | Run all tests, no visible browser |
| `npm run test:headed` | `playwright test --headed` | Run tests with the browser visible |
| `npm run test:ui` | `playwright test --ui` | Run tests in the visual UI window |
| `npm run test:debug` | `playwright test --debug` | Step through a test line by line in the Inspector |
| `npm run test:list` | `playwright test --list` | Only list tests, do not run them |
| `npm run report` | `playwright show-report` | Open the last HTML report |
| `npm run typecheck` | `tsc --noEmit` | Check code errors without a browser |

---

## In detail

### `npm test`
- Reads `playwright.config.ts` and runs every `.spec.ts` file inside `testDir: './tests'`.
- **Headless** by default (the browser is not shown), so it is fast.
- **When:** to run all tests, and in CI.

### `npm run test:headed`
- `--headed` = the browser is shown on screen. A bit slower.
- **When:** a test fails and you want to see what it clicks.

### `npm run test:ui`
- `--ui` = Playwright **UI Mode** (a separate window): test list, timeline of every step, DOM snapshots, network calls, watch mode.
- **When:** writing a new test or debugging. The most useful mode for daily work.

### `npm run test:debug`
- `--debug` = opens the **Playwright Inspector** and pauses on the first line. Timeouts are turned off automatically.
- **When:** a locator does not work and you need to stop on the exact line.

### `npm run test:list`
- `--list` = does not run tests, only lists them.
- **When:** to check that files load, imports are not broken, or that a `-g` filter picks the right tests.

### `npm run report`
- Opens the last run's HTML report (from the `playwright-report/` folder): pass/fail, errors, screenshots, videos, traces.
- **When:** after a test run, especially when a test failed.

### `npm run typecheck`
- `tsc` = the TypeScript compiler. `--noEmit` = only check for errors, do not create `.js` files (Playwright runs TypeScript itself).
- Reads `tsconfig.json` (strict mode, path aliases). In 2-3 seconds it finds wrong imports, wrong method names, wrong fixture names and type mistakes.
- **When:** before every commit, always.

---

## Everyday examples

```
npm test                                           # all tests
npm test -- tests/SearchProduct.spec.ts            # one file
npm test -- -g "Search Product"                    # filter by test name (-g = grep)
npm test -- --retries=0                            # no retries: see real failures, nothing hidden as flaky
npm run test:headed -- tests/SearchProduct.spec.ts # one file, browser visible
npm run test:debug -- tests/SearchProduct.spec.ts  # one file, line by line
npm run test:list -- -g "Login"                    # check which tests a filter picks
npm run typecheck                                  # before committing
npm run report                                     # after a run
npx playwright test tests/LogOutUser.spec.ts --retries=0   # one file, no retries (prove a change works)
npx playwright test --list                         # loads the config: quick check that .env values are present
```

**Check the "missing variable" message** (Git Bash): `BASE_URL= npx playwright test --list` → `Missing environment variable "BASE_URL"`. An empty value set in the shell wins over `.env`.

---

## Git: daily feature branch workflow

Every session starts on a new branch. Work never goes straight to `main`.

### Start of the day
```
git status                                  # main must be clean (nothing uncommitted)
git switch main                             # go to main if you are on another branch
git pull origin main                        # get the latest main from GitHub
git switch -c feature/<topic>               # create a new branch and switch to it
git branch                                  # * marks the current branch
```
`git checkout -b feature/<topic>` is the older command that does the same as `git switch -c`.

### Branch names
| Prefix | When | Example |
|--------|------|---------|
| `feature/` | New work or an improvement | `feature/page-object-fixtures` |
| `fix/` | A bug fix | `fix/scroll-up-flaky-test` |
| `chore/` | Config, dependencies, docs | `chore/update-readme` |

Lowercase, words joined by `-`, and the name says what the branch is for.

### During the day
```
git status                                  # what changed
git diff                                    # see the exact changes
git diff --stat                             # changed files and line counts
git add <file>                              # stage a file
git add .                                   # stage everything
git commit -m "Short message saying what and why"
```

### End of the day
```
git push -u origin feature/<topic>          # first push of the branch (-u links it to GitHub)
git push                                    # later pushes
gh pr create                                # open a Pull Request to main
gh pr checks                                # CI status of the PR
gh pr merge                                 # merge after review and green CI
git switch main && git pull origin main     # come back to the updated main
git branch -d feature/<topic>               # delete the merged local branch
```
`-d` deletes only a branch that is already merged (safe). `-D` deletes it anyway (use with care).

### Pull Request flow in detail
```
git push -u origin feature/<topic>          # 1. send the branch to GitHub
gh pr create --base main --fill             # 2. open a PR; --fill uses the commit message as title/body
gh pr view --web                            # 3. open the PR in the browser (review the "Files changed" tab)
gh pr checks --watch                        # 4. follow CI live until every check finishes
gh pr merge --merge --delete-branch         # 5. merge into main and delete the remote branch
git switch main && git pull origin main     # 6. update local main
git branch -d feature/<topic>               # 7. delete the local branch
```
Merge options: `--merge` (keeps every commit + a merge commit), `--squash` (all commits become one), `--rebase` (commits replayed on top of main, no merge commit).

---

## GitHub CLI (`gh`): check CI from the terminal

`gh` was installed on 2026-10-28 and is logged in. If the terminal does not find `gh`, restart it (or use the full path `"C:\Program Files\GitHub CLI\gh.exe"`).

```
gh run list --limit 5                           # last 5 CI runs and their result
gh run watch <run-id>                           # follow a running CI run live
gh run view <run-id> --log                      # full CI log
gh run download <run-id> -n playwright-report   # download the HTML report (screenshots, traces)
gh secret list                                  # names of the repo secrets (values are never shown)
gh variable list                                # repo variables with their values
```

**When:** CI is red and you need to know which test failed and why. Open the downloaded report with `npx playwright show-report <folder>`.

---

## Interview tips

**Q:** What is the difference between `npx playwright test` and `npm test`?

**A:** The result is the same, but `npm test` is the project's standard entry point. The command is defined once in `package.json`, and CI and every developer use the same command. To change a flag, you change it in one place.

**Q:** `git switch -c` vs `git checkout -b`?

**A:** Same result: create a branch and switch to it. `switch` is the newer command made only for branches; `checkout` does many different things (branches, files, commits), so `switch` is clearer.

More questions and answers for every concept: [INTERVIEW_PREP.md](INTERVIEW_PREP.md).
