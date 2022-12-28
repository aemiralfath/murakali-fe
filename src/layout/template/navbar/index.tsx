import { Avatar, Button, Icon, TextInput } from '@/components'
import { useMediaQuery, useUser } from '@/hooks'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { HiHeart, HiMenu, HiSearch, HiShoppingCart } from 'react-icons/hi'

const Navbar: React.FC = () => {
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
                <li className="nav-item mx-1 my-1 md:my-0">
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
                <li className="nav-item">
                  <Link
                    href={`/carts`}
                    className="flex items-center px-3 py-2 text-xs font-bold uppercase leading-snug text-white hover:opacity-75"
                  >
                    <HiShoppingCart size={26} />
                  </Link>
                </li>
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
                  <Avatar url={user.photo_url} />
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
