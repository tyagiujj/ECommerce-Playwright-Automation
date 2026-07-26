import {Page , Locator} from '@playwright/test';

export class CategoryPage{
    private readonly page : Page
    private readonly categoryText : Locator;
    private readonly womenCategory : Locator;
    private readonly dressCategory : Locator;
    private readonly womenDressProductsText : Locator;
    private readonly menCategory : Locator;
    private readonly tshirtsCategory : Locator;
    private readonly menTshirtsProductsText : Locator;
    private readonly brandsText : Locator;
    private readonly brandLinks : Locator;


    constructor(page : Page){
        this.page = page;
        this.categoryText = page.getByRole('heading', { name: 'Category' });
        this.womenCategory = page.locator('a[href="#Women"]');
        this.dressCategory = page.locator('#Women a[href="/category_products/1"]');
        this.womenDressProductsText = page.getByRole('heading', { name: 'Women - Dress Products' });
        this.menCategory = page.locator('a[href="#Men"]');
        this.tshirtsCategory = page.locator('#Men a[href="/category_products/3"]');
        this.menTshirtsProductsText = page.getByRole('heading', { name: 'Men - Tshirts Products' });
        this.brandsText = page.getByRole('heading', { name: 'Brands' });
        this.brandLinks = page.locator('.brands-name a');
    }

    async getCategoryText(){
        return this.categoryText;
    }

    async ClickOnWomenCategory(){
        await this.womenCategory.click();
    }

    async ClickOnDressCategory(){
        await this.dressCategory.click();
    }

    async GetWomenDressProductsText(){
        return this.womenDressProductsText;
    }

    async ClickOnMenCategory(){
        await this.menCategory.click();
    }

    async ClickOnTshirtsCategory(){
        await this.tshirtsCategory.click();
    }

    async GetMenTshirtsProductsText(){
        return this.menTshirtsProductsText;
    }

    async GetBrandsText(){
        return this.brandsText;
    }

    async GetBrandLinks(){
        return this.brandLinks;
    }

    async ClickOnBrandName(brandName: string){
        await this.brandLinks.filter({ hasText: brandName }).click();
    }

    async GetBrandProductsText(brandName: string){
        return this.page.getByRole('heading', { name: `Brand - ${brandName} Products` });
    }

}
