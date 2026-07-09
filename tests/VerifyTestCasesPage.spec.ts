import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/homepage';
import { TestCasesPage } from '../pages/testCasespage';
import { TestConfig } from '../config/testconfig';

let homePage: HomePage;
let testConfig: TestConfig;
let testCasesPage: TestCasesPage;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();
    homePage = new HomePage(page);
    testCasesPage = new TestCasesPage(page);

    // Launch the application
    await page.goto(testConfig.appUrl);
});

test("Verify Test Case Page", async ({ page }) => {

    // Verify that the home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Verify that the Test Cases link is visible
    await expect(await testCasesPage.GetTestCasesLink()).toBeVisible();

    // Click on the Test Cases link
    await testCasesPage.ClickOnTestCasesLink();

    // Verify that the Test Cases page heading is visible
    await expect(await testCasesPage.GetTestCasesText()).toBeVisible();

    // Verify that the page heading text is 'Test Cases'
    await expect(await testCasesPage.GetTestCasesText()).toHaveText("Test Cases");

    // Verify that the user is navigated to the Test Cases page
    await expect(page).toHaveURL(testConfig.testcaseUrl);
});