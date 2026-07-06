import { Page, Locator } from "@playwright/test";

export class HomePage {
    private page: Page;
    private signupLoginButton: Locator;
    private homepageLogo: Locator;
    private newUserSignupText: Locator;
    private nameInputField: Locator;
    private emailInputField: Locator;
    private signupButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signupLoginButton = page.getByRole('link', { name: 'Signup / Login' });
        this.homepageLogo = page.getByRole('link', { name: 'Home' });
        this.newUserSignupText = page.getByRole('heading', { name: 'New User Signup!' });
        this.nameInputField = page.getByPlaceholder('Name');
        this.emailInputField = page.locator("//input[@data-qa='signup-email']");
        this.signupButton = page.getByRole('button', { name: 'Signup' });
    }

    async clickOnSignupLoginButton() {
        await this.signupLoginButton.click();
    }

    async verifyHomepageLogoIsVisible(): Promise<Locator> {
        return this.homepageLogo;
    }
    async verifyNewUserSignupTextIsVisible(): Promise<Locator>{
        return this.newUserSignupText;
    }
    async enterName(name: string){
        await this.nameInputField.fill(name);
    }
    async enterEmail(email:string){
        await this.emailInputField.fill(email);
    }
    async GetSignupButton(): Promise<Locator>{
        return this.signupButton;
    }
    async clickOnSignupButton(){
        await this.signupButton.click();
    }
}