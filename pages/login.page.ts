import { Page, Locator } from '@playwright/test';
import { baseUrl } from '../data/auth';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async goto() {
        await this.page.goto(baseUrl);
    }

    /**
     * Mengisi username dan password (opsional) lalu klik Login.
     * Parameter dibuat opsional agar mendukung skenario field kosong (TC-004 & TC-005).
     */
    async login(username?: string, password?: string) {
        if (username) {
            await this.usernameInput.fill(username);
        }
        if (password) {
            await this.passwordInput.fill(password);
        }
        await this.loginButton.click();
    }
}