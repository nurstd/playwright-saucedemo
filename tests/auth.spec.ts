import { test, expect } from '@playwright/test';
import { baseUrl, authLogin } from '../data/auth';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';

test.describe('Authentication Test Suite', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();

        inventoryPage = new InventoryPage(page);
    });

    test('Auth-001: Successful login & logout with standard_user', async ({ page }) => {
        await loginPage.login(authLogin.standard_user, authLogin.password);

        await expect(page).toHaveURL(`${baseUrl}inventory.html`);
        await expect(page.getByText('Products')).toBeVisible();

        await inventoryPage.clickMenuButton();
        await inventoryPage.clickLogoutButton();
        await expect(page).toHaveURL(baseUrl);
    });

    test('Auth-002: Login fails with locked_out_user', async ({ page }) => {
        await loginPage.login(authLogin.locked_out_user, authLogin.password);

        await expect(page).toHaveURL(baseUrl);
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Sorry, this user has been locked out.'
        );
    });

    test('Auth-003: Login fails with invalid password', async ({ page }) => {
        await loginPage.login(authLogin.standard_user, 'wrong_password');

        await expect(page).toHaveURL(baseUrl);
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Username and password do not match any user in this service'
        );
    });

    test('Auth-004: Login fails when username is empty', async ({ page }) => {
        await loginPage.login(undefined, authLogin.password);

        await expect(page).toHaveURL(baseUrl);
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Username is required'
        );
    });

    test('Auth-005: Login fails when password is empty', async ({ page }) => {
        await loginPage.login(authLogin.standard_user, undefined);

        await expect(page).toHaveURL(baseUrl);
        await expect(loginPage.errorMessage).toHaveText(
            'Epic sadface: Password is required'
        );
    });
});