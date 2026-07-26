import { test, expect } from '@playwright/test';

import { CartAndCheckOutPage } from '../pages/cartAndCheckOutpage';
import { HomePage } from '../pages/homepage';
import { LoginPage } from '../pages/loginpage';
import { ProductPage } from '../pages/productpage';
import { RegistrationPage } from '../pages/registrationpage';
import { TestConfig } from '../config/testconfig';
import { RandomDataUtil } from '../config/rondomDataGenerator';

let cartPage: CartAndCheckOutPage;
let homePage: HomePage;
let loginPage: LoginPage;
let productPage: ProductPage;
let registerPage: RegistrationPage;
let testConfig: TestConfig;

test.beforeEach(async ({ page }) => {
    cartPage = new CartAndCheckOutPage(page);
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    registerPage = new RegistrationPage(page);
    testConfig = new TestConfig();

    await page.goto(testConfig.appUrl);
});

test("Verify Address Details In Checkout Page", async ({ page }) => {
    const username = RandomDataUtil.getFullName();
    const emailAddress = RandomDataUtil.getEmail();
    const password = 'Password123!';
    const firstName = 'John';
    const lastName = 'Doe';
    const company = 'Automation Labs';
    const address1 = '123 Main Street';
    const address2 = 'Apt 4B';
    const state = 'California';
    const city = 'Los Angeles';
    const zipCode = '90001';
    const mobileNumber = '1234567890';

    await homePage.clickOnSignupLoginButton();
    await homePage.enterName(username);
    await homePage.enterEmail(emailAddress);
    await homePage.clickOnSignupButton();

    await registerPage.ClickMrTitleradioButton();
    await registerPage.EnterPaasword(password);
    await registerPage.SelectDOBDay('10');
    await registerPage.SelectDOBMonth('March');
    await registerPage.SelectDOBYear('1990');
    await registerPage.EnterFirstName(firstName);
    await registerPage.EnterLastName(lastName);
    await registerPage.EnterCompany(company);
    await registerPage.EnterAddress1(address1);
    await registerPage.EnterAddress2(address2);
    await registerPage.SelectCountry('United States');
    await registerPage.EnterState(state);
    await registerPage.EnterCity(city);
    await registerPage.EnterZipCode(zipCode);
    await registerPage.EnterMobileNumber(mobileNumber);
    await registerPage.ClickCreateAccountButton();
    await registerPage.ClickContinueButton();

    await productPage.HoverOnFirstProduct();
    await productPage.ClickFirstProductAddToCartButton();
    await productPage.ClickOnContinueShoppingButton();
    await homePage.ClickOnCartButton();
    await cartPage.ClickOnProceedToCheckoutButton();

    await expect(await cartPage.GetAddressDetailsHeading()).toBeVisible();
    await expect(await cartPage.GetDeliveryAddress()).toContainText(firstName);
    await expect(await cartPage.GetDeliveryAddress()).toContainText(lastName);
    await expect(await cartPage.GetDeliveryAddress()).toContainText(company);
    await expect(await cartPage.GetDeliveryAddress()).toContainText(address1);
    await expect(await cartPage.GetDeliveryAddress()).toContainText(address2);
    await expect(await cartPage.GetDeliveryAddress()).toContainText(state);
    await expect(await cartPage.GetDeliveryAddress()).toContainText(city);
    await expect(await cartPage.GetDeliveryAddress()).toContainText(zipCode);
    await expect(await cartPage.GetDeliveryAddress()).toContainText(mobileNumber);

    await expect(await cartPage.GetBillingAddress()).toContainText(firstName);
    await expect(await cartPage.GetBillingAddress()).toContainText(lastName);
    await expect(await cartPage.GetBillingAddress()).toContainText(company);
    await expect(await cartPage.GetBillingAddress()).toContainText(address1);
    await expect(await cartPage.GetBillingAddress()).toContainText(address2);
    await expect(await cartPage.GetBillingAddress()).toContainText(state);
    await expect(await cartPage.GetBillingAddress()).toContainText(city);
    await expect(await cartPage.GetBillingAddress()).toContainText(zipCode);
    await expect(await cartPage.GetBillingAddress()).toContainText(mobileNumber);

    await loginPage.ClickDeleteAccountButton();
    await expect(await loginPage.GetAccountDeletedMessage()).toBeVisible();
});
