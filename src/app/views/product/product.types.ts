// Product-related types and interfaces

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  sku: string;
  image?: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 'Electronics' | 'Clothing' | 'Food' | 'Books' | 'Toys' | 'Other';

export type ProductStatus = 'active' | 'inactive' | 'out-of-stock';

export interface ProductFormData {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  sku: string;
  status: ProductStatus;
}
