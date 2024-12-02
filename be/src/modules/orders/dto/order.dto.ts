import { Field, ObjectType, Int } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class Order {
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
  price: number;

  @Field(() => Int)
  @IsNumber()
  seats: number;

  @Field(() => Int)
  @IsNumber()
  totalPrice: number;

  @Field(() => GraphQLJSON, { nullable: true })
  paymentData?: JsonValue;

  @IsNotEmpty()
  @Field()
  orderStatus: OrderStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt?: Date;
}
