import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { RegistrationPage } from '../pages/registrationpage';
import { TestConfig } from '../config/testconfig';


let homePage: HomePage;
let testConfig: TestConfig;
let registerPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();
    homePage = new HomePage(page);
    registerPage = new RegistrationPage(page);

    // Launch the application
    await page.goto(testConfig.appUrl);
});

test("Verify the Registration functionality with existing eamil", async ({ page }) => {

  

    // 1. Verify that the home page is visible successfully
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // 2. Click on the 'Signup / Login' button
    await homePage.clickOnSignupLoginButton();

    // 3. Verify that 'New User Signup!' is visible
    await expect(await homePage.verifyNewUserSignupTextIsVisible()).toBeVisible();

    // 4. Enter the user name
    await homePage.enterName("Ujjwal");

    // 5. Enter the email address
    await homePage.enterEmail(testConfig.emailaddress);

    // 6. Verify the Signup button is visible and enabled
    await expect(await homePage.GetSignupButton()).toBeVisible();
    await expect(await homePage.GetSignupButton()).toBeEnabled();

    // 7. Click on the Signup button
    await homePage.clickOnSignupButton();

    await expect(await registerPage.GetEmailAddressalreadyexistText()).toBeVisible();


});