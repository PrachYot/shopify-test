import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Attribute {
  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;
}
