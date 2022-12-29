import categoriesData from '@/dummy/categoriesData'
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { HiChevronDown, HiSearch } from 'react-icons/hi'

const CategorySearch = () => {
  const [selectedCategory, setSelectedCategory] = useState(0)

  return (
    <div className="z-50 flex w-full -translate-y-[2.5rem] justify-center lg:-translate-y-[0.5rem]">
      <div className="hidden items-center gap-4 rounded-full bg-white shadow-md sm:flex sm:px-12 sm:py-5">
        <Menu as="div" className="inline-block w-fit text-left">
          <Menu.Button>
            <a className="flex items-center gap-2">
              <>
                {
                  categoriesData.filter(
                    (data) => data.id === selectedCategory
                  )[0].name
                }{' '}
                <HiChevronDown />
              </>
            </a>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className={
                'absolute mt-2 w-[32rem] origin-top-left divide-y divide-gray-100 rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none xl:w-[48rem]'
              }
            >
              <div className="grid grid-flow-row grid-cols-3 p-1">
                {categoriesData.map((category) => (
                  <Menu.Item key={category.id}>
                    <a
                      onClick={() => setSelectedCategory(category.id)}
                      className="w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded p-1 transition-all hover:bg-primary hover:bg-opacity-10 hover:text-primary"
                    >
                      {category.name}
                      <br />
                    </a>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <input
          placeholder="Search"
          className="transition-color border-b-[1px] p-2 focus-visible:border-primary focus-visible:outline-none"
        ></input>
        <HiSearch />
      </div>
    </div>
  )
}

export default CategorySearch
