import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/modules/prisma/prisma.service';
import { UserCreateDto } from '../../../src/modules/users/dto/user.create.dto';
import { UserResponseDto } from '../../../src/modules/users/dto/user.response.dto';
import { UsersService } from '../../../src/modules/users/service/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user if doesnt exists', async () => {
    const dto: UserCreateDto = { email: 'mario.rossi@example.org' };

    (prisma.user.upsert as jest.Mock).mockResolvedValue({
      id: '1',
      email: dto.email,
    } as UserResponseDto);

    const result = await service.findOrCreate(dto);

    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { email: dto.email },
      create: { email: dto.email },
      update: {},
    });
    expect(result).toEqual({ id: '1', email: 'mario.rossi@example.org' });
  });

  it('should return existing user if it already exists', async () => {
    const dto: UserCreateDto = { email: 'mario.rossi@example.org' };

    (prisma.user.upsert as jest.Mock).mockResolvedValue({
      id: '1',
      email: dto.email,
    } as UserResponseDto);

    const result = await service.findOrCreate(dto);

    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { email: dto.email },
      create: { email: dto.email },
      update: {},
    });
    expect(result).toEqual({ id: '1', email: 'mario.rossi@example.org' });
  });
});
