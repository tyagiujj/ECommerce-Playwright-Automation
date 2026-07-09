import { Page, Locator } from '@playwright/test';

export class ContactUsPage {

    private page: Page;
    private contactUsLink: Locator;
    private getInTouchText: Locator;
    private nameInputField: Locator;
    private emailInputField: Locator;
    private subjectInputField: Locator;
    private messageInputField: Locator;
    private uploadfile: Locator;
    private submitButton: Locator;
    private successMessage: Locator;
    private homePageButton: Locator;

    constructor(page: Page) {

        this.page = page;

        this.contactUsLink = page.getByRole('link', { name: 'Contact us' });
        this.getInTouchText = page.getByRole('heading', { name: 'Get In Touch' });
        this.nameInputField = page.getByRole('textbox', { name: 'Name' });
        this.emailInputField = page.locator('[data-qa="email"]');
        this.subjectInputField = page.getByRole('textbox', { name: 'Subject' });
        this.messageInputField = page.getByRole('textbox', { name: 'Your Message Here' });
        this.uploadfile = page.locator('[name="upload_file"]');
        this.submitButton = page.locator('[name="submit"]');
        this.successMessage = page.locator('div.status.alert.alert-success:visible');
        this.homePageButton = page.locator('span:has-text("Home")');
    }

    async GetContactUsLink() {
        return this.contactUsLink;
    }

    async ClickonContactUsLink() {
        await this.contactUsLink.click();
    }

    async GetInTouchText() {
        return this.getInTouchText;
    }

    async EnterName(name: string) {
        await this.nameInputField.fill(name);
    }

    async EnterEmail(email: string) {
        await this.emailInputField.fill(email);
    }

    async EnterSubject(subject: string) {
        await this.subjectInputField.fill(subject);
    }

    async EnterMessage(message: string) {
        await this.messageInputField.fill(message);
    }

    async UploadFile(file: string) {
        await this.uploadfile.setInputFiles(file);
    }

    async ClickOnSubmitButton() {
        await this.submitButton.click();
    }

    async GetSuccessMessage() {
        return this.successMessage;
    }

    async ClickOnHomePageButton() {
        await this.homePageButton.click();
    }

}
