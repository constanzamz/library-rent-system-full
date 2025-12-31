import { Book } from './book.model';

export interface Order {
  id: number;
  fechaPedido?: string;
  clientId: number;
  isReturned: boolean;
  books?: Book[];
}
