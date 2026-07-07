import { Page, Locator } from "@playwright/test";

export class LoginPage {
    private page: Page;
    private loggedinaUsernameText:Locator;
   

    constructor(page: Page) {
        this.page = page;
        this.loggedinaUsernameText = page.locator('a', { hasText: 'Logged in as' });
      
    }
    async GetLoggedinUsername():Promise<Locator>{
        return this.loggedinaUsernameText;
    }
}