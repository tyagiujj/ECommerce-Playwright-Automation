import { test, expect } from '@fixtures/baseTest';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test("Verify Scroll Up Without Arrow Button And Scroll Down", async ({ page, homePage }) => {
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    await homePage.ScrollToBottom();
    await expect(await homePage.GetSubscriptionText()).toBeVisible();

    await homePage.ScrollToTop();
    await expect(await homePage.GetFullFledgedPracticeText()).toBeVisible();
});
