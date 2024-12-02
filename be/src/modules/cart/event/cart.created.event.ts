import { Cart } from '@prisma/client';

export class CartCreatedEvent {
  constructor(public cart: Cart) {}
}
