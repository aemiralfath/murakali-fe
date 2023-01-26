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
      <SectionOneSideBar />
      <div className="flex w-full bg-primary bg-opacity-5">
        <SectionTwoSideBar selectedPage={selectedPage} />
        <div className="w-full max-w-full overflow-auto">
          <div className="container p-6">{children}</div>
        </div>
      </div>
    </>
  )
}

export default SellerPanelLayout
