# 🛒 E-Commerce Automation Framework | Playwright + TypeScript

[![Playwright Tests](https://github.com/tyagiujj/ECommerce-Playwright-Automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/tyagiujj/ECommerce-Playwright-Automation/actions/workflows/playwright.yml)

A UI automation framework built with **Playwright**, **TypeScript** and the **Page Object Model (POM)** for the public e-commerce application **Automation Exercise**.

The framework is being hardened step by step towards industry standards: environment-based configuration, custom fixtures, CI with GitHub Secrets, and stable, non-flaky tests. Every change is logged with its reason in [FRAMEWORK_JOURNEY.md](FRAMEWORK_JOURNEY.md).

> **Last updated:** 2026-10-29 · **CI status:** ✅ green (25 passed, 1 flaky, 0 failed)

---

# 🚀 Project Overview

This project automates complete user journeys of an e-commerce application:

- User Registration and Authentication
- Product Search and Product Details
- Shopping Cart
- Checkout, Payment and Order Placement
- Invoice Download
- Category and Brand Navigation
- Product Reviews and Recommended Products
- Subscription, Contact Us and Scroll Validations

---

# 🌐 Application Under Test

**Automation Exercise**: https://automationexercise.com/

A public e-commerce application widely used to practise manual and automation testing.

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Playwright Test | Test runner and browser automation |
| TypeScript (strict mode) | Programming language and type checking |
| Page Object Model | Design pattern |
| Custom fixtures | Shared test setup (ad blocking) |
| dotenv | Environment variables from `.env` |
| Faker | Dynamic test data |
| GitHub Actions | CI/CD |
| GitHub Secrets / Variables | Credentials and config in CI |
| HTML Report / Allure | Reporting |

---

# 📂 Project Structure

```text
AutomationExerciseProject
│
├── .github/workflows/
│   └── playwright.yml          # CI: type check, tests, report upload
│
├── config/
│   ├── testconfig.ts           # Reads BASE_URL, USER_EMAIL, USER_PASSWORD from the environment
│   └── rondomDataGenerator.ts  # Faker-based test data (unique emails)
│
├── fixtures/
│   └── baseTest.ts             # Custom test: blocks Google ad requests for every test
│
├── pages/                      # Page objects
│   ├── homepage.ts
│   ├── loginpage.ts
│   ├── registrationpage.ts
│   ├── productpage.ts
│   ├── cartAndCheckOutpage.ts
│   ├── Categorypage.ts
│   ├── contactUsformpage.ts
│   └── testCasespage.ts
│
├── tests/                      # 26 spec files, one scenario each
├── utils/
│   └── commonActions.ts
├── testData/
│   └── sample.pdf              # Upload file for the Contact Us test
│
├── .env.example                # Template for your local .env (never commit .env)
├── playwright.config.ts        # Loads .env, reporters, retries, browser settings
├── tsconfig.json               # Strict mode and path aliases (@pages, @config, @utils, @fixtures)
├── package.json                # npm scripts
├── COMMANDS.md                 # Every command explained: what, why, when
├── FRAMEWORK_JOURNEY.md        # Daily log of framework improvements
└── README.md
```

---

# ⚙️ Setup

**1. Clone and install**

```bash
git clone https://github.com/tyagiujj/ECommerce-Playwright-Automation.git
cd ECommerce-Playwright-Automation
npm ci
npx playwright install
```

**2. Create your `.env` file**

Copy `.env.example` to `.env` and fill in a test account:

```text
BASE_URL=https://automationexercise.com/
USER_EMAIL=your-test-email@example.com
USER_PASSWORD=your-test-password
```

`.env` is git-ignored, so your credentials never reach GitHub. If a variable is missing, tests stop at once with a clear message, for example `Missing environment variable "BASE_URL"`.

---

# ▶️ Running Tests

| Command | What it does |
|---------|--------------|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run with the browser visible |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:debug` | Step through a test in the Playwright Inspector |
| `npm run test:list` | List tests without running them |
| `npm run report` | Open the last HTML report |
| `npm run typecheck` | Check TypeScript errors without opening a browser |

Pass extra arguments after `--`:

```bash
npm test -- tests/SearchProduct.spec.ts   # one file
npm test -- -g "Login"                     # tests whose name contains "Login"
```

See [COMMANDS.md](COMMANDS.md) for every command with an explanation.

---

# 🏗 Framework Design

### Page Object Model
Each page class holds its locators and actions, so tests read like business steps and a locator change is fixed in one place.

### Custom fixtures
All tests import `test` and `expect` from `@fixtures/baseTest` instead of `@playwright/test`. The fixture overrides the browser `context` and aborts requests to Google ad servers. The site's full-screen ads and injected ad links used to block clicks and change page text, which made CI fail at random.

### Environment-based configuration
`config/testconfig.ts` reads values from `process.env` through `requireEnv()`. Locally they come from `.env` (loaded by `dotenv` in `playwright.config.ts`); in CI they come from GitHub Secrets and Variables. Login and test-case URLs are built from `BASE_URL`, so switching environments means changing one value.

### Stability practices
- Wait for real conditions (`waitForURL`, web-first assertions) instead of fixed sleeps.
- Locators based on the site's own structure (`#empty_cart p`) instead of long exact text.
- Unique sign-up emails (`<username>.<timestamp>@example.com`) on this shared public site.
- `test.slow()` only for long end-to-end flows (full sign-up), so short tests keep the 30 s timeout.

---

# 🔄 Continuous Integration

GitHub Actions (`.github/workflows/playwright.yml`) runs on every push and pull request to `main`:

1. Checkout and install Node.js
2. `npm ci` and install Playwright browsers
3. **Type check** (`npm run typecheck`): fails in seconds on a code error
4. **Run tests** (`npm test`) with `BASE_URL` from a repository Variable and `USER_EMAIL` / `USER_PASSWORD` from repository Secrets
5. Upload the HTML report as an artifact

To run CI in your own fork, add under **Settings → Secrets and variables → Actions**:

| Type | Name |
|------|------|
| Secret | `USER_EMAIL` |
| Secret | `USER_PASSWORD` |
| Variable | `BASE_URL` |

---

# 📊 Reporting

- Playwright HTML report (`npm run report`)
- Allure results in `allure-results/` (generating the report needs the Allure CLI: `allure generate allure-results --clean -o allure-report`, then `allure open allure-report`)
- Screenshot and video on failure, trace on first retry

---

# ✅ Automated Test Scenarios

| # | Test Scenario | Spec file |
|---|---------------|-----------|
| 1 | Register User | `RegisterUser.spec.ts` |
| 2 | Login with Correct Email and Password | `LoginWithCorrectEmailAndPassword.spec.ts` |
| 3 | Login with Incorrect Email and Password | `LoginWithIncorrectEmailAndPassword.spec.ts` |
| 4 | Logout User | `LogOutUser.spec.ts` |
| 5 | Register User with Existing Email | `RegisterUserWithExistingEmail.spec.ts` |
| 6 | Contact Us Form | `ContactUsForm.spec.ts` |
| 7 | Verify Test Cases Page | `VerifyTestCasesPage.spec.ts` |
| 8 | Verify All Products and Product Detail Page | `VerifyAllProductsandproductdetailpage.spec.ts` |
| 9 | Search Product | `SearchProduct.spec.ts` |
| 10 | Verify Subscription in Home Page | `VerifySubscriptioninhomepage.spec.ts` |
| 11 | Verify Subscription in Cart Page | `VerifySubscriptioninCartpage.spec.ts` |
| 12 | Add Products in Cart | `AddProductsinCart.spec.ts` |
| 13 | Verify Product Quantity in Cart | `VerifyProductquantityinCart.spec.ts` |
| 14 | Place Order: Register while Checkout | `PlaceOrderRegisterwhileCheckout.spec.ts` |
| 15 | Place Order: Register before Checkout | `PlaceOrderBeforeRegisterCheckout.spec.ts` |
| 16 | Place Order: Login before Checkout | `PlaceOrderLoginBeforeCheckOut.spec.ts` |
| 17 | Remove Products from Cart | `RemoveProductsFromCart.spec.ts` |
| 18 | View Category Products | `ViewCategoryProducts.spec.ts` |
| 19 | View and Cart Brand Products | `ViewAndCartBrandProducts.spec.ts` |
| 20 | Search Products and Verify Cart After Login | `SearchProductsAndVerifyCartAfterLogin.spec.ts` |
| 21 | Add Review on Product | `AddReviewOnProduct.spec.ts` |
| 22 | Add to Cart from Recommended Items | `AddToCartFromRecommendedItems.spec.ts` |
| 23 | Verify Address Details in Checkout | `VerifyAddressDetailsInCheckoutPage.spec.ts` |
| 24 | Download Invoice after Purchase Order | `DownloadInvoiceAfterPurchaseOrder.spec.ts` |
| 25 | Verify Scroll Up using Arrow Button | `VerifyScrollUpUsingArrowButtonAndScrollDown.spec.ts` |
| 26 | Verify Scroll Up without Arrow Button | `VerifyScrollUpWithoutArrowButtonAndScrollDown.spec.ts` |

---

# 🗺 Improvement Roadmap

| # | Step | Status |
|---|------|--------|
| 1 | Foundation: `tsconfig.json`, path aliases, npm scripts, `.env`, CI with GitHub Secrets | ✅ Done |
| 2 | Custom fixtures: ad blocking, then page objects injected into tests | 🔄 In progress |
| 3 | Page Object cleanup: naming conventions, `readonly` locators, no `force: true` | ⬜ |
| 4 | Reusable business flows (register user) and API-based setup | ⬜ |
| 5 | Remove hard waits (`waitForTimeout`) and use web-first assertions | ⬜ |
| 6 | Test data management: data files, typed models, builders | ⬜ |
| 7 | Tagging (`@smoke`, `@regression`) | ⬜ |
| 8 | ESLint, Prettier and Husky pre-commit hooks | ⬜ |
| 9 | Logging and reporting: Allure steps, attachments | ⬜ |
| 10 | CI/CD: parallel runs, sharding, environments, report publishing | ⬜ |
| 11 | Authentication reuse with `storageState` | ⬜ |
| 12 | API testing layer | ⬜ |

Details, reasons and lessons for each step: [FRAMEWORK_JOURNEY.md](FRAMEWORK_JOURNEY.md).

---

# 📝 Recent Updates

### 2026-10-29
- Fixed a race condition on the cart page: tests now wait for the page to load (`waitForURL`) before clicking delete or Proceed To Checkout.
- Stable empty-cart locator (`#empty_cart p`).
- Unique sign-up emails with a timestamp.
- **CI is green again** for the first time since July (25 passed, 1 flaky). Run time dropped from about 8.5 to 2.3 minutes.

### 2026-10-28
- npm scripts for every common task, documented in `COMMANDS.md`.
- URL and credentials moved to `.env` (dotenv); `.env.example` template added.
- CI runs a type check first and takes credentials from GitHub Secrets.
- Custom fixture `fixtures/baseTest.ts` blocks Google ads that broke tests in CI.
- `test.slow()` for the 7 tests that run the full sign-up flow.

### 2026-10-27
- `tsconfig.json` with strict mode and path aliases (`@pages`, `@config`, `@utils`).

---

# 👨‍💻 Author

## Ujjwal Tyagi

**QA Automation Engineer | SDET**

### Technical Skills

- Playwright
- Selenium WebDriver
- TypeScript
- Java
- TestNG
- Page Object Model
- API Testing (Learning)
- Git
- GitHub
- CI/CD
- Jenkins

---

⭐ If you found this project useful, feel free to fork it, star the repository, and connect with me on LinkedIn.
