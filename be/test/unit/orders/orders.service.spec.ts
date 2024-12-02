import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { Order } from '@prisma/client';
import { OrderCreateDto } from '../../../src/modules/orders/dto/order.create.dto';
import { OrderResponseDto } from '../../../src/modules/orders/dto/order.response.dto';
import { OrderUpdateDto } from '../../../src/modules/orders/dto/order.update.dto';
import { OrdersService } from '../../../src/modules/orders/service/orders.service';
import { PrismaService } from '../../../src/modules/prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      order: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('order_event'),
    };

    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
        {
          provide: PinoLogger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order', async () => {
    const dto: OrderCreateDto = {
      packId: 'd408be33-aa6a-4c73-a2c8-58a70ab2ba4d',
      cartId: 'fb704887-27c2-4fb7-9061-79e4b1cb23b0',
      userId: '5cabb972-d728-4dbe-8ddf-ee2880bf8a72',
      seats: 2,
      totalPrice: 240000,
      price: 12000,
    };

    const mockOrder: OrderResponseDto = {
      id: 'bc1f5fb8-9059-438f-aeda-1297e06c4b82',
      packId: dto.packId,
      userId: dto.userId,
      seats: dto.seats,
      totalPrice: dto.totalPrice,
      orderStatus: 'PENDING',
      paymentData: null,
      createdAt: new Date(),
    };

    (prisma.order.create as jest.Mock).mockResolvedValue(mockOrder);

    const result = await service.createOrder(dto);

    expect(prisma.order.create).toHaveBeenCalledWith({
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
    expect(result).toEqual(mockOrder);
  });

  it('should update an order', async () => {
    const dto: OrderUpdateDto = {
      orderId: 'bc1f5fb8-9059-438f-aeda-1297e06c4b82',
      orderStatus: 'PAID',
      paymentData: { transactionId: 'pm_test' },
    };

    const mockUpdatedOrder: OrderResponseDto = {
      id: dto.orderId,
      packId: 'd408be33-aa6a-4c73-a2c8-58a70ab2ba4d',
      userId: '5cabb972-d728-4dbe-8ddf-ee2880bf8a7',
      seats: 2,
      totalPrice: 240000,
      orderStatus: dto.orderStatus,
      paymentData: dto.paymentData,
      createdAt: new Date(),
    };

    (prisma.order.update as jest.Mock).mockResolvedValue(mockUpdatedOrder);

    const result = await service.updateOrder(dto);

    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: dto.orderId },
      data: {
        orderStatus: dto.orderStatus,
        paymentData: dto.paymentData,
      },
    });
    expect(result).toEqual(mockUpdatedOrder);
  });

  it('should return a list of orders', async () => {
    const mockOrders: Order[] = [
      {
        id: 'bc1f5fb8-9059-438f-aeda-1297e06c4b82',
        packId: 'd408be33-aa6a-4c73-a2c8-58a70ab2ba4d',
        userId: '5cabb972-d728-4dbe-8ddf-ee2880bf8a72',
        seats: 2,
        totalPrice: 240000,
        orderStatus: 'PENDING',
        paymentData: null,
        price: 120000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'e7852b49-c799-48f0-b240-f4e702532582',
        packId: '4f4bd032-e7d4-402a-bdf6-aaf6be240d53',
        userId: '5cabb972-d728-4dbe-8ddf-ee2880bf8a72',
        seats: 1,
        totalPrice: 120000,
        price: 120000,
        orderStatus: 'PAID',
        paymentData: { transactionId: 'pm_test' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

    const result = await service.getOrders();

    expect(prisma.order.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockOrders);
  });

  it('should return orders for a specific user', async () => {
    const mockOrders: Order[] = [
      {
        id: 'bc1f5fb8-9059-438f-aeda-1297e06c4b82',
        packId: '4f4bd032-e7d4-402a-bdf6-aaf6be240d53',
        userId: '5cabb972-d728-4dbe-8ddf-ee2880bf8a72',
        seats: 2,
        totalPrice: 240000,
        price: 120000,
        orderStatus: 'PENDING',
        paymentData: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

    const result = await service.getUserOrders('5cabb972-d728-4dbe-8ddf-ee2880bf8a72');

    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: { userId: '5cabb972-d728-4dbe-8ddf-ee2880bf8a72' },
    });
    expect(result).toEqual(mockOrders);
  });
});
