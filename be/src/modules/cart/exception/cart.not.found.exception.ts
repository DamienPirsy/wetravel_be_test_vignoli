import { NotFoundException } from '@nestjs/common';

export class CartNotFoundException extends NotFoundException {
  constructor() {
    super('Cart not found');
  }
}
