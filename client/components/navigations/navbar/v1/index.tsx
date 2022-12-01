import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Overlay from '../../../overlays/overlay/v1';
import SignInTemplate from '../../../templates/signIn/v1';
import { tokenGet, tokenSet } from '../../../../utils/localStorage/v1';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';

const currencies = ['CAD', 'USD', 'AUD', 'EUR', 'GBP'];

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [openCartOverlay, setOpenCartOverlay] = useState(false);
  const [openSignInOverlay, setOpenSignInOverlay] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customer, setCustomer] = useState<any>(null);
  const [cart, setCart] = useState<any>(null);

  useEffect(() => {
    handleGetCustomer();
    handleGetCart();
  }, []);

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

  const handleGetCustomer = async () => {
    const token = tokenGet('accessToken');

    const res = await axios.get(`http://localhost:8000/api/v1/storefront/customer/${token}`)

    if (res.status !== 200) {
      return
    }

    setCustomer(res.data)
  };

  const handleSignIn = async () => {
    const res = await axios.post('http://localhost:8000/api/v1/storefront/customer/login', {
      email,
      password
    }).catch(() => {
      return null;
    })

    if (res?.status !== 201) {
      return
    }

    const { customerAccessToken } = res.data;

    const { accessToken } = customerAccessToken;

    tokenSet('accessToken', accessToken);

    window.location.reload();
  };

  const handleCheckout = async () => {
    setOpenCartOverlay(false)
    setOpenSignInOverlay(false)

    router.push('/checkout')
  };

  const handleUpdateCartLineAttributes = async (value: number, id: string, merchandiseId: string, quantity: number) => {
    const res = await axios.post('http://localhost:8000/api/v1/storefront/cart/lines/update', {
      cartId: cart.id,
      cartLineUpdateData: [
        {
          attributes: [{
            key: 'add_on_espresso_shot',
            value: value.toString(),
          }],
          quantity,
          id,
          merchandiseId
        }
      ]
    })

    if (res.status !== 201) {
      return
    }

    setCart(res.data)
  };

  return (
    <div className='bg-white'>
      <Overlay
        isOpen={openCartOverlay}
        onClose={() => setOpenCartOverlay(false)}
        title='Your awesome cart'
        buttons={{
          submitButton: {
            label: 'Checkout',
            onClick: handleCheckout,
          },
          cancelButton: {
            label: 'Back',
            onClick: () => setOpenCartOverlay(false),
          },
        }}>
        <ul role='list' className='divide-y divide-gray-200 border-t border-b border-gray-200'>
          {cart?.lines?.edges?.map(({ node: lineItem }: { node: any }, index: number) => (
            <li key={lineItem.id} className='flex py-6 sm:py-10'>
              <div className='relative h-24 w-24 overflow-hidden rounded-md'>
                <Image src={lineItem.merchandise.image.url} layout='fill' objectFit='cover' className='h-full w-full' />
              </div>
              <div className='ml-4 flex flex-1 flex-col justify-between sm:ml-6'>
                <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
                  <div className='space-y-4'>
                    <div>
                      <div className='flex justify-between'>
                        <h3 className='text-sm'>{lineItem.merchandise.product.title}</h3>
                      </div>
                      <div className='space-y-2'>
                        <p className='text-sm text-gray-500'>
                          {lineItem.merchandise.title === 'Default Title' ? '-' : lineItem.merchandise.title}
                        </p>
                        <p className='text-xs text-gray-700'>Total: {lineItem.cost.totalAmount.amount}฿</p>
                      </div>
                    </div>
                    {lineItem.merchandise.product.metafields && lineItem.merchandise.product.metafields.find((field: any) => field.key === 'add_on_espresso_shot' && field.value === "true") && (
                      <div className='space-y-2'>
                      <p className='text-sm'>Add on</p>
                      <p className='text-xs'>Espresso shot</p>
                      <select
                        id={`quantity-${index}`}
                        name={`quantity-${index}`}
                        value={function() {
                          const addOnEspresssoShot = lineItem.attributes.find((item: any) => item.key === 'add_on_espresso_shot');

                          if (addOnEspresssoShot) {
                            return addOnEspresssoShot.value
                          }

                          return 0
                        }()}
                        onChange={(e: any) => handleUpdateCartLineAttributes(
                          e.target.value, 
                          lineItem.id,
                          lineItem.merchandise.id, 
                          lineItem.quantity)}
                        className='max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Overlay>

      <Overlay
        isOpen={openSignInOverlay}
        onClose={() => setOpenSignInOverlay(false)}
        title='Sign In'
        buttons={{
          submitButton: {
            label: 'Sign In',
            onClick: handleSignIn,
          },
          cancelButton: {
            label: 'Back',
            onClick: () => setOpenSignInOverlay(false),
          },
        }}>
        <SignInTemplate email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
      </Overlay>

      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-40 lg:hidden' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 z-40 flex'>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'>
              <Dialog.Panel className='relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl'>
                <div className='flex px-4 pt-5 pb-2'>
                  <button
                    type='button'
                    className='-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400'
                    onClick={() => setOpen(false)}>
                    <span className='sr-only'>Close menu</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>

                <div className='space-y-6 border-t border-gray-200 py-6 px-4'>
                  {/* <div className='flow-root'>
                    <a href='#' className='-m-2 block p-2 font-medium text-gray-900'>
                      Create an account
                    </a>
                  </div> */}
                  <div className='flow-root'>
                    <a href='#' className='-m-2 block p-2 font-medium text-gray-900'>
                      Sign in
                    </a>
                  </div>
                </div>

                <div className='space-y-6 border-t border-gray-200 py-6 px-4'>
                  {/* Currency selector */}
                  <form>
                    <div className='inline-block'>
                      <label htmlFor='mobile-currency' className='sr-only'>
                        Currency
                      </label>
                      <div className='group relative -ml-2 rounded-md border-transparent focus-within:ring-2 focus-within:ring-white'>
                        <select
                          id='mobile-currency'
                          name='currency'
                          className='flex items-center rounded-md border-transparent bg-none py-0.5 pl-2 pr-5 text-sm font-medium text-gray-700 focus:border-transparent focus:outline-none focus:ring-0 group-hover:text-gray-800'>
                          {currencies.map((currency) => (
                            <option key={currency}>{currency}</option>
                          ))}
                        </select>
                        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center'>
                          <ChevronDownIcon className='h-5 w-5 text-gray-500' aria-hidden='true' />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className='relative'>
        <nav aria-label='Top'>
          {/* Top navigation */}
          <div className='bg-gray-900'>
            <div className='mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
              {/* Currency selector */}
              <form className='hidden lg:block lg:flex-1'>
                <div className='flex'>
                  <label htmlFor='desktop-currency' className='sr-only'>
                    Currency
                  </label>
                  <div className='group relative -ml-2 rounded-md border-transparent bg-gray-900 focus-within:ring-2 focus-within:ring-white'>
                    <select
                      id='desktop-currency'
                      name='currency'
                      className='flex items-center rounded-md border-transparent bg-gray-900 bg-none py-0.5 pl-2 pr-5 text-sm font-medium text-white focus:border-transparent focus:outline-none focus:ring-0 group-hover:text-gray-100'>
                      {currencies.map((currency) => (
                        <option key={currency}>{currency}</option>
                      ))}
                    </select>
                    <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center'>
                      <ChevronDownIcon className='h-5 w-5 text-gray-300' aria-hidden='true' />
                    </div>
                  </div>
                </div>
              </form>

              <p className='flex-1 text-center text-sm font-medium text-white lg:flex-none'>
                Get free delivery on orders over $100
              </p>

              <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                {/* <a href='#' className='text-sm font-medium text-white hover:text-gray-100'>
                  Create an account
                </a> */}
                <span className='h-6 w-px' aria-hidden='true' />
                {customer && customer?.displayName ? (
                  <div className='flex items-center space-x-2'>
                    <p className='text-sm font-normal text-gray-300'>Welcome</p>
                    <p className='text-sm font-medium text-white'>{customer.firstName}!</p>
                  </div>
                ) : (
                  <div
                    onClick={() => setOpenSignInOverlay(true)}
                    className='cursor-pointer text-sm font-medium text-white hover:text-gray-100'>
                    Sign in
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secondary navigation */}
          <div className='bg-white'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='border-b border-gray-200'>
                <div className='flex h-16 items-center justify-between'>
                  {/* Logo (lg+) */}
                  <div className='hidden lg:flex lg:items-center'>
                    <a href='/'>
                      <span className='sr-only'>Your Company</span>
                      <img
                        className='h-8 w-auto'
                        src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                        alt=''
                      />
                    </a>
                  </div>

                  {/* Mobile menu and search (lg-) */}
                  <div className='flex flex-1 items-center lg:hidden'>
                    <button
                      type='button'
                      className='-ml-2 rounded-md bg-white p-2 text-gray-400'
                      onClick={() => setOpen(true)}>
                      <span className='sr-only'>Open menu</span>
                      <Bars3Icon className='h-6 w-6' aria-hidden='true' />
                    </button>

                    {/* Search */}
                    <a href='#' className='ml-2 p-2 text-gray-400 hover:text-gray-500'>
                      <span className='sr-only'>Search</span>
                      <MagnifyingGlassIcon className='h-6 w-6' aria-hidden='true' />
                    </a>
                  </div>

                  {/* Logo (lg-) */}
                  <a href='#' className='lg:hidden'>
                    <span className='sr-only'>Your Company</span>
                    <img
                      src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                      alt=''
                      className='h-8 w-auto'
                    />
                  </a>

                  <div className='flex flex-1 items-center justify-end'>
                    <div className='flex items-center lg:ml-8'>
                      <div className='flex space-x-8'>
                        <div className='hidden lg:flex'>
                          <a href='#' className='-m-2 p-2 text-gray-400 hover:text-gray-500'>
                            <span className='sr-only'>Search</span>
                            <MagnifyingGlassIcon className='h-6 w-6' aria-hidden='true' />
                          </a>
                        </div>

                        <div className='flex'>
                          <a href='#' className='-m-2 p-2 text-gray-400 hover:text-gray-500'>
                            <span className='sr-only'>Account</span>
                            <UserIcon className='h-6 w-6' aria-hidden='true' />
                          </a>
                        </div>
                      </div>

                      <span className='mx-4 h-6 w-px bg-gray-200 lg:mx-6' aria-hidden='true' />

                      <div className='flow-root'>
                        <div onClick={() => setOpenCartOverlay(true)} className='group -m-2 flex items-center p-2'>
                          <ShoppingCartIcon
                            className='h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                            aria-hidden='true'
                          />
                          <span className='ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800'>
                            {cart?.lines?.edges?.length}
                          </span>
                          <span className='sr-only'>items in cart, view bag</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
