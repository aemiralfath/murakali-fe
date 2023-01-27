import { useLogout } from '@/api/auth/logout'
import { Avatar } from '@/components'

import { useMediaQuery, useUser } from '@/hooks'
import type { APIResponse } from '@/types/api/response'
import { Menu, Transition } from '@headlessui/react'
import type { AxiosError } from 'axios'
import { useRouter } from 'next/router'

import React, { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiMenu } from 'react-icons/hi'

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

const SectionOneSideBarSellerPanel: React.FC = ({}) => {
  const [navbarOpen, setNavbarOpen] = useState(false)

  const lg = useMediaQuery('lg')
  const { user } = useUser()

  return (
    <>
      <nav
        className={`relative z-20 flex flex-wrap items-center justify-between bg-white px-2 py-5 shadow-md`}
      >
        <div className="mx-auto flex w-full flex-wrap items-center justify-end gap-2 px-3">
          {lg ? (
            <></>
          ) : (
            <label
              htmlFor="my-drawer-2"
              className="btn-ghost drawer-button btn text-primary lg:hidden"
            >
              <HiMenu />
            </label>
          )}
          <div className="text-heading relative flex flex-1 items-center text-xl font-semibold text-primary">
            Seller Panel
          </div>
          {user ? (
            <div className={'hidden items-center md:flex'}>
              <ul className="flex list-none flex-col md:ml-auto md:flex-row">
                <li className="nav-item mx-6 flex items-center">
                  <div className="h-full w-[1px] bg-base-300"></div>
                </li>
                <li className="nav-item flex items-center">
                  <AvatarMenu url={user.photo_url} />
                </li>
              </ul>
            </div>
          ) : (
            <></>
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
          {user ? (
            <ul className="container mx-auto flex list-none flex-col gap-2">
              <li className="nav-item flex items-center gap-2 text-sm text-white hover:opacity-75">
                <Avatar size="sm" url={user.photo_url} />
                <div>{user.full_name}</div>
              </li>
            </ul>
          ) : (
            <></>
          )}
        </div>
      </Transition>
    </>
  )
}

export default SectionOneSideBarSellerPanel
