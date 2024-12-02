import { Cart } from '../dto/cart.dto';

export class CartCancelledEvent {
  constructor(public cart: Cart) {}
}
