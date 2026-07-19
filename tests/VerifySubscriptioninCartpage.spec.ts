import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { TestConfig } from '../config/testconfig';
import { CommonActions } from '../utils/commonActions';

let homePage: HomePage;
let testConfig: TestConfig;
let commonActions: CommonActions;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();
    homePage = new HomePage(page);
    commonActions = new CommonActions(page);

    await page.goto(testConfig.appUrl);
});

test("Verify Subscription in Cart page", async ({ page }) => {

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