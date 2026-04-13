import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VisitorService } from '../../Service/VisitorService/visitor';

@Component({
  selector: 'app-medicine',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './medicine.html',
  styleUrl: './medicine.css',
})
export class Medicine implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  diseases: any[] = [];

  selectedCategoryId: string = 'all';
  selectedDiseaseId: string = 'all';

  cartItems: any[] = [];
  cartCount = 0;

  loading = false;
  hideDiseaseDropdown = true;

  viewImageUrl: string | null = null;

  constructor(
    private visitorService: VisitorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.loadCategories();
    this.loadDiseases();
    this.loadCart();

    this.route.queryParams.subscribe(params => {
      this.selectedDiseaseId = params['diseaseId'] || 'all';
      this.loadProducts();
    });

  }

  // ================= LOADERS =================

  loadCategories(): void {
    this.visitorService.getCategories().subscribe({
      next: res => this.categories = res,
      error: err => console.error('Category load failed', err)
    });
  }

  loadDiseases(): void {
    this.visitorService.getEnabledDiseases().subscribe({
      next: res => this.diseases = res,
      error: err => console.error('Disease load failed', err)
    });
  }

  // 🔥 LOAD PRODUCTS (NORMALIZED)
  loadProducts(): void {

    this.loading = true;

    const request =
      this.selectedDiseaseId !== 'all'
        ? this.visitorService.getProductsByDisease(this.selectedDiseaseId)
        : this.visitorService.getAllHealthProducts();

    request.subscribe({
      next: res => {

        this.products = res.map((p: any) => ({

          productId:
            p.productId ||
            p.healthProductId ||
            p.id,

          name:
            p.name ||
            p.productName ||
            p.healthProductName ||
            'Unnamed Product',

          price:
            p.price ||
            p.productPrice ||
            p.healthProductPrice ||
            p.sellingPrice ||
            0,

          imageUrl:
            p.imageUrl ||
            p.productImage ||
            p.healthProductImage ||
            '',

          categoryId:
            p.categoryId ||
            p.productCategoryId ||
            '',

          quantity:
            p.quantity ?? 0

        }));

        this.applyCategoryFilter();
        this.loading = false;

      },
      error: err => {
        console.error('Product load failed', err);
        this.loading = false;
      }
    });

  }

  // ================= FILTERS =================

  onDiseaseChange(): void {
    this.selectedCategoryId = 'all';
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.applyCategoryFilter();
  }

  applyCategoryFilter(): void {

    if (this.selectedCategoryId === 'all') {
      this.filteredProducts = this.products;
      return;
    }

    this.filteredProducts = this.products.filter(
      p => p.categoryId?.toString() === this.selectedCategoryId
    );

  }

  // ================= IMAGE VIEW =================

  openImageViewer(url: string) {
    this.viewImageUrl = url;
  }

  closeImageViewer() {
    this.viewImageUrl = null;
  }

  // ================= CART FUNCTIONS =================

 // ================= CART FUNCTIONS =================

loadCart() {

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  this.cartItems = cart;

  this.cartCount = cart.length;
}

isInCart(productId: any) {

  return this.cartItems.some(
    item => item.productId == productId
  );
}


// 🔥 ADD / REMOVE TOGGLE
addToCart(product: any) {

  const id =
    product.productId ||
    product.healthProductId ||
    product.id;

  if (!id) return;

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const index = cart.findIndex(
    (x: any) => x.productId == id
  );

  if (index > -1) {

    cart.splice(index, 1);

  } else {

    cart.push({
      productId: id,
      qty: 1
    });

  }

  localStorage.setItem('cart', JSON.stringify(cart));

  this.loadCart();
}


removeFromCart(productId: any) {

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  cart = cart.filter(
    (x: any) => x.productId != productId
  );

  localStorage.setItem('cart', JSON.stringify(cart));

  this.loadCart();
}

}