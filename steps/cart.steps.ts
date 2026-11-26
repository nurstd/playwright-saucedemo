import { Page } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';

export async function addToCart(
    page: Page,
    productId: number
) {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.waitForPage();
    await inventoryPage.addToCartButton(productId);
    await cartPage.clickShoppingCart();
}

export async function checkout(page: Page, productId: number) {
    await addToCart(page, productId);

    const cartPage = new CartPage(page);
    await cartPage.clickCheckoutButton();
}