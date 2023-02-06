import React from 'react'

import MainLayout from '@/layout/MainLayout'
import type { ValidPage } from '@/layout/template/profile/ProfileMenu'
import ProfileMenu from '@/layout/template/profile/ProfileMenu'

const ProfileLayout: React.FC<{
  children: React.ReactNode
  selectedPage: ValidPage
}> = ({ children, selectedPage }) => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-x-0 gap-y-2 md:grid-cols-4 md:gap-x-2">
        <ProfileMenu selectedPage={selectedPage} />
        <div className="col-span-3 min-h-full rounded md:border-[1px] bg-white py-8 md:px-8">
          {children}
        </div>
      </div>
    </MainLayout>
  )
}

export default ProfileLayout
