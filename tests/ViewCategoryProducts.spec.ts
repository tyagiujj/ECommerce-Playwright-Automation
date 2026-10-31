import { test , expect } from '@fixtures/baseTest';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test("View Category Products", async ({ page, homePage, productPage, categoryPage }) => {

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Verify category text is visible
    await expect(await categoryPage.getCategoryText()).toBeVisible();

    // Click on Women category
    await categoryPage.ClickOnWomenCategory();

    // Click on Dress category
    await categoryPage.ClickOnDressCategory();

    // Verify Women Dress Products page is displayed
    await expect(await categoryPage.GetWomenDressProductsText()).toBeVisible();

    // Click on Men category
    await categoryPage.ClickOnMenCategory();

    // Click on Tshirts category
    await categoryPage.ClickOnTshirtsCategory();

    // Verify Men Tshirts Products page is displayed
    await expect(await categoryPage.GetMenTshirtsProductsText()).toBeVisible();

});
