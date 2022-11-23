import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => String)
  id: string;

  @Field(() => String)
  description: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => String)
  title: string;

  @Field(() => Number)
  totalInventory: number;

  @Field(() => Boolean)
  availableForSale: boolean;

  @Field(() => String)
  updatedAt: string;
}
