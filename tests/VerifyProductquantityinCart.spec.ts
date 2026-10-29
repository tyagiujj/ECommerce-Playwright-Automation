import { test, expect } from '@fixtures/baseTest';

import { TestConfig } from '@config/testconfig';

let testConfig: TestConfig;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();

    await page.goto(testConfig.appUrl);
});

test("Verify Product quantity in Cart", async ({ page, homePage, productPage }) => {

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Click View Product
    await productPage.ClickViewProductFirstButton();

    // Verify Quantity field is visible
    await expect(await productPage.GetProductQuantityField()).toBeVisible();

    // Enter Quantity
    await productPage.EnterProductQuantity("4");

    // Verify Add To Cart button
    await expect(await productPage.GetProductDetailsAddToCartButton()).toBeVisible();
    await expect(await productPage.GetProductDetailsAddToCartButton()).toBeEnabled();

    // Click Add To Cart
    await productPage.ClickProductDetailsAddToCartButton();

    // Click View Cart
    await productPage.ClickOnViewCartButton();

    // Get final quantity from Cart
  const finalQuantity = await productPage.GetFirstProductCartQuantity();

console.log(`Final Quantity in Cart : ${finalQuantity}`);

// Verify quantity is at least entered quantity
expect(finalQuantity).toBeGreaterThanOrEqual(4);

    await page.waitForTimeout(5000);
});