import { gql, useMutation, useQuery } from '@apollo/client';
import _ from 'lodash';
import { ReactElement } from 'react';
import Button from '../components/buttons/button/v1';
import Badge from '../components/elements/badge/v1';
import Thumbnail from '../components/thumbnails/thumbnail/v1';
import ThumbnailContainer from '../components/thumbnails/thumbnailContainer/v1';
import Layout from '../layouts/v1';
import { tokenGet } from '../utils/localStorage/v1';

const PRODUCTS = gql`
  query Products {
    products {
      edges {
        node {
          id
          title
          description
          tags
          images {
            edges {
              node {
                url
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
            }
          }
          variants {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                }
                image {
                  url
                }
              }
            }
            pageInfo {
              endCursor
              hasNextPage
              hasPreviousPage
              startCursor
            }
          }
        }
      }
    }
  }
`;

const CART_LINE_ADD = gql`
  mutation Mutation($cartId: String!, $cartLineData: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, cartLineData: $cartLineData) {
      id
    }
  }
`;

function Home(): ReactElement {
  const { data } = useQuery(PRODUCTS);
  const [cartLinesAdd] = useMutation(CART_LINE_ADD);

  const handleAddToCart = async (merchandiseId: string) => {
    const cartId = tokenGet('cartId');

    const res = await cartLinesAdd({
      variables: {
        cartId,
        cartLineData: [
          {
            merchandiseId,
            quantity: 1,
          },
        ],
      },
    }).catch(() => null);

    if (!res || !res.data) {
      return;
    }

    alert('Added to cart!');

    window.location.reload();
  };

  return (
    <div>
      {_.reverse(data?.products?.edges)?.map(({ node: product }: { node: any }) => (
        <ThumbnailContainer key={product.id} title={product.title}>
          {product.variants.edges.map(({ node: variant }: { node: any }) => (
            <div key={variant.id} className='space-y-2'>
              <Thumbnail
                imageUrl={variant.image.url}
                title={product.title}
                amount={variant.priceV2.amount}
                description={`${variant.title === 'Default Title' ? '' : variant.title} ${product.description}`}
              />
              <Button label='Add to cart' onClick={() => handleAddToCart(variant.id)} />
              <div>
                {product.tags.map((tag: string) => (
                  <Badge key={`${product.id}-${tag}`} label={tag} />
                ))}
              </div>
            </div>
          ))}
        </ThumbnailContainer>
      ))}
    </div>
  );
}

const HOCHome: any = Home;

HOCHome.getLayout = function GetLayout(page: ReactElement) {
  return (
    <Layout title='' description=''>
      {page}
    </Layout>
  );
};

export default HOCHome;
