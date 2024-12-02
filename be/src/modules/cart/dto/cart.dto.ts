import { Field, ObjectType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

@ObjectType()
export class Cart {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  id: string;

  @IsUUID()
  @IsNotEmpty()
  @Field()
  packId: string;

  @IsUUID()
  @IsNotEmpty()
  @Field()
  userId: string;

  @Field(() => Int)
  @IsNumber()
  seats: number;

  @Field(() => Int)
  @IsNumber()
  amount: number;

  @Field()
  createdAt: Date;

  @Field()
  expiresAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
