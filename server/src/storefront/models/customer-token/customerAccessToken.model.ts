import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CustomerAccessToken {
  @Field(() => String)
  accessToken: string;

  @Field(() => Date)
  expiresAt: Date;
}
