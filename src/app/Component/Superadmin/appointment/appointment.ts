import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperAdminService } from '../../../Service/SuperAdminService/super-admin';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css'
})
export class Appointment implements OnInit {

  appointments: any[] = [];
  paginatedAppointments: any[] = [];

  fromDate = '';
  toDate = '';
  status: number | null = null;

  page = 1;
  pageSize = 10;

  statuses = [
    { label: 'All', value: null },
    { label: 'Pending', value: 1 },
    { label: 'Cancelled', value: 3 },
    { label: 'Completed', value: 4 }
  ];

  constructor(private superAdminService: SuperAdminService) {}
ngOnInit() {
  const today = new Date().toISOString().split('T')[0];

  this.fromDate = today;
  this.toDate = today;

  this.loadAppointments();
}

  loadAppointments() {

  // Date validation
  if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
    alert('From Date cannot be greater than To Date');
    return;
  }

  const filters: any = {};

  if (this.fromDate) filters.fromDate = this.fromDate;
  if (this.toDate) filters.toDate = this.toDate;
  if (this.status !== null) filters.status = this.status;

  this.superAdminService.getAppointments(filters)
    .subscribe(res => {
      this.appointments = res;
      this.page = 1;
      this.updatePagination();
    });
}

  updatePagination() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedAppointments = this.appointments.slice(start, end);
  }

  nextPage() {
    if ((this.page * this.pageSize) < this.appointments.length) {
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

  updateStatus(id: number, status: number) {
    this.superAdminService.updateAppointmentStatus(id, status)
      .subscribe(() => this.loadAppointments());
  }

  getStatusText(status: number) {
    switch (status) {
      case 1: return 'Pending';
      case 3: return 'Cancelled';
      case 4: return 'Completed';
      default: return '';
    }
  }

  showPagination() {
    return this.appointments.length > this.pageSize;
  }

}