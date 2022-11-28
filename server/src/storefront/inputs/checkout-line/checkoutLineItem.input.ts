import { Field, InputType } from '@nestjs/graphql';
import { AttributeInput } from 'src/storefront/inputs/attribute/attributeInput.input';

@InputType()
export class CheckoutLineItemInput {
  @Field(() => [AttributeInput])
  customAttributes: AttributeInput[];

  @Field(() => String)
  variantId: string;

  @Field(() => Number)
  quantity: number;
}
