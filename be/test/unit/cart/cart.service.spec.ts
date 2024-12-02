import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/modules/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { CartExpiredException } from '../../../src/modules/cart/exception/cart.expired.exception';
import { CartNotFoundException } from '../../../src/modules/cart/exception/cart.not.found.exception';
import { CartService } from '../../../src/modules/cart/service/cart.service';

describe('CartService', () => {
  let service: CartService;
  let prisma: PrismaService;
  const packId: string = 'd408be33-aa6a-4c73-a2c8-58a70ab2YYYY';
  const userId: string = 'd408be33-aa6a-4c73-a2c8-58a70ab2XXXX';
  const cartId: string = '9d12588c-a991-4aa5-8753-56c0248c017d';

  beforeEach(async () => {
    const mockPrismaService = {
      cart: {
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const mockEventBus = {
      emit: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        const mockConfig = {
          CART_CREATED: 'cart.created',
          CART_UPDATED: 'cart.updated',
          CART_CANCELLED: 'cart.cancelled',
        };
        return mockConfig[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventEmitter2, useValue: mockEventBus },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new cart if none exists', async () => {
    (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.cart.create as jest.Mock).mockResolvedValue({
      id: cartId,
      userId: userId,
      packId: packId,
      amount: 240000,
      seats: 2,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    } as any); 

    const result = await service.createOrUpdateCart({
      userId: userId,
      amount: 240000,
      seats: 2,
      packId: packId,
    });

    expect(prisma.cart.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: userId,
        packId: packId,
        amount: 240000,
        seats: 2,
      }),
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: cartId,
        userId: userId,
        packId: packId,
      }),
    );
  });

  it('should update an existing cart if it exists and is not expired', async () => {
    const existingCart = {
      id: cartId,
      userId: userId,
      packId: packId,
      amount: 120000,
      seats: 1,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Not expired
    };

    (prisma.cart.findUnique as jest.Mock).mockResolvedValue(existingCart); 
    (prisma.cart.update as jest.Mock).mockResolvedValue({
      ...existingCart,
      amount: 240000,
      seats: 2,
    } as any);

    const result = await service.createOrUpdateCart({
      userId: userId,
      amount: 240000,
      seats: 2,
      packId: packId,
    });

    expect(prisma.cart.update).toHaveBeenCalledWith({
      where: { id: existingCart.id },
      data: {
        amount: 240000,
        seats: 2,
        packId: packId,
      },
    });
    expect(result).toEqual(
      expect.objectContaining({
        amount: 240000,
        seats: 2,
      }),
    );
  });

  it('should throw CartExpiredException if cart is expired', async () => {
    const expiredCart = {
      id: cartId,
      userId: userId,
      packId: packId,
      amount: 120000,
      seats: 1,
      expiresAt: new Date(Date.now() - 5 * 60 * 1000), // Date in the past so it's expired
    };

    (prisma.cart.findUnique as jest.Mock).mockResolvedValue(expiredCart); 

    await expect(
      service.createOrUpdateCart({
        userId: userId,
        amount: 240000,
        seats: 2,
        packId: packId,
      }),
    ).rejects.toThrow(CartExpiredException);

    expect(prisma.cart.delete).toHaveBeenCalledWith({
      where: { id: expiredCart.id },
    });
  });

  it('should return a cart if it exists', async () => {
    const cart = {
      id: cartId,
      userId: userId,
      packId: packId,
      amount: 120000,
      seats: 1,
      expiresAt: new Date(),
    };
    (prisma.cart.findUnique as jest.Mock).mockResolvedValue(cart);

    const result = await service.getCartById(cartId);
    expect(result).toEqual(cart);
  });

  it('should throw CartNotFoundException if the cart does not exist', async () => {
    (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.getCartById('1')).rejects.toThrow(
      CartNotFoundException,
    );
  });
});
