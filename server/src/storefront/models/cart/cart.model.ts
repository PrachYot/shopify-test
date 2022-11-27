import { Field, ObjectType } from '@nestjs/graphql';
import { CartLines } from '../cartLines/cartLines.model';
import { CartCost } from './cartCost.model';

@ObjectType()
export class Cart {
  @Field(() => String)
  id: string;

  @Field(() => String)
  checkoutUrl: string;

  @Field(() => Number)
  totalQuantity: number;

  @Field(() => CartCost)
  cost: CartCost;

  @Field(() => CartLines, { nullable: true })
  lines: CartLines;
}
