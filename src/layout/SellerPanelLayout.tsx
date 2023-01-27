import React from 'react'
import SectionOneSideBar from './template/sidebar/seller-panel/sectionOneSellerPanel'
import SectionTwoSideBar from './template/sidebar/seller-panel/sectionTwoSellerPanel'
import type { ValidPage } from './template/sidebar/seller-panel/sectionTwoSellerPanel'

const SellerPanelLayout: React.FC<{
  children: React.ReactNode
  selectedPage?: ValidPage
}> = ({ children, selectedPage }) => {
  return (
    <>
      <div className="drawer-mobile drawer">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col bg-gray-100 ">
          <div className="customscroll w-full max-w-full overflow-auto">
            <SectionOneSideBar />
            <div className="container mx-auto py-6 sm:px-6 lg:ml-0">
              {children}
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <div className="w-64 bg-primary">
            <SectionTwoSideBar selectedPage={selectedPage} />
          </div>
        </div>
      </div>
    </>
  )
}

export default SellerPanelLayout
