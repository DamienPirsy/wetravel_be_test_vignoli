import { Module } from '@nestjs/common';
import { PacksService } from './service/packs.service';
import { PacksResolver } from './resolver/packs.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { CartEventsListener } from './listener/cart.events.listener';

@Module({
  providers: [PacksService, PacksResolver, PrismaService, CartEventsListener],
  exports: [PacksService],
})
export class PacksModule {}
