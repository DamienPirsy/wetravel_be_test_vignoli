import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from './service/orders.service';
import { OrderResolver } from './resolver/orders.resolver';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CartModule],
  providers: [OrdersService, OrderResolver, PrismaService],
  exports: [],
})
export class OrdersModule {}
