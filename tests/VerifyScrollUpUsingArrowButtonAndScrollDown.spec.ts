import { test, expect } from '@fixtures/baseTest';

import { TestConfig } from '@config/testconfig';

let testConfig: TestConfig;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();

    await page.goto(testConfig.appUrl);
});

test("Verify Scroll Up Using Arrow Button And Scroll Down", async ({ page, homePage }) => {
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    await homePage.ScrollToBottom();
    await expect(await homePage.GetSubscriptionText()).toBeVisible();

    await homePage.ClickScrollUpButton();
    await expect(await homePage.GetFullFledgedPracticeText()).toBeVisible();
});
