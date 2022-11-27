import { Field, ObjectType } from '@nestjs/graphql';
import { CustomerAccessToken } from './customerAccessToken.model';

@ObjectType()
export class CustomerToken {
  @Field(() => CustomerAccessToken)
  customerAccessToken: CustomerAccessToken;
}
