import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserCreateDto } from '../dto/user.create.dto';
import { UserResponseDto } from '../dto/user.response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(dto: UserCreateDto): Promise<UserResponseDto> {
    // this is like a "find and create"
    return await this.prisma.user.upsert({
      where: { email: dto.email },
      create: { email: dto.email },
      update: {},
    });
  }
}
