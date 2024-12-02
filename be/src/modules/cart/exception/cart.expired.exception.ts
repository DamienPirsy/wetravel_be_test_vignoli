import { BadRequestException } from '@nestjs/common';

export class CartExpiredException extends BadRequestException {
  constructor() {
    super('Cart has expired');
  }
}
