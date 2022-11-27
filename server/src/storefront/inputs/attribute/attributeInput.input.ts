import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AttributeInput {
  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;
}
