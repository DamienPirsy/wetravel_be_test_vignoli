import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, Min } from 'class-validator';

@InputType()
export class PackUpdateDto {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  id: string;

  @Field(() => Int)
  @IsNotEmpty()
  @Min(1)
  seats: number;
}
