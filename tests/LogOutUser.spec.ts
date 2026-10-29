import { test, expect } from '@fixtures/baseTest';

import { TestConfig } from '@config/testconfig';

let testConfig: TestConfig;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();

    // Launch the application
    await page.goto(testConfig.appUrl);
});

test("Verify the logout functionality", async ({ page, homePage, loginPage }) => {

    // 1. Verify that home page is visible successfully
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // 2. Click on 'Signup / Login' button
    await homePage.clickOnSignupLoginButton();

    // 3. Verify 'Login to your account' is visible
    await expect(await homePage.GetLoginToYourAccountText()).toBeVisible();

    // 4. Enter the registered email address
    await homePage.EnterLoginEmail(testConfig.emailaddress);

    // 5. Enter the registered password
    await homePage.EnterLoginPassword(testConfig.password);

    // 6. Verify Login button is visible and enabled
    await expect(await homePage.GetLoginButton()).toBeVisible();
    await expect(await homePage.GetLoginButton()).toBeEnabled();

    // 7. Click on Login button
    await homePage.ClickOnLoginButton();

    // Wait for login to complete
    await page.waitForTimeout(2000);

    // 8. Verify 'Logged in as username' is visible
    await expect(await loginPage.GetLoggedinUsername()).toBeVisible({ timeout: 10000 });

    // 9. Verify Logout button is visible and enabled
    await expect(await loginPage.GetLogoutButton()).toBeVisible();
    await expect(await loginPage.GetLogoutButton()).toBeEnabled();

    // 10. Click on Logout button
    await loginPage.ClickLogoutButton();

    // Wait for logout navigation
    await page.waitForTimeout(2000);

    // 11. Verify user is redirected to the Login page
    await expect(page).toHaveURL(testConfig.apploginUrl);

});