import { Avatar, Button, H2, Icon, TextInput } from '@/components'
import {
  useHover,
  useLoadingModal,
  useMediaQuery,
  useSearchKeyword,
  useSelector,
  useUser,
} from '@/hooks'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'
import {
  HiCurrencyDollar,
  HiHeart,
  HiMenu,
  HiSearch,
  HiShoppingCart,
} from 'react-icons/hi'

import type { CartData } from '@/types/api/cart'
import { useRouter } from 'next/router'
import { useLogout } from '@/api/auth/logout'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { APIResponse } from '@/types/api/response'
import { useGetHoverCart } from '@/api/user/cart'
import formatMoney from '@/helper/formatMoney'

const HoverableCartButton: React.FC<{ cart: CartData[]; isLogin: boolean }> = ({
  cart,
  isLogin,
}) => {
  const [cartRef, isCartHover] = useHover()
  const router = useRouter()
  return (
    <div className="nav-item relative z-50 " ref={cartRef}>
      <Link
        href={`/cart`}
        className="flex items-center px-3 py-2 text-xs font-bold uppercase leading-snug text-white hover:opacity-75"
      >
        <div ref={cartRef}>
          <HiShoppingCart size={26} />
        </div>
      </Link>
      <Transition
        show={isCartHover}
        enter="transition ease-out duration-50"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute right-[10%] top-auto ">
          <div className="relative z-40 mt-3 w-[32rem] rounded-md bg-white py-2 px-4 shadow-lg">
            <div className="absolute -top-[7px] right-[10px] h-5 w-5 rotate-45 bg-white" />
            <H2 className="text-primary">Cart</H2>
            <div className="grid grid-cols-1 divide-y">
              {isLogin ? (
                <>
                  {cart && cart.length > 0 ? (
                    cart.map((data, idx) => {
                      return (
                        <div key={idx} className="flex py-2">
                          <img
                            width={60}
                            height={60}
                            src={
                              data.thumbnail_url === ' '
                                ? undefined
                                : data.thumbnail_url
                            }
                            alt={data.title}
                            className={'aspect-square h-[4.5rem] w-[4.5rem]'}
                          />
                          <div className="flex flex-1 flex-col flex-wrap gap-2 px-1">
                            <div className="mt-1 font-semibold leading-4 line-clamp-2">
                              {data.title}
                            </div>
                            <div className="text-sm text-gray-400">
                              {Object.keys(data.variant).map((key) => {
                                return `${key}: ${data.variant[key]} `
                              })}
                            </div>
                          </div>
                          <div className="flex w-[9rem] flex-col overflow-ellipsis text-right">
                            <div className="block truncate text-lg font-semibold">
                              {data.sub_price === 0
                                ? 'Rp.' + formatMoney(data.price)
                                : 'Rp.' + formatMoney(data.sub_price)}
                            </div>
                            {data.sub_price === 0 ? null : (
                              <div className="flex flex-1 justify-end gap-1 text-xs">
                                <div className="font-light text-gray-400 line-through">
                                  {'Rp.' + formatMoney(data.price)}
                                </div>
                                {data.discount_percentage === 0 ||
                                data.discount_percentage === null ? null : (
                                  <div className="font-bold text-error">
                                    -{data.discount_percentage}%
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="text-sm text-gray-400">
                              Qty: {data.quantity}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex py-2">
                      <div className="flex flex-1 flex-col gap-2 px-2">
                        <div className="mt-1 text-center font-semibold leading-4 line-clamp-2">
                          No item in cart
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex py-2">
                  <div className="flex flex-1 flex-col gap-2 px-2">
                    <div className="mt-1 text-center font-semibold leading-4">
                      Please login to see your cart
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="my-2 flex justify-end">
              {isLogin ? (
                <Button
                  size="sm"
                  buttonType="ghost"
                  onClick={() => {
                    router.push('/cart')
                  }}
                >
                  See More
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}

const AvatarMenu: React.FC<{ url: string }> = ({ url }) => {
  const router = useRouter()

  const logout = useLogout()

  useEffect(() => {
    if (logout.isSuccess) {
      toast.success('Logout Success')
      router.push('/')
    }
  }, [logout.isSuccess])
  useEffect(() => {
    if (logout.isError) {
      const reason = logout.failureReason as AxiosError<APIResponse<null>>
      toast.error(
        reason.response ? reason.response.data.message : reason.message
      )
    }
  }, [logout.isError])

  return (
    <Menu as="div" className="relative h-full">
      <Menu.Button className="inline-flex h-full items-center">
        <Avatar url={url} />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => router.push('/profile')}
                className={`${
                  active
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm font-semibold`}
              >
                My Profile
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm font-semibold`}
                onClick={() => router.push('/wallet')}
              >
                My Wallet
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={() => logout.mutate()}
              >
                Logout
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

const Navbar: React.FC = () => {
  const { keyword } = useSelector((state) => state.searchKeyword)

  const [navbarOpen, setNavbarOpen] = useState(false)
  const { user, isLoading } = useUser()

  const sm = useMediaQuery('sm')
  const cart = useGetHoverCart(Boolean(user?.id))
  const setIsLoading = useLoadingModal()
  const setSearchKeyword = useSearchKeyword()
  const router = useRouter()

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  useEffect(() => {
    setSearchKeyword(keyword)
  }, [keyword])

  return (
    <>
      <nav
        className={`relative flex flex-wrap items-center justify-between bg-primary px-2 py-5`}
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-5 px-5">
          <div className="relative flex justify-between">
            <div className="mx-1 flex max-w-[2rem] items-center sm:max-w-[6rem]">
              <Link href="/">
                <Icon color="white" small={!sm} />
              </Link>
            </div>
          </div>
          <div className="relative flex-1">
            <TextInput
              type="text"
              placeholder={sm ? 'Search ...' : ''}
              inputSize="sm"
              full
              transparent
              value={keyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (keyword && keyword.replace(/\s/g, '').length) {
                    router.push({
                      pathname: '/search',
                      query: { keyword },
                    })
                  } else {
                    router.push({
                      pathname: '/search',
                    })
                  }
                }
              }}
            />
            <button
              type="submit"
              className="absolute top-0 right-0 h-full px-1 text-xl"
              onClick={() => {
                if (keyword && keyword.replace(/\s/g, '').length) {
                  router.push({
                    pathname: '/search',
                    query: { keyword },
                  })
                } else {
                  router.push({
                    pathname: '/search',
                  })
                }
              }}
            >
              <HiSearch color="white" />
            </button>
          </div>
          {!user ? (
            <div
              className={'hidden items-center md:flex'}
              id="example-navbar-danger"
            >
              <ul className="flex list-none flex-col items-start md:ml-auto md:flex-row">
                <HoverableCartButton
                  cart={cart.data?.data.cart_items}
                  isLogin={user ? true : false}
                />
                <li className="nav-item">
                  <Link
                    href={`/favorites`}
                    className="flex items-center px-3 py-2 text-xs font-bold uppercase leading-snug text-white hover:opacity-75"
                  >
                    <HiHeart size={26} />
                  </Link>
                </li>
                <li className="nav-item relative mx-1 my-1">
                  <Link href="/login">
                    <Button buttonType="white" outlined={true} size="sm">
                      Login
                    </Button>
                  </Link>
                </li>
                <li className="nav-item mx-1 my-1">
                  <Link href="/register">
                    <Button buttonType="white" size="sm">
                      Register
                    </Button>
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div className={'hidden items-center md:flex'}>
              <ul className="flex list-none flex-col md:ml-auto md:flex-row">
                <HoverableCartButton
                  cart={cart.data?.data.cart_items}
                  isLogin={user ? true : false}
                />

                <li className="nav-item">
                  <Link
                    href={`/favorites`}
                    className="flex items-center px-3 py-2 text-xs font-bold uppercase leading-snug text-white hover:opacity-75"
                  >
                    <HiHeart size={26} />
                  </Link>
                </li>
                <li className="nav-item mx-6 flex items-center">
                  <div className="h-full w-[1px] bg-white"></div>
                </li>
                <li className="nav-item flex items-center">
                  <AvatarMenu url={user.photo_url} />
                </li>
              </ul>
            </div>
          )}
          <button
            className="bg-transparent text-2xl text-white md:hidden"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <HiMenu />
          </button>
        </div>
      </nav>
      <Transition
        show={navbarOpen}
        enter={'transition-transform duration-50'}
        enterFrom={'scale-y-0'}
        enterTo={'scale-y-100'}
        leave={'transition-transform duration-50'}
        leaveFrom={'scale-y-100'}
        leaveTo={'scale-y-0'}
        className={'block origin-top md:hidden'}
      >
        <div className="bg-primary px-5 pb-3">
          {!user ? (
            <>
              {' '}
              <ul className="container mx-auto flex list-none flex-col gap-2">
                <li className="nav-item pt-2">
                  <Link
                    href={`/cart`}
                    className="flex items-center gap-2 text-sm text-white hover:opacity-75"
                  >
                    <HiShoppingCart size={26} />
                    <div>Cart</div>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href={`/favorites`}
                    className="flex items-center gap-2 text-sm text-white hover:opacity-75"
                  >
                    <HiHeart size={26} />
                    <div>Favorites</div>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/login">
                    <Button
                      buttonType="white"
                      className="w-full"
                      outlined={true}
                      size="sm"
                    >
                      Login
                    </Button>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/register">
                    <Button buttonType="white" size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </li>
              </ul>
            </>
          ) : (
            <ul className="container mx-auto flex list-none flex-col gap-2">
              <li className="nav-item pt-2">
                <Link
                  href={`/cart`}
                  className="flex items-center gap-2 text-sm text-white hover:opacity-75"
                >
                  <HiShoppingCart size={26} />
                  <div>Cart</div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href={`/favorites`}
                  className="flex items-center gap-2 text-sm text-white hover:opacity-75"
                >
                  <HiHeart size={26} />
                  <div>Favorites</div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href={`/wallet`}
                  className="flex items-center gap-2 text-sm text-white hover:opacity-75"
                >
                  <HiCurrencyDollar size={24} />
                  <div>My Wallet</div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href={`/profile`}
                  className={
                    'flex items-center gap-2 text-sm text-white hover:opacity-75'
                  }
                >
                  <Avatar size="sm" url={user.photo_url} />
                  <div>{user.full_name}</div>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </Transition>
    </>
  )
}

export default Navbar
