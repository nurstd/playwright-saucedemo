export interface ProductItem {
  id: number;
  name: string;
  price: string;
}

// List of Products
export const productList: ProductItem[] = [
  { id: 0, name: 'Sauce Labs Bike Light', price: '$9.99' },
  { id: 1, name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' },
  { id: 2, name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' },
  { id: 3, name: 'Sauce Labs Onesie', price: '$7.99' },
  { id: 4, name: 'Sauce Labs Backpack', price: '$29.99' },
  { id: 5, name: 'Sauce Labs Fleece Jacket', price: '$49.99' },
];

// Helper
export function toProductSlug(productName: string): string {
  return productName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProductById(id: number): ProductItem {
  const found = productList.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Product with id "${id}" not found in productList`);
  }
  return found;
}

export function getSortedProducts(sortOrder: string): ProductItem[] {

  const sortedList = [...productList];
  const toPriceNumber = (price: string): number =>
    parseFloat(price.replace(/[^0-9.-]+/g, ''));

  switch (sortOrder) {
    case 'lohi':
      sortedList.sort((a, b) => toPriceNumber(a.price) - toPriceNumber(b.price));
      break;
    case 'hilo':
      sortedList.sort((a, b) => toPriceNumber(b.price) - toPriceNumber(a.price));
      break;
    case 'az':
      sortedList.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'za':
      sortedList.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  return sortedList;
}