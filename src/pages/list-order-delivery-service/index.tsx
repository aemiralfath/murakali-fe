import SectionOneSideBar from '@/layout/template/sidebar/sectionOne'
import SectionTwoSideBar from '@/layout/template/sidebar/sectionTwo'
import React from 'react'

function ListOrderDeliveryService() {
  return (
    <div>
      <SectionOneSideBar />

      <div className="flex">
        <SectionTwoSideBar selectedPage="order" />
        <div className="border-grey-200 z-10 m-5 flex h-full items-center rounded-lg border-[1px] border-solid py-7 px-8"></div>
      </div>
    </div>
  )
}

export default ListOrderDeliveryService
