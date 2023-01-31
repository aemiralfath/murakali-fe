import React, { useState } from 'react'
import { HiFilter } from 'react-icons/hi'

import { H4, TextInput, P } from '@/components'

export type FilterPrice = {
  min: number
  max: number
}

const PriceFilter: React.FC<{
  setFilterPrice: (p: FilterPrice | undefined) => void
}> = ({ setFilterPrice }) => {
  const [minFilter, setMinFilter] = useState(0)
  const [maxFilter, setMaxFilter] = useState(0)

  return (
    <div>
      <H4>Price Range</H4>
      <div className="mt-1">
        <form
          className="flex max-w-full flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            setFilterPrice({ min: minFilter, max: maxFilter })
          }}
        >
          <TextInput
            type={'number'}
            placeholder={'Minimum'}
            min={0}
            fit
            inputSize="sm"
            required
            value={minFilter === 0 ? undefined : minFilter}
            onChange={(e) => {
              const parsed = parseInt(e.target.value)
              if (parsed <= 0) {
                setMinFilter(0)
              } else {
                setMinFilter(parsed)
              }
            }}
            leftIcon={<P className="text-sm font-semibold opacity-50">Rp.</P>}
          />
          <TextInput
            type={'number'}
            placeholder={'Maximum'}
            min={minFilter}
            fit
            inputSize="sm"
            required
            value={maxFilter === 0 ? undefined : maxFilter}
            onChange={(e) => {
              const parsed = parseInt(e.target.value)
              if (parsed <= 0) {
                setMaxFilter(0)
              } else {
                setMaxFilter(parsed)
              }
            }}
            leftIcon={<P className="text-sm font-semibold opacity-50">Rp.</P>}
          />
          <div className="mt-2 flex w-full justify-end">
            <button
              className="flex items-center gap-1 text-sm font-semibold text-primary"
              type="submit"
            >
              <HiFilter /> Set
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PriceFilter
