import { Field, ObjectType } from '@nestjs/graphql';
import { Money } from './money.model';

@ObjectType()
export class CartCost {
  @Field(() => Money)
  checkoutChargeAmount: Money;

  @Field(() => Money)
  subtotalAmount: Money;

  @Field(() => Money)
  totalAmount: Money;
}
