import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/utils/models/pageInfo.model';
import { ProductEdge } from './productEdge.model';

@ObjectType()
export class Products {
  @Field(() => [ProductEdge])
  edges: ProductEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
