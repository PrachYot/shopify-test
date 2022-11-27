import { Field, ObjectType } from '@nestjs/graphql';
import { Price } from './price.model';
import { VariantImage } from './variantImage.model';

@ObjectType()
export class Variant {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => Price)
  priceV2: Price;

  @Field(() => VariantImage)
  image: VariantImage;
}
