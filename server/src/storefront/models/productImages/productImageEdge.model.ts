import { Field, ObjectType } from '@nestjs/graphql';
import { ProductImage } from '../productImage/productImage.model';

@ObjectType()
export class ProductImageEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => ProductImage)
  node: ProductImage;
}
