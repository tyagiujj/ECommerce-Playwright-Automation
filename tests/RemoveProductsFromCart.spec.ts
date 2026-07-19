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

test("Remove Products From Cart", async ({ page }) => {
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

    // Click on X remove button of first product
    await cartPage.ClickRemoveProductButton();

    //  Verify that product is removed from the cart
    await expect(await cartPage.GetCartIsEmptyMessage()).toBeVisible();
    await expect(await cartPage.GetCartIsEmptyMessage()).toContainText('Cart is empty! Click here to buy products.');

});