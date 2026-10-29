import { test as base } from '@playwright/test';
import { HomePage } from '@pages/homepage';
import { LoginPage } from '@pages/loginpage';
import { RegistrationPage } from '@pages/registrationpage';
import { ProductPage } from '@pages/productpage';
import { CartAndCheckOutPage } from '@pages/cartAndCheckOutpage';
import { CategoryPage } from '@pages/Categorypage';
import { ContactUsPage } from '@pages/contactUsformpage';
import { TestCasesPage } from '@pages/testCasespage';
import { CommonActions } from '@utils/commonActions';

// Google ad servers. Their ads (full-screen vignette, injected chips) block clicks and change page text.
const AD_HOSTS = /googlesyndication|doubleclick\.net|googleadservices|adservice\.google|fundingchoicesmessages/;

// Page objects a test can ask for by name, e.g. async ({ homePage, loginPage }) => { ... }.
// Each one is created only when a test asks for it, and every test gets a fresh instance.
type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegistrationPage;
  productPage: ProductPage;
  cartPage: CartAndCheckOutPage;
  categoryPage: CategoryPage;
  contactUsPage: ContactUsPage;
  testCasesPage: TestCasesPage;
  commonActions: CommonActions;
};

export const test = base.extend<PageFixtures>({
  context: async ({ context }, use) => {
    await context.route(AD_HOSTS, route => route.abort());
    await use(context);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartAndCheckOutPage(page));
  },
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page));
  },
  testCasesPage: async ({ page }, use) => {
    await use(new TestCasesPage(page));
  },
  commonActions: async ({ page }, use) => {
    await use(new CommonActions(page));
  },
});

export { expect } from '@playwright/test';
