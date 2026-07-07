import{test,expect} from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { TestConfig } from '../config/testconfig'
import { LoginPage } from '../pages/loginpage';
import { RegistrationPage } from '../pages/registrationpage';
import { RandomDataUtil } from '../config/rondomDataGenerator';

let homePage : HomePage;
let testConfig : TestConfig;
let loginPage : LoginPage;
let registerPage : RegistrationPage;

test.beforeEach(async ({page})=>{
    testConfig = new TestConfig();
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    registerPage = new RegistrationPage(page);
    await page.goto(testConfig.appUrl);
});

test("Verify the login functionality with correct email and password", async({page})=>{
    const emailAddress = RandomDataUtil.getEmail();
    const password = 'Password123!';

    // Pre-step: Create account first
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();
    await homePage.clickOnSignupLoginButton();
    await homePage.enterName(RandomDataUtil.getFullName());
    await homePage.enterEmail(emailAddress);
    await homePage.clickOnSignupButton();

    await registerPage.ClickMrTitleradioButton();
    await registerPage.EnterPaasword(password);
    await registerPage.SelectDOBDay('10');
    await registerPage.SelectDOBMonth('March');
    await registerPage.SelectDOBYear('1990');
    await registerPage.EnterFirstName('John');
    await registerPage.EnterLastName('Doe');
    await registerPage.EnterCompany('TestCorp');
    await registerPage.EnterAddress1('123 Main Street');
    await registerPage.SelectCountry('United States');
    await registerPage.EnterState('CA');
    await registerPage.EnterCity('San Francisco');
    await registerPage.EnterZipCode('94102');
    await registerPage.EnterMobileNumber('9876543210');
    await registerPage.ClickCreateAccountButton();
    await page.waitForTimeout(1000);
    await registerPage.ClickContinueButton();
    await page.waitForTimeout(1000);
    
    // Logout before login test
    await loginPage.logout();
    await page.waitForTimeout(1000);
    
    // 3. Verify the home page is visible successfully
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();
    
    // 4. Click on 'Signup / Login' button
    await homePage.clickOnSignupLoginButton();
    
    // 5. Verify 'Login to your account' is visible
    await expect(await homePage.GetLoginToYourAccountText()).toBeVisible();
    
    // 6. Enter the registered email address and password
    await homePage.EnterLoginEmail(emailAddress);
    await homePage.EnterLoginPassword(password);
    
    // 7. Click the Login button
    await expect(await homePage.GetLoginButton()).toBeVisible();
    await expect(await homePage.GetLoginButton()).toBeEnabled();
    await homePage.ClickOnLoginButton();
    await page.waitForTimeout(2000);
    
    // 8. Verify 'Logged in as username' is visible
    await expect(await loginPage.GetLoggedinUsername()).toBeVisible({ timeout: 10000 });
    
    // 9. Click the 'Delete Account' button
    await expect(await loginPage.GetDeleteAccountButton()).toBeVisible();
    await loginPage.ClickDeleteAccountButton();
    
    // 10. Verify 'ACCOUNT DELETED!' is visible
    await expect(await loginPage.GetAccountDeletedMessage()).toBeVisible();
})