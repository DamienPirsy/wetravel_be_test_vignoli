import { BadRequestException } from '@nestjs/common';

export class PackNotAvailableException extends BadRequestException {
  constructor() {
    super('Not enough free seats available');
  }
}
