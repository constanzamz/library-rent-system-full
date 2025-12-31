import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClientsService } from '../shared/services/clients.service';
import { BooksService } from '../shared/services/books.service';
import { OrdersService } from '../shared/services/orders.service';

import { Client } from '../shared/models/client.model';
import { Book } from '../shared/models/book.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
    MatAutocompleteModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  displayClientFn(client?: Client): string {
    return client ? `${client.nombres} ${client.apellidos} (${client.dni})` : '';
  }
  private clientsService = inject(ClientsService);
  private booksService = inject(BooksService);
  private ordersService = inject(OrdersService);
  private snackBar = inject(MatSnackBar);

  books: Book[] = [];

  selectedClientId: number | null = null;
  selectedBooks: number[] = [];

  searchBook: string = '';

  clientQuery: string = '';
  clientOptions: Client[] = [];
  selectedClient: Client | null = null;
  private clientSearchTimer: any = null;

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.booksService.getAll().subscribe({
      next: (res) => (this.books = res.data),
    });
  }

  get filteredBooks(): Book[] {
    if (!this.searchBook) return this.books;

    const search = this.searchBook.toLowerCase();

    return this.books.filter(
      (b) =>
        b.nombre.toLowerCase().includes(search) ||
        b.autor.toLowerCase().includes(search) ||
        b.isbn.toLowerCase().includes(search)
    );
  }

  toggleBook(bookId: number) {
    if (this.selectedBooks.includes(bookId)) {
      this.selectedBooks = this.selectedBooks.filter(id => id !== bookId);
    } else {
      this.selectedBooks.push(bookId);
    }
  }

  onClientQueryChange(value: string) {
    this.clientQuery = value;

    if (!value || value.trim().length < 2) {
      this.clientOptions = [];
      this.selectedClientId = null;
      this.selectedClient = null;
      return;
    }

    clearTimeout(this.clientSearchTimer);
    this.clientSearchTimer = setTimeout(() => {
      this.clientsService.searchByName(value.trim(), 20).subscribe({
        next: (res) => {
          this.clientOptions = res.data ?? [];
        },
        error: () => {
          this.clientOptions = [];
        },
      });
    }, 300);
  }

  onClientSelected(client: Client) {
    this.selectedClient = client;
    this.selectedClientId = client.id!;
  }

  saveOrder() {
    if (!this.selectedClientId || this.selectedBooks.length === 0) {
      this.snackBar.open(
        'Seleccioná un cliente y al menos un libro',
        'Cerrar',
        {
          duration: 3000,
        }
      );
      return;
    }

    const order = {
      clientId: this.selectedClientId,
      bookIds: this.selectedBooks,
    };

    this.ordersService.create(order).subscribe({
      next: () => {
        this.snackBar.open('Pedido registrado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.selectedClientId = null;
        this.selectedClient = null;
        this.clientQuery = '';
        this.selectedBooks = [];
        this.searchBook = '';
      },
      error: () => {
        this.snackBar.open('Error al registrar el pedido', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}

