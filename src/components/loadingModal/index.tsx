import React from 'react'

import cx from '@/helper/cx'
import { useSelector } from '@/hooks'

import IconLoading from '../iconLoading'
import { P } from '../typography'

const LoadingModal = () => {
  const loadingModal = useSelector((state) => state.loadingModal)

  return (
    <div
      className={cx(
        'pin fixed top-0 left-0 z-[9000] h-screen w-screen overflow-y-hidden',
        loadingModal.isLoadingOpen ? 'block' : 'hidden'
      )}
    >
      <div className="inset-0 flex h-full w-full items-center justify-center bg-neutral-focus bg-opacity-25">
        <div className="flex aspect-square w-[200px] flex-col items-center justify-center rounded-full bg-white shadow-xl">
          <div className="max-w-[6rem]">
            <IconLoading color="primary" />
            <P className="mt-2 whitespace-nowrap text-center text-sm text-primary">
              Loading ...
            </P>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingModal
