import { A, Icon } from '@/components'
import cx from '@/helper/cx'
import { useMediaQuery } from '@/hooks'

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
  HiArrowLeft,
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
          ? ' rounded-r-full bg-white text-primary shadow-sm'
          : 'hover:rounded-r-full hover:bg-white hover:text-primary'
      )}
      onClick={() => {
        router.push(`/seller-panel/${link}`)
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
  const sm = useMediaQuery('sm')
  const router = useRouter()

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
  ]

  return (
    <>
      <div className="flex">
        <div className="flex h-full bg-primary py-5">
          <div className="mr-4 flex flex-col gap-2">
            <div className="relative flex justify-between">
              <div
                className="mx-6 my-1 flex max-w-[2rem] cursor-pointer items-center sm:max-w-[6rem]"
                onClick={() => {
                  router.push('/seller-panel')
                }}
              >
                <Icon color="white" small={!sm} />
              </div>
            </div>
            <div className="mt-3 h-[1px] w-full bg-white" />
            {items.map((item, idx) => (
              <SideBarMenu key={idx} {...item} />
            ))}
            <div className="absolute bottom-0 mb-8 ml-4">
              <A
                className="flex items-center gap-2 font-medium text-white"
                underline
                onClick={() => {
                  router.push('/')
                }}
              >
                <HiArrowLeft /> Back to Main App
              </A>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SectionTwoSideBarSellerPanel
