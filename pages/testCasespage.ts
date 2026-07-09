import{ Page , Locator } from '@playwright/test';

export class TestCasesPage{
    private page : Page;
    private testCasesLink : Locator;
    private  testCasesText : Locator;

    constructor(page : Page){
        this.page = page;
        this.testCasesLink = page.getByRole('link', { name: 'Test Cases', exact: true })
        this.testCasesText = page.locator("//b[normalize-space()='Test Cases']")
    }
    async GetTestCasesLink(){
        return  this.testCasesLink;
    }
    async ClickOnTestCasesLink(){
        await this.testCasesLink.click();
    }
    async GetTestCasesText(){
        return this.testCasesText;
    }


}