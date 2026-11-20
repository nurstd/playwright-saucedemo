import { test, expect } from '@playwright/test';
import { baseUrl, authLogin, customerData } from '../data/auth';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { getProductById } from '../data/products';
import fs from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

test.describe('Checkout Test Suite', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let productPage: ProductPage;
  const product = getProductById(4);    // TODO: change to random product id

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(authLogin.standard_user, authLogin.password);
    await expect(page).toHaveURL(`${baseUrl}inventory.html`);

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    productPage = new ProductPage(page);
  });

  test('CO-001: Complete end-to-end checkout flow with valid information', async ({ page }) => {
    await inventoryPage.clickViewProduct(product.id)
    await productPage.clickAddToCart()
    await cartPage.clickShoppingCart()
    await cartPage.clickCheckoutButton()

    await expect(checkoutPage.title).toHaveText('Checkout: Your Information')
    await expect(page).toHaveURL(/.*\/checkout-step-one\.html/);

    await checkoutPage.fillCheckoutInformation(customerData.firstName, customerData.lastName, customerData.zipCode);
    await checkoutPage.continueBtn.click();

    await expect(page).toHaveURL(/.*\/checkout-step-two\.html/);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview')
    await expect(page.getByText(product.name)).toBeVisible();

    const totalAmount = await checkoutPage.getTotalAmount()
    expect(totalAmount).toBeTruthy();

    await checkoutPage.finishBtn.click()

    await expect(page).toHaveURL(/.*\/checkout-complete\.html/);
    await expect(checkoutPage.title).toHaveText('Checkout: Complete!')
    await expect(page.getByText('Thank you for your order!')).toBeVisible();

    // Download PDF
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      checkoutPage.generatePDFBtn.click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/^swag-labs-order-.*\.pdf$/i);

    const filePath = await download.path();
    expect(filePath).toBeTruthy();

    // Read PDF
    const buffer = await fs.readFile(filePath!);
    const parser = new PDFParse({ data: buffer });

    let pdfText = '';
    try {
      const result = await parser.getText();
      pdfText = result.text.replace(/\s+/g, ' ');
    } finally {
      await parser.destroy();
    }

    expect(pdfText).toContain(`${customerData.firstName} ${customerData.lastName}`);
    expect(pdfText).toContain(customerData.zipCode);
    expect(pdfText).toContain(totalAmount!);

  });

  test('CO-002: Attempt checkout without fill information', async ({ page }) => {
    await inventoryPage.clickViewProduct(product.id)
    await productPage.clickAddToCart()
    await cartPage.clickShoppingCart()
    await cartPage.clickCheckoutButton()

    await expect(checkoutPage.title).toHaveText('Checkout: Your Information')
    await expect(page).toHaveURL(/.*\/checkout-step-one\.html/);

    await checkoutPage.continueBtn.click();
    await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');
  });
});