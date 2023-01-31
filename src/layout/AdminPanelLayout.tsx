import React from 'react'

import SectionOneSideBarAdmin from './template/sidebar/admin/sectionOneAdmin'
import SectionTwoSideBarAdmin from './template/sidebar/admin/sectionTwoAdmin'
import type { ValidPage } from './template/sidebar/admin/sectionTwoAdmin'

const AdminPanelLayout: React.FC<{
  children: React.ReactNode
  selectedPage: ValidPage
}> = ({ children, selectedPage }) => {
  return (
    <>
      <SectionOneSideBarAdmin />
      <div className="flex w-full bg-primary bg-opacity-5">
        <SectionTwoSideBarAdmin selectedPage={selectedPage} />
        <div className="w-full max-w-full overflow-auto">
          <div className="container p-6">{children}</div>
        </div>
      </div>
    </>
  )
}

export default AdminPanelLayout
