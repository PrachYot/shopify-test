import { Field, ObjectType } from '@nestjs/graphql';
import { Attribute } from '../attribute/attribute.model';
import { Variant } from '../variant/variant.model';
import { CartLineCost } from './cartLineCost.model';

@ObjectType()
export class CartLine {
  @Field(() => [Attribute])
  attributes: Attribute[];

  @Field(() => String)
  id: string;

  @Field(() => Number)
  quantity: number;

  @Field(() => CartLineCost)
  cost: CartLineCost;

  @Field(() => Variant)
  merchandise: Variant;
}
