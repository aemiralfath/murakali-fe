import { useEffect, useState } from 'react'

import { searchingKeyword } from '@/redux/reducer/searchKeywordReducer'

import { useDispatch } from '.'

function useSearchKeyword() {
  const dispatch = useDispatch()
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    dispatch(searchingKeyword(keyword))
  }, [keyword])

  return setKeyword
}

export default useSearchKeyword
