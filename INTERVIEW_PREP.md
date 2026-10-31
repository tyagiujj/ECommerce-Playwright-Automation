# Interview Prep: Playwright + TypeScript Framework

Every concept used in this framework, explained in detail: **what it is**, **why we used it here**, **what it gives us**, and the **interview questions** with answers I can say out loud.

This file grows every day together with [FRAMEWORK_JOURNEY.md](FRAMEWORK_JOURNEY.md) (the daily log). The journey says *what happened when*; this file says *what each concept means and how to explain it*.

> **Last updated:** 2026-10-31 (Day 5)

---

## Contents

1. [How to explain this framework (the "walk me through your framework" answer)](#1-how-to-explain-this-framework)
2. [Page Object Model, classes, objects and constructors](#2-page-object-model-classes-objects-and-constructors)
3. [TypeScript strict mode and `tsconfig.json`](#3-typescript-strict-mode-and-tsconfigjson)
4. [Path aliases](#4-path-aliases)
5. [npm scripts](#5-npm-scripts)
6. [Environment-based configuration (`.env`, dotenv)](#6-environment-based-configuration-env-dotenv)
7. [Secrets management](#7-secrets-management)
8. [CI with GitHub Actions](#8-ci-with-github-actions)
9. [Playwright fixtures](#9-playwright-fixtures)
10. [Network interception: blocking ads with `context.route`](#10-network-interception-blocking-ads-with-contextroute)
11. [Debugging flaky tests in CI](#11-debugging-flaky-tests-in-ci)
12. [Timeouts and `test.slow()`](#12-timeouts-and-testslow)
13. [Waiting: race conditions, auto-waiting, `waitForURL`](#13-waiting-race-conditions-auto-waiting-waitforurl)
14. [Locator strategy](#14-locator-strategy)
15. [Test data: unique data and Faker](#15-test-data-unique-data-and-faker)
16. [Retries, traces, screenshots, videos](#16-retries-traces-screenshots-videos)
17. [Git: feature branch workflow and Pull Requests](#17-git-feature-branch-workflow-and-pull-requests)
18. [Refactoring principles](#18-refactoring-principles)
19. [`baseURL` and relative URLs](#19-baseurl-and-relative-urls)
20. [Quick revision table](#20-quick-revision-table)

---

## 1. How to explain this framework

**Q: Walk me through your automation framework.**

**A (2-minute answer):**
> It is a UI automation framework for an e-commerce site, built with **Playwright Test** and **TypeScript** in strict mode, using the **Page Object Model**.
>
> - **`pages/`** holds one class per page. Each class owns its locators and actions, so tests read like business steps and a locator change is fixed in one place.
> - **`fixtures/baseTest.ts`** extends Playwright's `test` with custom fixtures. It overrides the browser `context` to block third-party ad requests that made CI flaky, and it creates every page object and the config object, so tests just ask for `homePage`, `cartPage` or `testConfig` in their signature. No test creates objects itself.
> - **Configuration** comes from environment variables: a `.env` file locally, GitHub Secrets and Variables in CI. `BASE_URL` is Playwright's `baseURL`, so tests only use relative paths like `page.goto('/')`; credentials reach tests through a `testConfig` fixture. A missing variable stops the run at once with a clear message.
> - **`tests/`** has 26 end-to-end scenarios: registration, login, cart, checkout, invoice download and more. Test data such as sign-up emails is generated with Faker plus a timestamp, so it is unique on a shared environment.
> - **npm scripts** are the single entry point for every task (`npm test`, `npm run typecheck`...), used the same way locally and in CI.
> - **GitHub Actions** runs a type check first, then the tests, and uploads the HTML report. We use HTML and Allure reports, with screenshots and video on failure and a trace on retry.
> - Work happens on **feature branches** and reaches `main` through Pull Requests.
>
> When I took it over, CI had been red for months. I analysed the traces, found that Google ads were blocking clicks, blocked them with a fixture, then fixed a race condition the ads had been hiding. CI went from 4 failed and 3 flaky to green, and the run time dropped from about 8.5 to 2.3 minutes.

**Tip:** always end with a concrete problem you solved and a number. That is what makes the answer memorable.

**Layer diagram**
```
tests/       → WHAT to test (scenarios, assertions)
fixtures/    → HOW tests get their setup (page objects, ad blocking)
pages/       → HOW to talk to each page (locators + actions)
config/      → WHERE to run (URL, credentials from the environment)
utils/       → shared helpers (CommonActions)
CI           → WHEN it runs (every push / PR to main)
```

---

## 2. Page Object Model, classes, objects and constructors

### What it is
- **Page Object Model (POM)** is a design pattern: every page (or big component) of the app gets its own class. The class holds the page's **locators** and **actions** (methods like `clickOnSignupLoginButton()`).
- Tests never use raw selectors; they call methods on page objects.

### Class, object, constructor (OOP basics)
- A **class** is a blueprint. `export class HomePage { ... }` in `pages/homepage.ts` describes which locators and methods a home page has. A blueprint cannot click anything.
- An **object** (instance) is a real thing built from the blueprint: `new HomePage(page)`.
- `new` automatically runs the **constructor**:
  ```ts
  constructor(page: Page) {
      this.page = page;   // the object remembers its browser tab
      this.signupLoginButton = page.getByRole('link', { name: 'Signup / Login' });
      // ... every other locator
  }
  ```
- `page` is the browser tab of the current test. Locators are created *on* that page, so the object works only in that tab.

### Why we use it
- **Maintainability:** a UI change (new button text) is fixed in one class, not in every test.
- **Readability:** tests read like business steps.
- **Reuse:** 26 tests share 8 page classes.

### Interview questions

**Q: What is POM and why use it?**
A: A pattern where each page is a class with its locators and actions. It separates *how to find elements* from *what the test checks*. When the UI changes, only the page class changes. Tests become readable and reusable.

**Q: What is the difference between a class and an object?**
A: A class is a blueprint; an object is an instance created from it with `new`. In my framework `HomePage` is the class, and `new HomePage(page)` creates an object bound to one test's browser tab.

**Q: What does the constructor of your page class do?**
A: It receives Playwright's `page`, stores it in `this.page`, and initialises every locator on that page. Locators in Playwright are lazy (they are only resolved when used), so creating them in the constructor is cheap.

**Q: Why does a page object need `page` in its constructor?**
A: So its locators know which browser tab to search. Each test has its own `page`, so each test needs its own page object.

**Q: Should page objects contain assertions?**
A: Generally no: keep assertions in tests and actions in pages, so pages stay reusable for positive and negative tests. Some teams allow small "verify" helpers. (In our framework, Step 3 will clean up methods that return locators through `async` getters.)

---

## 3. TypeScript strict mode and `tsconfig.json`

### What it is
- `tsconfig.json` configures the TypeScript compiler. We use `"strict": true`, `"noEmit": true` and path aliases.
- **Strict mode** turns on checks like `strictNullChecks` (a value that can be `undefined` must be handled) and `noImplicitAny` (no untyped variables by accident).
- `noEmit`: only check types, do not write `.js` files. Playwright runs TypeScript itself.

### Why we did it
- Without strict mode many bugs are found only when a test runs (slow, in a browser). With it, `npm run typecheck` finds them in 2-3 seconds.
- CI runs the type check **before** the tests, so a typo fails the build in seconds instead of after 10 minutes of browser tests.

### Interview questions

**Q: Why TypeScript instead of JavaScript for automation?**
A: Type safety and tooling. Wrong method names, wrong argument types and missing imports are found at compile time, with autocomplete in the editor. In a big framework that is used by many people, it makes refactoring safe.

**Q: Playwright runs `.ts` files directly. Why run `tsc` at all?**
A: Playwright only *transpiles* TypeScript (removes the types); it does not *type-check*. A type error can still run and fail at run time. `tsc --noEmit` is the real check, so we run it in CI as the first step.

**Q: What is `strict` mode?**
A: A group of compiler checks (null checks, no implicit `any`, strict function types...). It catches whole classes of bugs, such as using a value that may be `undefined`.

---

## 4. Path aliases

### What it is
In `tsconfig.json`:
```json
"paths": {
  "@pages/*": ["./pages/*"],
  "@config/*": ["./config/*"],
  "@utils/*": ["./utils/*"],
  "@fixtures/*": ["./fixtures/*"]
}
```
So we write `import { HomePage } from '@pages/homepage'` instead of `'../../pages/homepage'`.

### Why
- Relative paths break when a file moves to another folder depth and are hard to read (`../../../`).
- Aliases show the layer at a glance (`@pages`, `@fixtures`).
- Playwright supports `tsconfig` paths out of the box.

### Interview questions

**Q: How do you avoid long relative imports?**
A: Path aliases in `tsconfig.json`. Imports become independent of where the file is, and the alias names document the architecture.

---

## 5. npm scripts

### What it is
`package.json`:
```json
"scripts": {
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "test:ui": "playwright test --ui",
  "test:debug": "playwright test --debug",
  "test:list": "playwright test --list",
  "report": "playwright show-report",
  "typecheck": "tsc --noEmit"
}
```
Extra arguments go after `--`: `npm test -- tests/SearchProduct.spec.ts`.

### Why
- **One standard entry point.** A new team member runs `npm test` without knowing Playwright flags.
- **Local = CI.** CI calls the same scripts, so "works on my machine" problems shrink.
- **Change in one place.** A new flag is added in `package.json` once.

### Interview questions

**Q: Difference between `npx playwright test` and `npm test`?**
A: Same result, but `npm test` is the project's standard command defined in one place and shared by everyone and CI. If we change a flag, we change it once.

**Q: Why does `npm test` work without `run`, but `npm run typecheck` needs it?**
A: `test`, `start` and a few others are built-in lifecycle scripts with shortcuts. Every custom script needs `npm run <name>`.

---

## 6. Environment-based configuration (`.env`, dotenv)

### What it is
- `config/testconfig.ts` reads values from `process.env`:
  ```ts
  export function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing environment variable "${name}". ...`);
    return value;
  }
  export class TestConfig {
    emailaddress = requireEnv('USER_EMAIL');
    password = requireEnv('USER_PASSWORD');
  }
  ```
- `BASE_URL` is read in `playwright.config.ts` as `baseURL: requireEnv('BASE_URL')` (see section 19). Since Day 5, `TestConfig` holds only credentials and reaches tests as the `testConfig` fixture.
- Locally the values come from a git-ignored `.env` file, loaded by `dotenv.config()` in `playwright.config.ts`. `.env.example` is the committed template.
- In CI they come from GitHub Secrets / Variables.

### Concepts
- **12-Factor App, "Config":** config that changes between environments (URLs, credentials) lives in the environment, not in code. Code knows the *name* (`BASE_URL`); the environment provides the *value*.
- **Fail fast:** `requireEnv()` stops at once with a clear message instead of failing later with a confusing `undefined` error inside a test.
- **Single source of truth:** every URL comes from `BASE_URL` through Playwright's `baseURL`; nothing else stores a URL.

### Why
- Before, the URL and password were hard-coded and committed. Changing environment (QA → staging) meant editing code.
- Now switching environment = changing one value.

### Interview questions

**Q: How do you run the same tests against different environments?**
A: All environment-specific values come from environment variables. Locally from `.env`, in CI from the pipeline's secrets and variables. `BASE_URL` becomes Playwright's `baseURL` and tests use relative paths, so one value switches the whole environment.

**Q: What happens if a variable is missing?**
A: `requireEnv()` throws immediately with the variable's name and a hint to check `.env.example`. Failing fast with a clear message saves debugging time.

**Q: Why commit `.env.example` but not `.env`?**
A: `.env.example` documents which variables are needed (no real values). `.env` holds real values and secrets, so it is in `.gitignore`.

---

## 7. Secrets management

### Concepts
- **Never commit secrets.** `.gitignore` only protects *future* commits; a secret already pushed is in git history forever and must be **rotated** (changed).
- **GitHub Secrets** are encrypted, write-only (nobody can read the value after saving), and masked as `***` in logs.
- **GitHub Variables** are for non-secret config (like `BASE_URL`); their values are visible.
- Secrets are passed only to the step that needs them (`env:` on the "Run Playwright tests" step), not to the whole job: **least privilege**.

### Interview questions

**Q: How do you handle credentials in your framework?**
A: Never in code. Locally in a git-ignored `.env`; in CI as GitHub Secrets injected as environment variables only into the test step. Non-secret values like the base URL are GitHub Variables.

**Q: A password was committed by mistake. What do you do?**
A: Rotate the password first (it is compromised as soon as it is pushed), then remove it from the code and move it to an environment variable. Deleting it in a new commit is not enough because the history still contains it.

**Q: Secret vs Variable in GitHub Actions?**
A: Secrets are encrypted, hidden and masked in logs, for passwords and tokens. Variables are plain config visible to anyone with access, for URLs or flags.

---

## 8. CI with GitHub Actions

### Our pipeline (`.github/workflows/playwright.yml`)
Runs on every push and pull request to `main`:
1. Checkout, set up Node.js
2. `npm ci` (clean install exactly from `package-lock.json`)
3. `npx playwright install --with-deps` (browsers + system libraries)
4. **`npm run typecheck`**: fails in seconds on a code error
5. **`npm test`** with `BASE_URL`, `USER_EMAIL`, `USER_PASSWORD` from Variables/Secrets
6. Upload the HTML report as an artifact (`if: !cancelled()`, so it uploads even when tests fail)

### Concepts
- **Fail fast ordering:** cheap checks (type check) before expensive ones (browser tests).
- **`npm ci` vs `npm install`:** `ci` deletes `node_modules` and installs the exact locked versions, so CI is reproducible.
- **Artifacts:** files saved from a run (report, traces) that you download to debug.
- **`gh` CLI:** `gh run list`, `gh run view <id> --log`, `gh run download <id> -n playwright-report` to inspect CI from the terminal.

### Interview questions

**Q: Describe your CI pipeline.**
A: GitHub Actions on every push and PR to `main`: clean install, browser install, type check, tests with secrets injected, report uploaded as an artifact even if tests fail.

**Q: Why `npm ci` in CI?**
A: It installs exactly what `package-lock.json` says and fails if `package.json` and the lock file disagree. Builds are reproducible.

**Q: How do you debug a test that fails only in CI?**
A: Download the report artifact, open the trace and the failure screenshot, read the CI log, and compare with earlier runs to see if the failure is new or random. See section 11.

---

## 9. Playwright fixtures

### What a fixture is
A **fixture** is something Playwright prepares and gives to a test. `page`, `context`, `browser`, `request` are built-in fixtures. A test asks for fixtures by name in its signature:
```ts
test('example', async ({ page, homePage }) => { ... });
```
This is **dependency injection**: the test declares what it needs, the framework creates and provides it.

### Our custom fixtures (`fixtures/baseTest.ts`)
```ts
import { test as base } from '@playwright/test';
import { HomePage } from '@pages/homepage';
// ... other page classes

type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  // ... 9 in total
};

export const test = base.extend<PageFixtures>({
  // 1. Override a built-in fixture: block ad hosts for every test
  context: async ({ context }, use) => {
    await context.route(AD_HOSTS, route => route.abort());
    await use(context);
  },

  // 2. New fixtures: page objects
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  // ...

  // 3. A fixture with no dependencies: config (credentials)
  testConfig: async ({}, use) => {
    await use(new TestConfig());
  },
});

export { expect } from '@playwright/test';
```
Every test imports from here: `import { test, expect } from '@fixtures/baseTest';`

### Anatomy of a fixture
```ts
name: async ({ dependencies }, use) => {
  // setup: runs before the test
  await use(value);   // hands the value to the test; the test runs here
  // teardown: runs after the test
}
```
- `{ page }`: the fixture's own dependencies (other fixtures).
- `use(value)`: everything before it is **setup**, everything after it is **teardown** (for example, delete a user created in setup).
- `base.extend<T>()`: creates a new `test` with extra fixtures. The generic `<T>` tells TypeScript the names and types.

### Before vs after (Day 4 refactor)
| | Before (`let` + `beforeEach`) | After (fixtures) |
|---|---|---|
| Who creates objects | Each test file | Playwright, using `baseTest.ts` |
| Where `new HomePage(page)` is written | 26 files | 1 file |
| New object per test? | Yes | Yes (same) |
| Forget to create one? | Runtime `undefined` error | Impossible: compile error |
| Unused objects created? | Yes | No (lazy) |
| Test shows its dependencies? | No | Yes, in its signature |

### Key properties
- **Lazy:** a fixture runs only if a test (or another fixture) asks for it.
- **Isolated:** test-scoped fixtures (the default) are new for every test.
- **Chained:** `homePage` → needs `page` → needs `context` → our override blocks ads. Every page object gets ad blocking for free.
- **Scopes:** `test` (default, new per test) or `worker` (shared by all tests in one worker process; used for expensive things like a DB connection or an auth token): `[async ({}, use) => {...}, { scope: 'worker' }]`.
- **Auto fixtures:** `{ auto: true }` runs even when no test asks for it (for global logging, for example).
- **Overriding built-ins:** we override `context` to add behaviour for every test without touching the tests.

### Interview questions

**Q: What are fixtures in Playwright?**
A: Reusable, isolated setup and teardown units that Playwright injects into tests by name. Built-ins include `page`, `context`, `browser`. Custom ones are created with `test.extend()`. Code before `use()` is setup, after it is teardown.

**Q: How do you manage page objects in Playwright?**
A: As custom fixtures. `baseTest.ts` extends `test` with one fixture per page class, typed with a `PageFixtures` type. Tests ask for `homePage`, `cartPage`... in their signature. No `let` variables or `beforeEach` setup, and object creation is in one place.

**Q: Fixtures vs `beforeEach`?**
A: `beforeEach` runs for every test in the file whether the test needs it or not, shares state through file-level variables, and cannot be reused across files without copy-paste. Fixtures are lazy, typed, reusable across the whole project, keep setup and teardown together, and make each test's dependencies explicit.

**Q: Does a fixture share one object between tests?**
A: No, not with the default `test` scope. The fixture code is written once but runs for every test, so each test gets a fresh object bound to its own `page`. Only `worker`-scoped fixtures are shared within a worker.

**Q: What does `use()` do?**
A: It passes the fixture value to the test and waits for the test to finish. After it returns, teardown code runs.

**Q: What are fixture scopes?**
A: `test` (default): created for every test. `worker`: created once per worker process and shared by its tests, for expensive setup. A test-scoped fixture can depend on a worker-scoped one, not the other way round.

**Q: How did you add a behaviour to every test without editing them?**
A: By overriding the built-in `context` fixture in `baseTest.ts` to route ad hosts to `abort()`. All tests import `test` from that file, so they all got it.

**Q: Why is the first argument `{}` in `testConfig: async ({}, use) => ...`?**
A: The first argument lists the fixtures this fixture depends on. `TestConfig` needs no browser, so it asks for nothing. With `{ page }`, Playwright would open a tab only to read credentials. Fixtures are built only when needed, and this one is needed by just 4 tests.

**Q: Can a fixture hold something that is not a page object?**
A: Yes: config, test data, an API client, a logged-in user, a database connection. Anything a test needs and that should be created in one place.

**Q: Why the `<PageFixtures>` generic?**
A: It tells TypeScript which fixtures exist and their types. Tests get autocomplete, a typo in a fixture name is a compile error, and TypeScript also errors if a fixture in the type is not implemented.

---

## 10. Network interception: blocking ads with `context.route`

### What it is
```ts
const AD_HOSTS = /googlesyndication|doubleclick\.net|googleadservices|adservice\.google|fundingchoicesmessages/;
await context.route(AD_HOSTS, route => route.abort());
```
`route()` intercepts every request whose URL matches the pattern. `abort()` cancels it, so the ad script never loads. Other options: `route.fulfill()` (return a fake response, i.e. mocking) and `route.continue()` (let it through, optionally modified).

### Why
- The site shows Google ads: a full-screen "vignette" ad that blocked clicks, and ad chips injected into page text (which broke an exact-text locator).
- Ads appear randomly, so different tests failed on different runs: the classic sign of flakiness from an outside source.
- **Fix the cause at the source:** blocking the ad script is better than trying to close an ad that may or may not appear.
- Bonus: pages load faster (CI went from about 8.5 to 2.3 minutes, together with the other fixes).

### Interview questions

**Q: How do you handle third-party popups or ads in tests?**
A: If they are not part of what we test, block them at the network level with `context.route(pattern, r => r.abort())` in a shared fixture. That removes the randomness completely. Closing them with clicks is fragile because they appear at random.

**Q: Why `context.route` and not `page.route`?**
A: `context.route` applies to every page in the browser context, including popups and new tabs. `page.route` covers one page only.

**Q: What else can `route` do?**
A: Mock API responses with `fulfill()`, modify requests with `continue({ headers })`, simulate errors and slow networks. Useful for testing edge cases without a backend.

---

## 11. Debugging flaky tests in CI

### What we did
1. Looked at **several CI runs**, not just the last one: CI had been red since 2026-07-26, so our changes were not the cause.
2. Noticed **different tests failed on different runs** → something random (ads, data, timing).
3. Opened the **traces and screenshots**: a full-screen ad was covering the page; a timeout was only the symptom.
4. Fixed the cause (ad blocking), re-ran, then found the **next** cause hidden behind it (a race condition, section 13).

### Concepts
- **Flaky test:** passes and fails on the same code without changes.
- Common causes: timing (race conditions, hard waits), shared or non-unique test data, third-party content, test order dependence, environment instability.
- **A timeout is a symptom, not a cause.** The trace shows what the page looked like when the test was stuck.
- **Fixing one cause can expose the next.** Faster pages (no ads) revealed a race condition that slow pages had hidden.

### Interview questions

**Q: How do you handle flaky tests?**
A: Find the root cause instead of adding retries or bigger timeouts. I compare several runs to see the pattern, open the trace, screenshot and DOM snapshot of a failure, and classify the cause: timing, data, environment or third-party content. Then I fix it at the source: wait for a real condition, make data unique, block or mock third-party content. Retries only hide flakiness, so I report a test that passed on retry as flaky and investigate it.

**Q: Tell me about a difficult bug in your framework.**
A: CI had been red for months. Failures moved between tests from run to run. The traces showed Google ads covering the page and injecting text. I blocked the ad hosts with a context fixture: failures dropped from 4 failed + 3 flaky to 2 failed. The remaining ones turned out to be a race condition the slow ads had been hiding: the test clicked the cart's delete button before `cart.js` had attached its handlers. Waiting for the page's `load` event with `waitForURL` fixed it, and CI became green with the run time down from 8.5 to 2.3 minutes.

---

## 12. Timeouts and `test.slow()`

### What it is
- Default test timeout here: 30 s (`timeout: 30 * 1000` in `playwright.config.ts`).
- `test.slow()` inside a test triples its timeout (90 s).
- We used it only on the 7 tests that run the full sign-up flow.

### Why not raise the global timeout?
- A global 60 s would make every stuck short test wait 60 s before failing. Short tests should fail fast.
- Tests that are slow because of hard waits (`waitForTimeout`) should be fixed (Step 5), not hidden behind a bigger timeout.

### Interview questions

**Q: A test times out. Do you increase the timeout?**
A: Only if the test is genuinely long, and only for that test (`test.slow()` or `test.setTimeout()`). First I check the trace to see *why* it was slow. Often it is waiting for something that never happens (a covered button, a wrong locator), and a bigger timeout would just make it fail later.

**Q: Which timeouts exist in Playwright?**
A: Test timeout (whole test, default 30 s), expect timeout (each web-first assertion, default 5 s), action and navigation timeouts (optional, set in `use`), and the global timeout for the whole run.

---

## 13. Waiting: race conditions, auto-waiting, `waitForURL`

### What happened
- CI trace: the test clicked "Cart" at 5.90 s and the delete (X) button at 6.33 s. The HTML was visible, but `cart.js` (loaded at the end of the page) had not attached its click handlers yet. The click did nothing.
- Fix in `HomePage.ClickOnCartButton()` and `ProductPage.ClickOnViewCartButton()`:
  ```ts
  await this.cartButton.click();
  await this.page.waitForURL('**/view_cart');   // waits for the URL and the `load` event
  ```

### Concepts
- **Race condition:** the test and the app run at the same time; the result depends on who is faster.
- **Auto-waiting:** before an action Playwright waits for the element to be attached, visible, stable, enabled and receiving events. It does **not** know whether JavaScript has attached event handlers.
- **`waitForURL`** waits for the URL to match and, by default, the `load` event (all scripts executed).
- **Web-first assertions** (`await expect(locator).toBeVisible()`) retry until the condition is true or the timeout ends.
- **Hard waits** (`page.waitForTimeout(2000)`) are guesses: too short = flaky, too long = slow. Always wait for a real condition.

### Interview questions

**Q: Playwright auto-waits. Why can a click still do nothing?**
A: Auto-waiting checks that the element is visible, stable, enabled and not covered. It cannot know whether the page's JavaScript has attached the click handler. If the click happens before that, nothing happens. Wait for a real signal first: the page's `load` event (`waitForURL`), a network response, or a state change.

**Q: Why avoid `waitForTimeout`?**
A: It is a fixed guess. On a fast machine it wastes time; on a slow CI machine it is too short. Waiting for a condition takes exactly as long as needed.

**Q: What is a web-first assertion?**
A: An `expect` on a locator that retries until it passes or times out, like `toBeVisible()` or `toHaveText()`. It handles timing automatically, unlike checking a value once.

---

## 14. Locator strategy

### What happened
- `getByText('Cart is empty! Click here to buy products.', { exact: true })` broke when an ad chip was injected into the sentence.
- First attempt `getByText('Cart is empty!')` matched only the `<b>` tag, but the test checks the whole sentence. **Check how a locator is used before changing it.**
- Fix: `page.locator('#empty_cart p')`, the paragraph inside the site's own container.

### Priority (Playwright's recommendation)
1. `getByRole` (how users and screen readers see the page)
2. `getByLabel`, `getByPlaceholder`, `getByText` (user-visible)
3. `getByTestId` (`data-testid`, stable contract with developers)
4. CSS / XPath tied to stable IDs or structure, as a last resort

### Interview questions

**Q: How do you choose locators?**
A: User-facing first (`getByRole` with the accessible name), then test IDs, and stable IDs/CSS only when nothing better exists. I avoid long exact texts, indexes like `nth(3)` and absolute XPath because they break on small UI changes.

**Q: What is strict mode in locators?**
A: An action on a locator that matches more than one element throws an error instead of clicking the first one. It forces precise locators.

---

## 15. Test data: unique data and Faker

### What happened
A run failed with "Email Address already exist!": Faker produced `Emely19@gmail.com`, which someone else had already registered on this **shared public** site.

Fix in `config/rondomDataGenerator.ts`:
```ts
static getEmail() {
    return `${faker.internet.username()}.${Date.now()}@example.com`;
}
```

### Concepts
- **Unique data on shared environments:** random is not the same as unique. A timestamp makes collisions practically impossible.
- `example.com` is a reserved domain, so we never email a real person.
- **Static utility class:** `RandomDataUtil` methods are `static`, used without `new`. That is why it is imported directly and not turned into a fixture.

### Interview questions

**Q: How do you manage test data?**
A: Dynamic data with Faker for things like names, and guaranteed-unique values (timestamp or UUID) for anything that must be unique, like emails. Each test creates the data it needs, so tests are independent and can run in parallel. (Planned: data files, typed models and builders, Step 6.)

**Q: When would you make something a fixture and when a plain import?**
A: A fixture when each test needs its own instance, especially one that depends on `page` or needs setup/teardown. A plain import for stateless helpers and static utilities.

---

## 16. Retries, traces, screenshots, videos

### Our config (`playwright.config.ts`)
```ts
retries: 1,
use: {
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
},
reporter: [['html'], ['dot'], ['list'], ['allure-playwright']],
```

### Concepts
- **Retry:** a failed test runs again. If it then passes, Playwright marks it **flaky** (not passed). Retries are a safety net, not a fix.
- **Trace:** a recording of every action, DOM snapshot, network call and console message. Opened with `npx playwright show-trace` or in the HTML report. The best tool to debug CI failures.
- `on-first-retry`: records a trace only when a test is retried, so passing runs stay fast.

### Interview questions

**Q: What is the Trace Viewer?**
A: A timeline of a test run with DOM snapshots before and after every action, network requests, console logs and errors. You can see exactly what the page looked like when it failed, even for a CI run.

**Q: Are retries good practice?**
A: As a safety net in CI, yes, with 1-2 retries. But a test that passes only on retry is flaky and must be investigated; retries must not hide real problems.

---

## 17. Git: feature branch workflow and Pull Requests

### Commands
```bash
git status                                  # make sure main is clean
git pull origin main                        # get the latest main
git switch -c feature/page-object-fixtures  # create a branch and switch to it
git branch                                  # * marks the current branch
# ... work, commit ...
git push -u origin feature/page-object-fixtures
gh pr create                                # open a Pull Request
```
`git checkout -b <name>` is the older equivalent of `git switch -c <name>`.

### Concepts
- `main` is always stable. All work happens on short-lived branches cut from `main`.
- **Pull Request:** a request to merge a branch into `main`. It is where code review and CI happen.
- **Branch naming:** `feature/...`, `fix/...`, `chore/...`, lowercase with `-`.
- **Branch protection:** rules on `main` such as "no direct push", "require PR approval", "require green CI".
- Our CI runs on `pull_request` to `main`, so every PR is tested before merge.

### Interview questions

**Q: What Git workflow do you follow?**
A: Feature branch workflow. I branch from the latest `main`, commit small focused changes, push the branch and open a Pull Request. CI runs on the PR, a teammate reviews, and after approval and green checks it is merged. `main` is never pushed to directly.

**Q: Why not commit directly to `main`?**
A: A broken change would break `main` for the whole team, skip code review, and skip CI before merge. Branches isolate work in progress.

**Q: `git switch -c` vs `git checkout -b`?**
A: Same result. `switch` is the newer, clearer command made only for branches; `checkout` does many things (branches, files, commits).

**Q: Merge vs rebase?** *(to be covered when we merge)*
A: Merge keeps history as it happened and adds a merge commit. Rebase replays your commits on top of the latest `main` for a linear history. Never rebase commits that others already use.

---

## 18. Refactoring principles

| Principle | Meaning | Where we used it |
|-----------|---------|------------------|
| **DRY** (Don't Repeat Yourself) | One piece of knowledge in one place | Page objects created only in `baseTest.ts`; URLs built from `BASE_URL` |
| **Separation of concerns** | Each layer has one job | `pages/` (how), `fixtures/` (setup), `tests/` (what), `config/` (where) |
| **Single source of truth** | One authoritative value | `BASE_URL` drives every URL |
| **Fail fast** | Report problems as early and clearly as possible | `requireEnv()`, type check before tests in CI |
| **Small steps** | Change, verify, then scale | Migrated one test, ran it, then the other 25 |
| **Backward-compatible change** | New code does not break old code | New fixtures did not break tests that had not migrated yet |
| **Codemod** | A script that applies the same change to many files | Migrated 24 test files (Day 4) and 25 test files (Day 5) with one script |
| **Remove dead code, keep its side effects** | Before deleting a line, check what else it did | Deleted `TestConfig.appUrl` but moved its `requireEnv('BASE_URL')` check to `playwright.config.ts` |
| **Types are not logic** | A passing type check does not prove the code is right | `goto('/')` instead of `goto('/products')` compiled fine; tests catch that |
| **Fix at the source** | Remove the cause, not the symptom | Blocked ads instead of closing them; fixed waits instead of raising timeouts |

**Q: How do you refactor a large test suite safely?**
A: In small steps with a check after each one. Make the new mechanism backward-compatible (old tests keep working), migrate one file and run it, then migrate the rest, ideally with a script so every file gets the same change. Run the type check and the full suite at the end, and compare results with the run before the change.

---

## 19. `baseURL` and relative URLs

### What it is
```ts
// playwright.config.ts
import { requireEnv } from './config/testconfig';

use: {
  baseURL: requireEnv('BASE_URL'), // page.goto('/login') opens BASE_URL + login
}
```
```ts
// in a test
await page.goto('/');                       // https://automationexercise.com/
await expect(page).toHaveURL('/login');     // compared with https://automationexercise.com/login

// in a page object
await this.page.goto('/products');
```
Playwright joins `baseURL` with relative paths in `page.goto()`, `page.waitForURL()`, `expect(page).toHaveURL()` and API calls (`request.get('/api/...')`).

### Why we did it (Day 5)
- Before: every test called `page.goto(testConfig.appUrl)`, assertions used full URLs (`testConfig.apploginUrl`), and page objects built URLs with `new URL('/products', this.page.url()).toString()`.
- After: the URL is configured once. Tests and page objects only say **where on the site** to go.
- Changing environment (QA → staging) = changing one variable, `BASE_URL`.

### Concepts
- **Leading slash:** with `baseURL = https://site.com/app/`, `goto('/login')` → `https://site.com/login` (root), `goto('login')` → `https://site.com/app/login` (relative to the folder). Standard URL resolution, the same as links in HTML.
- **`baseURL` vs current page URL:** `new URL(path, page.url())` depends on where the browser is right now (it could be an ad's domain). `baseURL` is always the configured site.
- **Fail fast in the config:** `baseURL: requireEnv('BASE_URL')` stops the run with a clear message when the variable is missing, instead of an "invalid URL" error inside a test.

### Interview questions

**Q: How do you run the same suite against QA, staging and production?**
A: The base URL comes from an environment variable and is set as `baseURL` in `playwright.config.ts`. Tests and page objects use only relative paths like `page.goto('/login')`. Locally the value comes from `.env`, in CI from a pipeline variable, so switching environments is one value and no code change. For several fixed environments you can also define one Playwright **project** per environment, each with its own `baseURL`.

**Q: What does `page.goto('/')` do if `baseURL` is not set?**
A: It fails, because `'/'` is not a full URL. That is why our config reads `BASE_URL` through `requireEnv()`: a missing value stops the run at once with the variable's name.

**Q: Does `toHaveURL` use `baseURL` too?**
A: Yes. `expect(page).toHaveURL('/login')` resolves the string against `baseURL` before comparing. For dynamic parts use a regex, for example `toHaveURL(/\/brand_products\/Polo/)`.

**Q: `goto('/login')` vs `goto('login')`?**
A: With a leading slash the path starts at the domain root; without it, it is relative to the `baseURL` path. They only differ when `baseURL` has a path such as `/app/`.

**Q: Why not keep full URLs in a config class?**
A: Duplication: every URL had to be built and stored, and tests had to read them. With `baseURL` Playwright does the joining, the code is shorter, and there is no URL to forget to update.

---

## 20. Quick revision table

| Concept | One-line answer |
|---------|-----------------|
| POM | One class per page with its locators and actions |
| Class vs object | Blueprint vs instance created with `new` |
| Constructor | Runs on `new`; stores `page` and builds locators |
| Strict TypeScript | Compiler checks that catch bugs before running |
| `tsc --noEmit` | Type check only; Playwright does not type-check |
| Path aliases | `@pages/...` instead of `../../pages/...` |
| npm scripts | One standard command for each task, same locally and in CI |
| `.env` + dotenv | Config and secrets out of code |
| `requireEnv()` | Fail fast with a clear message |
| GitHub Secret vs Variable | Hidden/encrypted vs plain config |
| `npm ci` | Exact, reproducible install from the lock file |
| Fixture | Setup/teardown injected into tests by name |
| `use()` | Before = setup, after = teardown |
| Fixture scope | `test` (fresh each test) or `worker` (shared per worker) |
| Lazy fixture | Created only when a test asks for it |
| `base.extend<T>()` | New `test` with typed custom fixtures |
| `context.route` + `abort()` | Block network requests (ads) for the whole context |
| Flaky test | Passes and fails without code changes; find the root cause |
| Timeout | A symptom; check the trace |
| `test.slow()` | Triple the timeout for one long test |
| Race condition | Test acts before the app is ready |
| `waitForURL` | Waits for URL + `load` event |
| Hard wait | A guess; avoid `waitForTimeout` |
| Web-first assertion | `expect(locator)` that retries |
| Locator priority | Role → label/text → test ID → CSS |
| Unique test data | Timestamp/UUID on shared environments |
| Retry → flaky | Passed only on retry = flaky, investigate |
| Trace Viewer | Recorded timeline with DOM snapshots |
| Feature branch | Work isolated from `main`, merged via PR |
| Pull Request | Code review + CI before merge |
| Codemod | Script that applies one change to many files |
| `baseURL` | Configured site URL; `goto('/x')` = `baseURL` + `x` |
| Leading `/` | Path from the domain root; without it, relative to the `baseURL` path |
| Relative `toHaveURL` | `toHaveURL('/login')` is resolved against `baseURL` |
| `async ({}, use)` | Fixture with no dependencies |
| `TS2304: Cannot find name` | A variable is used but never declared or received |
