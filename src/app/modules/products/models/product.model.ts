export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export type ProductInput = Omit<Product, 'id'>;

export interface ProductQuery {
  page?: number;
  limit?: number;
  name?: string;
  category?: string;
  sortBy?: string;
}
