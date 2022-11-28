import { Field, ObjectType } from '@nestjs/graphql';
import { Money } from '../cart/money.model';

@ObjectType()
export class CartLineCost {
  @Field(() => Money)
  amountPerQuantity: Money;

  @Field(() => Money, { nullable: true })
  compareAtAmountPerQuantity: Money;

  @Field(() => Money)
  subtotalAmount: Money;

  @Field(() => Money)
  totalAmount: Money;
}
