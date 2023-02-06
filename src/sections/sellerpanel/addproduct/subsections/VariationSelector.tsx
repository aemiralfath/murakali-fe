import { useState, Fragment, useEffect } from 'react'
import { HiChevronDown, HiPlus } from 'react-icons/hi'

import { Divider, TextInput, Button } from '@/components'
import cx from '@/helper/cx'
import toTitleCase from '@/helper/toTitleCase'

import { Popover, Transition } from '@headlessui/react'

const VariationSelector: React.FC<{
  disabledKeyword: string
  onChange: (s: string) => void
  defaultVariation?: string
  isEditing?: boolean
}> = ({ disabledKeyword, onChange, defaultVariation, isEditing }) => {
  const predefinedVariation = ['Color', 'Size', 'Material']

  const [customVariant, setCustomVariant] = useState('')
  const [selected, setSelected] = useState('')

  useEffect(() => {
    if (defaultVariation) {
      setSelected(defaultVariation)
    }
  }, [defaultVariation])

  return (
    <Popover className="relative w-full">
      {({ open }) => (
        <>
          <Popover.Button
            disabled={isEditing}
            className={cx(
              'input-bordered input flex w-full items-center justify-between gap-2',
              isEditing ? 'input-disabled' : ''
            )}
          >
            <span
              className={cx(
                'max-w-full overflow-hidden whitespace-nowrap',
                selected === '' ? 'text-gray-400' : 'text-base-content'
              )}
            >
              {selected === '' ? 'Select Variant Type' : selected}
            </span>
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
                    {predefinedVariation.map((v) => {
                      return (
                        <button
                          key={`select-${v}-${disabledKeyword}`}
                          disabled={v === disabledKeyword}
                          className={cx(
                            'w-full gap-8 rounded p-1 text-left',
                            v === disabledKeyword
                              ? 'cursor-default bg-gray-200 text-gray-400'
                              : 'cursor-pointer bg-white hover:bg-primary hover:bg-opacity-5 hover:text-primary'
                          )}
                          onClick={() => {
                            if (v !== disabledKeyword) {
                              setSelected(v)
                              onChange(v)
                              close()
                            }
                          }}
                        >
                          {v}
                        </button>
                      )
                    })}
                    <Divider />
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <TextInput
                          inputSize={'sm'}
                          full
                          placeholder="Add Custom Variant"
                          value={
                            customVariant === '' ? undefined : customVariant
                          }
                          onChange={(e) => setCustomVariant(e.target.value)}
                          onKeyDown={({ key }) => {
                            if (key === 'Enter') {
                              if (
                                !(
                                  customVariant === '' ||
                                  toTitleCase(customVariant) === disabledKeyword
                                )
                              ) {
                                setSelected(toTitleCase(customVariant))
                                onChange(toTitleCase(customVariant))
                                close()
                              }
                            }
                          }}
                        />
                      </div>
                      <Button
                        size="sm"
                        buttonType="ghost"
                        disabled={
                          customVariant === '' ||
                          toTitleCase(customVariant) === disabledKeyword
                        }
                        onClick={() => {
                          if (customVariant) {
                            setSelected(toTitleCase(customVariant))
                            onChange(toTitleCase(customVariant))
                            close()
                          }
                        }}
                      >
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
  )
}

export default VariationSelector
