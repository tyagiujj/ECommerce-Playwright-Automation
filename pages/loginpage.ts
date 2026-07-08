import { Page, Locator } from "@playwright/test";

export class LoginPage {
    private page: Page;
    private loggedinaUsernameText: Locator;
    private deleteAccountButton: Locator;
    private accountDeletedMessage: Locator;
    private YouremailorpasswordisincorrectText: Locator;
    private LogoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loggedinaUsernameText = page.locator('li:has-text("Logged in as") b');
        this.deleteAccountButton = page.getByRole('link', { name: 'Delete Account' });
        this.accountDeletedMessage = page.locator('b:has-text("ACCOUNT DELETED!")');
        this.YouremailorpasswordisincorrectText=page.getByText('Your email or password is incorrect!', { exact: true });
        this.LogoutButton=page.getByRole('link', { name: 'Logout' });
    }

    async GetLoggedinUsername(): Promise<Locator> {
        return this.loggedinaUsernameText;
    }

    async GetDeleteAccountButton(): Promise<Locator> {
        return this.deleteAccountButton;
    }

    async ClickDeleteAccountButton() {
        await this.deleteAccountButton.click();
    }

    async GetAccountDeletedMessage(): Promise<Locator> {
        return this.accountDeletedMessage;
    }

    async logout() {
        const logoutLink = this.page.locator('a[href*="/logout"]');
        await logoutLink.click();
    }
    async GetYouremailorpasswordisincorrectText(): Promise<Locator>{
        return this.YouremailorpasswordisincorrectText;
    }
    async GetLogoutButton(): Promise<Locator>{
        return this.LogoutButton;
    }
    async ClickLogoutButton(){
        await this.LogoutButton.click();
    }
}