export type Product = {
  name: string;
  stock: number;
};

export type BuyInput = {
  quantity: number;
};

export type RestockInput = {
  quantity: number;
};

export type BuyResult = {
  success: boolean;
  stock: number;
};
