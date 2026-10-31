import { test, expect } from '@fixtures/baseTest';

import { RandomDataUtil } from '@config/rondomDataGenerator';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test("Remove Products From Cart", async ({ page, homePage, productPage, cartPage, loginPage, registerPage }) => {
    const emailAddress = RandomDataUtil.getEmail();
    const password = 'Password123!';

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Hover on first product
    await productPage.HoverOnFirstProduct();

    // Click Add To Cart of first product
    await productPage.ClickFirstProductAddToCartButton();

    // Click Continue Shopping
    await productPage.ClickOnContinueShoppingButton();

    // Click on Cart Button
    await homePage.ClickOnCartButton();

    // Click on X remove button of first product
    await cartPage.ClickRemoveProductButton();

    //  Verify that product is removed from the cart
    await expect(await cartPage.GetCartIsEmptyMessage()).toBeVisible();
    await expect(await cartPage.GetCartIsEmptyMessage()).toContainText('Cart is empty! Click here to buy products.');

});