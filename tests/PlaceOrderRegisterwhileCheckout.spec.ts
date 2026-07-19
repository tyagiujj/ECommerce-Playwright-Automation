import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/homepage';
import { TestConfig } from '../config/testconfig';
import { ProductPage } from '../pages/productpage';
import { CartAndCheckOutPage } from '../pages/cartAndCheckOutpage';
import { LoginPage } from '../pages/loginpage';
import { RegistrationPage } from '../pages/registrationpage';
import { RandomDataUtil } from '../config/rondomDataGenerator';

let homePage: HomePage;
let testConfig: TestConfig;
let productPage: ProductPage;
let cartPage: CartAndCheckOutPage;
let loginPage: LoginPage;
let registerPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartAndCheckOutPage(page);
    loginPage = new LoginPage(page);
    registerPage = new RegistrationPage(page);

    await page.goto(testConfig.appUrl);
});

test("Place Order Register while Checkout", async ({ page }) => {
    const emailAddress = RandomDataUtil.getEmail();
    const password = 'Password123!';

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Hover on first product
    await productPage.HoverOnFirstProduct();

    // Click Add To Cart of first product
    await productPage.ClickFirstProductAddToCartButton();

    // Click Continue Shopping
    await productPage.ClickOnContinueShoppingButton();

    // Click on Cart Button
    await homePage.ClickOnCartButton();

    // Click on Proceed to Checkout Button
    await cartPage.ClickOnProceedToCheckoutButton();

    // Click on Register and Login Link
    await cartPage.ClickOnRegisterAndLoginLink();

    // . Fill all details in Signup and create account
    // Pre-step: Create account first
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();
    await homePage.clickOnSignupLoginButton();
    await homePage.enterName(RandomDataUtil.getFullName());
    await homePage.enterEmail(emailAddress);
    await homePage.clickOnSignupButton();

    await registerPage.ClickMrTitleradioButton();
    await registerPage.EnterPaasword(password);
    await registerPage.SelectDOBDay('10');
    await registerPage.SelectDOBMonth('March');
    await registerPage.SelectDOBYear('1990');
    await registerPage.EnterFirstName('John');
    await registerPage.EnterLastName('Doe');
    await registerPage.EnterCompany('TestCorp');
    await registerPage.EnterAddress1('123 Main Street');
    await registerPage.SelectCountry('United States');
    await registerPage.EnterState('CA');
    await registerPage.EnterCity('San Francisco');
    await registerPage.EnterZipCode('94102');
    await registerPage.EnterMobileNumber('9876543210');
    await registerPage.ClickCreateAccountButton();
    await page.waitForTimeout(1000);
    await registerPage.ClickContinueButton();
    await page.waitForTimeout(1000);

    // Logout before login test
    await loginPage.logout();
    await page.waitForTimeout(1000);

    // 3. Verify the home page is visible successfully
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // 4. Click on 'Signup / Login' button
    await homePage.clickOnSignupLoginButton();

    // 5. Verify 'Login to your account' is visible
    await expect(await homePage.GetLoginToYourAccountText()).toBeVisible();

    // 6. Enter the registered email address and password
    await homePage.EnterLoginEmail(emailAddress);
    await homePage.EnterLoginPassword(password);

    // 7. Click the Login button
    await expect(await homePage.GetLoginButton()).toBeVisible();
    await expect(await homePage.GetLoginButton()).toBeEnabled();
    await homePage.ClickOnLoginButton();

    // Click on Cart Button
    await homePage.ClickOnCartButton();

    // Click on Proceed to Checkout Button
    await cartPage.ClickOnProceedToCheckoutButton();

    // Verify Address Details
    await expect(await cartPage.GetAddressDetailsHeading()).toBeVisible();
    await expect(await cartPage.GetDeliveryAddress()).toBeVisible();
    await expect(await cartPage.GetBillingAddress()).toBeVisible();

    // Verify Review Your Order
    await expect(await cartPage.GetReviewYourOrderHeading()).toBeVisible();
    await expect(await cartPage.GetOrderTable()).toBeVisible();

    // Verify Products are displayed
    await cartPage.VerifyProductsPresentInOrder();

    // Verify Comment Box
    await expect(await cartPage.GetCommentTextArea()).toBeVisible();

    // Enter Comment
    await cartPage.EnterComment(
        "Please deliver the order carefully. This order is created through Playwright automation."
    );

    // Verify Place Order Button
    await expect(await cartPage.GetPlaceOrderButton()).toBeVisible();
    await expect(await cartPage.GetPlaceOrderButton()).toBeEnabled();

    // Click Place Order
    await cartPage.ClickPlaceOrderButton();

    // Enter the Name on Card
    await cartPage.EnterNameOnCard("John Doe");

    // Enter the Card Number
    await cartPage.EnterCardNumber("4111 1111 1111 1111");

    // Enter the CVV Number
    await cartPage.EnterCVVNumber("123");

    // Enter the Expiration Month
    await cartPage.EnterExpirationMonth("12");

    // Enter the Expiration Year
    await cartPage.EnterExpirationYear("2035");

    // Click Pay and Confirm Order
    await cartPage.ClickPayAndConfirmOrderButton();

    await expect(await cartPage.GetOrderSuccessMessage()).toBeVisible({ timeout: 15000 });

    //  Click the 'Delete Account' button
    await expect(await loginPage.GetDeleteAccountButton()).toBeVisible();
    await loginPage.ClickDeleteAccountButton();

    // Verify 'ACCOUNT DELETED!' is visible
    await expect(await loginPage.GetAccountDeletedMessage()).toBeVisible();

    // Click the 'Continue' button
    await registerPage.ClickContinueButton();
});