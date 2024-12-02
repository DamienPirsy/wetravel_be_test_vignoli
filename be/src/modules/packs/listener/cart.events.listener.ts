import { OnEvent } from '@nestjs/event-emitter';
import events from 'src/config/events';
import { PacksService } from '../service/packs.service';
import { Injectable } from '@nestjs/common';
import { CartCancelledEvent } from '../../cart/event/cart.cancelled.event';
import { CartCreatedEvent } from '../../cart/event/cart.created.event';
import { CartUpdatedEvent } from 'src/modules/cart/event/cart.updated.event';

const { CART_CREATED, CART_CANCELLED, CART_UPDATED } = events();

@Injectable()
export class CartEventsListener {
  constructor(private readonly packsService: PacksService) {}

  @OnEvent(CART_CREATED)
  async onCartCreated({ cart }: CartCreatedEvent) {
    // decremento il numero di posti disponibili
    await this.packsService.removeSeats(cart.packId, cart.seats);
  }

  @OnEvent(CART_CANCELLED)
  async onCartCancelled({ cart }: CartCancelledEvent) {
    await this.packsService.restoreSeats(cart.packId, cart.seats);
  }

  @OnEvent(CART_UPDATED)
  async onCartUpdated({ cart, data }: CartUpdatedEvent) {
    if (data.seats !== cart.seats) {
      await this.packsService.restoreSeats(cart.packId, cart.seats); // aggiungo quelli originali
      await this.packsService.removeSeats(cart.packId, data.seats); // rimuovo il nuovo valore
    }
  }
}
