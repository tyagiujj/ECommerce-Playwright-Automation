import {test ,expect} from '@playwright/test';

import { HomePage } from '../pages/homepage';
import { LoginPage } from '../pages/loginpage';
import { TestConfig } from '../config/testconfig';

let homePage : HomePage;
let testConfig : TestConfig;
let loginPage : LoginPage;

test.beforeEach(async ({page})=>{
    testConfig = new TestConfig();
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await page.goto(testConfig.appUrl);
});

test("Verify the login functionality with incorrect email and password" , async({page})=>{

    // 1. Verify that home page is visible successfully
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // 2. Click on 'Signup / Login' button
    await homePage.clickOnSignupLoginButton();
    
    // 3. Verify 'Login to your account' is visible
    await expect(await homePage.GetLoginToYourAccountText()).toBeVisible();
    
    // 4. Enter the incorrect email address and password
    await homePage.EnterLoginEmail("Test@56799gmail.com");
    await homePage.EnterLoginPassword("Test@12347");
    
    // 5. Click the Login button
    await expect(await homePage.GetLoginButton()).toBeVisible();
    await expect(await homePage.GetLoginButton()).toBeEnabled();
    await homePage.ClickOnLoginButton();
    await page.waitForTimeout(2000);
    
    // 6. Verify 'Your email or password is incorrect!' is visible
    await expect(await loginPage.GetYouremailorpasswordisincorrectText()).toBeVisible();
})