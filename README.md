# Playwright Repository for E2E Testing

Test URL: https://www.saucedemo.com/

## Coding Standards
1. **Page Object Model (POM)**: Encapsulated page locators and user actions into dedicated page classes (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`, `ProductPage`) initialized in `beforeEach` hooks.
2. **Centralized Product Data & Helpers**: Managed product catalogs via `productList` with helpers for ID lookup (`getProductById`), URL-safe slug generation, and sorting (`low to high`, `high to low`, `Z to A`) with currency parsing.
3. **Dynamic Locators & URL Assertions**: Built dynamic locators for product actions/items and regex-based URL assertions tied to product IDs.
4. **Checkout & PDF Validation**: Handled browser download events (`page.waitForEvent('download')`) and parsed generated PDFs using `pdf-parse` to verify order details.

## Directory
```
.
├── data/                    # Test Data
├── pages/                   # Page Obejcts
└── tests/                   # Automation Test Script
```

## Prerequisites
1. Install Node.js
2. Install project dependencies -> `npm install`
3. Install browser binaries Playwright -> `npx playwright install`
4. Install PDF parsing library -> `npm install pdf-parse`

## How to Run
1. Run All Tests (Headless) -> `npx playwright test`
2. Run Specific Test -> `npx playwright test tests/[test_name].spec.ts`
3. Run Test with UI Mode -> `npx playwright test --ui`
4. View Test Report -> `npx playwright show-report`