# Framework Journey: making this framework industry-ready

A daily log of how this Playwright + TypeScript framework is improved, step by step.
Each day records **what** changed, **why** it matters in real projects, and **what I learned**.

---

## Roadmap

| # | Step | Status |
|---|------|--------|
| 1 | Foundation: environment config (`.env`), no hard-coded secrets, npm scripts, `tsconfig.json` | ✅ Done (tsconfig, aliases, npm scripts, `.env`, CI with GitHub Secrets) |
| 2 | Custom fixtures: inject page objects into tests (remove repeated `beforeEach` setup) | 🔄 In progress (ad-blocking fixture done; page objects next) |
| 3 | Page Object cleanup: naming conventions, `readonly` locators, no `async` getters for locators | ⬜ |
| 4 | Reusable business flows (e.g. register user), plus API-based setup for speed | ⬜ |
| 5 | Remove hard waits (`waitForTimeout`) and use web-first assertions | ⬜ |
| 6 | Test data management: JSON/data files, typed models, faker builders | ⬜ |
| 7 | Tagging (`@smoke`, `@regression`) and running suites selectively | ⬜ |
| 8 | Code quality: ESLint + Prettier + Husky pre-commit hooks | ⬜ |
| 9 | Logging and reporting: replace `console.log`, Allure steps, attachments | ⬜ |
| 10 | CI/CD: parallel runs, sharding, environments, report publishing | ⬜ |
| 11 | Authentication reuse with `storageState` | ⬜ |
| 12 | API testing layer alongside UI tests | ⬜ |

---

## Day 1: 2026-10-27, framework analysis

### Current state (baseline)
- 26 spec files, 8 page objects, 1 utility class, Faker-based random data, Allure + HTML reports, GitHub Actions CI.
- Page Object Model is in place, which is a good start.

### Problems found
1. **Hard-coded config and credentials** in `config/testconfig.ts` (URL, email, password). No environment support (QA/Staging/Prod).
2. **No `tsconfig.json`** and **no npm scripts** in `package.json`; tests can only be run by typing long commands.
3. **Repeated setup**: 26 files repeat the same `beforeEach` that creates page objects by hand.
4. **Duplicated registration flow**: the full sign-up steps are copy-pasted in 7 test files.
5. **17 hard waits** (`page.waitForTimeout`), which make tests slow and flaky.
6. **Page Object issues**: `async` methods that only return a locator, mixed naming (`ClickOn...` / `clickOn...`), typos (`EnterPaasword`, `rondomDataGenerator`), `force: true` clicks.
7. **17 `console.log`** calls instead of proper reporting.
8. **No tags**, so you cannot run a smoke suite separately.
9. **Folder naming**: `config/` holds a data generator (belongs in `utils/`); `testcontest/` holds an AI prompt, not test content.

### Decision
Start with **Step 1 (Foundation)**, because every later step (fixtures, CI, environments) builds on it.

---

## Day 1 (continued): 2026-10-27, `tsconfig.json` and path aliases

### What changed
1. Installed TypeScript as a dev dependency (`npm install -D typescript`, version 7).
2. Added `tsconfig.json` with `strict: true` and `noEmit: true`, plus path aliases:
   `@pages/*` → `./pages/*`, `@utils/*` → `./utils/*`, `@config/*` → `./config/*`.
3. Replaced every relative import (`../pages/...`, `../config/...`, `../utils/...`) in all 26 test files with the aliases.

### Why
- `npx tsc --noEmit` catches type mistakes in about 2 seconds, without opening a browser.
- With aliases, an import stays the same however deep a test file sits (`tests/`, `tests/login/`, `tests/checkout/payment/`), so tests can later be organized into folders without breaking imports.

### Verification
- `npx tsc --noEmit` → no errors.
- `npx playwright test --list` → 26 tests in 26 files load fine.
- Sample runs passed: `SearchProduct`, `VerifySubscriptioninhomepage`, `LoginWithIncorrectEmailAndPassword`.
- Only import lines changed (0 other lines touched).

### What I learned
- `..` means "one folder up"; the number of `../` depends on how deep the test file is, not how many tests there are.
- An alias like `@pages` is a nickname saved in `tsconfig.json`: `"@name/*": ["./folder/*"]`.
- Don't name an alias like an npm package (`@playwright`, `@faker-js`).
- TypeScript 7 removed `baseUrl`, and `paths` values must start with `./`. Read the error message: it usually tells you the fix.
- Keep one import style per file; mixing `../` and `@` is flagged as inconsistent in code review.

### Next
- Part 2: npm scripts in `package.json` (`test`, `test:headed`, `report`, `typecheck`).
- Part 3: move URL and credentials to `.env`.

---

## Day 2: 2026-10-28, npm scripts

### What changed
1. Added npm scripts to `package.json`: `test`, `test:headed`, `test:ui`, `test:debug`, `test:list`, `report`, `typecheck`.
2. Added `COMMANDS.md`, a cheat sheet that explains every command, why it exists, and when to use it.

### Why
- `npm test` is the standard entry point of every Node project; anyone who clones the repo can run it without reading docs.
- Each command is defined in one place, so local runs and CI use the same command.

### Verification
- `npm run test:list` → 26 tests found.
- `npm test -- tests/SearchProduct.spec.ts` → passed.

### What I learned
- A script is `"name": "command"`; `npm test` works directly, every other script needs `npm run <name>`.
- Extra arguments go after `--` (`npm test -- -g "Login"`), so npm passes them on to Playwright.
- `tsc --noEmit` only checks types and writes no `.js` files.

---

## Day 2 (continued): 2026-10-28, `.env` with dotenv

### What changed
1. Installed `dotenv` as a dev dependency.
2. `.env` (local only, git-ignored) holds `BASE_URL`, `USER_EMAIL`, `USER_PASSWORD`.
3. `.env.example` (committed) is a template with fake values, so teammates know which variables they need.
4. `.gitignore` now ignores `.env`.
5. `playwright.config.ts` loads the file with `dotenv.config({ quiet: true })`.
6. `tsconfig.json` got `"types": ["node"]`, because TypeScript 7 no longer loads Node types by default (`Cannot find name 'process'`).
7. `config/testconfig.ts` reads values from `process.env` through a `requireEnv()` helper. Login and test-cases URLs are built from `BASE_URL` with `new URL()`.
8. No test file changed: the `TestConfig` property names stayed the same (encapsulation).

### Why
- No passwords in code or on GitHub.
- Switching environments (QA / Staging / Prod) means changing one value, not code.
- `requireEnv()` fails fast with a clear message instead of typing `undefined` into a field.

### Verification
- `npm run typecheck` → no errors.
- `LoginWithCorrectEmailAndPassword`, `ContactUsForm`, `LogOutUser` → passed (login test failed once because the site returned a Cloudflare 520 error, then passed on retry).
- With `.env` removed: `Error: Missing environment variable "BASE_URL"`.
- `git status` does not show `.env`.

### What I learned
- `process.env` holds environment variables; `dotenv` copies `.env` lines into it.
- Config belongs outside code (12-Factor App principle).
- `.gitignore` protects only future commits; a secret already pushed must be rotated.
- Derive values (login URL) from one source (`BASE_URL`) instead of duplicating them.

---

## Day 2 (continued): 2026-10-28, CI uses npm scripts and GitHub Secrets

### What changed
1. `.github/workflows/playwright.yml`: added a `Type check` step (`npm run typecheck`) before the tests.
2. Tests now run with `npm test` instead of `npx playwright test`.
3. The test step gets `BASE_URL` from a GitHub Variable and `USER_EMAIL` / `USER_PASSWORD` from GitHub Secrets through an `env:` block.

### Why
- `.env` is git-ignored, so CI needs the values from somewhere else; Secrets are encrypted and masked as `***` in logs.
- `BASE_URL` is a Variable, not a Secret, because it is not sensitive and should stay readable in logs.
- The `env:` block gives the values only to the test step (least privilege).
- Type check first fails the run in seconds when the code has a type error (fail fast).

### What I learned
- CI runs the tests on a fresh machine on every push and pull request.
- `npm ci` installs the exact versions from `package-lock.json`.
- `${{ secrets.NAME }}` for secrets, `${{ vars.NAME }}` for variables.
- Add the secrets on GitHub before pushing the workflow, or the run fails with an empty locker.
- YAML uses spaces only; indentation decides the structure.

### Next
- Add the Secrets and the Variable on GitHub (Settings → Secrets and variables → Actions).
- Commit Parts 2 to 4, push, and check the run in the Actions tab.

---

## Day 2 (continued): 2026-10-28, CI failure analysis

### Result of the first run with secrets (run 40734502066)
- 19 passed, 3 flaky, 4 failed. `Type check` passed. No `Missing environment variable` error, so Secrets and the Variable work.
- CI had already been red on every push since 2026-07-26, before any of today's changes.

### Root cause: Google ads on automationexercise.com
1. **Full-screen "vignette" ads**: clicking a link opens an ad overlay instead of the next page. The test then waits for an element on a page it never reached, until `Test timeout of 30000ms exceeded`. Seen in Login, Place Order Register while Checkout, Download Invoice, Place Order before Checkout, View Category Products, Verify Address Details.
2. **Injected ad chips**: Google inserts a "Software products" link inside the page text, so `getByText('Cart is empty! Click here to buy products.', { exact: true })` no longer matches (Remove Products From Cart).
- Different tests fail on each run, because ads appear at random. GitHub runners (US data centre) see more ads than a local machine in India.

### Planned fix
- Block ad network requests with `context.route(...)` inside a custom fixture (this is Step 2 of the roadmap).
- Make the empty-cart locator not depend on the full sentence.

### What I learned
- `gh run view <id> --log` and `gh run download <id>` give the CI log and the HTML report with screenshots.
- A timeout is often a symptom; the screenshot shows the real cause.
- Compare with earlier runs before blaming the latest change.

---

## Day 2 (continued): 2026-10-28, Step 2 Part 2.1, ad-blocking fixture

### What changed
1. New `fixtures/baseTest.ts`: extends Playwright's `test` and overrides the built-in `context` fixture so every request to Google ad servers is aborted (`context.route(AD_HOSTS, route => route.abort())`).
2. `tsconfig.json`: new alias `@fixtures/*` and `fixtures/**/*.ts` added to `include`.
3. All 26 tests: line 1 now imports `test, expect` from `@fixtures/baseTest` instead of `@playwright/test`. No other line changed.
4. Page objects still import `Page` and `Locator` types from `@playwright/test`; that is correct, they are only types.

### Why
- One file protects all 26 tests (and every future test) from ads.
- Blocking the ad script removes the cause; clicking an ad's "Close" button would stay flaky because ads appear at random.
- Overriding `context` instead of `page` also covers new tabs and popups.

### Verification
- `npm run typecheck` → no errors.
- Throwaway check: `pagead2.googlesyndication.com` blocked, 0 ad iframes on the home page.
- The 7 tests that failed or were flaky in CI: 6 passed, 1 flaky (Place Order Register while Checkout).
- That flaky run had no ad on the page; it hit the 30 s test timeout. The test takes 23–30 s (65 steps, 3 hard waits), right at the limit.

### What I learned
- A fixture has setup, `await use(value)` (the test runs here), then teardown.
- `base.extend({...})` adds or overrides fixtures; `{ page }` was a fixture all along.
- `context.route(pattern, route => route.abort())` cancels matching network requests.
- After fixing one cause of flakiness, run again: a second, different cause can show up.

---

## Day 2 (continued): 2026-10-28, `test.slow()` for long sign-up flows

### What changed
- Added `test.slow()` (3x timeout, 30 s → 90 s) as the first line of the 7 tests that run the full sign-up flow:
  DownloadInvoiceAfterPurchaseOrder, LoginWithCorrectEmailAndPassword, PlaceOrderBeforeRegisterCheckout,
  PlaceOrderRegisterwhileCheckout, RegisterUser, SearchProductsAndVerifyCartAfterLogin, VerifyAddressDetailsInCheckoutPage.

### Why
- Chose per-test `test.slow()` over a global 60 s timeout: short tests keep the 30 s limit, so a stuck short test still fails fast.
- Picked tests by a clear rule (they sign up a new user), not by guessing. Local full run: 26 passed in 4.5 min with no retries; CI is about 2x slower, so 20 s locally is close to 30 s on CI.
- AddProductsinCart and LogOutUser are slow because of hard waits (5 s, 2 × 2 s). Those get fixed in Step 5, not hidden behind a bigger timeout.

### Verification
- The 7 tests: 7 passed with `--retries=0`.

### CI result after the fixture (run 40743089383)
- 24 passed, 0 flaky, 2 failed (before: 19 passed, 3 flaky, 4 failed). All ad failures are gone.

---

## Day 3: 2026-10-29, race condition on the cart page, unique emails

### Problem 1: hidden race condition
- CI trace: the test clicked "Cart" at 5.90 s and the delete (X) button at 6.33 s. The cart page HTML was visible, but `cart.js` (loaded at the end of the page) had not attached its click handlers yet, so the click did nothing. Same for "Proceed To Checkout" (its popup comes from JavaScript).
- The ads used to slow pages down, which hid this bug. Blocking ads made pages faster and exposed it.
- **Fix**: `HomePage.ClickOnCartButton()` and `ProductPage.ClickOnViewCartButton()` now call `await this.page.waitForURL('**/view_cart')` after the click. `waitForURL` waits for the URL and, by default, the page `load` event, so all scripts have run. 11 tests use these methods.

### Problem 2: fragile empty-cart locator
- `getByText('Cart is empty! Click here to buy products.', { exact: true })` broke when an ad chip was injected into the sentence.
- First attempt `getByText('Cart is empty!')` matched only the `<b>` tag, and the test checks the whole sentence. Lesson: check how a locator is used before changing it.
- **Fix**: `page.locator('#empty_cart p')`, the paragraph inside the site's own `#empty_cart` container.

### Problem 3: email already exists
- A full local run failed with "Email Address already exist!": `faker.internet.email()` gave `Emely19@gmail.com`, which someone else had already registered on this shared public site.
- **Fix**: `RandomDataUtil.getEmail()` returns `<username>.<timestamp>@example.com`, which is unique on every call.

### Verification
- `npm run typecheck` → no errors.
- 11 tests that open the cart: passed. RemoveProductsFromCart: 3 of 3 runs passed.
- 11 tests that sign up a new user: passed.

### What I learned
- A test that passes only because something else made the page slow is a hidden race condition.
- Wait for a real condition (`waitForURL`, web-first assertions), never a guessed time.
- Unique test data matters on shared environments.

### CI result (run 40747532056, commit c457eb6)
- ✅ **Green, for the first time since 2026-07-26.** 25 passed, 1 flaky, 0 failed, in 2.3 min (the red runs took about 8.5 min, because failing tests wait for their full timeout and then retry).
- Flaky: VerifyScrollUpUsingArrowButtonAndScrollDown, `locator.click: Element is not visible` on `#scrollUp`, clicked with `force: true`. It is left for Step 3/5 (no `force: true`, wait for the arrow to appear).

---

## Summary of Day 2 and Day 3 (2026-10-28 to 2026-10-29)

### What we did
| # | Change | Where | Result |
|---|--------|-------|--------|
| 1 | npm scripts | `package.json`, `COMMANDS.md` | One standard command for every task (`npm test`, `npm run typecheck`, ...) |
| 2 | Config in environment variables | `.env`, `.env.example`, `.gitignore`, `playwright.config.ts`, `config/testconfig.ts`, `tsconfig.json` | No password in code; switching environments means changing one value |
| 3 | CI uses npm scripts and GitHub Secrets | `.github/workflows/playwright.yml` | Type check runs first; secrets reach only the test step |
| 4 | CI failure analysis | `gh` CLI, CI logs, traces, screenshots | Found the real cause: Google ads |
| 5 | Ad-blocking custom fixture | `fixtures/baseTest.ts`, all 26 tests (line 1) | One file protects every test |
| 6 | `test.slow()` on 7 sign-up tests | 7 test files | Long flows get 90 s; short tests keep 30 s |
| 7 | Wait for the cart page to load | `pages/homepage.ts`, `pages/productpage.ts` | Fixed a hidden race condition |
| 8 | Stable empty-cart locator | `pages/cartAndCheckOutpage.ts` | No longer breaks when text changes |
| 9 | Unique sign-up emails | `config/rondomDataGenerator.ts` | No more "Email Address already exist!" |

**CI before → after:** 19 passed, 3 flaky, 4 failed (8.4 min) → 25 passed, 1 flaky, 0 failed (2.3 min).

### Key lessons
1. **Keep config out of code.** Code knows the *name* (`BASE_URL`), the environment provides the *value* (12-Factor App).
2. **Never commit secrets.** `.gitignore` protects only future commits; a pushed secret must be rotated.
3. **Fail fast.** `requireEnv()` and the type-check step turn hidden problems into clear, early errors.
4. **Single source of truth.** Login and test-case URLs are built from `BASE_URL`, not stored three times.
5. **A timeout is a symptom, not a cause.** The screenshot, trace and page snapshot show the real reason.
6. **Compare with earlier runs** before blaming the latest change. If different tests fail on each run, suspect something random (ads, data, timing).
7. **Remove a problem at its source.** Blocking the ad script is better than clicking "Close" on an ad that appears at random.
8. **Fixtures beat copy-paste setup.** `base.extend()`, setup → `await use()` → teardown; one file changes all tests.
9. **Fixing one cause can expose the next.** Faster pages (no ads) revealed a race condition that the ads had been hiding.
10. **Wait for a real condition, never a guessed time.** `waitForURL` waits exactly as long as needed; `waitForTimeout` is a guess.
11. **Check how a locator is used before changing it.** My first empty-cart locator broke the assertion that used it.
12. **Use unique test data on shared environments.** A timestamp makes every email unique.
13. **Raise a timeout only for tests that are truly long** (`test.slow()`), and fix slow tests caused by hard waits instead of hiding them.

### Next
- Part 2.2: page objects as fixtures (remove `let` variables and `beforeEach` from the 26 tests).
