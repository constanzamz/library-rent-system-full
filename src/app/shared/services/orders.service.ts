import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OrderRequest } from '../models/order-request.model';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  create(order: OrderRequest) {
    return this.http.post(this.baseUrl + 'Orders', order);
  }

  getAll() {
    return this.http.get<{
      data: any[];
      success: boolean;
      errorMessage: string | null;
    }>(this.baseUrl + 'Orders');
  }

  return(orderId: number) {
    return this.http.put(
      this.baseUrl + 'Orders/' + orderId + '/return',
      {}
    );
  }

  getBooksByDni(dni: string) {
    return this.http.get<{
      data: Book[];
      success: boolean;
      errorMessage: string | null;
    }>(this.baseUrl + 'Orders/books-by-dni/' + dni);
  }
}

