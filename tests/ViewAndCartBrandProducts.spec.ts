import { test , expect } from '@playwright/test';

import { HomePage } from '../pages/homepage';
import { TestConfig } from '../config/testconfig';
import { ProductPage } from '../pages/productpage';
import { CategoryPage } from '../pages/Categorypage';

let homePage: HomePage;
let testConfig: TestConfig;
let productPage: ProductPage;
let categoryPage: CategoryPage;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    categoryPage = new CategoryPage(page);

    await page.goto(testConfig.appUrl);
});

test("Verify View and Cart Brand Products", async ({ page }) => {

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
