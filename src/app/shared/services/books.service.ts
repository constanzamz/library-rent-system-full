import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

 getAll() {
  return this.http.get<{
    data: Book[];
    success: boolean;
    errorMessage: string | null;
  }>(this.baseUrl + 'Books');
}

create(book: Book) {
  return this.http.post(this.baseUrl + 'Books', book);
}

update(id: number, book: Book) {
  return this.http.put(this.baseUrl + 'Books/' + id, book);
}

delete(id: number) {
  return this.http.delete(this.baseUrl + 'Books/' + id);
}

}
