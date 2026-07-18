import { Page, Locator } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;
    private readonly allProductText: Locator;
    private readonly productList: Locator;
    private readonly viewProductFirstButton: Locator;
    private readonly productName: Locator;
    private readonly category: Locator;
    private readonly price: Locator;
    private readonly availability: Locator;
    private readonly condition: Locator;
    private readonly brand: Locator;
    private readonly productNames: Locator;
    private readonly searchInputField: Locator;
    private readonly searchButton: Locator;
    private readonly searchedProductText: Locator;
    private readonly searchedProductsList: Locator;

    constructor(page: Page) {
        this.page = page;

        this.allProductText = page.getByRole('heading', { name: 'All Products' });

        // Product List
        this.productList = page.locator(".features_items .product-image-wrapper");

        // View Product Button
        this.viewProductFirstButton = page.locator('a').filter({ hasText: 'View Product' }).first();

        // Product Details
        this.productName = page.locator(".product-information h2");
        this.category = page.locator(".product-information p").filter({ hasText: "Category:" });
        this.price = page.locator(".product-information span > span");
        this.availability = page.locator(".product-information p").filter({ hasText: "Availability:" });
        this.condition = page.locator(".product-information p").filter({ hasText: "Condition:" });
        this.brand = page.locator(".product-information p").filter({ hasText: "Brand:" });

        // All Product Names
        this.productNames = page.locator(".features_items .product-image-wrapper .productinfo p");

        // Search Product
        this.searchInputField = page.getByRole('textbox', { name: 'Search Product' });
        this.searchButton = page.locator('#submit_search');
        this.searchedProductText = page.getByRole('heading', { name: 'Searched Products' });

        // Searched Products List
        this.searchedProductsList = page.locator(".features_items .product-image-wrapper");
    }

    async GetAllProductText(): Promise<Locator> {
        return this.allProductText;
    }

    async GetProductList(): Promise<Locator> {
        return this.productList;
    }

    async ClickViewProductFirstButton(): Promise<void> {
        await this.viewProductFirstButton.click();
    }

    async GetProductName(): Promise<Locator> {
        return this.productName;
    }

    async GetCategory(): Promise<Locator> {
        return this.category;
    }

    async GetPrice(): Promise<Locator> {
        return this.price;
    }

    async GetAvailability(): Promise<Locator> {
        return this.availability;
    }

    async GetCondition(): Promise<Locator> {
        return this.condition;
    }

    async GetBrand(): Promise<Locator> {
        return this.brand;
    }

    async PrintAllProductNames(): Promise<void> {
        const count = await this.productNames.count();

        console.log("\n======================================");
        console.log(`Total Products: ${count}`);
        console.log("======================================");

        for (let i = 0; i < count; i++) {
            const productName = await this.productNames.nth(i).textContent();
            console.log(`${i + 1}. ${productName?.trim()}`);
        }

        console.log("======================================\n");
    }

    async GetAllProductNames(): Promise<string[]> {
        const names: string[] = [];

        const count = await this.productNames.count();

        for (let i = 0; i < count; i++) {
            const productName = await this.productNames.nth(i).textContent();
            names.push(productName?.trim() || "");
        }

        return names;
    }

    async SearchProduct(productName: string): Promise<void> {
        await this.searchInputField.fill(productName);
        await this.searchButton.click();
    }

    async GetSearchedProductText(): Promise<Locator> {
        return this.searchedProductText;
    }

    async GetSearchedProductsList(): Promise<Locator> {
        return this.searchedProductsList;
    }

    async VerifyAllSearchedProductsAreVisible(): Promise<void> {
        const count = await this.searchedProductsList.count();

        console.log(`Total searched products found: ${count}`);

        for (let i = 0; i < count; i++) {
            await this.searchedProductsList.nth(i).scrollIntoViewIfNeeded();
            await this.searchedProductsList.nth(i).waitFor({ state: "visible" });
        }
    }
}