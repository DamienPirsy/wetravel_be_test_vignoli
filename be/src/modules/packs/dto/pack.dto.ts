import { Field, ObjectType, Int } from '@nestjs/graphql';
import { JsonValue } from '@prisma/client/runtime/library';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class Pack {
  @Field()
  id: string;

  @Field()
  slug: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  startingDate: string;

  @Field()
  endingDate: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  maxSeats: number;

  @Field(() => Int)
  freeSeats: number;

  @Field(() => GraphQLJSON) // type json! o usare string?
  moods: JsonValue;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}
