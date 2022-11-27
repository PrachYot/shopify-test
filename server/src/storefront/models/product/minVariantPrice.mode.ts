import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MinVariantPrice {
  @Field(() => String)
  amount: string;
}
