import { ReactElement, useEffect, useState } from 'react'
import Layout from '../layouts/v1'
import { tokenGet, tokenSet } from '../utils/localStorage/v1'
import axios from 'axios'
import Image from 'next/image'

function Checkout(): ReactElement {
  const [customer, setCustomer] = useState<any>(null);
  const [cart, setCart] = useState<any>(null);

  useEffect(() => {
    handleGetCustomer();
    handleGetCart();
  }, []);

  const handleGetCustomer = async () => {
    const token = tokenGet('accessToken');

    const res = await axios.get(`http://localhost:8000/api/v1/storefront/customer/${token}`)

    if (res.status !== 200) {
      return
    }

    setCustomer(res.data)
  };

  const handleGetCart = async () => {
    let cartId = tokenGet('cartId');

    if (!cartId) {
      const res = await axios.post('http://localhost:8000/api/v1/storefront/cart/create');

      if (res.status !== 201) {
        return;
      }

      const { id } = res.data;

      tokenSet('cartId', id);

      cartId = id;
    }

    const res = await axios.post('http://localhost:8000/api/v1/storefront/cart', {
      cartId
    });

    if (res.status !== 201) {
      return;
    }

    setCart(res.data);
  };

  const handleAddOns = (item: any) => {
    const addOnsField: any[] = []

    item.attributes.forEach((attr: any) => {
      if (attr.key === 'add_on_espresso_shot' && Number(attr.value) > 0) {
        addOnsField.push(<p className='text-xs text-gray-500'>Add {attr.value} espresso shot</p>)
      }
    })
    
    return addOnsField.map((addOn) => addOn)
  }

  const checkoutCreate = async () => {
    const lineItems = cart.lines.edges.map(({ node }: { node: any }) => {
      return {
        customAttributes: node.attributes,
        quantity: node.quantity,
        variantId: node.merchandise.id,
      }
    })

    const checkoutCreateData = {
      email: customer.email,
      lineItems
    }

    const res = await axios.post('http://localhost:8000/api/v1/storefront/checkout/create', {
      checkoutCreateData
    })

    if (res.status !== 201) {
      return
    }

    const { id } = res.data;

    return id
  }

  const checkoutCustomerAssociate = async (checkoutId: string, token: string) => {
    await axios.post('http://localhost:8000/api/v1/storefront/checkout/customer/associate', {
      checkoutId,
      customerAccessToken: token
    })
  }

  const checkoutCompleteFree = async (checkoutId: string) => {
    const res = await axios.post('http://localhost:8000/api/v1/storefront/checkout/complete/free', {
      checkoutId
    })

    console.log(res)
  }

  const handleCheckout = async (e: any) => {
    e.preventDefault()

    // Create checkout
    const checkoutId = await checkoutCreate();

    if (!checkoutId) {
      return
    }

    const accessToken = tokenGet('accessToken') || '';

    await checkoutCustomerAssociate(checkoutId, accessToken);

    await checkoutCompleteFree(checkoutId)
  }

  return (
    <div className="bg-white">
      {/* Background color split screen for large screens */}
      <div className="fixed top-0 left-0 hidden h-full w-1/2 bg-white lg:block" aria-hidden="true" />
      <div className="fixed top-0 right-0 hidden h-full w-1/2 bg-gray-50 lg:block" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-gray-50 px-4 pt-16 pb-10 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <ul role="list" className="divide-y divide-gray-200 text-sm font-medium text-gray-900">
              {cart?.lines?.edges?.map(({ node: lineItem }: { node: any }) => (
                <li key={lineItem.id} className="flex items-start space-x-4 py-6">
                  <div className='relative h-24 w-24 overflow-hidden rounded-md'>
                    <Image src={lineItem.merchandise.image.url} layout='fill' objectFit='cover' className='h-full w-full' />
                  </div>
                  <div className="flex-auto space-y-1">
                    <h3>{lineItem.merchandise.product.title}</h3>
                    <p className='text-sm text-gray-500'>
                      {lineItem.merchandise.title === 'Default Title' ? '-' : lineItem.merchandise.title}
                    </p>
                    {handleAddOns(lineItem)}
                  </div>
                  <p className="flex-none text-base font-medium">{lineItem.cost.totalAmount.amount}</p>
                </li>
              ))}
            </ul>

            <dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>฿{cart?.cost.subtotalAmount.amount}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Tax</dt>
                <dd>฿{cart?.cost.totalTaxAmount.amount}</dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">฿{cart?.cost.totalAmount.amount}</dd>
              </div>
            </dl>
          </div>
        </section>

        <form className="px-4 pt-16 pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16">
          <div className="mx-auto max-w-lg lg:max-w-none">
            <section aria-labelledby="contact-info-heading">
              <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900">
                Contact information
              </h2>

              <div className="mt-6">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            <section aria-labelledby="payment-heading" className="mt-10">
              <h2 id="payment-heading" className="text-lg font-medium text-gray-900">
                Payment details
              </h2>

              <div className="mt-6 grid grid-cols-3 gap-y-6 gap-x-4 sm:grid-cols-4">
                <div className="col-span-3 sm:col-span-4">
                  <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
                    Name on card
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name-on-card"
                      name="name-on-card"
                      autoComplete="cc-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="col-span-3 sm:col-span-4">
                  <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                    Card number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="card-number"
                      name="card-number"
                      autoComplete="cc-number"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-3">
                  <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                    Expiration date (MM/YY)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="expiration-date"
                      id="expiration-date"
                      autoComplete="cc-exp"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                    CVC
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="cvc"
                      id="cvc"
                      autoComplete="csc"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2 id="shipping-heading" className="text-lg font-medium text-gray-900">
                Shipping address
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="region"
                      name="region"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postal-code"
                      name="postal-code"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="billing-heading" className="mt-10">
              <h2 id="billing-heading" className="text-lg font-medium text-gray-900">
                Billing information
              </h2>

              <div className="mt-6 flex items-center">
                <input
                  id="same-as-shipping"
                  name="same-as-shipping"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-2">
                  <label htmlFor="same-as-shipping" className="text-sm font-medium text-gray-900">
                    Same as shipping information
                  </label>
                </div>
              </div>
            </section>

            <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
              <button
                onClick={handleCheckout}
                type="submit"
                className="w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
              >
                Continue
              </button>
              <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
                You won't be charged until the next step.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const HOCCheckout: any = Checkout;

HOCCheckout.getLayout = function GetLayout(page: ReactElement) {
  return (
    <Layout title='' description=''>
      {page}
    </Layout>
  );
};

export default HOCCheckout;