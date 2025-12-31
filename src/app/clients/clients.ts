import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Client } from '../shared/models/client.model';
import { ClientsService } from '../shared/services/clients.service';
import { ClientForm } from './client-form/client-form';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClientForm,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  private clientsService = inject(ClientsService);
  private snackBar = inject(MatSnackBar);

  searchTerm: string = '';
  searching = false;
  private searchTimer: any = null;

  clients: Client[] = [];
  selectedClient: Client | null = null;
  displayedColumns: string[] = [
    'nombres',
    'apellidos',
    'dni',
    'edad',
    'acciones',
  ];

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientsService.getAll().subscribe({
      next: (response) => {
        this.clients = response.data;
      },
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;

    // Si está vacío, volvemos al listado completo
    if (!value || value.trim().length === 0) {
      clearTimeout(this.searchTimer);
      this.loadClients();
      return;
    }

    // (opcional) mínimo 2 letras para evitar “spam” al back
    if (value.trim().length < 2) {
      return;
    }

    clearTimeout(this.searchTimer);
    this.searching = true;

    this.searchTimer = setTimeout(() => {
      this.clientsService.searchByName(value.trim(), 20).subscribe({
        next: (res) => {
          this.clients = res.data ?? [];
          this.searching = false;
        },
        error: () => {
          this.searching = false;
          this.snackBar.open('Error al buscar clientes', 'Cerrar', { duration: 3000 });
        },
      });
    }, 300);
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadClients();
  }

  newClient() {
  this.selectedClient = {
    nombres: '',
    apellidos: '',
    dni: '',
    edad: 0,
  };
}

  editClient(client: Client) {
    this.selectedClient = { ...client };
  }

  saveClient(client: Client) {
    if (client.id) {
      this.clientsService.update(client.id, client).subscribe({
        next: () => {
          this.selectedClient = null;
          this.loadClients();
        },
      });
    } else {
      this.clientsService.create(client).subscribe({
        next: () => {
          this.selectedClient = null;
          this.loadClients();
        },
      });
    }
  }

  deleteClient(id: number) {
    if (!confirm('¿Eliminar cliente?')) return;

    this.clientsService.delete(id).subscribe({
      next: () => this.loadClients(),
    });
  }
}
