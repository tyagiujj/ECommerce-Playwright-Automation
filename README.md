# 🛒 E-Commerce Automation Framework | Playwright + TypeScript

A scalable, production-style UI automation framework built using **Playwright**, **TypeScript**, and the **Page Object Model (POM)** design pattern for the public e-commerce application **Automation Exercise**.

This framework demonstrates real-world QA Automation practices, including reusable page objects, robust locator strategies, end-to-end business flow validation, dynamic test data generation, reporting, and CI/CD integration.

---

# 🚀 Project Overview

This project automates complete user journeys of an e-commerce application covering:

- User Registration
- User Authentication
- Product Search
- Product Details Validation
- Shopping Cart
- Checkout
- Payment Flow
- Order Placement
- Invoice Download
- Category Navigation
- Brand Navigation
- Product Reviews
- Recommended Products
- Scroll Validations

The framework is developed using industry-standard automation practices suitable for enterprise-level applications.

---

# 🌐 Application Under Test

**Automation Exercise**

https://automationexercise.com/

Automation Exercise is a public e-commerce application widely used for practicing Manual Testing and Automation Testing concepts.

---

# 🛠 Tech Stack

| Technology | Description |
|------------|-------------|
| Playwright | UI Automation |
| TypeScript | Programming Language |
| Playwright Test | Test Runner |
| Page Object Model | Design Pattern |
| Faker | Dynamic Test Data |
| Node.js | Runtime |
| Git | Version Control |
| GitHub | Source Code Repository |
| GitHub Actions | CI/CD |
| HTML Report | Test Reporting |
| Allure Report | Advanced Reporting |

---

# 📂 Project Structure

```text
AutomationExerciseProject
│
├── .github
│   └── workflows
│       └── playwright.yml
│
├── config
│   ├── rondomDataGenerator.ts
│   └── testconfig.ts
│
├── pages
│   ├── homepage.ts
│   ├── loginpage.ts
│   ├── registrationpage.ts
│   ├── productpage.ts
│   ├── cartAndCheckOutpage.ts
│   ├── categorypage.ts
│   └── testCasespage.ts
│
├── tests
│   ├── RegisterUser.spec.ts
│   ├── LoginWithCorrectEmailAndPassword.spec.ts
│   ├── LoginWithIncorrectEmailAndPassword.spec.ts
│   ├── LogoutUser.spec.ts
│   ├── RegisterUserWithExistingEmail.spec.ts
│   ├── ContactUsForm.spec.ts
│   ├── VerifyTestCasesPage.spec.ts
│   ├── VerifyAllProductsAndProductDetailPage.spec.ts
│   ├── SearchProduct.spec.ts
│   ├── VerifySubscriptionInHomePage.spec.ts
│   ├── VerifySubscriptionInCartPage.spec.ts
│   ├── AddProductsInCart.spec.ts
│   ├── VerifyProductQuantityInCart.spec.ts
│   ├── PlaceOrderRegisterWhileCheckout.spec.ts
│   ├── PlaceOrderBeforeRegisterCheckout.spec.ts
│   ├── PlaceOrderLoginBeforeCheckout.spec.ts
│   ├── RemoveProductsFromCart.spec.ts
│   ├── ViewCategoryProducts.spec.ts
│   ├── ViewCartBrandProducts.spec.ts
│   ├── SearchProductsAndVerifyCartAfterLogin.spec.ts
│   ├── AddReviewOnProduct.spec.ts
│   ├── AddToCartFromRecommendedItems.spec.ts
│   ├── VerifyAddressDetailsInCheckoutPage.spec.ts
│   ├── DownloadInvoiceAfterPurchaseOrder.spec.ts
│   ├── VerifyScrollUpUsingArrowButtonAndScrollDown.spec.ts
│   └── VerifyScrollUpWithoutArrowButtonAndScrollDown.spec.ts
│
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

# ✅ Automated Test Scenarios

| # | Test Scenario |
|---|---------------|
| 1 | Register User |
| 2 | Login with Correct Email and Password |
| 3 | Login with Incorrect Email and Password |
| 4 | Logout User |
| 5 | Register User with Existing Email |
| 6 | Contact Us Form |
| 7 | Verify Test Cases Page |
| 8 | Verify All Products and Product Detail Page |
| 9 | Search Product |
| 10 | Verify Subscription in Home Page |
| 11 | Verify Subscription in Cart Page |
| 12 | Add Products in Cart |
| 13 | Verify Product Quantity in Cart |
| 14 | Place Order: Register while Checkout |
| 15 | Place Order: Register before Checkout |
| 16 | Place Order: Login before Checkout |
| 17 | Remove Products from Cart |
| 18 | View Category Products |
| 19 | View Brand Products |
| 20 | Search Products and Verify Cart After Login |
| 21 | Add Review on Product |
| 22 | Add to Cart from Recommended Items |
| 23 | Verify Address Details in Checkout |
| 24 | Download Invoice after Purchase Order |
| 25 | Verify Scroll Up using Arrow Button |
| 26 | Verify Scroll Up without Arrow Button |

---

# 🏗 Framework Design

The framework follows the **Page Object Model (POM)** architecture.

Every page contains:

- Page Locators
- Page Actions
- Reusable Methods

Benefits:

- High Maintainability
- Low Code Duplication
- Easy Scalability
- Better Readability

---

# 🔍 Locator Strategy

The framework uses stable Playwright locators such as:

- getByRole()
- getByText()
- getByPlaceholder()
- getByLabel()
- CSS Selectors
- Attribute Selectors
- XPath (only where necessary)

Priority is always given to stable and maintainable locators.

---

# 🎲 Dynamic Test Data

Dynamic user data is generated using **Faker**, including:

- First Name
- Last Name
- Full Name
- Email Address
- Company
- Address
- Phone Number
- Password

This eliminates dependency on hardcoded data.

---

# 📊 Reporting

The framework supports:

- Playwright HTML Report
- Allure Report
- Screenshot on Failure
- Video Recording on Failure
- Trace on First Retry

Generate reports:

```bash
npx playwright show-report
```

For Allure:

```bash
allure generate allure-results --clean -o allure-report

allure open allure-report
```

---

# ⚙️ Installation

Clone Repository

```bash
git clone https://github.com/<your-github-username>/AutomationExerciseProject.git
```

Navigate

```bash
cd AutomationExerciseProject
```

Install Dependencies

```bash
npm install
```

Install Browsers

```bash
npx playwright install
```

---

# ▶️ Running Tests

Run all tests

```bash
npx playwright test
```

Run headed mode

```bash
npx playwright test --headed
```

Run Chromium

```bash
npx playwright test --project=chromium
```

Run single test

```bash
npx playwright test tests/RegisterUser.spec.ts
```

---

# 🔄 Continuous Integration

GitHub Actions workflow is configured to:

- Checkout Repository
- Install Node.js
- Install Dependencies
- Install Playwright Browsers
- Execute Tests
- Upload Test Reports

Workflow Location

```text
.github/workflows/playwright.yml
```

---

# 💡 Features

- Scalable Architecture
- End-to-End Automation
- Data Driven Approach
- Dynamic Test Data
- Reusable Page Objects
- Stable Locator Strategy
- CI/CD Ready
- HTML & Allure Reports
- Failure Screenshots
- Retry Mechanism
- Clean Project Structure
- Easy Maintenance

---

# 📈 Skills Demonstrated

This project demonstrates practical experience with:

- Playwright Automation
- TypeScript
- Page Object Model (POM)
- End-to-End Test Automation
- UI Validation
- Functional Testing
- Regression Testing
- Dynamic Test Data
- Locator Strategy
- Assertions
- Reporting
- Git & GitHub
- GitHub Actions (CI/CD)
- Automation Framework Design

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