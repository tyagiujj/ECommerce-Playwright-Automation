import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/homepage';
import { ProductPage } from '../pages/productpage';
import { TestConfig } from '../config/testconfig';

let homePage: HomePage;
let productPage: ProductPage;
let testConfig: TestConfig;

test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    testConfig = new TestConfig();

    await page.goto(testConfig.appUrl);
});

test("Add To Cart From Recommended Items", async ({ page }) => {
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    await homePage.ScrollToBottom();
    await expect(await homePage.GetRecommendedItemsText()).toBeVisible();

    await homePage.ClickRecommendedAddToCartButton();
    await productPage.ClickOnViewCartButton();

    expect(await (await productPage.GetCartProducts()).count()).toBeGreaterThan(0);
});
