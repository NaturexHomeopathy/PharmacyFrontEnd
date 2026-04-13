import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VisitorService } from '../../../Service/VisitorService/visitor';

@Component({
  selector: 'app-visitor-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitor-orders.html',
  styleUrls: ['./visitor-orders.css'],
})
export class VisitorOrders implements OnInit {

  orders: any[] = [];
  currentOrders: any[] = [];
  orderHistory: any[] = [];

  activeTab: 'current' | 'history' = 'current';
  loading = true;

  constructor(
    private visitorService: VisitorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.visitorService.getMyOrders()
      .subscribe({
        next: (res) => {
          this.orders = res;

          this.currentOrders = this.orders.filter(o =>
            o.status === 'Pending' ||
            o.status === 'Processing' ||
            o.status === 'Shipped'
          );

          this.orderHistory = this.orders.filter(o =>
            o.status === 'Delivered' ||
            o.status === 'Cancelled'
          );

          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  switchTab(tab: 'current' | 'history') {
    this.activeTab = tab;
  }

  goToDashboard() {
    this.router.navigate(['/']);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}