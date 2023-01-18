import { H3, H4, Chip, P, TextInput, TextArea } from '@/components'
import toTitleCase from '@/helper/toTitleCase'
import type { CategoryData } from '@/types/api/category'
import { RadioGroup } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import CategorySelector from './subsections/CategorySelector'

const ProductInfo: React.FC<{
  nameValue: string
  setName: (s: string) => void
  setCategoryID: (id: string) => void
  conditionValue: string
  setCondition: (s: 'new' | 'used') => void
  descriptionValue: string
  setDescription: (s: string) => void
  categoryData?: CategoryData[]
  defaultCategory?: string
  isEditing?: boolean
}> = ({
  nameValue,
  setName,
  setCategoryID,
  conditionValue,
  setCondition,
  descriptionValue,
  setDescription,
  categoryData,
  defaultCategory,
  isEditing,
}) => {
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
  useEffect(() => {
    if (selectedCategory.length > 0) {
      setCategoryID(selectedCategory.at(-1)?.id)
    }
  }, [selectedCategory])

  return (
    <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
      <H3>Product Information</H3>
      <div className="mt-6 flex justify-between gap-3">
        <div className="w-[30%]">
          <div className="flex items-center gap-3">
            <H4>Product Name</H4>
            <Chip type={'gray'}>Required</Chip>
          </div>
          <P className="mt-2 max-w-[20rem] text-sm">
            The product name should be at least 40 characters long and include
            the brand, type of product, or material.
            <br />
            <br />
            It is recommended not to use too many capital letters, include more
            than one brand, and promotional words.
          </P>
        </div>
        <div className="flex-1">
          <TextInput
            full
            value={nameValue}
            onChange={(e) => setName(e.target.value)}
            placeholder="Example: Vens (Brand) + Authentic Casual Shoe (Type) + Canvas (Material)"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-between gap-3">
        <div className="w-[30%]">
          <div className="flex items-center gap-3">
            <H4>Category</H4>
            <Chip type={'gray'}>Required</Chip>
          </div>
          <P className="mt-2 max-w-[20rem] text-sm">
            Choose the appropriate category because the product will be
            displayed to users based on the category selected.
          </P>
        </div>
        <div className="flex-1">
          <TextInput
            full
            placeholder={`Click "Choose Category"`}
            readOnly
            errorMsg={isEditing ? 'Category cannot be edited' : ''}
            value={
              isEditing
                ? defaultCategory
                  ? toTitleCase(defaultCategory)
                  : getSelectedCategoryStr()
                : getSelectedCategoryStr()
            }
          />
        </div>
        <CategorySelector
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categoryData={categoryData}
          disabled={isEditing}
        />
      </div>
      <div className="mt-6 flex gap-3">
        <div className="w-[30%]">
          <div className="flex items-center gap-3">
            <H4>Condition</H4>
          </div>
        </div>
        <RadioGroup
          value={conditionValue}
          onChange={setCondition}
          className="flex gap-2"
          id="condition"
        >
          <RadioGroup.Option value="new">
            {({ checked }) => (
              <label className="label flex cursor-pointer gap-1">
                <input
                  type="radio"
                  name="radio-condition-new"
                  className="radio checked:bg-primary"
                  checked={checked}
                />
                <span className="label-text">New</span>
              </label>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="used">
            {({ checked }) => (
              <label className="label flex cursor-pointer gap-1">
                <input
                  type="radio"
                  name="radio-condition-used"
                  className="radio checked:bg-primary"
                  checked={checked}
                />
                <span className="label-text">Used</span>
              </label>
            )}
          </RadioGroup.Option>
        </RadioGroup>
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
            value={descriptionValue}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Vens Authentic Casual Shoe Black Canvas Series C28B

- Simple model
- Comfortable
- Available in Black
- Sole PVC (injection shoes), very soft and durable for everyday use

Material:
Upper: Canvas
Sole: Premium Rubber Sole

Size
39 : 25,5 cm
40 : 26 cm
41 : 26.5 cm
42 : 27 cm
43 : 27.5 - 28 cm

Limited edition from Vens with the newest and trendy model just for you. Designed for every occasion. Very comfortable to wear and can enhance your looks and confidence. Buy now while stock lasts!
          `}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
