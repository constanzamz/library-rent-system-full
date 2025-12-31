import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    ClientForm,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  private clientsService = inject(ClientsService);

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
