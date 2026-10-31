import { test, expect } from '@fixtures/baseTest';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test("Verify Scroll Up Using Arrow Button And Scroll Down", async ({ page, homePage }) => {
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    await homePage.ScrollToBottom();
    await expect(await homePage.GetSubscriptionText()).toBeVisible();

    await homePage.ClickScrollUpButton();
    await expect(await homePage.GetFullFledgedPracticeText()).toBeVisible();
});
