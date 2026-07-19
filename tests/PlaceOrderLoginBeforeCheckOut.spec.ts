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

test("Place Order Login before Checkout", async ({ page }) => {
    const username = RandomDataUtil.getFullName();
    const emailAddress = RandomDataUtil.getEmail();
    const password = 'Password123!';

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Click on Signup / Login button
    await homePage.clickOnSignupLoginButton();

    // Fill all details in Signup and create account
    await expect(await homePage.verifyNewUserSignupTextIsVisible()).toBeVisible();
    await homePage.EnterLoginEmail(testConfig.emailaddress);
    await homePage.EnterLoginPassword(testConfig.password);
    await homePage.ClickOnLoginButton();

    // Verify 'Logged in as username' is visible
    await expect(await loginPage.GetLoggedinUsername()).toBeVisible({ timeout: 10000 });

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

    // Verify Address Details
    await expect(await cartPage.GetAddressDetailsHeading()).toBeVisible();
    await expect(await cartPage.GetDeliveryAddress()).toBeVisible();
    await expect(await cartPage.GetBillingAddress()).toBeVisible();

    // Verify Review Your Order
    await expect(await cartPage.GetReviewYourOrderHeading()).toBeVisible();
    await expect(await cartPage.GetOrderTable()).toBeVisible();

    // Verify Products are displayed
    await cartPage.VerifyProductsPresentInOrder();

    // Enter Comment
    await expect(await cartPage.GetCommentTextArea()).toBeVisible();
    await cartPage.EnterComment(
        "Please deliver the order carefully. This order is created through Playwright automation."
    );

    // Click Place Order
    await expect(await cartPage.GetPlaceOrderButton()).toBeVisible();
    await expect(await cartPage.GetPlaceOrderButton()).toBeEnabled();
    await cartPage.ClickPlaceOrderButton();

    // Enter payment details
    await cartPage.EnterNameOnCard("John Doe");
    await cartPage.EnterCardNumber("4111 1111 1111 1111");
    await cartPage.EnterCVVNumber("123");
    await cartPage.EnterExpirationMonth("12");
    await cartPage.EnterExpirationYear("2035");

    // Click Pay and Confirm Order
    await cartPage.ClickPayAndConfirmOrderButton();

    // Verify success message
    await expect(await cartPage.GetOrderSuccessMessage()).toBeVisible({ timeout: 15000 });


});
