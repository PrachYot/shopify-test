import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VariantImage {
  @Field(() => String)
  url: string;
}
