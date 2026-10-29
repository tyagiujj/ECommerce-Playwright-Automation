import { test, expect } from '@fixtures/baseTest';

import { TestConfig } from '@config/testconfig';

let testConfig: TestConfig;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();

    await page.goto(testConfig.appUrl);
});

test("Verify Add Product in Cart", async ({ page, homePage, productPage }) => {

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