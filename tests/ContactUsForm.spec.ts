import { test, expect } from '@fixtures/baseTest';

import { RandomDataUtil } from '@config/rondomDataGenerator';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test("Verify the functionality of contact Us Form", async ({ page, homePage, contactUsPage }) => {

    // Verify home page is visible
    await expect(await homePage.verifyHomepageLogoIsVisible()).toBeVisible();

    // Verify Contact Us link
    await expect(await contactUsPage.GetContactUsLink()).toBeVisible();
    await expect(await contactUsPage.GetContactUsLink()).toBeEnabled();

    // Click Contact Us
    await contactUsPage.ClickonContactUsLink();

    // Verify Get In Touch text
    await expect(await contactUsPage.GetInTouchText()).toBeVisible();

    // Enter Name
    await contactUsPage.EnterName(RandomDataUtil.getFullName());

    // Enter Email
    await contactUsPage.EnterEmail(RandomDataUtil.getEmail());

    // Enter Subject
    await contactUsPage.EnterSubject("Automation Testing");

    // Enter Message
    await contactUsPage.EnterMessage("This is an automated message using Playwright.");

    // Upload File
    await contactUsPage.UploadFile("./testData/sample.pdf");

    await page.waitForTimeout(2000);

    // Handle JavaScript Alert
    page.once('dialog', async (dialog) => {
        console.log(dialog.message());
        await dialog.accept(); // Click OK
    });

    // Click Submit Button
    await contactUsPage.ClickOnSubmitButton();

    await page.waitForTimeout(2000);

    // Verify Success Message
    await expect(await contactUsPage.GetSuccessMessage()).toBeVisible();

    //Click on Home Button
    await contactUsPage.ClickOnHomePageButton();

    //verify that landed to home page successfully
    await expect(page).toHaveURL('/');

});