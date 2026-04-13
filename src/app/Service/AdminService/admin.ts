import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../Environment/environment/environment';
import { HealthProduct } from '../../Model/health-product';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = `${environment.apiBaseUrl}/api/admin`;

  constructor(private http: HttpClient) {}

  // Users
  getAllUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getUserById(id: string) {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }

  // Health Products
  addHealthProduct(data: HealthProduct) {
    return this.http.post(`${this.baseUrl}/health-products`, data);
  }

  getAllHealthProducts() {
    return this.http.get(`${this.baseUrl}/health-products`);
  }

  getHealthProductById(id: string) {
    return this.http.get(`${this.baseUrl}/health-products/${id}`);
  }

  getHealthProductsByCategory(category: number) {
    return this.http.get(
      `${this.baseUrl}/health-products/category/${category}`
    );
  }

  updateHealthProduct(id: string, data: HealthProduct) {
    return this.http.put(
      `${this.baseUrl}/health-products/${id}`,
      data
    );
  }

  deleteHealthProduct(id: string) {
    return this.http.delete(
      `${this.baseUrl}/health-products/${id}`
    );
  }

  // Appointments
  getAllAppointments() {
    return this.http.get(`${this.baseUrl}/appointments`);
  }

  getAppointmentById(id: number) {
    return this.http.get(`${this.baseUrl}/appointments/${id}`);
  }

  getAppointmentsByUser(userId: string) {
    return this.http.get(
      `${this.baseUrl}/appointments/user/${userId}`
    );
  }

  updateAppointmentStatus(id: number, status: number) {
    return this.http.put(
      `${this.baseUrl}/appointments/${id}/status/${status}`,
      {}
    );
  }

  // Orders
  getAllOrders() {
    return this.http.get(`${this.baseUrl}/orders`);
  }

  getOrderById(id: string) {
    return this.http.get(`${this.baseUrl}/orders/${id}`);
  }

  getOrderItems(orderId: string) {
    return this.http.get(
      `${this.baseUrl}/orders/${orderId}/items`
    );
  }

  // Transactions
  getAllTransactions() {
    return this.http.get(`${this.baseUrl}/transactions`);
  }

  getTransactionById(id: string) {
    return this.http.get(`${this.baseUrl}/transactions/${id}`);
  }

  getTransactionsByUser(userId: string) {
    return this.http.get(
      `${this.baseUrl}/transactions/user/${userId}`
    );
  }

  // Feedback
  getAllFeedbacks() {
    return this.http.get(`${this.baseUrl}/feedbacks`);
  }

  getFeedbacksByUser(userId: string) {
    return this.http.get(
      `${this.baseUrl}/feedbacks/user/${userId}`
    );
  }

  // Prescriptions
  getAllPrescriptions() {
    return this.http.get(`${this.baseUrl}/prescriptions`);
  }

  getPrescriptionByAppointment(appointmentId: string) {
    return this.http.get(
      `${this.baseUrl}/prescriptions/appointment/${appointmentId}`
    );
  }
}
