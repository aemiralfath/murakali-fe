import SectionOneSideBar from '@/layout/template/sidebar/sectionOne'
import SectionTwoSideBar from '@/layout/template/sidebar/sectionTwo'
import Head from 'next/head'
import React from 'react'

function SellerDeliveryService() {
  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SectionOneSideBar />
      <div className="flex">
        <SectionTwoSideBar selectedPage="order" />
        <div
          className="border-grey-200 z-10 m-5 flex h-full w-full max-w-full flex-col 
        items-center overflow-auto rounded-lg border-[1px] border-solid py-7 px-8"
        ></div>
      </div>
    </div>
  )
}

export default SellerDeliveryService
