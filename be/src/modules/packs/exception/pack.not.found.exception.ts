import { NotFoundException } from '@nestjs/common';

export class PackNotFoundException extends NotFoundException {
  constructor() {
    super('Pack not found');
  }
}
