import React from 'react'
import SectionOneSideBar from './template/sidebar/sectionOne'
import SectionTwoSideBar from './template/sidebar/sectionTwo'
import type { ValidPage } from './template/sidebar/sectionTwo'

const SellerPanelLayout: React.FC<{
  children: React.ReactNode
  selectedPage: ValidPage
}> = ({ children, selectedPage }) => {
  return (
    <>
      <SectionOneSideBar />
      <div className="flex w-full bg-primary bg-opacity-5">
        <SectionTwoSideBar selectedPage={selectedPage} />
        <div className="min-h-full w-full max-w-full overflow-auto">
          <div className="container p-6">{children}</div>
        </div>
      </div>
    </>
  )
}

export default SellerPanelLayout
