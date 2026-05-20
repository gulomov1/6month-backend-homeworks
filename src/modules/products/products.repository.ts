import { Product, BuyResult } from "./products.types";

const product: Product = {
  name: "Iphone 17",
  stock: 5,
};

function fakeDatabaseDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export function getProduct(): Product {
  return { ...product };
}

export async function buyStock(quantity: number): Promise<BuyResult> {
  if (product.stock < quantity) {
    return { success: false, stock: product.stock };
  }

  product.stock -= quantity;

  await fakeDatabaseDelay();

  return { success: true, stock: product.stock };
}

export async function restockStock(quantity: number): Promise<number> {
  await fakeDatabaseDelay();
  product.stock += quantity;
  return product.stock;
}
