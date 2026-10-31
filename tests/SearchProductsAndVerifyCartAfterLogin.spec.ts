import { test, expect } from '@fixtures/baseTest';

import { RandomDataUtil } from '@config/rondomDataGenerator';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test("Search Products and Verify Cart After Login", async ({ page, homePage, loginPage, productPage, registerPage }) => {
    // Long end-to-end flow (sign-up + several pages): give it 3x the default timeout.
    test.slow();
    const username = RandomDataUtil.getFullName();
    const emailAddress = RandomDataUtil.getEmail();
    const password = 'Password123!';

    await homePage.clickOnSignupLoginButton();
    await homePage.enterName(username);
    await homePage.enterEmail(emailAddress);
    await homePage.clickOnSignupButton();

    await registerPage.ClickMrTitleradioButton();
    await registerPage.EnterPaasword(password);
    await registerPage.SelectDOBDay('10');
    await registerPage.SelectDOBMonth('March');
    await registerPage.SelectDOBYear('1990');
    await registerPage.EnterFirstName('John');
    await registerPage.EnterLastName('Doe');
    await registerPage.EnterAddress1('123 Main Street');
    await registerPage.SelectCountry('United States');
    await registerPage.EnterState('CA');
    await registerPage.EnterCity('San Francisco');
    await registerPage.EnterZipCode('94102');
    await registerPage.EnterMobileNumber('9876543210');
    await registerPage.ClickCreateAccountButton();
    await registerPage.ClickContinueButton();
    await loginPage.logout();

    await homePage.ClickOnProductButton();
    await expect(await productPage.GetAllProductText()).toBeVisible();

    await productPage.SearchProduct('Dress');
    await expect(await productPage.GetSearchedProductText()).toBeVisible();
    expect(await (await productPage.GetSearchedProductsList()).count()).toBeGreaterThan(0);

    await productPage.AddFirstSearchedProductToCart();
    await productPage.ClickOnViewCartButton();
    expect(await (await productPage.GetCartProducts()).count()).toBeGreaterThan(0);

    await homePage.clickOnSignupLoginButton();
    await homePage.EnterLoginEmail(emailAddress);
    await homePage.EnterLoginPassword(password);
    await homePage.ClickOnLoginButton();

    await homePage.ClickOnCartButton();
    expect(await (await productPage.GetCartProducts()).count()).toBeGreaterThan(0);

    await loginPage.ClickDeleteAccountButton();
    await expect(await loginPage.GetAccountDeletedMessage()).toBeVisible();
});
