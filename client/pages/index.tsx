import { gql, useQuery } from '@apollo/client';
import _ from 'lodash';
import { ReactElement } from 'react';
import Button from '../components/buttons/button/v1';
import Badge from '../components/elements/badge/v1';
import Thumbnail from '../components/thumbnails/thumbnail/v1';
import ThumbnailContainer from '../components/thumbnails/thumbnailContainer/v1';
import Layout from '../layouts/v1';

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

function Home(): ReactElement {
  const { data } = useQuery(PRODUCTS);

  const handleAddToCart = (id: string) => {
    alert(`Added to cart: ${id}`);
  };

  return (
    <div>
      {_.reverse(data?.products?.edges)?.map(({ node: product }: { node: any }) => (
        <ThumbnailContainer key={product.id} title={product.title}>
          {product.variants.edges.map(({ node: variant }: { node: any }) => (
            <div key={variant.id} className='space-y-2'>
              <Thumbnail
                imageUrl={variant.image.url}
                title={variant.title}
                amount={variant.priceV2.amount}
                description={product.title + ', ' + product.description}
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
