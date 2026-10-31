import { test, expect } from '@fixtures/baseTest';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test("Verify Subscription in Cart page", async ({ page, homePage, commonActions, testConfig }) => {

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Click on Cart button
    await homePage.ClickOnCartButton();

    // Scroll to Subscription section
    await commonActions.ScrollToElement(await homePage.GetSubscriptionText());

    // Verify Subscription heading is visible
    await expect(await homePage.GetSubscriptionText()).toBeVisible();

    // Enter the Email address for subscription
    await homePage.EnterSubscriptionEmail(testConfig.emailaddress);

    // Click on Subscribe button
    await homePage.ClickOnSubscriptionArrowButton();

    // Verify Subscription success message is visible
    await expect(await homePage.GetSubscriptionSuccessMessage()).toBeVisible();

});