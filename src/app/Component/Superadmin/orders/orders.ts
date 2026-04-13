import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperAdminService } from '../../../Service/SuperAdminService/super-admin';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  orders: any[] = [];
  paginatedOrders: any[] = [];

  fromDate = '';
  toDate = '';
  status: number | null = null;

  page = 1;
  pageSize = 10;

  // ✅ CORRECT STATUS VALUES
  statuses = [
    { label: 'All', value: null },
    { label: 'Pending', value: 1 },
    { label: 'Completed', value: 4 },   // Delivered
    { label: 'Cancelled', value: 5 }
  ];

  constructor(private adminService: SuperAdminService) {}

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0];
    this.fromDate = today;
    this.toDate = today;
    this.loadOrders();
  }

  loadOrders() {

    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      alert('From Date cannot be greater than To Date');
      return;
    }

    const filters: any = {};

    if (this.fromDate) filters.fromDate = this.fromDate;
    if (this.toDate) filters.toDate = this.toDate;
    if (this.status !== null) filters.status = this.status;

    this.adminService.getOrders(filters)
      .subscribe(res => {
        this.orders = res;
        this.page = 1;
        this.updatePagination();
      });
  }

  updatePagination() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedOrders = this.orders.slice(start, end);
  }

  nextPage() {
    if ((this.page * this.pageSize) < this.orders.length) {
      this.page++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }

  // ✅ UPDATE STATUS
  updateStatus(orderId: string, status: number) {
    this.adminService.updateOrderStatus(orderId, status)
      .subscribe(() => this.loadOrders());
  }

  // ✅ DISPLAY TEXT
  getStatusText(status: number) {
    switch (status) {
      case 1: return 'Pending';
      case 4: return 'Completed';   // Delivered
      case 5: return 'Cancelled';
      default: return '';
    }
  }

  showPagination() {
    return this.orders.length > this.pageSize;
  }
}