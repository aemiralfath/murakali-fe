import React, { useEffect, useState } from 'react'

import { Combobox, Transition } from '@headlessui/react'
import cx from '@/helper/cx'
import Spinner from '../spinner'
import { HiChevronDown } from 'react-icons/hi'
interface SelectInputProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {
  isEdit: boolean
  selectedEdit: string | undefined
  data?: string[]
  selectedData: (data: string) => void
  isLoading?: boolean
  placeholder: string
}

const SelectComboBox: React.FC<SelectInputProps> = ({
  isEdit,
  selectedEdit,
  data,
  selectedData,
  isLoading,
  placeholder,
  ...rest
}) => {
  const [query, setQuery] = useState('')

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (selectedEdit && isEdit) {
      selectedData(selectedEdit)
      setIsOpen(false)
    }
  }, [])

  let filteredData: string[] = []

  if (data !== undefined) {
    filteredData =
      query === ''
        ? data
        : data.filter((dataDetail) => {
            if (dataDetail === undefined) {
              return dataDetail
            }
            return dataDetail.toLowerCase().includes(query.toLowerCase())
          })
  }

  return (
    <Combobox>
      <div className="relative">
        <Combobox.Input
          autoComplete="off"
          readOnly={!data || data.length === 0}
          onChange={(event) => {
            setQuery(event.target.value)
          }}
          onFocus={() => {
            setIsOpen(true)
          }}
          value={query}
          placeholder={data ? placeholder : '-'}
          className={cx(
            'input-bordered input w-full placeholder-black',
            data
              ? data.length === 0
                ? 'input-disabled'
                : ''
              : 'input-disabled'
          )}
          required={placeholder === '' ? rest.required : false}
        />
        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform justify-end">
          {isLoading ? (
            <Spinner color="neutral" />
          ) : data ? (
            <HiChevronDown />
          ) : (
            <></>
          )}
        </div>
        {data !== undefined ? (
          <Transition
            show={isOpen}
            enter="transition-opacity duration-75"
            enterFrom="scale-x-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options
              className="absolute z-50 max-h-48 w-full overflow-y-scroll rounded border bg-white shadow"
              static={isOpen}
            >
              {filteredData.map((dataDetail, index) => (
                <>
                  <Combobox.Option
                    onClick={() => {
                      selectedData(dataDetail)
                      setQuery('')
                      setIsOpen(false)
                    }}
                    key={index}
                    value={dataDetail}
                    className="border-1 -auto cursor-pointer border-solid border-slate-600 p-2 text-black"
                  >
                    {dataDetail}
                  </Combobox.Option>
                  <hr></hr>
                </>
              ))}
              <>
                <Combobox.Option
                  onClick={() => {
                    setIsOpen(false)
                  }}
                  value={''}
                  className="border-1 -auto text-black-700 cursor-pointer border-solid border-slate-600 p-2 text-center"
                >
                  Close
                </Combobox.Option>
              </>
            </Combobox.Options>
          </Transition>
        ) : (
          <></>
        )}
      </div>
    </Combobox>
  )
}

export default SelectComboBox
