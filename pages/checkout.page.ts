import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;
    readonly title: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly zipCodeInput: Locator;
    readonly continueBtn: Locator;
    readonly finishBtn: Locator;
    readonly generatePDFBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('.title');
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.zipCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
        this.continueBtn = page.getByRole('button', { name: 'Continue' });
        this.finishBtn = page.getByRole('button', { name: 'Finish' });
        this.generatePDFBtn = page.locator('#generate-pdf-order');
    }

    async fillCheckoutInformation(firstName: string, lastName: string, zipCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipCodeInput.fill(zipCode);
    }

    async getTotalAmount() {
        const totalLabel = this.page.locator('[data-test="total-label"]');
        const rawTotal = (await totalLabel.innerText()).trim();

        const totalAmount = rawTotal.match(/[\d,.]+/)?.[0] ?? '';
        return totalAmount;
    }

}