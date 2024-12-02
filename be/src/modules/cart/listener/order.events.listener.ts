import { OnEvent } from '@nestjs/event-emitter';
import events from '../../../config/events';
import { Injectable } from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { OrderCreateEvent } from 'src/modules/orders/event/order.create.event';

const { ORDER_CREATED } = events();

@Injectable()
export class OrderEventsListener {
  constructor(private readonly cartService: CartService) {}

  @OnEvent(ORDER_CREATED)
  async onOrderCreate({ cartId }: OrderCreateEvent) {
    // cancello il carrello
    await this.cartService.clearCart(cartId);
  }
}
