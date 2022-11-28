import { Field, ObjectType } from '@nestjs/graphql';
import { Attribute } from '../attribute/attribute.model';
import { Money } from '../cart/money.model';
import { CheckoutLines } from '../checkoutLines/checkoutLines.model';

@ObjectType()
export class Checkout {
  @Field(() => String)
  id: string;

  @Field(() => [Attribute], { nullable: true })
  attributes: Attribute[];

  @Field(() => String)
  email: string;

  @Field(() => Money)
  lineItemsSubtotalPrice: Money;

  @Field(() => String, { nullable: true })
  note: string;

  @Field(() => Boolean)
  ready: boolean;

  @Field(() => Money)
  subtotalPrice: Money;

  @Field(() => Money)
  totalPrice: Money;

  @Field(() => CheckoutLines)
  lineItems: CheckoutLines;
}
