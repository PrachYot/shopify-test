import Image from 'next/image';

export default function Thumbnail(props: any) {
  const { product } = props;

  return (
    <div>
      <div className='min-h-80 aspect-w-1 aspect-h-1 relative w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75'>
        <Image objectFit='cover' layout='fill' alt='' src={product.images.edges[0].node.url} />
      </div>
      <div className='mt-4'>
        <div className='flex justify-between'>
          <h3 className='truncate text-sm text-gray-700'>{product.title}</h3>
          <p className='text-sm font-medium text-gray-900'>{product.priceRange.minVariantPrice.amount}</p>
        </div>
        <p className='mt-1 truncate text-sm text-gray-500'>{product.description}</p>
      </div>
    </div>
  );
}
