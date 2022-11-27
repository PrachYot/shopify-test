import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/utils/models/pageInfo.model';
import { ProductImageEdge } from './productImageEdge.model';

@ObjectType()
export class ProductImages {
  @Field(() => [ProductImageEdge])
  edges: ProductImageEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
