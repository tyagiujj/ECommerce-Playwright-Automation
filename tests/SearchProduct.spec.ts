import { test, expect } from '@fixtures/baseTest';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test("Verify Search Product", async ({ page, homePage, productPage }) => {

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Click on Product button
    await homePage.ClickOnProductButton();

    // Verify Product page is visible
    await expect(await productPage.GetAllProductText()).toBeVisible();

    // Enter the Product name and Search the product
    await productPage.SearchProduct("Dress");

    // Verify Searched Product page is visible
    await expect(await productPage.GetSearchedProductText()).toBeVisible();

    // Verify searched products list is displayed
    const searchedProducts = await productPage.GetSearchedProductsList();
    expect(await searchedProducts.count()).toBeGreaterThan(0);

    // Verify all searched products are visible
    await productPage.VerifyAllSearchedProductsAreVisible();

});