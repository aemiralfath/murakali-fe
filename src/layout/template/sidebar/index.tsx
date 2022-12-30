import { Avatar, Button, H3, Icon, TextInput } from '@/components'
import hoverCartData from '@/dummy/hoverCartData'
import { useMediaQuery, useUser } from '@/hooks'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import React, { Fragment, useState } from 'react'
import { HiHeart, HiMenu, HiSearch, HiShoppingCart } from 'react-icons/hi'

import type { CartData } from '@/types/api/cart'

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

const SellerPanelSideBar: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [keyword, setKeyword] = useState<string>('')
  const { user } = useUser()

  const sm = useMediaQuery('sm')

  return (
    <>
      <nav
        className={`relative flex flex-wrap items-center justify-between bg-primary px-2 py-5`}
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-5 px-5">
          <div className="relative flex justify-between">
            <div className="mx-1 flex max-w-[2rem] items-center sm:max-w-[6rem]">
              <Icon color="white" small={!sm} />
            </div>
          </div>
          <div className="relative flex-1">
            <H3>Seller Panel</H3>
          </div>

          <div className={'hidden items-center md:flex'}>
            <ul className="flex list-none flex-col md:ml-auto md:flex-row">
              <li className="nav-item mx-6 flex items-center">
                <div className="h-full w-[1px] bg-white"></div>
              </li>
              <li className="nav-item flex items-center">
                <AvatarMenu url={user.photo_url} />
              </li>
            </ul>
          </div>

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
          <ul className="container mx-auto flex list-none flex-col gap-2">
            <li className="nav-item flex items-center gap-2 text-sm text-white hover:opacity-75">
              <Avatar size="sm" url={user.photo_url} />
              <div>{user.full_name}</div>
            </li>
          </ul>
        </div>
      </Transition>
    </>
  )
}

export default SellerPanelSideBar
