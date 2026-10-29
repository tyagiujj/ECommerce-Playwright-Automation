import { test, expect } from '@fixtures/baseTest';

import { TestConfig } from '@config/testconfig';
import { RandomDataUtil } from '@config/rondomDataGenerator';

let testConfig: TestConfig;

test.beforeEach(async ({ page }) => {
    testConfig = new TestConfig();

    await page.goto(testConfig.appUrl);
});

test("Add Review On Product", async ({ page, homePage, productPage }) => {
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    await homePage.ClickOnProductButton();
    await expect(await productPage.GetAllProductText()).toBeVisible();

    await productPage.ClickViewProductFirstButton();
    await expect(await productPage.GetProductName()).toBeVisible();

    await productPage.EnterReviewName(RandomDataUtil.getFullName());
    await productPage.EnterReviewEmail(RandomDataUtil.getEmail());
    await productPage.EnterReviewMessage('This product review is submitted through Playwright automation.');
    await productPage.ClickReviewSubmitButton();

    await expect(await productPage.GetReviewSuccessMessage()).toBeVisible();
});
