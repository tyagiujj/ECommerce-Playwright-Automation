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
    private loginemailField: Locator;
    private loginpasswordField: Locator;
    private loginButton: Locator;
    private productButton: Locator;
    private subscriptionText: Locator;
    private subscriptionEmailField: Locator;
    private subscriptionArrowButton: Locator;
    private subscriptionSuccessMessage : Locator;
    private cartButton : Locator;
    private recommendedItemsText: Locator;
    private recommendedAddToCartButton: Locator;
    private scrollUpButton: Locator;
    private fullFledgedPracticeText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signupLoginButton = page.getByRole('link', { name: 'Signup / Login' });
        this.homepageLogo = page.getByRole('link', { name: 'Home' });
        this.newUserSignupText = page.getByRole('heading', { name: 'New User Signup!' });
        this.nameInputField = page.getByPlaceholder('Name');
        this.emailInputField = page.locator("//input[@data-qa='signup-email']");
        this.signupButton = page.getByRole('button', { name: 'Signup' });
        this.logintoYourAccountText = page.getByRole('heading', { name: 'Login to your account' });
        this.loginemailField = page.locator('form').locator('input').nth(1);
        this.loginpasswordField = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.productButton = page.locator('a[href="/products"]');
        this.subscriptionText = page.getByRole('heading', { name: 'Subscription' });
        this.subscriptionEmailField =page.getByRole('textbox', { name: 'Your email address' });
        this.subscriptionArrowButton = page.locator('#subscribe');
        this.subscriptionSuccessMessage = page.getByText('You have been successfully subscribed!');
        this.cartButton = page.getByText('Cart', { exact: true });
        this.recommendedItemsText = page.getByRole('heading', { name: 'recommended items' });
        this.recommendedAddToCartButton = page.locator('#recommended-item-carousel .add-to-cart').first();
        this.scrollUpButton = page.locator('#scrollUp');
        this.fullFledgedPracticeText = page.locator('#slider-carousel .item.active h2');
    }

    async clickOnSignupLoginButton() {
        await this.signupLoginButton.click();
    }

    async verifyHomepageLogoIsVisible(): Promise<Locator> {
        return this.homepageLogo;
    }

    async verifyNewUserSignupTextIsVisible(): Promise<Locator> {
        return this.newUserSignupText;
    }

    async enterName(name: string) {
        await this.nameInputField.fill(name);
    }

    async enterEmail(email: string) {
        await this.emailInputField.fill(email);
    }

    async GetSignupButton(): Promise<Locator> {
        return this.signupButton;
    }

    async clickOnSignupButton() {
        await this.signupButton.click();
    }

    async GetLoginToYourAccountText(): Promise<Locator> {
        return this.logintoYourAccountText;
    }

    async EnterLoginEmail(email: string) {
        await this.loginemailField.fill(email);
    }

    async EnterLoginPassword(password: string) {
        await this.loginpasswordField.fill(password);
    }

    async GetLoginButton(): Promise<Locator> {
        return this.loginButton;
    }

    async ClickOnLoginButton() {
        await this.loginButton.click();
    }

    async ClickOnProductButton() {
        await this.productButton.click();
        await this.page.waitForLoadState('domcontentloaded');

        if (!this.page.url().includes('/products')) {
            await this.page.goto(new URL('/products', this.page.url()).toString());
        }
    }

    async GetSubscriptionText(): Promise<Locator> {
        return this.subscriptionText;
    }

    async EnterSubscriptionEmail(email:string){
        await this.subscriptionEmailField.fill(email);
    }

    async ClickOnSubscriptionArrowButton(){
        await this.subscriptionArrowButton.click();
    }
    async GetSubscriptionSuccessMessage(): Promise<Locator> {
        return this.subscriptionSuccessMessage;
    }
    async ClickOnCartButton(){
        await this.cartButton.click();
    }

    async GetRecommendedItemsText(): Promise<Locator> {
        return this.recommendedItemsText;
    }

    async ClickRecommendedAddToCartButton(): Promise<void> {
        await this.recommendedAddToCartButton.click();
    }

    async ScrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    async ClickScrollUpButton(): Promise<void> {
        await this.scrollUpButton.click({ force: true });
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await this.page.waitForFunction(() => window.scrollY === 0);
    }

    async ScrollToTop(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await this.page.waitForFunction(() => window.scrollY === 0);
    }

    async GetFullFledgedPracticeText(): Promise<Locator> {
        return this.fullFledgedPracticeText;
    }

   
}
