import { Test, TestingModule } from '@nestjs/testing';
import { Pack } from '@prisma/client';
import { PackUpdateDto } from '../../../src/modules/packs/dto/pack.update.dto';
import { PacksService } from '../../../src/modules/packs/service/packs.service';
import { PrismaService } from '../../../src/modules/prisma/prisma.service';
import { PinoLogger } from 'nestjs-pino';
import { PackNotFoundException } from '../../../src/modules/packs/exception/pack.not.found.exception';

describe('PacksService', () => {
  let service: PacksService;
  let prisma: PrismaService;
  let mockPacks: Pack[];

  beforeAll(() => {
    mockPacks = [
      {
        id: 'd408be33-aa6a-4c73-a2c8-58a70ab2ba4d',
        slug: 'jordan-360',
        name: 'Jordan 360°',
        description:
          'Jordan 360°: the perfect tour to discover the suggestive Wadi Rum desert, the ancient beauty of Petra, and much more.\n\nVisiting Jordan is one of the most fascinating things that everyone has to do once in their life.You are probably wondering "Why?". Well, that\'s easy: because this country keeps several passions! During our tour in Jordan, you can range from well-preserved archaeological masterpieces to trekkings, from natural wonders excursions to ancient historical sites, from camels trek in the desert to some time to relax.\nDo not forget to float in the Dead Sea and enjoy mineral-rich mud baths, it\'s one of the most peculiar attractions. It will be a tour like no other: this beautiful country leaves a memorable impression on everyone.',
        startingDate: '2021-11-01',
        endingDate: '2021-11-09',
        price: 199900,
        moods: {
          nature: 80,
          relax: 20,
          history: 90,
          culture: 30,
          party: 10,
        },
        maxSeats: 0,
        freeSeats: 0,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      },
      {
        id: '4f4bd032-e7d4-402a-bdf6-aaf6be240d53',
        slug: 'iceland-hunting-northern-lights',
        name: 'Iceland: hunting for the Northern Lights',
        description:
          "Why visit Iceland in winter? Because it is between October and March that this land offers the spectacle of the Northern Lights, one of the most incredible and magical natural phenomena in the world, visible only near the earth's two magnetic poles. Come with us on WeRoad to explore this land of ice and fire, full of contrasts and natural variety, where the energy of waterfalls and geysers meets the peace of the fjords... And when the ribbons of light of the aurora borealis twinkle in the sky before our enchanted eyes, we will know that we have found what we were looking for.",
        startingDate: '2021-11-01',
        endingDate: '2021-11-08',
        price: 199900,
        moods: {
          nature: 100,
          relax: 30,
          history: 10,
          culture: 20,
          party: 10,
        },
        maxSeats: 0,
        freeSeats: 0,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      },
    ];
  });

  beforeEach(async () => {
    const mockPrismaService = {
      pack: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacksService,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: PinoLogger,
          useValue: {
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PacksService>(PacksService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of packages', async () => {
    (prisma.pack.findMany as jest.Mock).mockResolvedValue(mockPacks);

    const result = await service.getPackages();

    expect(prisma.pack.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockPacks);
  });

  it('should return a package by ID', async () => {
    (prisma.pack.findUnique as jest.Mock).mockResolvedValue(mockPacks[0]);

    const result = await service.packageById(
      'd408be33-aa6a-4c73-a2c8-58a70ab2ba4d',
    );

    expect(prisma.pack.findUnique).toHaveBeenCalledWith({
      where: { id: 'd408be33-aa6a-4c73-a2c8-58a70ab2ba4d' },
    });
    expect(result).toEqual(mockPacks[0]);
  });

  it('should throw packNotFoundException if not pack is found by ID', async () => {
    (prisma.pack.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.packageById('xxxxxxxxxx')).rejects.toThrow(PackNotFoundException);
    expect(prisma.pack.findUnique).toHaveBeenCalledWith({
      where: { id: 'xxxxxxxxxx' },
    });
  });


  it('should update the package with new seats', async () => {
    const dto: PackUpdateDto = { id: '1', seats: 20 };

    (prisma.pack.update as jest.Mock).mockResolvedValue({
      id: dto.id,
      freeSeats: dto.seats,
    } as Pack);

    await service.updatePackage(dto);

    expect(prisma.pack.update).toHaveBeenCalledWith({
      where: { id: dto.id },
      data: { freeSeats: dto.seats },
    });
  });

  it('should remove seats from a package', async () => {
    const packId = 'd408be33-aa6a-4c73-a2c8-58a70ab2ba4d';
    const seats = 2;

    (prisma.pack.update as jest.Mock).mockResolvedValue({
      id: packId,
      freeSeats: 5,
    });

    await service.removeSeats(packId, seats);

    expect(prisma.pack.update).toHaveBeenCalledWith({
      where: { id: packId },
      data: {
        freeSeats: {
          decrement: seats,
        },
      },
    });
  });

  it('should restore seats to a package', async () => {
    const packId = '1';
    const seats = 2;

    (prisma.pack.update as jest.Mock).mockResolvedValue({
      id: packId,
      freeSeats: 5,
    });

    await service.restoreSeats(packId, seats);

    expect(prisma.pack.update).toHaveBeenCalledWith({
      where: { id: packId },
      data: {
        freeSeats: {
          increment: seats,
        },
      },
    });
  });
});
