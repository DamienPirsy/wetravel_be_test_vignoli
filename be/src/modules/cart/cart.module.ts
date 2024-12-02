import { Module } from '@nestjs/common';
import { CartService } from './service/cart.service';
import { CartResolver } from './resolver/cart.resolver';
import { UsersModule } from '../users/users.module';
import { PacksModule } from '../packs/packs.module';
import { OrderEventsListener } from './listener/order.events.listener';

@Module({
  imports: [UsersModule, PacksModule],
  providers: [CartService, CartResolver, OrderEventsListener],
  exports: [CartService],
})
export class CartModule {}
