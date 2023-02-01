import React, { useEffect, useState } from 'react'
import { HiSearch } from 'react-icons/hi'

import { useRouter } from 'next/router'

const CategorySearch = () => {
  const router = useRouter()
  const [keyword, setKeyword] = useState<string>('')

  useEffect(() => {
    setKeyword(keyword)
  }, [keyword])
  return (
    <div className="z-50 flex w-full -translate-y-[2.5rem] justify-center lg:-translate-y-[0.5rem]">
      <div className="hidden items-center gap-4 rounded-full bg-white shadow-md sm:flex sm:px-12 sm:py-5">
        <input
          placeholder="Search"
          className="transition-color border-b-[1px] p-2 focus-visible:border-primary focus-visible:outline-none"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (keyword && keyword.replace(/\s/g, '').length) {
                router.push({
                  pathname: '/search',
                  query: { keyword },
                })
              } else {
                router.push({
                  pathname: '/search',
                })
              }
            }
          }}
        ></input>
        <button
          type="submit"
          className="  h-full px-1 text-xl"
          onClick={() => {
            if (keyword && keyword.replace(/\s/g, '').length) {
              router.push({
                pathname: '/search',
                query: { keyword },
              })
            } else {
              router.push({
                pathname: '/search',
              })
            }
          }}
        >
          {' '}
          <HiSearch />
        </button>
      </div>
    </div>
  )
}

export default CategorySearch
