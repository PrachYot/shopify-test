import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Cart {
  @Field(() => String)
  id: string;
}
