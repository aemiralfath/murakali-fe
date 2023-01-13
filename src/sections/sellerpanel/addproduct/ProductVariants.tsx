/* eslint-disable @next/next/no-img-element */
import { Button, Chip, Divider, H3, H4, P, TextInput } from '@/components'
import cx from '@/helper/cx'
import toTitleCase from '@/helper/toTitleCase'
import { useModal } from '@/hooks'
import CropperComponent from '@/layout/template/cropper'
import { Popover, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'
import {
  HiAdjustments,
  HiChevronDown,
  HiOutlineLightBulb,
  HiPlus,
  HiTrash,
  HiUpload,
  HiX,
} from 'react-icons/hi'
import type { ChangeEvent } from 'react'
import type { ProductDetailReq } from '@/types/api/product'

const Uploader: React.FC<{ id: string; title: string }> = ({ id, title }) => {
  const modal = useModal()
  const [image, setImage] = useState<string>()

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      setImage(URL.createObjectURL(event.target.files[0]))
      reader.readAsDataURL(event.target.files[0])
    }
  }

  return (
    <div className="flex w-full items-center justify-center">
      <label
        htmlFor={id}
        className={cx(
          'flex aspect-square h-[8rem] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all',
          image
            ? ''
            : 'group cursor-pointer hover:border-primary hover:bg-primary hover:bg-opacity-5'
        )}
      >
        {image ? (
          <div className="relative h-full w-full text-sm">
            <div className="absolute bottom-0 right-0 z-10 flex gap-1 p-2">
              <Button
                className="aspect-square rounded border-gray-200 bg-white shadow"
                outlined
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  modal.edit({
                    title: 'Crop Image',
                    content: (
                      <div>
                        <CropperComponent src={image} setImage={setImage} />
                      </div>
                    ),
                    closeButton: false,
                  })
                }}
              >
                <HiAdjustments />
              </Button>
              <Button
                className="aspect-square rounded border-gray-200 bg-white shadow"
                outlined
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setImage(undefined)
                }}
              >
                <HiTrash />
              </Button>
            </div>
            <img
              src={image}
              alt={'Preview Image'}
              className={
                'absolute top-1/2 left-1/2 z-0 max-h-full max-w-full -translate-y-1/2 -translate-x-1/2 rounded-lg object-fill'
              }
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center px-5 pt-5 pb-6">
              <HiUpload className="mb-3 h-10 w-10 text-gray-400 transition-all group-hover:text-primary" />
              <p className="text-center text-sm font-semibold text-gray-500 transition-all group-hover:text-primary">
                {title}
              </p>
              <p className="text-center text-xs text-gray-500 transition-all group-hover:text-primary">
                Click to upload
              </p>
            </div>
            <input
              accept="image/jpeg, image/jpg, image/x-png, image/png"
              id={id}
              type="file"
              className="hidden"
              onChange={onImageChange}
            />
          </>
        )}
      </label>
    </div>
  )
}

const VariationSelector: React.FC<{
  disabledKeyword: string
  onChange: (s: string) => void
}> = ({ disabledKeyword, onChange }) => {
  const predefinedVariation = ['Color', 'Size', 'Material']

  const [customVariant, setCustomVariant] = useState('')
  const [selected, setSelected] = useState('')

  return (
    <Popover className="relative w-full">
      {({ open }) => (
        <>
          <Popover.Button
            className={cx(
              'input-bordered input flex w-full items-center justify-between gap-2'
            )}
          >
            <span
              className={cx(
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

const VariantChip: React.FC<{
  content: string
  onClose: (s: string) => void
}> = ({ content, onClose }) => {
  return (
    <Chip className="flex items-center gap-1 normal-case" type="gray">
      {content}
      <button
        className="aspect-square rounded-full bg-black bg-opacity-10 p-[0.1rem] transition-all hover:bg-opacity-20"
        onClick={() => {
          onClose(content)
        }}
      >
        <HiX />
      </button>
    </Chip>
  )
}

const ProductVariants = () => {
  const [variantType, setVariantType] = useState<string[]>(['', ''])
  const [variantNames, setVariantNames] = useState<string[][]>([[], []])
  const [openVariantTwo, setOpenVariantTwo] = useState(false)

  const [tempVariantNameOne, setTempVariantNameOne] = useState('')
  const [tempVariantNameTwo, setTempVariantNameTwo] = useState('')

  const addVariantName = (idx: number, content: string) => {
    const tempVariantNames = variantNames.map((n, i) => {
      if (i === idx) {
        return [...n, content]
      } else {
        return n
      }
    })
    setVariantNames(tempVariantNames)
  }

  const removeVariantName = (idx: number, content: string) => {
    const tempVariantNames = variantNames.map((n, i) => {
      if (i === idx) {
        return n.filter((vn) => vn !== content)
      } else {
        return n
      }
    })
    setVariantNames(tempVariantNames)
  }

  const handleOpenVariantTwo = () => {
    setOpenVariantTwo(true)
  }

  const handleCloseVariantTwo = () => {
    setOpenVariantTwo(false)
    setVariantType(
      variantType.map((t, i) => {
        if (i === 1) {
          return ''
        } else {
          return t
        }
      })
    )
    setVariantNames(
      variantNames.map((n, i) => {
        if (i === 1) {
          return []
        } else {
          return n
        }
      })
    )
  }

  const [productDetailData, updateProductDetailData] = useImmer<{
    [key: string]: ProductDetailReq
  }>({})

  const getKey = (vname1: string, vname2?: string) => {
    return `1-${vname1}` + (vname2 ? '' : `-2-${vname2}`)
  }

  const handleChangePrice = (key: string, newVal: number) => {
    updateProductDetailData((draft) => {
      draft[key].price = newVal
    })
  }

  const handleChangeStock = (key: string, newVal: number) => {
    updateProductDetailData((draft) => {
      draft[key].stock = newVal
    })
  }

  const handleChangeWeight = (key: string, newVal: number) => {
    updateProductDetailData((draft) => {
      draft[key].weight = newVal
    })
  }

  const handleChangeVolume = (key: string, newVal: number) => {
    updateProductDetailData((draft) => {
      draft[key].size = newVal
    })
  }

  useEffect(() => {
    const lastData = productDetailData
    updateProductDetailData({})

    variantNames[0].forEach((vname1) => {
      if (variantNames[1].length > 0) {
        variantNames[1].forEach((vname2) => {
          const key = getKey(vname1, vname2)
          updateProductDetailData((draft) => {
            draft[key] = lastData[key] ?? {
              price: 0,
              stock: 0,
              weight: 0,
              size: 0,
              hazardous: false,
              condition: 'new',
              bulk_price: false,
              photo: [],
              variant_detail: [
                {
                  name: vname1,
                  type: variantType[0],
                },
                {
                  name: vname2,
                  type: variantType[1],
                },
              ],
            }
          })
        })
      } else {
        const key = getKey(vname1)
        updateProductDetailData((draft) => {
          draft[key] = lastData[key] ?? {
            price: 0,
            stock: 0,
            weight: 0,
            size: 0,
            hazardous: false,
            condition: 'new',
            bulk_price: false,
            photo: [],
            variant_detail: [
              {
                name: vname1,
                type: variantType[0],
              },
            ],
          }
        })
      }
    })
  }, [variantType, variantNames])

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
            <VariationSelector
              disabledKeyword={variantType[1]}
              onChange={(s) => {
                setVariantType(
                  variantType.map((v, i) => {
                    if (i === 0) {
                      return s
                    } else {
                      return v
                    }
                  })
                )
              }}
            />
          </div>
          <div
            className={cx(
              'input-bordered input flex h-fit min-h-[3rem] w-full flex-wrap items-center gap-3 py-2',
              Boolean(variantType[0]) ? '' : 'input-disabled'
            )}
          >
            {variantNames[0].map((varNames, idx) => {
              return (
                <VariantChip
                  key={`${varNames}-${idx}-0`}
                  content={varNames}
                  onClose={(n) => {
                    removeVariantName(0, n)
                  }}
                />
              )
            })}
            <input
              disabled={!Boolean(variantType[0])}
              className="focus-visible:outline-none"
              placeholder="Enter Variant Name"
              value={tempVariantNameOne}
              onChange={(e) => {
                setTempVariantNameOne(e.target.value)
              }}
              onKeyDown={({ key }) => {
                if (key === 'Enter') {
                  addVariantName(0, toTitleCase(tempVariantNameOne))
                  setTempVariantNameOne('')
                }
              }}
            />
          </div>
        </div>
      </div>
      {openVariantTwo ? (
        <div className="mt-6 rounded border p-6">
          <H4 className="flex items-center gap-2">
            <span>Variation 2</span>
            <HiTrash
              className="cursor-pointer text-gray-600 hover:text-base-content"
              onClick={handleCloseVariantTwo}
            />
          </H4>
          <div className="mt-2 flex gap-3">
            <div className="flex w-[30%]">
              <VariationSelector
                disabledKeyword={variantType[0]}
                onChange={(s) => {
                  if (variantType.length === 1) {
                    setVariantType([...variantType, s])
                  } else {
                    setVariantType(
                      variantType.map((t, i) => {
                        if (i === 1) {
                          return s
                        } else {
                          return t
                        }
                      })
                    )
                  }
                }}
              />
            </div>
            <div
              className={cx(
                'input-bordered input flex h-fit min-h-[3rem] w-full flex-wrap items-center gap-3 py-2',
                Boolean(variantType[1]) ? '' : 'input-disabled'
              )}
            >
              {variantNames[1].map((varNames, idx) => {
                return (
                  <VariantChip
                    key={`${varNames}-${idx}-0`}
                    content={varNames}
                    onClose={(n) => {
                      removeVariantName(1, n)
                    }}
                  />
                )
              })}
              <input
                disabled={!Boolean(variantType[1])}
                className="focus-visible:outline-none"
                placeholder="Enter Variant Name"
                value={tempVariantNameTwo}
                onChange={(e) => {
                  setTempVariantNameTwo(e.target.value)
                }}
                onKeyDown={({ key }) => {
                  if (key === 'Enter') {
                    addVariantName(1, toTitleCase(tempVariantNameTwo))
                    setTempVariantNameTwo('')
                  }
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <Button buttonType="ghost" onClick={handleOpenVariantTwo}>
            <HiPlus />
            Add Variant Type
          </Button>
        </div>
      )}
      <div className="py-6">
        <Divider />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex w-fit items-center gap-2 rounded bg-base-200 px-6 py-3">
          <input type={'checkbox'} className={'checkbox'} />
          <button>
            <HiChevronDown />
          </button>
        </div>
        Select some products
      </div>
      <div className="mt-3 max-w-full flex-col divide-y-[1px] overflow-auto">
        {variantNames[0].length > 0 ? (
          openVariantTwo ? (
            variantNames[1].length > 0 ? (
              variantNames[0].map((vname1) => {
                return (
                  <>
                    {variantNames[1].map((vname2) => {
                      return (
                        <div
                          className="flex w-fit justify-start p-6"
                          key={getKey(vname1, vname2)}
                        >
                          <div className="mt-3 w-[3rem]">
                            <input type={'checkbox'} className={'checkbox'} />
                          </div>
                          <div className="w-[8.5rem]">
                            <Uploader
                              id={getKey(vname1, vname2)}
                              title={'Photo'}
                            />
                            <div className="mt-2 min-w-[12rem] pl-2 text-sm ">
                              <div className="flex items-baseline gap-2">
                                <span className="font-semibold">
                                  {variantType[0]}:
                                </span>
                                <span>{vname1}</span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="font-semibold">
                                  {variantType[1]}:
                                </span>
                                <span>{vname2}</span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-6">
                            <div className="-mt-2 flex gap-2">
                              <TextInput
                                label="Price (Rp.)"
                                value={
                                  productDetailData[getKey(vname1, vname2)]
                                    ?.price
                                }
                                onChange={(e) => {
                                  const parsed = parseInt(e.target.value)
                                  handleChangePrice(
                                    getKey(vname1, vname2),
                                    Number.isNaN(parsed) ? 0 : parsed
                                  )
                                }}
                              />
                              <TextInput
                                label="Stock"
                                value={
                                  productDetailData[getKey(vname1, vname2)]
                                    ?.stock
                                }
                                onChange={(e) => {
                                  const parsed = parseInt(e.target.value)
                                  handleChangeStock(
                                    getKey(vname1, vname2),
                                    Number.isNaN(parsed) ? 0 : parsed
                                  )
                                }}
                              />
                              <TextInput
                                label="Weight"
                                value={
                                  productDetailData[getKey(vname1, vname2)]
                                    ?.weight
                                }
                                onChange={(e) => {
                                  const parsed = parseInt(e.target.value)
                                  handleChangeWeight(
                                    getKey(vname1, vname2),
                                    Number.isNaN(parsed) ? 0 : parsed
                                  )
                                }}
                              />
                            </div>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex items-end gap-2">
                                <div className="max-w-[8rem]">
                                  <TextInput
                                    label="Volume (cm3)"
                                    full
                                    value={
                                      productDetailData[getKey(vname1, vname2)]
                                        ?.size
                                    }
                                    onChange={(e) => {
                                      const parsed = parseInt(e.target.value)
                                      handleChangeVolume(
                                        getKey(vname1, vname2),
                                        Number.isNaN(parsed) ? 0 : parsed
                                      )
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )
              })
            ) : (
              <div>No Data</div>
            )
          ) : (
            variantNames[0].map((vname, i) => {
              return (
                <div
                  className="flex w-fit justify-start p-6"
                  key={`${i}-${vname}`}
                >
                  <div className="mt-3 w-[3rem]">
                    <input type={'checkbox'} className={'checkbox'} />
                  </div>
                  <div className="w-[8.5rem]">
                    <Uploader id={`id-ab`} title={'Photo'} />
                    <div className="mt-2 min-w-[12rem] pl-2 text-sm ">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold">{variantType[0]}:</span>
                        <span>{vname}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <div className="-mt-2 flex gap-2">
                      <TextInput
                        label="Price (Rp.)"
                        value={productDetailData[getKey(vname)]?.price}
                        onChange={(e) => {
                          const parsed = parseInt(e.target.value)
                          handleChangePrice(
                            getKey(vname),
                            Number.isNaN(parsed) ? 0 : parsed
                          )
                        }}
                      />
                      <TextInput
                        label="Stock"
                        value={productDetailData[getKey(vname)]?.stock}
                        onChange={(e) => {
                          const parsed = parseInt(e.target.value)
                          handleChangeStock(
                            getKey(vname),
                            Number.isNaN(parsed) ? 0 : parsed
                          )
                        }}
                      />
                      <TextInput
                        label="Weight"
                        value={productDetailData[getKey(vname)]?.weight}
                        onChange={(e) => {
                          const parsed = parseInt(e.target.value)
                          handleChangeWeight(
                            getKey(vname),
                            Number.isNaN(parsed) ? 0 : parsed
                          )
                        }}
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-end gap-2">
                        <div className="max-w-[8rem]">
                          <TextInput
                            label="Volume (cm3)"
                            full
                            value={productDetailData[getKey(vname)]?.size}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value)
                              handleChangeVolume(
                                getKey(vname),
                                Number.isNaN(parsed) ? 0 : parsed
                              )
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )
        ) : (
          <div>No Data</div>
        )}
      </div>
    </div>
  )
}

export default ProductVariants
