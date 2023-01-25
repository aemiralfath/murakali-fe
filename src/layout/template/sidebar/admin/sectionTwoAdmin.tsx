import cx from '@/helper/cx'

import { useRouter } from 'next/router'
import React from 'react'
import { HiTag } from 'react-icons/hi'

export type ValidPage = 'voucher'

interface AdminSideBarProps {
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

const SectionTwoSideBarAdmin: React.FC<AdminSideBarProps> = ({
  selectedPage,
}) => {
  const items: Array<SideBarMenuProps> = [
    {
      link: 'vouchers',
      title: 'Voucher',
      icon: <HiTag />,
      active: selectedPage === 'voucher',
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

export default SectionTwoSideBarAdmin
