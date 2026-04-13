import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { VisitorService } from '../../../Service/VisitorService/visitor';
import { RouterLinkActive, RouterModule } from "@angular/router";

@Component({
  selector: 'visitor-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './visitor-appointment.html',
  styleUrls: ['./visitor-appointment.css']
})
export class VisitorAppointment implements OnInit {

  constructor(private visitorService: VisitorService) {}

  showModal = false;
  todayMinDate = '';

  activeTab: 'current' | 'history' = 'current';

  form = {
    name: '',
    contact: '',
    address: '',
    reason: '',
    appointmentDate: ''
  };

  allAppointments: any[] = [];

  ngOnInit() {
    this.setMinDate();
    this.loadAppointments();
  }

  setMinDate() {
    const now = new Date();
    this.todayMinDate = now.toISOString().slice(0, 16);
  }

  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; this.resetForm(); }

  allowOnlyNumbers(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    this.form.contact = event.target.value;
  }

  bookAppointment(formRef: NgForm) {

    if (formRef.invalid) return;

    const payload = {
      bookerName: this.form.name,
      bookerContactNumber: this.form.contact,
      appointmentAddress: this.form.address,
      appointmentReason: this.form.reason,
      appointmentDate: this.form.appointmentDate
    };

    this.visitorService.bookAppointment(payload).subscribe({
      next: () => {
        alert('Appointment booked successfully');
        this.closeModal();
        this.loadAppointments();
      },
      error: () => alert('Booking failed')
    });
  }

  loadAppointments() {
    this.visitorService.getMyAppointments()
      .subscribe(res => this.allAppointments = res);
  }

  get currentAppointments() {
    return this.allAppointments.filter(a => a.appointmentStatus === 1);
  }

  get historyAppointments() {
    return this.allAppointments.filter(a => a.appointmentStatus !== 1);
  }

  resetForm() {
    this.form = {
      name: '',
      contact: '',
      address: '',
      reason: '',
      appointmentDate: ''
    };
  }

  getStatusText(status: number) {
    switch(status) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Cancelled';
      case 4: return 'Completed';
      default: return 'Unknown';
    }
  }
}