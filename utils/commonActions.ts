import { Page, Locator } from "@playwright/test";

export class CommonActions {

    constructor(private page: Page) {}

    // Generic Scroll Method
    async ScrollToElement(locator: Locator): Promise<void> {
        await locator.waitFor({ state: "visible" });
        await locator.scrollIntoViewIfNeeded();
    }

    // Scroll to Bottom
    async ScrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    // Scroll to Top
    async ScrollToTop(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, 0));
    }
}