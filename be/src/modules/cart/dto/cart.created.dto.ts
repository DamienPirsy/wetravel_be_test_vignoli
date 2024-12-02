import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CartCreatedDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  packId: string;

  @IsInt()
  seats: number;

  @IsInt()
  amount: number;

  @IsNotEmpty()
  expiresAt: Date;

  public static fromRequest(payload: any) {
    const dto = new CartCreatedDto();
    dto.userId = payload.userId;
    dto.seats = payload.seats;
    dto.amount = payload.amount;
    dto.packId = payload.packId;
    dto.expiresAt = payload.expiresAt;
    return dto;
  }
}
