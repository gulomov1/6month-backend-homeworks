import { BuyInput, RestockInput } from "./products.types";
import { getProduct, buyStock, restockStock } from "./products.repository";
import { HttpError } from "../../shared/errors";

export function getProductService() {
  return getProduct();
}

export async function buyProductService(input: BuyInput) {
  if (!input.quantity || input.quantity <= 0) {
    throw new HttpError(400, "Quantity must be greater than 0");
  }

  const result = await buyStock(input.quantity);

  if (!result.success) {
    throw new HttpError(400, "Not enough stock", { stock: result.stock });
  }

  return { message: "Purchase successful", stock: result.stock };
}

export async function restockProductService(input: RestockInput) {
  if (!input.quantity || input.quantity <= 0) {
    throw new HttpError(400, "Quantity must be greater than 0");
  }

  const newStock = await restockStock(input.quantity);

  return { message: "Stock restocked successfully", stock: newStock };
}
