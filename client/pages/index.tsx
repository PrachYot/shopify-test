import axios from 'axios';
import _ from 'lodash';
import { ReactElement, useEffect, useState } from 'react';
import Button from '../components/buttons/button/v1';
import Badge from '../components/elements/badge/v1';
import Thumbnail from '../components/thumbnails/thumbnail/v1';
import ThumbnailContainer from '../components/thumbnails/thumbnailContainer/v1';
import Layout from '../layouts/v1';
import { tokenGet } from '../utils/localStorage/v1';

function Home(): ReactElement {
  const [products, setProducts] = useState<any>()

  useEffect(() => {
    handleGetProducts()
  }, [])

  const handleGetProducts = async () => {
    const res = await axios.get('http://localhost:8000/api/v1/storefront/products')

    if (res.status !== 200) {
      return
    }

    setProducts(res.data)
  }

  const handleAddToCart = async (merchandiseId: string) => {
    const cartId = tokenGet('cartId');

    const res = await axios.post('http://localhost:8000/api/v1/storefront/cart/lines/add', {
      cartId,
      cartLineData: [
        {
          merchandiseId,
          quantity: 1,
        },
      ],
    })

    if (res.status !== 201) {
      return
    }

    window.location.reload();
  };

  return (
    <div>
      {_.reverse(products?.edges)?.map(({ node: product }: { node: any }) => (
        <ThumbnailContainer key={product.id} title={product.title}>
          {product.variants.edges.map(({ node: variant }: { node: any }) => (
            <div key={variant.id} className='space-y-2'>
              <Thumbnail
                imageUrl={variant.image?.url}
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
