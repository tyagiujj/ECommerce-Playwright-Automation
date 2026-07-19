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

test("Place Order Register before Checkout", async ({ page }) => {
    const username = RandomDataUtil.getFullName();
    const emailAddress = RandomDataUtil.getEmail();
    const password = 'Password123!';

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Click on Signup / Login button
    await homePage.clickOnSignupLoginButton();

    // Fill all details in Signup and create account
    await expect(await homePage.verifyNewUserSignupTextIsVisible()).toBeVisible();
    await homePage.enterName(username);
    await homePage.enterEmail(emailAddress);
    await homePage.clickOnSignupButton();

    await expect(await registerPage.GetEnteraccoutinformationText()).toBeVisible();
    await registerPage.ClickMrTitleradioButton();
    await registerPage.EnterPaasword(password);
    await registerPage.SelectDOBDay('10');
    await registerPage.SelectDOBMonth('March');
    await registerPage.SelectDOBYear('1990');
    await registerPage.ClickNewsLetterCheckBox();
    await registerPage.ClickSpecialOffersCheckBox();
    await registerPage.EnterFirstName('John');
    await registerPage.EnterLastName('Doe');
    await registerPage.EnterCompany('TestCorp');
    await registerPage.EnterAddress1('123 Main Street');
    await registerPage.EnterAddress2('Apt 4B');
    await registerPage.SelectCountry('United States');
    await registerPage.EnterState('CA');
    await registerPage.EnterCity('San Francisco');
    await registerPage.EnterZipCode('94102');
    await registerPage.EnterMobileNumber('9876543210');
    await registerPage.ClickCreateAccountButton();

    // Verify Account Created and click Continue button
    await expect(await registerPage.GetAccountCreatedText()).toBeVisible();
    await registerPage.ClickContinueButton();

    // Verify Logged in as username
    await expect(await registerPage.GetLoggedInAsText()).toBeVisible();
    await expect(await registerPage.GetLoggedInAsText()).toContainText(username);

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

    // Click Delete Account
    await expect(await loginPage.GetDeleteAccountButton()).toBeVisible();
    await loginPage.ClickDeleteAccountButton();

    // Verify Account Deleted and click Continue button
    await expect(await loginPage.GetAccountDeletedMessage()).toBeVisible();
    await registerPage.ClickContinueButton();
});
