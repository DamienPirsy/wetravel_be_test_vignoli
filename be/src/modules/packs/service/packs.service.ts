import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Pack } from '@prisma/client';
import { PackUpdateDto } from '../dto/pack.update.dto';
import { PinoLogger } from 'nestjs-pino';
import { PackNotFoundException } from '../exception/pack.not.found.exception';

@Injectable()
export class PacksService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {}

  async getPackages(): Promise<Pack[]> {
    return await this.prisma.pack.findMany();
  }

  async packageById(id: string): Promise<Pack> {
    const pack = await this.prisma.pack.findUnique({
      where: { id },
    });
    if (!pack) {
      throw new PackNotFoundException();
    }
    return pack;
  }

  async updatePackage(dto: PackUpdateDto): Promise<void> {
    await this.prisma.pack.update({
      where: { id: dto.id },
      data: { freeSeats: dto.seats },
    });
  }

  async removeSeats(packId: string, seats: number): Promise<void> {
    this.logger.debug(`Removing  ${seats} seats`);
    await this.prisma.pack.update({
      where: { id: packId },
      data: {
        freeSeats: {
          decrement: seats,
        },
      },
    });
  }

  async restoreSeats(packId: string, seats: number): Promise<void> {
    this.logger.debug(`Adding back ${seats} seats`);
    await this.prisma.pack.update({
      where: { id: packId },
      data: {
        freeSeats: {
          increment: seats,
        },
      },
    });
  }
}
