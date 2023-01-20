import { H3, H4, Chip, P, TextInput, TextArea } from '@/components'
import toTitleCase from '@/helper/toTitleCase'
import type { CategoryData } from '@/types/api/category'
import { RadioGroup } from '@headlessui/react'
import React, { useEffect, useState } from 'react'

const ManagePromotionSaction: React.FC<{
  nameValue: string
  setName: (s: string) => void
}> = ({ nameValue, setName }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryData[]>([])
  const getSelectedCategoryStr = () => {
    if (selectedCategory[0]?.name) {
      let val = ''
      if (selectedCategory[0]) {
        val = val + `${toTitleCase(selectedCategory[0].name)}`
      }
      if (selectedCategory[1]) {
        val = val + ` > ${toTitleCase(selectedCategory[1].name)}`
      }
      if (selectedCategory[2]) {
        val = val + ` > ${toTitleCase(selectedCategory[2].name)}`
      }

      return val
    } else {
      return undefined
    }
  }

  return (
    <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
      <H3>Promotion Information</H3>
      <div className="mt-6 flex justify-between gap-3">
        <div className="w-[30%]">
          <div className="flex items-center gap-3">
            <H4>Promotion Name</H4>
          </div>
        </div>
        <div className="flex-1">
          <TextInput
            full
            value={nameValue}
            onChange={(e) => setName(e.target.value)}
            placeholder=""
          />
        </div>
      </div>
      <div className="mt-6 flex justify-between gap-3">
        <div className="w-[30%]">
          <div className="flex items-center gap-3">
            <H4>Promotion Name</H4>
          </div>
        </div>
        <div className="flex-1">
          <TextInput
            type="datetime-local"
            full
            value={nameValue}
            onChange={(e) => setName(e.target.value)}
            placeholder=""
          />
        </div>
      </div>
      <div className="mt-6 flex justify-between gap-3">
        <div className="w-[30%]">
          <div className="flex items-center gap-3">
            <H4>Description</H4>
            <Chip type={'gray'}>Required</Chip>
          </div>
          <P className="mt-2 max-w-[20rem] text-sm">
            Make sure your product description includes detailed explanations
            about your product so that buyers can easily understand and find it.
          </P>
        </div>
        <div className="-z-0 flex-1">
          <TextArea
            rows={8}
            full
            // value={descriptionValue}
            // onChange={(e) => setDescription(e.target.value)}
            placeholder={`Vens Authentic Casual Shoe Black Canvas Series C28B
          `}
          />
        </div>
      </div>
    </div>
  )
}

export default ManagePromotionSaction
