import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Customer {
  @Field(() => String)
  id: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => Boolean)
  acceptsMarketing: boolean;

  @Field(() => String)
  displayName: string;
}
