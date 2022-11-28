import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Metafield {
  @Field(() => String)
  id: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  key: string;

  @Field(() => String)
  namespace: string;

  @Field(() => String)
  value: string;
}
