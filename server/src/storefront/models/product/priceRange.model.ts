import { Field, ObjectType } from '@nestjs/graphql';
import { MinVariantPrice } from './minVariantPrice.mode';

@ObjectType()
export class PriceRange {
  @Field(() => MinVariantPrice)
  minVariantPrice: MinVariantPrice;
}
