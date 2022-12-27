import React from 'react'
import { useRouter } from 'next/router'
import {
  FaUserAlt,
  FaLock,
  FaListAlt,
  FaAddressCard,
  FaWallet,
  FaMoneyBillWave,
} from 'react-icons/fa'

interface IData {
  selectedPage: string
}

const ProfileMenu: React.FC<IData> = ({ selectedPage }) => {
  const router = useRouter()
  return (
    <div>
      <div className="border-1 h-min rounded-lg border-solid border-slate-600 p-8 shadow-2xl">
        <div className="flex flex-col gap-y-10">
          <button
            className={selectedPage === 'profile' ? 'text-indigo-500' : ''}
            onClick={() => {
              router.push('/profile')
            }}
          >
            <div className="flex-column flex gap-x-2">
              <FaUserAlt /> My Profile
            </div>
          </button>

          <button
            className={
              selectedPage === 'change-login-credential'
                ? 'text-indigo-500'
                : ''
            }
            onClick={() => {
              router.push('/profile/change-login-credential')
            }}
          >
            <div className="flex-column flex gap-x-2">
              <FaLock /> Change Login Credential
            </div>
          </button>

          <button
            className={
              selectedPage === 'transactionhistory' ? 'text-indigo-500' : ''
            }
          >
            <div className="flex-column flex gap-x-2">
              {' '}
              <FaListAlt />
              Transaction History
            </div>
          </button>

          <button
            className={selectedPage === 'address' ? 'text-indigo-500' : ''}
            onClick={() => {
              router.push('/profile/address')
            }}
          >
            <div className="flex-column flex gap-x-2">
              <FaAddressCard />
              Address
            </div>
          </button>

          <button
            className={selectedPage === 'wallet' ? 'text-indigo-500' : ''}
          >
            <div className="flex-column flex gap-x-2">
              <FaWallet />
              My Wallet
            </div>
          </button>

          <button
            className={selectedPage === 'digiwalet' ? 'text-indigo-500' : ''}
          >
            <div className="flex-column flex gap-x-2">
              <FaMoneyBillWave />
              Digiwalet
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileMenu
