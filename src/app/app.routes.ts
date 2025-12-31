import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Books } from './books/books';
import { Clients } from './clients/clients';
import { Orders } from './orders/orders';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'books', component: Books },
  { path: 'clients', component: Clients },
  { path: 'orders', component: Orders },

  {
    path: 'orders-list',
    loadComponent: () =>
      import('./orders/orders-list/orders-list')
        .then(m => m.OrdersList),
  },

  {
  path: 'search-dni',
  loadComponent: () =>
    import('./search/search-by-dni/search-by-dni')
      .then(m => m.SearchByDni),
},

];


