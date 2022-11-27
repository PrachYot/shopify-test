import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CustomerCreateInput {
  @Field(() => Boolean, { nullable: true })
  acceptsMarketing?: boolean | null;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  firstName?: string | null;

  @Field(() => String, { nullable: true })
  lastName?: string | null;

  @Field(() => String, { nullable: true })
  phone?: string | null;

  @Field(() => String)
  password: string;

  @Field(() => String)
  passwordConfirmation: string;
}
