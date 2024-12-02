import { ObjectType, Field, Int } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsUUID } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class OrderResponseDto {
  @IsUUID()
  @Field(() => String)
  id: string;

  @Field(() => String)
  packId: string;

  @Field(() => String)
  userId: string;

  @Field(() => Int)
  seats: number;

  @Field(() => Int)
  totalPrice: number;

  @Field()
  orderStatus: OrderStatus;

  @Field(() => GraphQLJSON, { nullable: true })
  paymentData?: JsonValue;

  @Field(() => Date)
  createdAt: Date;
}
