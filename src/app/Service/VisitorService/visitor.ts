import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../Environment/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private baseUrl = `${environment.apiBaseUrl}/api/visitor`;

  constructor(private http: HttpClient) {}

  // ================= DISEASES =================
  getEnabledDiseases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/diseases`);
  }

  getProductsByDisease(diseaseId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/diseases/${diseaseId}/products`
    );
  }

  // ================= CATEGORIES =================
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  getProductsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/categories/${categoryId}/products`
    );
  }

  // ================= HEALTH PRODUCTS =================
  getAllHealthProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/healthproducts`);
  }

  // 🔥 PRODUCT DETAILS (Images + Reviews + Rating)
  getProductById(id: string) {
  return this.http.get<any>(
    `${this.baseUrl}/healthproducts/${id}`
  );
}

  // ================= REVIEWS =================
  addReview(productId: string, review: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/health-products/${productId}/reviews`,
      review
    );
  }

  // ================= REGISTER VISITOR =================
  registerVisitor(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/register`,
      data
    );
  }

  // ================= APPOINTMENTS =================
// ================= APPOINTMENTS =================

bookAppointment(data: any): Observable<any> {

  const token = localStorage.getItem('token');

  return this.http.post<any>(
    `${this.baseUrl}/appointments`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

getMyAppointments(): Observable<any[]> {

  const token = localStorage.getItem('token');

  return this.http.get<any[]>(
    `${this.baseUrl}/my-appointments`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

  // ================= CANCEL APPOINTMENT =================
cancelAppointment(appointmentId: number, visitorId: string): Observable<any> {
  return this.http.put<any>(
    `${this.baseUrl}/appointments/${appointmentId}/visitor-cancel?visitorId=${visitorId}`,
    {}
  );
}

  // ================= ORDERS =================
getMyOrders(): Observable<any[]> {
  const token = localStorage.getItem('token');

  return this.http.get<any[]>(
    `${this.baseUrl}/my-orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}
  
 // ================= CREATE ORDER =================
createOrder(order: any) {
  const token = localStorage.getItem('token');

  return this.http.post(
    `${this.baseUrl}/create`,
    order,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

}