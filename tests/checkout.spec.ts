import { test, expect } from '@playwright/test';
import { customerData } from '../data/auth';
import { loginStandardUser } from '../steps/auth.steps';
import { checkout } from '../steps/cart.steps';
import { CheckoutPage } from '../pages/checkout.page';
import { getProductById } from '../data/products';
import fs from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

test.describe('Checkout Test Suite', () => {
  let checkoutPage: CheckoutPage;
  const product = getProductById(4);    // TODO: change to random product id

  test.beforeEach(async ({ page }) => {
    await loginStandardUser(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('CO-001: Complete end-to-end checkout flow with valid information', async ({ page }) => {
    await checkout(page, product.id);

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
    await checkout(page, product.id);

    await expect(checkoutPage.title).toHaveText('Checkout: Your Information')
    await expect(page).toHaveURL(/.*\/checkout-step-one\.html/);

    await checkoutPage.continueBtn.click();
    await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');
  });
});