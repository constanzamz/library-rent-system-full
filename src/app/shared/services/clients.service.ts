import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getAll() {
    return this.http.get<{
      data: Client[];
      success: boolean;
      errorMessage: string | null;
    }>(this.baseUrl + 'Clients');
  }

  create(client: Client) {
    return this.http.post(this.baseUrl + 'Clients', client);
  }

  update(id: number, client: Client) {
    return this.http.put(this.baseUrl + 'Clients/' + id, client);
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'Clients/' + id);
  }

  searchByName(term: string, take: number = 20) {
    return this.http.get<{
      data: Client[];
      success: boolean;
      errorMessage: string | null;
    }>(this.baseUrl + `Clients/search?term=${encodeURIComponent(term)}&take=${take}`);
  }
}
