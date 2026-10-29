import { test, expect } from '@fixtures/baseTest';

import { TestConfig } from '@config/testconfig';

let testConfig: TestConfig;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();

    await page.goto(testConfig.appUrl);
});

test("Verify All Products and product detail page", async ({ page, homePage, productPage }) => {

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Click on Product button
    await homePage.ClickOnProductButton();

    // Verify Product page is visible
    await expect(await productPage.GetAllProductText()).toBeVisible();

    // Verify Product list is displayed
    const products = await productPage.GetProductList();

    expect(await products.count()).toBeGreaterThan(0);
    await expect(products.first()).toBeVisible();

    // Print all product names
    await productPage.PrintAllProductNames();

    // Store all product names in a List
    const productNames = await productPage.GetAllProductNames();

    console.log("\n===== Product Names Using List =====");

    productNames.forEach((product, index) => {
        console.log(`${index + 1}. ${product}`);
    });

    // Click on the first product
    await productPage.ClickViewProductFirstButton();

    // Verify Product Details page
    await expect(await productPage.GetProductName()).toBeVisible();
    await expect(await productPage.GetCategory()).toBeVisible();
    await expect(await productPage.GetPrice()).toBeVisible();
    await expect(await productPage.GetAvailability()).toBeVisible();
    await expect(await productPage.GetCondition()).toBeVisible();
    await expect(await productPage.GetBrand()).toBeVisible();

});