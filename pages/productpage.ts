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
    private readonly continueShoppingButton : Locator;   
    private readonly secondProduct: Locator;
    private readonly secondProductAddToCartButton: Locator;
    private readonly countineshoppingviewCartButton : Locator;
    private readonly cartProducts: Locator;
    private readonly cartProductPrice: Locator;
    private readonly cartProductQuantity: Locator;
    private readonly cartProductTotalPrice: Locator;

  // First Product
private readonly firstProduct: Locator;
private readonly firstProductAddToCartButton: Locator;

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

      // First Product
      this.firstProduct = page.locator(".features_items .single-products").first();

// Add To Cart button of First Product
this.firstProductAddToCartButton = this.firstProduct.locator(".product-overlay .add-to-cart");

// Continue Shopping Button
this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });

// Second Product
this.secondProduct = page.locator(".features_items .single-products").nth(1);

// Add To Cart Button of Second Product
this.secondProductAddToCartButton =this.secondProduct.locator(".product-overlay .add-to-cart");

// View Cart
this.countineshoppingviewCartButton = page.getByText('View Cart', { exact: true });
// Cart Page
this.cartProducts = page.locator("#cart_info_table tbody tr");
this.cartProductPrice = page.locator("#cart_info_table tbody tr .cart_price p");
this.cartProductQuantity = page.locator("#cart_info_table tbody tr .cart_quantity button");
this.cartProductTotalPrice = page.locator("#cart_info_table tbody tr .cart_total_price");
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

  // Hover on First Product
async HoverOnFirstProduct(): Promise<void> {
    await this.firstProduct.hover();
    await this.page.waitForTimeout(1000);
}

// Get First Product Add To Cart Button
async GetFirstProductAddToCartButton(): Promise<Locator> {
    return this.firstProductAddToCartButton;
}

// Click First Product Add To Cart
async ClickFirstProductAddToCartButton(): Promise<void> {
    await this.firstProductAddToCartButton.click({ force: true });
}

//Click on Continue Shopping Button
async ClickOnContinueShoppingButton(): Promise<void>{
    await this.continueShoppingButton.click();
}
// Hover on Second Product
async HoverOnSecondProduct(): Promise<void> {
    await this.secondProduct.hover();
    await this.page.waitForTimeout(1000);
}

// Get Second Product Add To Cart Button
async GetSecondProductAddToCartButton(): Promise<Locator> {
    return this.secondProductAddToCartButton;
}

// Click Second Product Add To Cart
async ClickSecondProductAddToCartButton(): Promise<void> {
    await this.secondProductAddToCartButton.click({ force: true });
}
 
// Click on View Cart Button
async ClickOnViewCartButton(): Promise<void>{
    await this.countineshoppingviewCartButton.click();
}
async VerifyProductsAddedInCart(): Promise<void> {

    const count = await this.cartProducts.count();

    console.log(`Total Products in Cart : ${count}`);

    if (count < 2) {
        throw new Error("Expected two products in cart.");
    }

    for (let i = 0; i < count; i++) {

        await this.cartProducts.nth(i).scrollIntoViewIfNeeded();

        const price = await this.cartProductPrice.nth(i).textContent();
        const quantity = await this.cartProductQuantity.nth(i).textContent();
        const total = await this.cartProductTotalPrice.nth(i).textContent();

        console.log(`Product ${i + 1}`);
        console.log(`Price     : ${price?.trim()}`);
        console.log(`Quantity  : ${quantity?.trim()}`);
        console.log(`Total     : ${total?.trim()}`);

        await this.cartProductPrice.nth(i).waitFor({ state: "visible" });
        await this.cartProductQuantity.nth(i).waitFor({ state: "visible" });
        await this.cartProductTotalPrice.nth(i).waitFor({ state: "visible" });
    }
}
}