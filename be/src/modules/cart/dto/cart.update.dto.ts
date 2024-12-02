import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class CartUpdateDto {
  @Field()
  userId: string;

  @Field()
  packId: string;

  @Field(() => Int)
  @IsNumber()
  seats: number;

  @Field(() => Int)
  @IsNumber()
  amount: number;
}
