import { Cart } from '../dto/cart.dto';

export class CartUpdatedEvent {
  constructor(
    public cart: Cart,
    public data: Record<string, any>,
  ) {}
}
