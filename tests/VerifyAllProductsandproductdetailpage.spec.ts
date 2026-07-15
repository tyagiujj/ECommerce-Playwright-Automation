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

test("Verify All Products and product detail page", async ({ page }) => {

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