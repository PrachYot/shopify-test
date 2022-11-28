import { Field, ObjectType } from '@nestjs/graphql';
import { CheckoutLine } from '../checkoutLine/checkoutLine.model';

@ObjectType()
export class CheckoutLineEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => CheckoutLine)
  node: CheckoutLine;
}
