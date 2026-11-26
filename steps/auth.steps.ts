import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { authLogin } from '../data/auth';

export async function loginStandardUser(
  page: Page
) {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(authLogin.standard_user, authLogin.password);
  await inventoryPage.waitForPage();
}