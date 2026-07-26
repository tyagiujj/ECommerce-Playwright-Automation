import{ Page , Locator } from '@playwright/test';

export class TestCasesPage{
    private page : Page;
    private testCasesLink : Locator;
    private  testCasesText : Locator;

    constructor(page : Page){
        this.page = page;
        this.testCasesLink = page.locator('.navbar-nav a[href="/test_cases"]');
        this.testCasesText = page.getByRole('heading', { name: 'Test Cases', exact: true });
    }
    async GetTestCasesLink(){
        return  this.testCasesLink;
    }
    async ClickOnTestCasesLink(){
        await this.testCasesLink.click();
        await this.page.waitForLoadState('domcontentloaded');

        if (!this.page.url().includes('/test_cases')) {
            await this.page.goto(new URL('/test_cases', this.page.url()).toString());
        }
    }
    async GetTestCasesText(){
        return this.testCasesText;
    }


}
