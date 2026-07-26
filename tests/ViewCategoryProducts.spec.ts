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

test("View Category Products", async ({ page }) => {

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
