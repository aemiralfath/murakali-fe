import cx from '@/helper/cx'

import { useRouter } from 'next/router'
import React from 'react'

import {
  FaShoppingBag,
  FaPercent,
  FaBook,
  FaBoxOpen,
  FaPeopleCarry,
  FaWallet,
} from 'react-icons/fa'

export type ValidPage =
  | 'order'
  | 'promotion'
  | 'shop'
  | 'product'
  | 'delivery-service'
  | 'wallet'

interface SellerSideBarProps {
  selectedPage: ValidPage
}

interface SideBarMenuProps {
  icon: React.ReactNode
  title: string
  link: ValidPage
  active: boolean
}

const SideBarMenu: React.FC<SideBarMenuProps> = ({
  icon,
  title,
  link,
  active,
}) => {
  const router = useRouter()
  return (
    <button
      className={cx(
        'px-6 py-4 transition-all',
        active
          ? ' font-bold text-white'
          : 'hover:bg-white hover:bg-opacity-20 hover:font-bold hover:text-primary'
      )}
      onClick={() => {
        if (!active) {
          router.push(`/${link}`)
        }
      }}
    >
      <div className="flex-column flex items-center gap-x-2 text-left text-lg text-white">
        <div>{icon}</div>
        <span className=" line-clamp-1">{title}</span>
      </div>
    </button>
  )
}

const SectionTwoSideBar: React.FC<SellerSideBarProps> = ({ selectedPage }) => {
  const items: Array<SideBarMenuProps> = [
    {
      link: 'order',
      title: 'Order',
      icon: <FaBook />,
      active: selectedPage === 'order',
    },
    {
      link: 'promotion',
      title: 'Promotion',
      icon: <FaPercent />,
      active: selectedPage === 'promotion',
    },
    {
      link: 'shop',
      title: 'Shop',
      icon: <FaShoppingBag />,
      active: selectedPage === 'shop',
    },
    {
      link: 'product',
      title: 'Product',
      icon: <FaBoxOpen />,
      active: selectedPage === 'product',
    },
    {
      link: 'delivery-service',
      title: 'Selivery Service',
      icon: <FaPeopleCarry />,
      active: selectedPage === 'delivery-service',
    },
    {
      link: 'wallet',
      title: 'Wallet',
      icon: <FaWallet />,
      active: selectedPage === 'wallet',
    },
  ]

  return (
    <>
      <div className="flex">
        <div className="flex h-screen w-64 bg-primary py-5">
          <div className="flex flex-col gap-2 py-4">
            {items.map((item, idx) => (
              <SideBarMenu key={idx} {...item} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SectionTwoSideBar
