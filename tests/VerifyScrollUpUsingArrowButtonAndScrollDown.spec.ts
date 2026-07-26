import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/homepage';
import { TestConfig } from '../config/testconfig';

let homePage: HomePage;
let testConfig: TestConfig;

test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testConfig = new TestConfig();

    await page.goto(testConfig.appUrl);
});

test("Verify Scroll Up Using Arrow Button And Scroll Down", async ({ page }) => {
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    await homePage.ScrollToBottom();
    await expect(await homePage.GetSubscriptionText()).toBeVisible();

    await homePage.ClickScrollUpButton();
    await expect(await homePage.GetFullFledgedPracticeText()).toBeVisible();
});
