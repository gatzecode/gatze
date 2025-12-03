import { Injectable, signal } from '@angular/core';
import { Product, ProductFormData, ProductStatus } from './product.types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Signal to store products
  private productsSignal = signal<Product[]>(this.generateDummyProducts());

  // Public readonly signal
  readonly products = this.productsSignal.asReadonly();

  /**
   * Generate dummy products for demonstration
   */
  private generateDummyProducts(): Product[] {
    return [
      {
        id: 'prod-001',
        name: 'Wireless Headphones',
        description: 'High-quality Bluetooth headphones with noise cancellation',
        category: 'Electronics',
        price: 149.99,
        stock: 45,
        sku: 'WH-BT-001',
        status: 'active',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 'prod-002',
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt available in multiple colors',
        category: 'Clothing',
        price: 24.99,
        stock: 120,
        sku: 'CLO-TS-002',
        status: 'active',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-14'),
      },
      {
        id: 'prod-003',
        name: 'Organic Coffee Beans',
        description: 'Premium Arabica coffee beans, fair trade certified',
        category: 'Food',
        price: 18.50,
        stock: 0,
        sku: 'FOD-CF-003',
        status: 'out-of-stock',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-16'),
      },
      {
        id: 'prod-004',
        name: 'JavaScript: The Good Parts',
        description: 'Classic programming book by Douglas Crockford',
        category: 'Books',
        price: 32.00,
        stock: 28,
        sku: 'BOK-JS-004',
        status: 'active',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-11'),
      },
      {
        id: 'prod-005',
        name: 'LEGO Architecture Set',
        description: 'Build iconic landmarks with this detailed LEGO set',
        category: 'Toys',
        price: 89.99,
        stock: 15,
        sku: 'TOY-LG-005',
        status: 'active',
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-13'),
      },
      {
        id: 'prod-006',
        name: 'Yoga Mat Premium',
        description: 'Non-slip exercise mat with carrying strap',
        category: 'Other',
        price: 45.00,
        stock: 8,
        sku: 'OTH-YM-006',
        status: 'inactive',
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-12'),
      },
    ];
  }

  /**
   * Get all products
   */
  getAllProducts(): Product[] {
    return this.products();
  }

  /**
   * Get product by ID
   */
  getProductById(id: string): Product | undefined {
    return this.products().find((p) => p.id === id);
  }

  /**
   * Add a new product
   */
  addProduct(formData: ProductFormData): Product {
    const newProduct: Product = {
      ...formData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.productsSignal.update((products) => [...products, newProduct]);
    return newProduct;
  }

  /**
   * Update an existing product
   */
  updateProduct(id: string, formData: ProductFormData): Product | null {
    const index = this.products().findIndex((p) => p.id === id);

    if (index === -1) return null;

    const updatedProduct: Product = {
      ...this.products()[index],
      ...formData,
      updatedAt: new Date(),
    };

    this.productsSignal.update((products) => {
      const newProducts = [...products];
      newProducts[index] = updatedProduct;
      return newProducts;
    });

    return updatedProduct;
  }

  /**
   * Delete a product
   */
  deleteProduct(id: string): boolean {
    const initialLength = this.products().length;

    this.productsSignal.update((products) =>
      products.filter((p) => p.id !== id)
    );

    return this.products().length < initialLength;
  }

  /**
   * Update product status
   */
  updateProductStatus(id: string, status: ProductStatus): boolean {
    const index = this.products().findIndex((p) => p.id === id);

    if (index === -1) return false;

    this.productsSignal.update((products) => {
      const newProducts = [...products];
      newProducts[index] = {
        ...newProducts[index],
        status,
        updatedAt: new Date(),
      };
      return newProducts;
    });

    return true;
  }

  /**
   * Generate unique ID for new products
   */
  private generateId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `prod-${timestamp}-${random}`;
  }
}
