import { test, expect } from '@fixtures/baseTest';

import { TestConfig } from '@config/testconfig';

let testConfig: TestConfig;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();

    await page.goto(testConfig.appUrl);
});

test("Add To Cart From Recommended Items", async ({ page, homePage, productPage }) => {
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    await homePage.ScrollToBottom();
    await expect(await homePage.GetRecommendedItemsText()).toBeVisible();

    await homePage.ClickRecommendedAddToCartButton();
    await productPage.ClickOnViewCartButton();

    expect(await (await productPage.GetCartProducts()).count()).toBeGreaterThan(0);
});
