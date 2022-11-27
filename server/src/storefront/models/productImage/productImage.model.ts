import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductImage {
  @Field(() => String)
  url: string;
}
