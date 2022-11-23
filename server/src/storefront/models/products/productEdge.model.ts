import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../product/product.model';

@ObjectType()
export class ProductEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => Product)
  node: Product;
}
