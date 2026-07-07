import{test,expect} from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { TestConfig } from '../config/testconfig'
import { LoginPage } from '../pages/loginpage';

let homePage : HomePage;
let testConfig : TestConfig;
let loginPage : LoginPage;

test.beforeEach(async ({page})=>{
    testConfig = new TestConfig();
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await page.goto(testConfig.appUrl);
});

test("Verify the login functionality with correct email and password", async({page})=>{
    await homePage.clickOnSignupLoginButton();
   await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();
   await homePage.clickOnSignupLoginButton();
   await expect(await homePage.GetLoginToYourAccountText()).toBeVisible();
   await homePage.EnterLoginEmail(testConfig.emailaddress);
   await homePage.EnterLoginPassword(testConfig.password);
  
   await expect(await homePage.GetLoginButton()).toBeVisible();
   await expect(await homePage.GetLoginButton()).toBeEnabled();
   await homePage.ClickOnLoginButton();

   await expect(await loginPage.GetLoggedinUsername()).toBeVisible();

  
})