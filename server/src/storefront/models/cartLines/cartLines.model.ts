import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/utils/models/pageInfo.model';
import { CartLineEdge } from './cartLineEdge.model';

@ObjectType()
export class CartLines {
  @Field(() => [CartLineEdge])
  edges: CartLineEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
