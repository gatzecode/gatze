import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from './product.service';
import { Product, ProductStatus } from './product.types';
import { ProductDialogComponent } from './product-dialog';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductComponent {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Get products from service
  products = this.productService.products;

  // Computed stats
  totalProducts = computed(() => this.products().length);
  activeProducts = computed(() => this.products().filter((p) => p.status === 'active').length);
  outOfStock = computed(() => this.products().filter((p) => p.status === 'out-of-stock').length);
  totalValue = computed(() =>
    this.products().reduce((sum, p) => sum + p.price * p.stock, 0)
  );

  // Table columns
  displayedColumns: string[] = [
    'sku',
    'name',
    'category',
    'price',
    'stock',
    'status',
    'actions',
  ];

  /**
   * Open dialog to create a new product
   */
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '600px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newProduct = this.productService.addProduct(result);
        this.showNotification(`Product "${newProduct.name}" created successfully!`);
      }
    });
  }

  /**
   * Open dialog to edit an existing product
   */
  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '600px',
      data: { mode: 'edit', product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updated = this.productService.updateProduct(product.id, result);
        if (updated) {
          this.showNotification(`Product "${updated.name}" updated successfully!`);
        }
      }
    });
  }

  /**
   * Delete a product with confirmation
   */
  deleteProduct(product: Product): void {
    const confirmation = confirm(
      `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`
    );

    if (confirmation) {
      const success = this.productService.deleteProduct(product.id);
      if (success) {
        this.showNotification(`Product "${product.name}" deleted successfully!`);
      }
    }
  }

  /**
   * Toggle product status between active and inactive
   */
  toggleProductStatus(product: Product): void {
    const newStatus: ProductStatus = product.status === 'active' ? 'inactive' : 'active';
    const success = this.productService.updateProductStatus(product.id, newStatus);

    if (success) {
      this.showNotification(`Product status updated to ${newStatus}`);
    }
  }

  /**
   * Get status chip color based on product status
   */
  getStatusColor(status: ProductStatus): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  /**
   * Get category icon
   */
  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      Electronics: 'devices',
      Clothing: 'checkroom',
      Food: 'restaurant',
      Books: 'menu_book',
      Toys: 'toys',
      Other: 'category',
    };
    return icons[category] || 'category';
  }

  /**
   * Format currency
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  /**
   * Show notification message
   */
  private showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
