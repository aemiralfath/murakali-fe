import { Button, Chip, Divider, H3, H4, P, TextInput } from '@/components'
import SelectComboBox from '@/components/selectinput/SelectCombobox'
import Table from '@/components/table'
import cx from '@/helper/cx'
import { Popover, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { HiChevronDown, HiOutlineLightBulb, HiPlus } from 'react-icons/hi'

const ProductVariants = () => {
  const [variant1, setVariant1] = useState('')

  return (
    <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
      <div className="flex items-center gap-3">
        <H3>Product Variants</H3>
        <Chip type={'gray'}>Required</Chip>
      </div>
      <P className="mt-2 flex items-center gap-1 text-sm">
        <HiOutlineLightBulb className="text-accent" /> Add product variants so
        your buyer can get the right product. (Max. 2 variant types)
      </P>
      <div className="mt-6 rounded border p-6">
        <H4>Variation 1</H4>
        <div className="mt-2 flex gap-3">
          <div className="flex w-[30%]">
            <Popover className="relative w-full">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={cx(
                      'input-bordered input flex w-full items-center justify-between gap-2'
                    )}
                  >
                    <span className="text-gray-400">Select Variant Type</span>
                    <span className={cx('transform', open ? 'rotate-180' : '')}>
                      <HiChevronDown />
                    </span>
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 -translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-1"
                  >
                    <Popover.Panel className="absolute left-0 z-10 mt-1 w-full transform px-4 sm:px-0">
                      {({ close }) => {
                        return (
                          <div className="flex flex-col items-start gap-2 overflow-hidden rounded-lg border bg-white p-2 shadow-lg">
                            <button
                              className="w-full cursor-pointer gap-8 rounded bg-white p-1 text-left hover:bg-primary hover:bg-opacity-5 hover:text-primary"
                              onClick={() => close()}
                            >
                              Color
                            </button>
                            <button
                              className="w-full cursor-pointer gap-8 rounded bg-white p-1 text-left hover:bg-primary hover:bg-opacity-5 hover:text-primary"
                              onClick={() => close()}
                            >
                              Size
                            </button>
                            <button
                              className="w-full cursor-pointer gap-8 rounded bg-white p-1 text-left hover:bg-primary hover:bg-opacity-5 hover:text-primary"
                              onClick={() => close()}
                            >
                              Material
                            </button>
                            <Divider />
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <TextInput
                                  inputSize={'sm'}
                                  full
                                  placeholder="Add Custom Variant"
                                />
                              </div>
                              <Button size="sm" buttonType="ghost">
                                <HiPlus /> Add
                              </Button>
                            </div>
                          </div>
                        )
                      }}
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
          <div className="input-bordered input flex w-full items-center gap-3">
            <Chip>Hello</Chip>
            <input
              className="focus-visible:outline-none"
              placeholder="Variant Name"
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Button buttonType="ghost">
          <HiPlus />
          Add Variant Type
        </Button>
      </div>
      <div className="py-6">
        <Divider />
      </div>
      <div>
        <Table
          data={[
            {
              'Variation 1': '',
              'Variation 2': '',
              'Price*': '',
              'Stock*': '',
              'Weight* (gr)': '',
            },
          ]}
          empty
          wide
        />
      </div>
    </div>
  )
}

export default ProductVariants
