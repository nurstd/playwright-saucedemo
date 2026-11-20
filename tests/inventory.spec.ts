import { test, expect } from '@playwright/test';
import { baseUrl, authLogin } from '../data/auth';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { ProductPage } from '../pages/product.page';
import { getProductById, getSortedProducts } from '../data/products';

test.describe('Inventory Test Suite', () => {
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let productPage: ProductPage;
    const product = getProductById(4) // TODO: change to random product id

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(authLogin.standard_user, authLogin.password);
        await expect(page).toHaveURL(`${baseUrl}inventory.html`);

        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        productPage = new ProductPage(page);
    });

    test('Inv-001: Sort products by Price (low to high)', async ({ page }) => {
        await inventoryPage.sortBy('lohi');
        const sortedLowToHigh = getSortedProducts('lohi');

        await expect(page.locator('.inventory_item_name').first()).toContainText(sortedLowToHigh[0].name);
        await expect(page.locator('.inventory_item_price').first()).toContainText(sortedLowToHigh[0].price);
    });

    test('Inv-002: Sort products by Name (Z to A)', async ({ page }) => {
        await inventoryPage.sortBy('za');
        const sortedZToA = getSortedProducts('za');

        await expect(page.locator('.inventory_item_name').first()).toContainText(sortedZToA[0].name);
    });

    test('Inv-003: View product details page', async ({ page }) => {
        await inventoryPage.clickViewProduct(product.id);

        await expect(page).toHaveURL(`${baseUrl}inventory-item\.html\?id=${product.id}`);
        await expect(page.getByText(product.name)).toBeVisible();
        await expect(page.getByText(product.price)).toBeVisible();
        await expect(productPage.backToProducts).toBeVisible();
    });

    test('Inv-004: Add & Remove product from cart', async ({ page }) => {
        await inventoryPage.clickAddToCart(product.id);
        await expect(cartPage.shoppingCart).toContainText('1');
        await expect(inventoryPage.removeButton(product.id)).toBeVisible();

        await inventoryPage.clickRemove(product.id);
        await expect(cartPage.shoppingCart).not.toContainText('1');
        await expect(inventoryPage.addToCartButton(product.id)).toBeVisible();
    })
});