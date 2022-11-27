import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Money {
  @Field(() => Number)
  amount: number;
}
