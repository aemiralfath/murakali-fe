import React, { useEffect } from 'react'

import { useRouter } from 'next/router'

import { useGetUserProfile } from '@/api/user/profile'

import { Navbar } from './template'
import Footer from './template/footer'

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userProfile = useGetUserProfile()
  const router = useRouter()

  useEffect(() => {
    if (userProfile.data?.data?.role === 3) {
      router.push('/admin/vouchers')
    }
  }, [userProfile.data?.data?.role])

  return (
    <div className="max-w-screen relative min-h-screen overflow-hidden">
      <div className="absolute z-20 w-full">
        <Navbar />
      </div>
      <main className="container relative mx-auto flex min-h-[80vh] flex-col gap-6 px-5 pt-[5.5rem] sm:pt-[7rem]">
        {children}
      </main>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
