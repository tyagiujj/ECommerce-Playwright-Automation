import {test ,expect} from '@fixtures/baseTest';

test.beforeEach(async ({page})=>{
    await page.goto('/');
});

test("Verify the login functionality with incorrect email and password" , async({ page, homePage, loginPage })=>{

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