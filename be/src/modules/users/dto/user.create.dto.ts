import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ObjectType()
export class UserCreateDto {
  @Field(() => String)
  @IsEmail()
  email: string;
}
