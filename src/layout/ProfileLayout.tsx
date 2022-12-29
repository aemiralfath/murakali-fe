import ProfileMenu from '@/layout/template/profile/ProfileMenu'
import React from 'react'
import Head from 'next/head'
import MainLayout from '@/layout/MainLayout'

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Head>
        <title>Profile | Murakali</title>
        <meta
          name="description"
          content="Profile | Murakali E-Commerce Application"
        />
      </Head>
      <MainLayout>
        <div className="grid grid-cols-1 gap-x-0 gap-y-2 md:grid-cols-4 md:gap-x-2">
          <ProfileMenu selectedPage="profile" />
          <div className="col-span-3 min-h-full rounded border-[1px] bg-white p-8">
            {children}
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default ProfileLayout
