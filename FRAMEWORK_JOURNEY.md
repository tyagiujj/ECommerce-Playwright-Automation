# Framework Journey: making this framework industry-ready

A daily log of how this Playwright + TypeScript framework is improved, step by step.
Each day records **what** changed, **why** it matters in real projects, and **what I learned**.

---

## Roadmap

| # | Step | Status |
|---|------|--------|
| 1 | Foundation: environment config (`.env`), no hard-coded secrets, npm scripts, `tsconfig.json` | 🔄 In progress (tsconfig + path aliases done) |
| 2 | Custom fixtures: inject page objects into tests (remove repeated `beforeEach` setup) | ⬜ |
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
