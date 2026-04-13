import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperAdminService } from '../../../Service/SuperAdminService/super-admin';

@Component({
  selector: 'app-health-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './healthproduct.html',
  styleUrls: ['./healthproduct.css']
})
export class HealthProductComponent implements OnInit {

  categoryList: { id: string; name: string }[] = [];
  categoryMap: Record<string, string> = {};
  selectedCategory: string | null = null;
  

  products: any[] = [];
  editingId: string | null = null;

  showAddForm = false;
  newProduct = {
    productName: '',
    healthProductPrice: null as number | null,
    stockQuantity: null as number | null
  };

  // ================= IMAGE VIEW MODAL =================
  viewImageUrl: string | null = null;

  // ================= UPLOAD SUCCESS =================
  showUploadSuccess = false;

  constructor(private saService: SuperAdminService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.saService.getActiveCategories().subscribe(res => {
      this.categoryList = res
        .filter((c: any) => c.isActive)
        .map((c: any) => ({
          id: c.categoryId,
          name: c.categoryName
        }));

      this.categoryMap = {};
      this.categoryList.forEach(c => this.categoryMap[c.id] = c.name);
    });
  }

  loadProducts() {
    this.saService.getAllHealthProductsSimple().subscribe(res => {
      this.products = this.selectedCategory
        ? res.filter((p: any) => p.categoryId === this.selectedCategory)
        : res;
    });
  }

  onCategoryChange() {
    this.editingId = null;
    this.showAddForm = false;
    this.loadProducts();
  }

  get tableColumnCount(): number {
    let count = 3;
    if (this.selectedCategory === null) count++;
    if (this.selectedCategory !== null) count++;
    return count;
  }

  openAdd() {
    this.showAddForm = true;
    this.newProduct = {
      productName: '',
      healthProductPrice: null,
      stockQuantity: null
    };
  }

  addProduct() {
    if (!this.selectedCategory) return alert('Select category');

    const payload = {
      productName: this.newProduct.productName.trim(),
      categoryId: this.selectedCategory,
      healthProductPrice: this.newProduct.healthProductPrice,
      stockQuantity: this.newProduct.stockQuantity ?? 0,
      imageUrl: ''
    };

    this.saService.addHealthProduct(payload).subscribe(() => {
      this.showAddForm = false;
      this.loadProducts();
    });
  }

  startEdit(p: any) {
    this.editingId = p.healthProductId;
  }

  cancelEdit() {
    this.editingId = null;
    this.loadProducts();
  }

  saveEdit(p: any) {
    this.saService.updateHealthProduct(p.healthProductId, p).subscribe(() => {
      this.editingId = null;
      this.loadProducts();
    });
  }

  deleteProduct(id: string) {
    if (!confirm('Delete product?')) return;
    this.saService.deleteHealthProduct(id).subscribe(() => this.loadProducts());
  }

  // ================= IMAGE UPLOAD =================
  onImageSelected(event: Event, product: any) {

  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  this.saService.uploadHealthProductImage(product.healthProductId, file)
    .subscribe({
      next: (res: any) => {

        // Override old image
        product.imageUrl = res.imageUrl;

        this.showUploadSuccess = true;
        setTimeout(() => this.showUploadSuccess = false, 2000);

        input.value = '';
      },
      error: () => alert('Image upload failed')
    });

}

  // ================= IMAGE VIEW =================
  openImageViewer(url: string) {
    this.viewImageUrl = url;
  }

  closeImageViewer() {
    this.viewImageUrl = null;
  }
}
