import { test , expect } from '@fixtures/baseTest';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test("Verify View and Cart Brand Products", async ({ page, homePage, productPage, categoryPage }) => {

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Click on Product button
    await homePage.ClickOnProductButton();

    // Verify brands are visible on left side bar
    await expect(await categoryPage.GetBrandsText()).toBeVisible();
    expect(await (await categoryPage.GetBrandLinks()).count()).toBeGreaterThan(0);

    // Click on any brand name
    await categoryPage.ClickOnBrandName('Polo');

    // Verify user is navigated to brand page and brand products are displayed
    await expect(page).toHaveURL(/\/brand_products\/Polo/);
    await expect(await categoryPage.GetBrandProductsText('Polo')).toBeVisible();
    expect(await (await productPage.GetProductList()).count()).toBeGreaterThan(0);

    // Click on any other brand name
    await categoryPage.ClickOnBrandName('H&M');

    // Verify user is navigated to other brand page and products are displayed
    await expect(page).toHaveURL(/\/brand_products\/H&M/);
    await expect(await categoryPage.GetBrandProductsText('H&M')).toBeVisible();
    expect(await (await productPage.GetProductList()).count()).toBeGreaterThan(0);
});
