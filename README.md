# E-Commerce Playwright Automation Framework

End-to-end UI automation framework built with **Playwright**, **TypeScript**, **Page Object Model**, and **Allure reporting** for the public e-commerce demo application [Automation Exercise](https://automationexercise.com/).

This project is designed as an SDET portfolio project to demonstrate practical automation engineering skills, including test design, reusable page objects, assertions, reporting, CI execution, and data-driven test support.

## Project Highlights

- UI automation using Playwright with TypeScript
- Page Object Model implementation for maintainable test code
- Positive and negative test coverage for authentication and registration flows
- Dynamic test data generation using Faker
- Playwright HTML report support
- Allure reporter integration
- Failure artifacts configured with screenshots, videos, and traces
- GitHub Actions workflow for CI execution
- Chromium browser execution configured for stable local and CI runs

## Application Under Test

**Website:** https://automationexercise.com/

Automation Exercise is a public practice website commonly used for validating real-world e-commerce user journeys such as user registration, login, logout, account deletion, and validation messages.

## Tech Stack

| Area | Tool |
| --- | --- |
| Automation Framework | Playwright |
| Language | TypeScript |
| Test Runner | Playwright Test |
| Design Pattern | Page Object Model |
| Test Data | Faker |
| Reporting | Playwright HTML Report, Allure |
| CI/CD | GitHub Actions |
| Runtime | Node.js |

## Framework Structure

```text
AutomationExerciseProject/
|-- .github/
|   `-- workflows/
|       `-- playwright.yml
|-- config/
|   |-- rondomDataGenerator.ts
|   `-- testconfig.ts
|-- pages/
|   |-- homepage.ts
|   |-- loginpage.ts
|   `-- registrationpage.ts
|-- tests/
|   |-- LoginWithCorrectEmailAndPassword.spec.ts
|   |-- LoginWithIncorrectEmailAndPassword.spec.ts
|   |-- LogOutUser.spec.ts
|   |-- RegisterUser.spec.ts
|   `-- RegisterUserWithExistingEmail.spec.ts
|-- playwright.config.ts
|-- package.json
`-- README.md
```

## Test Coverage

| Test Scenario | Description |
| --- | --- |
| Register User | Creates a new user account with complete profile information and verifies account creation |
| Login With Valid Credentials | Creates a user, logs out, logs back in, and validates successful login |
| Login With Invalid Credentials | Verifies error handling for incorrect email and password |
| Logout User | Validates successful logout and redirection to the login page |
| Register With Existing Email | Verifies duplicate email validation message |

## Key Framework Components

### Page Object Model

The framework separates page interactions from test logic using page classes:

- `HomePage` handles home page, signup, and login entry actions
- `LoginPage` handles login verification, logout, account deletion, and login error validation
- `RegistrationPage` handles account information, address details, account creation, and duplicate email validation

This improves maintainability by keeping locators and reusable actions in one place instead of duplicating them across tests.

### Configuration Layer

The `config/testconfig.ts` file stores application URLs and reusable test credentials.

### Test Data Utility

The `config/rondomDataGenerator.ts` file uses Faker to generate dynamic user data such as names, emails, phone numbers, addresses, usernames, and passwords. This reduces dependency on hard-coded test data for registration scenarios.

### Reporting and Debugging

The Playwright configuration includes:

- HTML report
- Dot and list reporters
- Allure reporter
- Screenshot on failure
- Video retained on failure
- Trace collection on first retry
- Retry support for improved stability

## Prerequisites

Install the following before running the framework:

- Node.js LTS version
- npm
- Git

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd AutomationExerciseProject
```

Install project dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

Run the complete test suite:

```bash
npx playwright test
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

Run a specific test file:

```bash
npx playwright test tests/RegisterUser.spec.ts
```

Run tests using the Chromium project:

```bash
npx playwright test --project=chromium
```

## Reports

Open the Playwright HTML report:

```bash
npx playwright show-report
```

Allure results are generated in:

```text
allure-results/
```

If Allure CLI is installed, generate and open the Allure report:

```bash
allure generate allure-results --clean -o allure-report
allure open allure-report
```

## CI/CD

This project includes a GitHub Actions workflow at:

```text
.github/workflows/playwright.yml
```

The pipeline runs on push and pull request events for the `main` and `master` branches.

CI steps include:

- Checkout repository
- Setup Node.js
- Install dependencies
- Install Playwright browsers
- Execute Playwright tests
- Upload Playwright HTML report as an artifact

## Playwright Configuration Summary

Important settings from `playwright.config.ts`:

- Test directory: `./tests`
- Browser project: Chromium
- Workers: `1`
- Retries: `1`
- Timeout: `30 seconds`
- Viewport: `1280 x 720`
- Screenshot: only on failure
- Video: retain on failure
- Trace: on first retry
- Reporters: HTML, dot, list, Allure

## Skills Demonstrated

This framework demonstrates the following SDET skills:

- UI test automation with Playwright
- TypeScript-based test development
- Page Object Model design
- Locator strategy using roles, text, placeholders, CSS, and XPath where required
- Positive and negative test scenario coverage
- Assertions for UI visibility, text validation, enabled state, checked state, and URL validation
- Dynamic test data generation
- Test reporting and debugging artifacts
- CI integration with GitHub Actions
- Maintainable project structure suitable for scaling

## Author

**Ujjwal**

SDET / QA Automation Engineer

