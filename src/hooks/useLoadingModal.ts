import { useEffect, useState } from 'react'

import {
  closeLoadingModal,
  openLoadingModal,
} from '@/redux/reducer/loadingModalReducer'

import { useDispatch } from '.'

function useLoadingModal() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoading) {
      dispatch(openLoadingModal())
    } else {
      dispatch(closeLoadingModal())
    }
  }, [isLoading])

  return setIsLoading
}

export default useLoadingModal
