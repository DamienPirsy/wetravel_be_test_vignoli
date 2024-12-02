import { Field } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty, IsEmail } from 'class-validator';

export class UserResponseDto {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  id: string;

  @Field(() => String)
  @IsEmail()
  email: string;
}
