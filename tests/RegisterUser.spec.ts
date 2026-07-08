import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { RegistrationPage } from '../pages/registrationpage';
import { TestConfig } from '../config/testconfig';
import { RandomDataUtil } from '../config/rondomDataGenerator';

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

test("Verify the Registration Functionality", async ({ page }) => {

    // Generate random test data
    const username = RandomDataUtil.getFullName();
    const emailAddress = RandomDataUtil.getEmail();

    // 1. Verify that the home page is visible successfully
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // 2. Click on the 'Signup / Login' button
    await homePage.clickOnSignupLoginButton();

    // 3. Verify that 'New User Signup!' is visible
    await expect(await homePage.verifyNewUserSignupTextIsVisible()).toBeVisible();

    // 4. Enter the user name
    await homePage.enterName(username);

    // 5. Enter the email address
    await homePage.enterEmail(emailAddress);

    // 6. Verify the Signup button is visible and enabled
    await expect(await homePage.GetSignupButton()).toBeVisible();
    await expect(await homePage.GetSignupButton()).toBeEnabled();

    // 7. Click on the Signup button
    await homePage.clickOnSignupButton();

    // 8. Verify that 'Enter Account Information' is displayed
    await expect(await registerPage.GetEnteraccoutinformationText()).toBeVisible();
    await expect(await registerPage.GetEnteraccoutinformationText()).toHaveText("Enter Account Information");

    // 9. Select the title as 'Mr.'
    await expect(await registerPage.GetMrTitleradioButton()).toBeVisible();
    await registerPage.ClickMrTitleradioButton();
    await expect(await registerPage.GetMrTitleradioButton()).toBeChecked();

    // 10. Enter the account password
    await registerPage.EnterPaasword('Password123!');

    // 11. Select the Date of Birth
    await registerPage.SelectDOBDay('10');
    await registerPage.SelectDOBMonth('March');
    await registerPage.SelectDOBYear('1990');

    // 12. Select the 'Sign up for our newsletter!' checkbox
    await registerPage.ClickNewsLetterCheckBox();

    // 13. Select the 'Receive special offers from our partners!' checkbox
    await registerPage.ClickSpecialOffersCheckBox();

    // 14. Enter the first name
    await registerPage.EnterFirstName('John');

    // 15. Enter the last name
    await registerPage.EnterLastName('Doe');

    // 16. Enter the company name
    await registerPage.EnterCompany('Automation Labs');

    // 17. Enter Address Line 1
    await registerPage.EnterAddress1('123 Main Street');

    // 18. Enter Address Line 2
    await registerPage.EnterAddress2('Apt 4B');

    // 19. Select the country
    await registerPage.SelectCountry('United States');

    // 20. Enter the state
    await registerPage.EnterState('California');

    // 21. Enter the city
    await registerPage.EnterCity('Los Angeles');

    // 22. Enter the zip code
    await registerPage.EnterZipCode('90001');

    // 23. Enter the mobile number
    await registerPage.EnterMobileNumber('1234567890');

    // 24. Verify the Create Account button is visible and enabled
    await expect(await registerPage.GetCreateAccountButton()).toBeVisible();
    await expect(await registerPage.GetCreateAccountButton()).toBeEnabled();

    // 25. Click on the Create Account button
    await registerPage.ClickCreateAccountButton();

    // 26. Verify that 'Account Created!' message is displayed
    await expect(await registerPage.GetAccountCreatedText()).toBeVisible();
    await expect(await registerPage.GetAccountCreatedText()).toHaveText('Account Created!');

    // 27. Click on the Continue button
    await registerPage.ClickContinueButton();

    // 28. Verify that 'Logged in as username' is displayed
    await expect(await registerPage.GetLoggedInAsText()).toBeVisible();
    await expect(await registerPage.GetLoggedInAsText()).toContainText(username);

    // 29. Click on the Delete Account button
    await registerPage.ClickDeleteAccountButton();

    // 30. Verify that 'Account Deleted!' message is displayed
    await expect(page.getByText('Account Deleted!')).toBeVisible();
});