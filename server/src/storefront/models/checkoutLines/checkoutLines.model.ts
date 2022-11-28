import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/utils/models/pageInfo.model';
import { CheckoutLineEdge } from './checkoutLineEdge.model';

@ObjectType()
export class CheckoutLines {
  @Field(() => [CheckoutLineEdge])
  edges: CheckoutLineEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
