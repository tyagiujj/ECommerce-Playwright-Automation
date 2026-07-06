import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homepage';
import{ RegistrationPage } from '../pages/registrationpage';
import { TestConfig } from '../config/testconfig';
import { RandomDataUtil } from '../config/rondomDataGenerator';

let homePage: HomePage;
let testConfig: TestConfig;
let  registerPage: RegistrationPage;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();
    homePage = new HomePage(page);
    registerPage =new RegistrationPage(page);
    await page.goto(testConfig.appUrl);
});

test("Verify the Registration Functionality", async ({ page }) => {
    const username = RandomDataUtil.getFullName();
    const emailAddress = RandomDataUtil.getEmail();

    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();
    await homePage.clickOnSignupLoginButton();
    await expect(await homePage.verifyNewUserSignupTextIsVisible()).toBeVisible();

    await homePage.enterName(username);
    await homePage.enterEmail(emailAddress);

    await expect(await homePage.GetSignupButton()).toBeVisible();
    await expect(await homePage.GetSignupButton()).toBeEnabled();
    await homePage.clickOnSignupButton();

    await expect(await registerPage.GetEnteraccoutinformationText()).toBeVisible();
    await expect(await registerPage.GetEnteraccoutinformationText()).toHaveText("Enter Account Information");
    await expect(await registerPage.GetMrTitleradioButton()).toBeVisible();
    await registerPage.ClickMrTitleradioButton();
    await expect(await registerPage.GetMrTitleradioButton()).toBeChecked();

    await registerPage.EnterPaasword('Password123!');
    await registerPage.SelectDOBDay('10');
    await registerPage.SelectDOBMonth('March');
    await registerPage.SelectDOBYear('1990');
    await registerPage.ClickNewsLetterCheckBox();
    await registerPage.ClickSpecialOffersCheckBox();
    await registerPage.EnterFirstName('John');
    await registerPage.EnterLastName('Doe');
    await registerPage.EnterCompany('Automation Labs');
    await registerPage.EnterAddress1('123 Main Street');
    await registerPage.EnterAddress2('Apt 4B');
    await registerPage.SelectCountry('United States');
    await registerPage.EnterState('California');
    await registerPage.EnterCity('Los Angeles');
    await registerPage.EnterZipCode('90001');
    await registerPage.EnterMobileNumber('1234567890');

    await expect(await registerPage.GetCreateAccountButton()).toBeVisible();
    await expect(await registerPage.GetCreateAccountButton()).toBeEnabled();
    await registerPage.ClickCreateAccountButton();

    await expect(await registerPage.GetAccountCreatedText()).toBeVisible();
    await expect(await registerPage.GetAccountCreatedText()).toHaveText('Account Created!');
    await registerPage.ClickContinueButton();

    await expect(await registerPage.GetLoggedInAsText()).toBeVisible();
    await expect(await registerPage.GetLoggedInAsText()).toContainText(username);
    await registerPage.ClickDeleteAccountButton();
    await expect(page.getByText('Account Deleted!')).toBeVisible();
});