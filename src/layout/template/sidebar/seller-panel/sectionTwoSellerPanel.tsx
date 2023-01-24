import cx from '@/helper/cx'

import { useRouter } from 'next/router'
import React from 'react'
import {
  HiArchive,
  HiInbox,
  HiNewspaper,
  HiReceiptTax,
  HiShoppingBag,
  HiTruck,
  HiTag,
} from 'react-icons/hi'

export type ValidPage =
  | 'order'
  | 'promotion'
  | 'voucher'
  | 'shop'
  | 'product'
  | 'delivery-service'
  | 'sealabs-pay'
  | 'wallet'

interface SellerSideBarProps {
  selectedPage: ValidPage
}

interface SideBarMenuProps {
  icon: React.ReactNode
  title: string
  link: string
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
        'w-full px-6 py-4 text-white transition-all',
        active
          ? ' rounded-r-full bg-white font-semibold text-primary shadow-sm'
          : 'hover:rounded-r-full hover:bg-white hover:font-semibold hover:text-primary'
      )}
      onClick={() => {
        if (!active) {
          router.push(`/seller-panel/${link}`)
        }
      }}
    >
      <div className="flex-column flex items-center gap-x-2 text-left text-lg">
        <div>{icon}</div>
        <span className=" line-clamp-1">{title}</span>
      </div>
    </button>
  )
}

const SectionTwoSideBarSellerPanel: React.FC<SellerSideBarProps> = ({
  selectedPage,
}) => {
  const items: Array<SideBarMenuProps> = [
    {
      link: 'order',
      title: 'Order',
      icon: <HiArchive />,
      active: selectedPage === 'order',
    },
    {
      link: 'vouchers',
      title: 'Voucher',
      icon: <HiTag />,
      active: selectedPage === 'voucher',
    },
    {
      link: 'promotion',
      title: 'Promotion',
      icon: <HiReceiptTax />,
      active: selectedPage === 'promotion',
    },
    {
      link: 'shop',
      title: 'Shop',
      icon: <HiShoppingBag />,
      active: selectedPage === 'shop',
    },
    {
      link: 'products',
      title: 'Product',
      icon: <HiInbox />,
      active: selectedPage === 'product',
    },
    {
      link: 'delivery-service',
      title: 'Delivery Service',
      icon: <HiTruck />,
      active: selectedPage === 'delivery-service',
    },
    {
      link: 'wallet',
      title: 'Wallet',
      icon: <HiNewspaper className="-rotate-90" />,
      active: selectedPage === 'wallet',
    },
  ]

  return (
    <>
      <div className="flex">
        <div className="flex min-h-screen w-64 bg-primary py-5">
          <div className="mr-4 flex w-full flex-col gap-2 py-4">
            {items.map((item, idx) => (
              <SideBarMenu key={idx} {...item} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SectionTwoSideBarSellerPanel
