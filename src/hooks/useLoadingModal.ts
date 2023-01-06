import { closeModal, openModal } from '@/redux/reducer/loadingModalReducer'
import { useEffect, useState } from 'react'
import { useDispatch } from '.'

function useLoadingModal() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState()

  useEffect(() => {
    if (isLoading) {
      dispatch(openModal())
    } else {
      dispatch(closeModal())
    }
  }, [isLoading])

  return setIsLoading
}

export default useLoadingModal
