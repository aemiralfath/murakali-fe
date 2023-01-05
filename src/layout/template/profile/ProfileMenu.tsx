import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  HiCreditCard,
  HiHome,
  HiIdentification,
  HiLibrary,
  HiLockClosed,
  HiLogout,
  HiTable,
  HiUser,
} from 'react-icons/hi'
import cx from '@/helper/cx'
import { useLogout } from '@/api/auth/logout'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { APIResponse } from '@/types/api/response'

export type ValidPage =
  | 'profile'
  | 'edit-login-credential'
  | 'transaction-history'
  | 'address'
  | 'wallet'
  | 'digiwallet'
  | 'merchant'
  | 'logout'

interface ProfileMenuProps {
  selectedPage: ValidPage
}

interface MenuItemsProps {
  icon: React.ReactNode
  title: string
  link: ValidPage
  active: boolean
}

const MenuItems: React.FC<MenuItemsProps> = ({ icon, title, link, active }) => {
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
    <button
      className={cx(
        'px-6 py-4 transition-all',
        active
          ? 'bg-primary font-bold text-white'
          : 'hover:bg-primary hover:bg-opacity-20 hover:font-bold hover:text-primary'
      )}
      onClick={() => {
        if (link === 'logout') {
          logout.mutate()
        } else if (link === 'merchant') {
          router.push('/merchant')
        } else if (!active) {
          router.push('/profile' + (link === 'profile' ? '' : `/${link}`))
        }
      }}
    >
      <div className="flex-column flex items-center gap-x-2 text-left">
        <div>{icon}</div>
        <span className=" line-clamp-1">{title}</span>
      </div>
    </button>
  )
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ selectedPage }) => {
  const items: Array<MenuItemsProps> = [
    {
      link: 'profile',
      title: 'My Profile',
      icon: <HiUser />,
      active: selectedPage === 'profile',
    },
    {
      link: 'edit-login-credential',
      title: 'Edit Login Credentials',
      icon: <HiLockClosed />,
      active: selectedPage === 'edit-login-credential',
    },
    {
      link: 'transaction-history',
      title: 'Transaction History',
      icon: <HiTable />,
      active: selectedPage === 'transaction-history',
    },
    {
      link: 'address',
      title: 'Address',
      icon: <HiIdentification />,
      active: selectedPage === 'address',
    },
    {
      link: 'wallet',
      title: 'Wallet',
      icon: <HiCreditCard />,
      active: selectedPage === 'wallet',
    },
    {
      link: 'digiwallet',
      title: 'Digiwallet',
      icon: <HiLibrary />,
      active: selectedPage === 'digiwallet',
    },
    {
      link: 'merchant',
      title: 'Merchant',
      icon: <HiHome />,
      active: selectedPage === 'merchant',
    },
    {
      link: 'logout',
      title: 'Logout',
      icon: <HiLogout />,
      active: selectedPage === 'logout',
    },
  ]

  return (
    <div>
      <div className="h-fit rounded border-[1px]">
        <div className="flex flex-col gap-2 py-4">
          {items.map((item, idx) => (
            <MenuItems key={idx} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileMenu
