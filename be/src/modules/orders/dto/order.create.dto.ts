import { InputType, Field, Int } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty, IsInt } from 'class-validator';

@InputType()
export class OrderCreateDto {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  packId: string;

  @Field()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsUUID()
  @IsNotEmpty()
  cartId: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  seats: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  totalPrice: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  price: number;
}
