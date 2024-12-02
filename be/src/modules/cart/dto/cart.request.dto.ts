import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

@InputType()
export class CartRequestDto {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  packId: string;

  @Field(() => Int)
  @IsNumber()
  seats: number;

  @Field(() => String)
  @IsEmail()
  email: string;
}
