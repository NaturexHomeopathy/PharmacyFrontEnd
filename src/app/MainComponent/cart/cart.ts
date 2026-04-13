import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VisitorService } from '../../Service/VisitorService/visitor';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  qty: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {

  cartItems: CartItem[] = [];
  total = 0;

  checkoutMode = false;
  orderPlaced = false;
  placingOrder = false;

  // Customer details
  fullName = '';
  contact = '';
  deliveryAddress = '';

  constructor(
    private visitorService: VisitorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // ================= LOAD CART =================

  loadCart() {

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (!cart.length) {
      this.cartItems = [];
      this.calculateTotal();
      return;
    }

    const requests = cart.map((c: any) =>
      this.visitorService.getProductById(c.productId)
    );

    forkJoin<any[]>(requests).subscribe({
  next: (products) => {

    this.cartItems = products.map((p: any, i: number) => ({
      productId: p.productId || p.healthProductId,
      name: p.name || p.productName || p.healthProductName,
      price: p.price || p.productPrice || p.healthProductPrice,
      imageUrl: p.imageUrl || '',
      qty: cart[i].qty
    }));

    this.calculateTotal();
  },
  error: () => alert('Failed to load cart products')
});}

  // ================= TOTAL =================

  calculateTotal() {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }

  // ================= QTY =================

  increaseQty(id: string) {
    const item = this.cartItems.find(x => x.productId === id);
    if (item) item.qty++;
    this.updateCart();
  }

  decreaseQty(id: string) {
    const item = this.cartItems.find(x => x.productId === id);
    if (!item) return;

    if (item.qty === 1)
      this.cartItems = this.cartItems.filter(x => x.productId !== id);
    else
      item.qty--;

    this.updateCart();
  }

  updateCart() {
    const cart = this.cartItems.map(x => ({
      productId: x.productId,
      qty: x.qty
    }));

    localStorage.setItem('cart', JSON.stringify(cart));
    this.calculateTotal();
  }

  // ================= NAVIGATION =================

  goToDashboard() {
    this.router.navigate(['/']);
  }

  openCheckout() {
    this.checkoutMode = true;
  }

  backToCart() {
    this.checkoutMode = false;
  }

  // ================= PLACE ORDER (COD) =================

  placeOrderCOD() {

  if (!this.fullName.trim() ||
      !this.contact.trim() ||
      !this.deliveryAddress.trim()) {
    alert('Please fill all details');
    return;
  }

  if (this.cartItems.length === 0) {
    alert('Cart is empty');
    return;
  }

  this.placingOrder = true;

 const order = {
  fullName: this.fullName,
  contact: this.contact,
  deliveryAddress: this.deliveryAddress,

  orderItems: this.cartItems.map(x => ({
    healthProductId: x.productId,
    quantity: x.qty
  }))
};

  this.visitorService.createOrder(order)
    .subscribe({
      next: () => {

        this.orderPlaced = true;
        this.placingOrder = false;

        localStorage.removeItem('cart');
        this.cartItems = [];
        this.calculateTotal();

        setTimeout(() => this.resetPage(), 3000);
      },
      error: () => {
        this.placingOrder = false;
        alert('Failed to place order');
      }
    });
}
  resetPage() {
    this.orderPlaced = false;
    this.checkoutMode = false;

    this.fullName = '';
    this.contact = '';
    this.deliveryAddress = '';
  }

}