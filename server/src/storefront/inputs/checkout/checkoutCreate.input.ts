import { Field, InputType } from '@nestjs/graphql';
import { CheckoutLineItemInput } from '../checkout-line/checkoutLineItem.input';

@InputType()
export class CheckoutCreateInput {
  @Field(() => String)
  email: string;

  @Field(() => [CheckoutLineItemInput])
  lineItems: CheckoutLineItemInput[];

  @Field(() => String, { nullable: true })
  note: string;
}
