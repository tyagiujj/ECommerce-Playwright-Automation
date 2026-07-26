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

test("Download Invoice After Purchase Order", async ({ page }, testInfo) => {
    const username = RandomDataUtil.getFullName();
    const emailAddress = RandomDataUtil.getEmail();

    await homePage.clickOnSignupLoginButton();
    await homePage.enterName(username);
    await homePage.enterEmail(emailAddress);
    await homePage.clickOnSignupButton();

    await registerPage.ClickMrTitleradioButton();
    await registerPage.EnterPaasword('Password123!');
    await registerPage.SelectDOBDay('10');
    await registerPage.SelectDOBMonth('March');
    await registerPage.SelectDOBYear('1990');
    await registerPage.EnterFirstName('John');
    await registerPage.EnterLastName('Doe');
    await registerPage.EnterAddress1('123 Main Street');
    await registerPage.SelectCountry('United States');
    await registerPage.EnterState('CA');
    await registerPage.EnterCity('San Francisco');
    await registerPage.EnterZipCode('94102');
    await registerPage.EnterMobileNumber('9876543210');
    await registerPage.ClickCreateAccountButton();
    await registerPage.ClickContinueButton();

    await productPage.HoverOnFirstProduct();
    await productPage.ClickFirstProductAddToCartButton();
    await productPage.ClickOnContinueShoppingButton();
    await homePage.ClickOnCartButton();
    await cartPage.ClickOnProceedToCheckoutButton();
    await cartPage.EnterComment('Download invoice test order.');
    await cartPage.ClickPlaceOrderButton();

    await cartPage.EnterNameOnCard('John Doe');
    await cartPage.EnterCardNumber('4111 1111 1111 1111');
    await cartPage.EnterCVVNumber('123');
    await cartPage.EnterExpirationMonth('12');
    await cartPage.EnterExpirationYear('2035');
    await cartPage.ClickPayAndConfirmOrderButton();

    await expect(await cartPage.GetOrderSuccessMessage()).toBeVisible({ timeout: 15000 });
    await expect(await cartPage.GetDownloadInvoiceButton()).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await cartPage.ClickDownloadInvoiceButton();
    const download = await downloadPromise;
    await download.saveAs(testInfo.outputPath(download.suggestedFilename()));
    expect(download.suggestedFilename()).toContain('invoice');

    await cartPage.ClickContinueButton();
    await loginPage.ClickDeleteAccountButton();
    await expect(await loginPage.GetAccountDeletedMessage()).toBeVisible();
});
