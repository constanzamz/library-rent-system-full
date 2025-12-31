import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksService } from '../shared/services/books.service';
import { Book } from '../shared/models/book.model';
import { BookForm } from './book-form/book-form';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    CommonModule,
    BookForm,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books implements OnInit {
  private booksService = inject(BooksService);

  books: Book[] = [];
  selectedBook: Book | null = null;
  displayedColumns: string[] = ['nombre', 'autor', 'isbn', 'disponible', 'acciones'];

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.booksService.getAll().subscribe({
      next: (response) => {
        this.books = response.data;
      },
    });
  }

  editBook(book: Book) {
    this.selectedBook = { ...book };
  }

  saveBook(book: Book) {
    if (book.id) {
      this.booksService.update(book.id, book).subscribe({
        next: () => {
          this.selectedBook = null;
          this.loadBooks();
        },
      });
    } else {
      this.booksService.create(book).subscribe({
        next: () => {
          this.selectedBook = null;
          this.loadBooks();
        },
      });
    }
  }

  deleteBook(id: number) {
    if (!confirm('¿Eliminar libro?')) return;

    this.booksService.delete(id).subscribe({
      next: () => this.loadBooks(),
    });
  }

  newBook() {
    this.selectedBook = {
      nombre: '',
      autor: '',
      isbn: '',
    } as Book;
  }
}

   