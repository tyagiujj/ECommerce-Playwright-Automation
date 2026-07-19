import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/homepage';
import { TestConfig } from '../config/testconfig';
import { ProductPage } from '../pages/productpage';

let homePage: HomePage;
let testConfig: TestConfig;
let productPage: ProductPage;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();
    homePage = new HomePage(page);
    productPage = new ProductPage(page);

    await page.goto(testConfig.appUrl);
});

test("Verify Add Product in Cart", async ({ page }) => {

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Click on Product button
    await homePage.ClickOnProductButton();

    // Verify Product page is visible
    await expect(await productPage.GetAllProductText()).toBeVisible();

    // Hover on first product
    await productPage.HoverOnFirstProduct();

    // Click Add To Cart of first product
    await productPage.ClickFirstProductAddToCartButton();

    // Click Continue Shopping
    await productPage.ClickOnContinueShoppingButton();

    // Hover on second product
    await productPage.HoverOnSecondProduct();

    // Click Add To Cart of second product
    await productPage.ClickSecondProductAddToCartButton();

    //Click on View Cart Button
    await productPage.ClickOnViewCartButton();

    // Verify Products Added in Cart
    await productPage.VerifyProductsAddedInCart();

    await page.waitForTimeout(5000);

});