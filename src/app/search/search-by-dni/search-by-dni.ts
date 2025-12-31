import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrdersService } from '../../shared/services/orders.service';
import { Book } from '../../shared/models/book.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-by-dni',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './search-by-dni.html',
  styleUrl: './search-by-dni.css',
})
export class SearchByDni {
  private ordersService = inject(OrdersService);
  private snackBar = inject(MatSnackBar);

  dni: string = '';
  books: Book[] = [];
  errorMessage: string | null = null;
  searched = false;
  loading = false;

  search() {
    this.errorMessage = null;
    this.books = [];
    this.searched = false;
    this.loading = true;

    const cleanDni = this.dni.trim();

    if (!cleanDni) {
      this.loading = false;
      this.snackBar.open('Ingresá un DNI', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.ordersService.getBooksByDni(cleanDni).subscribe({
      next: (res) => {
        this.loading = false;
        this.searched = true;
        this.books = res.data;
        if (res.data.length === 0) {
          this.snackBar.open('No se encontraron libros para ese DNI', 'Cerrar', {
            duration: 3000,
          });
        }
      },
      error: () => {
        this.loading = false;
        this.searched = true;
        this.errorMessage = 'Error al buscar libros';
        this.snackBar.open('Error al buscar libros', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}
