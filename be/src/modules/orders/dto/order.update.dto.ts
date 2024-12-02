import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class OrderUpdateDto {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @Field()
  @IsOptional()
  @IsIn(Object.values(OrderStatus))
  orderStatus?: OrderStatus;

  @Field(() => GraphQLJSON)
  @IsOptional()
  paymentData: JsonValue;
}
