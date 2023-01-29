import React, { useEffect, useState } from 'react'
import SectionOneSideBar from './template/sidebar/seller-panel/sectionOneSellerPanel'
import SectionTwoSideBar from './template/sidebar/seller-panel/sectionTwoSellerPanel'
import type { ValidPage } from './template/sidebar/seller-panel/sectionTwoSellerPanel'
import { useMediaQuery } from '@/hooks'
import cx from '@/helper/cx'
import { Button } from '@/components'

const SellerPanelLayout: React.FC<{
  children: React.ReactNode
  selectedPage?: ValidPage
}> = ({ children, selectedPage }) => {
  const md = useMediaQuery('md')

  const key = 'hideAlert-SellerPanel'
  const [hideAlert, setHideAlert] = useState(false)

  const handleHideAlert = () => {
    setHideAlert(true)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(key, 'true')
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const gotValue = window.sessionStorage.getItem(key)
      setHideAlert(gotValue === 'true')
    }
  }, [])

  return (
    <>
      <div className="drawer-mobile drawer">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col bg-gray-100 ">
          <div className="customscroll relative w-full max-w-full overflow-auto">
            <SectionOneSideBar />
            <div className="container mx-auto py-6 sm:px-6 lg:ml-0">
              {children}
            </div>
            {md ? (
              <></>
            ) : (
              <div
                className={cx(
                  'sticky bottom-0 left-0 z-20 w-full border-t-2 border-base-300 bg-base-200 p-5 transition-all',
                  hideAlert ? 'translate-y-[100%]' : 'h-fit'
                )}
              >
                Alert: This page is best viewed on larger screen
                <div className="mt-2 flex justify-end">
                  <Button size="xs" onClick={handleHideAlert}>
                    I Understand
                  </Button>
                </div>
              </div>
            )}
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
