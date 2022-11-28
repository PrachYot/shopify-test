import { Field, ObjectType } from '@nestjs/graphql';
import { Attribute } from '../attribute/attribute.model';
import { Money } from '../cart/money.model';
import { Variant } from '../variant/variant.model';

@ObjectType()
export class CheckoutLine {
  @Field(() => [Attribute])
  customAttributes: Attribute[];

  @Field(() => String)
  id: string;

  @Field(() => Number)
  quantity: number;

  @Field(() => String)
  title: string;

  @Field(() => Money)
  unitPrice: Money;

  @Field(() => Variant)
  variant: Variant;
}
