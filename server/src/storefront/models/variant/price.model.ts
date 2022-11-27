import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Price {
  @Field(() => Number)
  amount: number;
}
