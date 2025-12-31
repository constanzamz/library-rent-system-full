import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrdersService } from '../../shared/services/orders.service';
import { ClientsService } from '../../shared/services/clients.service';

import { Order } from '../../shared/models/order.model';
import { Client } from '../../shared/models/client.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSlideToggleModule,
    DatePipe,
  ],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.css',
})
export class OrdersList implements OnInit {
  private ordersService = inject(OrdersService);
  private clientsService = inject(ClientsService);
  private snackBar = inject(MatSnackBar);

  orders: Order[] = [];
  clients: Client[] = [];

  clientById = new Map<number, Client>();
  dniSearch: string = '';
  showOnlyActive: boolean = false;

  ngOnInit(): void {
    this.loadClients();
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getAll().subscribe({
      next: (res) => {
        this.orders = res.data;
      },
    });
  }

  loadClients() {
    this.clientsService.getAll().subscribe({
      next: (res) => {
        this.clients = res.data;
        this.clientById = new Map(
          this.clients.map(c => [c.id!, c])
        );
      },
    });
  }

  get filteredOrders(): Order[] {
    let filtered = this.orders;

    const search = this.dniSearch.trim();
    if (search) {
      filtered = filtered.filter(o => {
        const client = this.clientById.get(o.clientId);
        return client?.dni?.includes(search);
      });
    }

    if (this.showOnlyActive) {
      filtered = filtered.filter(o => !o.isReturned);
    }

    return filtered;
  }

  getClientLabel(clientId: number): string {
    const c = this.clientById.get(clientId);
    if (!c) return `Cliente ${clientId}`;
    return `${c.nombres} ${c.apellidos} (${c.dni})`;
  }

  returnOrder(orderId: number) {
    if (!confirm('¿Marcar pedido como devuelto?')) return;

    this.ordersService.return(orderId).subscribe({
      next: () => {
        this.snackBar.open('Pedido marcado como devuelto', 'Cerrar', {
          duration: 3000,
        });
        this.loadOrders();
      },
      error: () => {
        this.snackBar.open('Error al marcar el pedido como devuelto', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}
