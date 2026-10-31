import { test, expect } from '@fixtures/baseTest';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test("Add To Cart From Recommended Items", async ({ page, homePage, productPage }) => {
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    await homePage.ScrollToBottom();
    await expect(await homePage.GetRecommendedItemsText()).toBeVisible();

    await homePage.ClickRecommendedAddToCartButton();
    await productPage.ClickOnViewCartButton();

    expect(await (await productPage.GetCartProducts()).count()).toBeGreaterThan(0);
});
