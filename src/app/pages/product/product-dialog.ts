import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Product, ProductCategory, ProductStatus } from './product.types';

export interface ProductDialogData {
  product?: Product;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <div class="product-dialog">
      <h2 mat-dialog-title class="flex items-center gap-2">
        <mat-icon>{{ data.mode === 'create' ? 'add_circle' : 'edit' }}</mat-icon>
        <span>{{ data.mode === 'create' ? 'Add New Product' : 'Edit Product' }}</span>
      </h2>

      <mat-dialog-content>
        <form [formGroup]="productForm" class="flex flex-col gap-4">
          <!-- Product Name -->
          <mat-form-field appearance="outline">
            <mat-label>Product Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter product name" />
            <mat-icon matPrefix>label</mat-icon>
            @if (productForm.get('name')?.hasError('required') && productForm.get('name')?.touched) {
            <mat-error>Product name is required</mat-error>
            }
          </mat-form-field>

          <!-- Description -->
          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea
              matInput
              formControlName="description"
              placeholder="Enter product description"
              rows="3"
            ></textarea>
            <mat-icon matPrefix>description</mat-icon>
          </mat-form-field>

          <!-- Category and SKU Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Category</mat-label>
              <mat-select formControlName="category">
                @for (cat of categories; track cat) {
                <mat-option [value]="cat">{{ cat }}</mat-option>
                }
              </mat-select>
              <mat-icon matPrefix>category</mat-icon>
              @if (productForm.get('category')?.hasError('required') &&
              productForm.get('category')?.touched) {
              <mat-error>Category is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>SKU</mat-label>
              <input matInput formControlName="sku" placeholder="SKU-XXX-XXX" />
              <mat-icon matPrefix>qr_code</mat-icon>
              @if (productForm.get('sku')?.hasError('required') && productForm.get('sku')?.touched) {
              <mat-error>SKU is required</mat-error>
              }
            </mat-form-field>
          </div>

          <!-- Price and Stock Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Price</mat-label>
              <input matInput type="number" formControlName="price" placeholder="0.00" step="0.01" />
              <span matTextPrefix>$&nbsp;</span>
              <mat-icon matPrefix>attach_money</mat-icon>
              @if (productForm.get('price')?.hasError('required') && productForm.get('price')?.touched)
              {
              <mat-error>Price is required</mat-error>
              } @else if (productForm.get('price')?.hasError('min') &&
              productForm.get('price')?.touched) {
              <mat-error>Price must be greater than 0</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Stock</mat-label>
              <input matInput type="number" formControlName="stock" placeholder="0" />
              <mat-icon matPrefix>inventory</mat-icon>
              @if (productForm.get('stock')?.hasError('required') && productForm.get('stock')?.touched)
              {
              <mat-error>Stock is required</mat-error>
              } @else if (productForm.get('stock')?.hasError('min') &&
              productForm.get('stock')?.touched) {
              <mat-error>Stock cannot be negative</mat-error>
              }
            </mat-form-field>
          </div>

          <!-- Status -->
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              @for (stat of statuses; track stat.value) {
              <mat-option [value]="stat.value">{{ stat.label }}</mat-option>
              }
            </mat-select>
            <mat-icon matPrefix>toggle_on</mat-icon>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="gap-2">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSave()"
          [disabled]="!productForm.valid || saving()"
        >
          <mat-icon>{{ data.mode === 'create' ? 'add' : 'save' }}</mat-icon>
          {{ saving() ? 'Saving...' : (data.mode === 'create' ? 'Create' : 'Save') }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .product-dialog {
        min-width: 500px;
        max-width: 600px;
      }

      @media (max-width: 640px) {
        .product-dialog {
          min-width: 100%;
        }
      }

      mat-dialog-content {
        padding: 20px 24px;
        overflow-y: auto;
        max-height: 60vh;
      }

      mat-dialog-actions {
        padding: 16px 24px;
      }
    `,
  ],
})
export class ProductDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProductDialogComponent>);
  readonly data = inject<ProductDialogData>(MAT_DIALOG_DATA);

  // Available options
  readonly categories: ProductCategory[] = [
    'Electronics',
    'Clothing',
    'Food',
    'Books',
    'Toys',
    'Other',
  ];

  readonly statuses = [
    { value: 'active' as ProductStatus, label: 'Active' },
    { value: 'inactive' as ProductStatus, label: 'Inactive' },
    { value: 'out-of-stock' as ProductStatus, label: 'Out of Stock' },
  ];

  // Saving state
  saving = signal(false);

  // Product form
  productForm: FormGroup;

  constructor() {
    this.productForm = this.createForm();

    // If editing, populate form with existing data
    if (this.data.mode === 'edit' && this.data.product) {
      this.productForm.patchValue(this.data.product);
    }
  }

  /**
   * Create the product form with validation
   */
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      status: ['active', [Validators.required]],
    });
  }

  /**
   * Handle save button click
   */
  onSave(): void {
    if (this.productForm.valid) {
      this.saving.set(true);

      // Simulate API delay
      setTimeout(() => {
        this.dialogRef.close(this.productForm.value);
        this.saving.set(false);
      }, 500);
    }
  }

  /**
   * Handle cancel button click
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
