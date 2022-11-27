import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/utils/models/pageInfo.model';
import { VariantEdge } from './variantEdge.model';

@ObjectType()
export class Variants {
  @Field(() => [VariantEdge])
  edges: VariantEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
