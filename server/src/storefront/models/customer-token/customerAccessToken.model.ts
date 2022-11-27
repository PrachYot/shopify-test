import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CustomerAccessToken {
  @Field(() => String, { nullable: true })
  accessToken: string;

  @Field(() => Date, { nullable: true })
  expiresAt: Date;
}
