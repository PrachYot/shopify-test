import { Field, InputType } from '@nestjs/graphql';
import { AttributeInput } from '../attribute/attributeInput.input';

@InputType()
export class CartLineInput {
  @Field(() => [AttributeInput], { nullable: true })
  attributes: AttributeInput[];

  @Field(() => String)
  merchandiseId: string;

  @Field(() => Number, { nullable: true })
  quantity: number;
}
