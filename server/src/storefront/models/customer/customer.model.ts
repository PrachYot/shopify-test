import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Customer {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => Boolean, { nullable: true })
  acceptsMarketing: boolean;

  @Field(() => String, { nullable: true })
  displayName: string;
}
