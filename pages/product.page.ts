import { Page, Locator } from "@playwright/test";

export class ProductPage {
    readonly page: Page;
    readonly addToCart: Locator;
    readonly remove: Locator;
    readonly backToProducts: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addToCart = page.locator('[data-test="add-to-cart"]');
        this.remove = page.locator('[data-test="remove"]');
        this.backToProducts = page.locator('[data-test="back-to-products"]');
    }

    async clickAddToCart() {
        await this.addToCart.click();
    }

    async clickRemove() {
        await this.remove.click();
    }

    async clickBackToProducts() {
        await this.backToProducts.click();
    }

}