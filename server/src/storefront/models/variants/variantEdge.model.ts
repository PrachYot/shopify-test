import { Field, ObjectType } from '@nestjs/graphql';
import { Variant } from '../variant/variant.model';

@ObjectType()
export class VariantEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => Variant)
  node: Variant;
}
