import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { OrdersService } from '../service/orders.service';
import { OrderResponseDto } from '../dto/order.response.dto';
import { OrderUpdateDto } from '../dto/order.update.dto';
import { OrderCreateDto } from '../dto/order.create.dto';
import { Order } from '../dto/order.dto';

@Resolver(() => OrderResponseDto)
export class OrderResolver {
  constructor(private readonly orderService: OrdersService) {}

  @Query(() => [Order], { name: 'getAllOrders' })
  async getAllOrders(): Promise<Order[]> {
    return await this.orderService.getOrders();
  }

  @Query(() => [Order], { name: 'getUserOrders' })
  async getUserOrders(@Args('userId') userId: string): Promise<Order[]> {
    return await this.orderService.getUserOrders(userId);
  }

  @Mutation(() => OrderResponseDto)
  async createOrder(
    @Args('orderCreate') orderCreateReq: OrderCreateDto,
  ): Promise<OrderResponseDto> {
    return await this.orderService.createOrder(orderCreateReq);
  }

  @Mutation(() => OrderResponseDto)
  async updateOrder(
    @Args('orderUpdate') orderUpdateReq: OrderUpdateDto,
  ): Promise<OrderResponseDto> {
    return await this.orderService.updateOrder(orderUpdateReq);
  }
}
