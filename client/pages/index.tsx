import { gql, useQuery } from '@apollo/client';
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
        }
      }
    }
  }
`;

function Home(): ReactElement {
  const { data } = useQuery(PRODUCTS);

  const handleAddToCart = (title: string) => {
    alert(`Added to cart: ${title}`);
  };

  return (
    <div>
      <ThumbnailContainer title='Our Lovely Cofee Just For You'>
        {data?.products &&
          data?.products.edges?.map(({ node: product }: { node: any }) => (
            <div key={product.id} className='space-y-4'>
              <Thumbnail product={product} />
              <Button label='Add to cart' onClick={() => handleAddToCart(product.title)} />
              <div>
                {product.tags.map((tag: string) => (
                  <Badge key={`${product.id}-${tag}`} label={tag} />
                ))}
              </div>
            </div>
          ))}
      </ThumbnailContainer>
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
