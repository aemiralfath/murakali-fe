import { Avatar, Button, H2, Icon, TextInput } from '@/components'
import hoverCartData from '@/dummy/hoverCartData'
import { useHover, useMediaQuery, useUser } from '@/hooks'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import React, { Fragment, useState } from 'react'
import { HiHeart, HiMenu, HiSearch, HiShoppingCart } from 'react-icons/hi'

import type { CartData } from '@/types/api/cart'
import Image from 'next/image'

const HoverableCartButton: React.FC<{ cart: CartData[] }> = ({ cart }) => {
  const [cartRef, isCartHover] = useHover()

  return (
    <div className="nav-item relative" ref={cartRef}>
      <Link
        href={`/carts`}
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
        <div className="absolute right-[10%] top-auto">
          <div className="relative mt-3 w-[32rem] rounded-md bg-white py-2 px-4 shadow-lg">
            <div className="absolute -top-[7px] right-[10px] h-5 w-5 rotate-45 bg-white" />
            <H2 className="text-primary">Cart</H2>
            <div className="grid grid-cols-1 divide-y">
              {cart.map((data, idx) => {
                return (
                  <div key={idx} className="flex py-2">
                    <Image
                      width={60}
                      height={60}
                      src={data.thumbnail_url}
                      alt={data.title}
                      className={'aspect-square h-[4.5rem] w-[4.5rem]'}
                    />
                    <div className="flex flex-1 flex-col gap-2 px-2">
                      <div className="mt-1 font-semibold leading-4 line-clamp-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Porro, voluptate unde! Placeat aliquam eum veritatis
                        nisi doloribus rerum fuga iste.
                      </div>
                      <div className="text-sm text-gray-400">
                        {data.variant_name}: {data.variant_type}
                      </div>
                    </div>
                    <div className="flex w-[6rem] flex-col overflow-ellipsis text-right">
                      <div className="text-lg font-semibold">Rp10.000</div>
                      <div className="flex flex-1 justify-end gap-1 text-xs">
                        <div className="font-light text-gray-400 line-through">
                          Rp10.000
                        </div>
                        <div className="font-bold text-error">-80%</div>
                      </div>
                      <div className="text-sm text-gray-400">
                        Qty: {data.quantity}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="my-2 flex justify-end">
              <Button size="sm" buttonType="ghost">
                See More
              </Button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}

const AvatarMenu: React.FC<{ url: string }> = ({ url }) => {
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
                className={`${
                  active
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm font-semibold`}
              >
                My Account
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
              >
                My Transactions
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
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [keyword, setKeyword] = useState<string>('')
  const { user } = useUser()

  const sm = useMediaQuery('sm')
  const cart: CartData[] = hoverCartData

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
              placeholder="Search ..."
              inputSize="sm"
              full
              transparent
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Link href={`/search?keyword=${keyword}`}>
              <button
                type="submit"
                className="absolute top-0 right-0 h-full px-1 text-xl"
              >
                <HiSearch color="white" />
              </button>
            </Link>
          </div>
          {!user ? (
            <div
              className={'hidden items-center md:flex'}
              id="example-navbar-danger"
            >
              <ul className="flex list-none flex-col items-start md:ml-auto md:flex-row">
                <li className="nav-item relative mx-1 my-1 md:my-0">
                  <Link href="/login">
                    <Button buttonType="white" outlined={true} size="sm">
                      Login
                    </Button>
                  </Link>
                </li>
                <li className="nav-item mx-1 my-1 md:my-0">
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
                <HoverableCartButton cart={cart} />
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
            <ul className="flex list-none items-center justify-end gap-2">
              <li className="nav-item">
                <Link href="/login">
                  <Button buttonType="white" outlined={true} size="sm">
                    Login
                  </Button>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/register">
                  <Button buttonType="white" size="sm">
                    Register
                  </Button>
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="container mx-auto flex list-none flex-col gap-2">
              <li className="nav-item">
                <Link
                  href={`/carts`}
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
              <li className="nav-item flex items-center gap-2 text-sm text-white hover:opacity-75">
                <Avatar size="sm" url={user.photo_url} />
                <div>{user.full_name}</div>
              </li>
            </ul>
          )}
        </div>
      </Transition>
    </>
  )
}

export default Navbar
