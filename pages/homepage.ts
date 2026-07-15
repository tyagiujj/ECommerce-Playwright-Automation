import { Page, Locator } from "@playwright/test";

export class HomePage {
    private page: Page;
    private signupLoginButton: Locator;
    private homepageLogo: Locator;
    private newUserSignupText: Locator;
    private nameInputField: Locator;
    private emailInputField: Locator;
    private signupButton: Locator;
    private logintoYourAccountText: Locator;
    private loginemailField:Locator;
    private loginpasswordField : Locator;
    private loginButton: Locator;
    private productButton : Locator;

    constructor(page: Page) {
        this.page = page;
        this.signupLoginButton = page.getByRole('link', { name: 'Signup / Login' });
        this.homepageLogo = page.getByRole('link', { name: 'Home' });
        this.newUserSignupText = page.getByRole('heading', { name: 'New User Signup!' });
        this.nameInputField = page.getByPlaceholder('Name');
        this.emailInputField = page.locator("//input[@data-qa='signup-email']");
        this.signupButton = page.getByRole('button', { name: 'Signup' });
        this.logintoYourAccountText= page.getByRole('heading', { name: 'Login to your account' });
        this.loginemailField= page.locator('form').locator('input').nth(1);
        this.loginpasswordField=page.getByRole('textbox', { name: 'Password' });
        this.loginButton= page.getByRole('button', { name: 'Login' });
        this.productButton=page.getByRole('link', { name: ' Products' });

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
    async GetLoginToYourAccountText():Promise<Locator>{
        return this.logintoYourAccountText;
    }
    async EnterLoginEmail(email:string){
        await this.loginemailField.fill(email);
    }
    async EnterLoginPassword(password:string){
        await this.loginpasswordField.fill(password);
    }
    async GetLoginButton():Promise<Locator>{
        return this.loginButton;
    }
    async ClickOnLoginButton(){
        await this.loginButton.click();
    }
    async ClickOnProductButton(){
        await this.productButton.click();
    }
}