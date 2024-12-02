import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderCreateDto } from '../dto/order.create.dto';
import { OrderResponseDto } from '../dto/order.response.dto';
import { OrderUpdateDto } from '../dto/order.update.dto';
import { Order } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { OrderCreateEvent } from '../event/order.create.event';
import { OrderUpdateEvent } from '../event/order.update.event';
import { OrderCreateException } from '../exception/order.create.exception';
import { OrderUpdateException } from '../exception/order.update.exception';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class OrdersService {
  private ORDER_CREATED: string;
  private ORDER_UPDATED: string;

  constructor(
    private prisma: PrismaService,
    private readonly eventBus: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.ORDER_CREATED = this.configService.get<string>('ORDER_CREATED');
    this.ORDER_UPDATED = this.configService.get<string>('ORDER_UPDATED');
  }

  async createOrder(dto: OrderCreateDto): Promise<OrderResponseDto> {
    try {
      const order = await this.prisma.order.create({
        data: {
          packId: dto.packId,
          userId: dto.userId,
          seats: dto.seats,
          totalPrice: dto.totalPrice,
          price: dto.price,
          orderStatus: 'PENDING',
          paymentData: null,
        },
      });
      this.eventBus.emit(
        this.ORDER_CREATED,
        new OrderCreateEvent(order, dto.cartId),
      );
      return order;
    } catch (e) {
      this.logger.error(`[Oder] - Error creating order: ${e.message}`);
      throw new OrderCreateException();
    }
  }

  async updateOrder(dto: OrderUpdateDto): Promise<OrderResponseDto> {
    try {
      const order = await this.prisma.order.update({
        where: { id: dto.orderId },
        data: {
          orderStatus: dto.orderStatus || 'PAID',
          paymentData: dto.paymentData || {},
        },
      });
      this.eventBus.emit(this.ORDER_UPDATED, new OrderUpdateEvent(order));
      return order;
    } catch (e) {
      this.logger.error(`[Oder] - Error updating order: ${e.message}`);
      throw new OrderUpdateException();
    }
  }

  async getOrders(): Promise<Order[]> {
    return await this.prisma.order.findMany();
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await this.prisma.order.findMany({
      where: { userId },
    });
  }
}
