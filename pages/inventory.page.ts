import { Page, Locator } from "@playwright/test";
import { getProductById, toProductSlug } from '../data/products';
import { ProductItem } from '../data/products';

export class InventoryPage {
    readonly page: Page;
    readonly sortContainer: Locator;
    readonly menuButton: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sortContainer = page.locator('[data-test="product-sort-container"]');
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutButton = page.locator('#logout_sidebar_link');
    }

    addToCartButton(productId: number): Locator {
        const product = getProductById(productId);
        return this.page.locator(`[data-test="add-to-cart-${toProductSlug(product.name)}"]`);
    }

    removeButton(productId: number): Locator {
        const product = getProductById(productId);
        return this.page.locator(`[data-test="remove-${toProductSlug(product.name)}"]`);
    }

    viewProduct(productId: number): Locator {
        const product = getProductById(productId);
        return this.page
            .locator('[data-test="inventory-item-name"]', { hasText: product.name })
            .first();
    }

    async sortBy(option: string) {
        await this.sortContainer.selectOption(option);
    }

    async clickMenuButton() {
        await this.menuButton.click();
    }

    async clickLogoutButton() {
        await this.logoutButton.click();
    }

    async clickAddToCart(productId: number) {
        await this.addToCartButton(productId).click();
    }

    async clickRemove(productId: number) {
        await this.removeButton(productId).click();
    }

    async clickViewProduct(productId: number) {
        await this.viewProduct(productId).click();
    }
}