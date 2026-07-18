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

test("Verify Search Product", async ({ page }) => {

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Click on Product button
    await homePage.ClickOnProductButton();

    // Verify Product page is visible
    await expect(await productPage.GetAllProductText()).toBeVisible();

    // Enter the Product name and Search the product
    await productPage.SearchProduct("Dress");

    // Verify Searched Product page is visible
    await expect(await productPage.GetSearchedProductText()).toBeVisible();

    // Verify searched products list is displayed
    const searchedProducts = await productPage.GetSearchedProductsList();
    expect(await searchedProducts.count()).toBeGreaterThan(0);

    // Verify all searched products are visible
    await productPage.VerifyAllSearchedProductsAreVisible();

});