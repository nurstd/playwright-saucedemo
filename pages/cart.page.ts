import { Page, Locator } from "@playwright/test";

export class CartPage {
    readonly page: Page;
    readonly shoppingCart: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.shoppingCart = page.locator('[data-test="shopping-cart-link"]');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.continueShoppingButton = page.locator('#continue-shopping');
    }

    async clickShoppingCart() {
        await this.shoppingCart.click();
    }

    async clickCheckoutButton() {
        await this.checkoutButton.click();
    }

    async clickContinueShoppingButton() {
        await this.continueShoppingButton.click();
    }
}