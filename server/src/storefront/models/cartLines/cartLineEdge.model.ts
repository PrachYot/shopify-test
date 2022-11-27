import { Field, ObjectType } from '@nestjs/graphql';
import { CartLine } from '../cartLine/cartLine.mode';

@ObjectType()
export class CartLineEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => CartLine)
  node: CartLine;
}
