import { Order } from '@prisma/client';

export class OrderCreateEvent {
  constructor(
    public order: Order,
    public cartId: string,
  ) {}
}
