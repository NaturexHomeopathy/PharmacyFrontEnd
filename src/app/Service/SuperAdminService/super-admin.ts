import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../Environment/environment/environment';
import { User } from '../../Model/user';
import { HealthProductCategory } from '../../Model/healthproductcategory';
import { Disease } from '../../Model/disease';
@Injectable({ providedIn: 'root' })
export class SuperAdminService {

  private baseUrl = `${environment.apiBaseUrl}/api/superadmin`;

  constructor(private http: HttpClient) {}

  // ================= SUPER ADMINS =================

  getSuperAdmins() {
    return this.http.get<User[]>(`${this.baseUrl}/superadmins`);
  }

  addSuperAdmin(user: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
  }) {
    return this.http.post<User>(
      `${this.baseUrl}/superadmins`,
      user
    );
  }

  updateSuperAdmin(id: string, user: Partial<User>) {
    return this.http.put<User>(
      `${this.baseUrl}/superadmins/${id}`,
      user
    );
  }

  // ================= ADMINS =================

  getAdmins() {
    return this.http.get<User[]>(`${this.baseUrl}/admins`);
  }

  addAdmin(user: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
  }) {
    return this.http.post<User>(
      `${this.baseUrl}/admins`,
      user
    );
  }

  updateAdmin(id: string, user: Partial<User>) {
    return this.http.put<User>(
      `${this.baseUrl}/admins/${id}`,
      user
    );
  }

  // ================= VISITORS =================

  getVisitors() {
    return this.http.get<User[]>(`${this.baseUrl}/visitors`);
  }

  // ================= ENABLE / DISABLE USERS =================

  enableUser(id: string) {
    return this.http.put(
      `${this.baseUrl}/users/${id}/enable`,
      {}
    );
  }

  disableUser(id: string) {
    return this.http.put(
      `${this.baseUrl}/users/${id}/disable`,
      {}
    );
  }

  // ================= ONLINE / OFFLINE =================

  setUserOnline(userId: string) {
    return this.http.post(
      `${this.baseUrl}/online`,
      { userId }
    );
  }

  setUserOffline(userId: string) {
    return this.http.post(
      `${this.baseUrl}/offline`,
      { userId }
    );
  }

  // ================= HEALTH PRODUCTS =================

  addHealthProduct(product: any) {
    return this.http.post(
      `${this.baseUrl}/health-products`,
      product
    );
  }

  updateHealthProduct(id: string, product: any) {
    return this.http.put(
      `${this.baseUrl}/health-products/${id}`,
      product
    );
  }

  deleteHealthProduct(id: string) {
    return this.http.delete(
      `${this.baseUrl}/health-products/${id}`
    );
  }

  // ✅ Backend-supported GET (by category)
  getHealthProductsByCategory(category: number) {
    return this.http.get(
      `${this.baseUrl}/health-products/category/${category}`
    );
  }

// ================= HEALTH PRODUCTS (ALL - NO FILTER) =================

getAllHealthProductsSimple() {
  return this.http.get<any[]>(
    `${this.baseUrl}/health-products/all`
  );
}

// ================= DASHBOARD DISEASES =================

getDashboardDiseases() {
  return this.http.get<any[]>(
    `${this.baseUrl}/dashboard-diseases`
  );
}

// ================= CATEGORY MANAGEMENT =================

// ➕ Add Category
addCategory(category: { categoryName: string }) {
  return this.http.post<HealthProductCategory>(
    `${this.baseUrl}/categories`,
    category
  );
}

// 📄 Get All Categories (Enabled + Disabled)
getAllCategories() {
  return this.http.get<HealthProductCategory[]>(
    `${this.baseUrl}/categories`
  );
}

// ✏️ Update Category Name
updateCategory(id: string, category: Partial<HealthProductCategory>) {
  return this.http.put<HealthProductCategory>(
    `${this.baseUrl}/categories/${id}`,
    category
  );
}

// 🔁 Enable / Disable Category (TOGGLE)
toggleCategory(id: string) {
  return this.http.put<HealthProductCategory>(
    `${this.baseUrl}/categories/${id}/toggle`,
    {}
  );
}
// 📄 Get only ACTIVE categories
getActiveCategories() {
  return this.http.get<any[]>(
    `${this.baseUrl}/categories`
  );
}

// ================= DISEASE MANAGEMENT =================

// ➕ Add Disease
addDisease(disease: { diseaseName: string }) {
  return this.http.post<Disease>(
    `${this.baseUrl}/diseases`,
    disease
  );
}

// 📄 Get All Diseases
getAllDiseases() {
  return this.http.get<Disease[]>(
    `${this.baseUrl}/diseases`
  );
}

// ✏️ Update Disease
updateDisease(id: string, disease: Partial<Disease>) {
  return this.http.put<Disease>(
    `${this.baseUrl}/diseases/${id}`,
    disease
  );
}

// ❌ Delete Disease
deleteDisease(id: string) {
  return this.http.delete(
    `${this.baseUrl}/diseases/${id}`
  );
}

// 🔁 Enable / Disable Disease (TOGGLE)
toggleDisease(id: string) {
  return this.http.put<Disease>(
    `${this.baseUrl}/diseases/${id}/toggle`,
    {}
  );
}

// ================= DISEASE ↔ HEALTH PRODUCT =================

// Get products linked to a disease
getProductsForDisease(diseaseId: string) {
  return this.http.get<any[]>(
    `${this.baseUrl}/diseases/${diseaseId}/products`
  );
}

// Add product to disease
addProductToDisease(diseaseId: string, productId: string) {
  return this.http.post(
    `${this.baseUrl}/diseases/${diseaseId}/products/${productId}`,
    {}
  );
}

// Remove product from disease
removeProductFromDisease(diseaseId: string, productId: string) {
  return this.http.delete(
    `${this.baseUrl}/diseases/${diseaseId}/products/${productId}`
  );
}

// ================= HEALTH PRODUCT IMAGE =================

// Upload product image
uploadHealthProductImage(productId: string, file: File) {
  const formData = new FormData();
  formData.append('image', file);

  return this.http.post<{ imageUrl: string }>(
    `${this.baseUrl}/health-products/${productId}/upload-image`,
    formData
  );
}
uploadDiseaseImage(diseaseId: string, file: File) {
  const formData = new FormData();
  formData.append('image', file);

  return this.http.post<any>(
    `${this.baseUrl}/diseases/${diseaseId}/upload-image`,
    formData
  );
}

// ================= APPOINTMENTS =================

// Get appointments with optional filters
getAppointments(filters?: {
  date?: string;
  fromDate?: string;
  toDate?: string;
  status?: number;
}) {
  let params: any = {};

  if (filters?.date) params.date = filters.date;
  if (filters?.fromDate) params.fromDate = filters.fromDate;
  if (filters?.toDate) params.toDate = filters.toDate;
  if (filters?.status !== undefined) params.status = filters.status;

  return this.http.get<any[]>(
    `${this.baseUrl}/appointments`,
    { params }
  );
}

// Update appointment status (Cancelled or Completed)
updateAppointmentStatus(id: number, status: number) {
  return this.http.put(
    `${this.baseUrl}/appointments/${id}/status`,
    null,
    { params: { status } }
  );
}

getOrders(filters: any) {
  return this.http.get<any[]>(
    `${this.baseUrl}/orders`,
    { params: filters }
  );
}

updateOrderStatus(orderId: string, status: number) {
  return this.http.put(
    `${this.baseUrl}/orders/${orderId}/status`,
    status
  );
}
}
