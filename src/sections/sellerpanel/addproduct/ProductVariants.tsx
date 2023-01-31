import { Button, Chip, Divider, H3, H4, P, TextInput } from '@/components'
import cx from '@/helper/cx'
import toTitleCase from '@/helper/toTitleCase'
import React, { useEffect, useState } from 'react'
import type { Updater } from 'use-immer'
import {
  HiExclamationCircle,
  HiOutlineLightBulb,
  HiPlus,
  HiTrash,
} from 'react-icons/hi'
import type {
  ProductDetail,
  ProductDetailReq,
  VariantDetailReq,
} from '@/types/api/product'
import VariantSelectionDropdown from './subsections/VariantSelectionDropdown'
import getKey from '@/helper/getKey'
import VariationSelector from './subsections/VariationSelector'
import VariantChip from './subsections/VariantChip'
import EmptyData from './subsections/EmptyData'
import { toast } from 'react-hot-toast'
import Uploader from '@/components/uploader'

const ProductVariants: React.FC<{
  productDetailData: {
    [key: string]: ProductDetailReq
  }
  updateProductDetailData: Updater<{
    [key: string]: ProductDetailReq
  }>
  defaultProductDetail?: ProductDetail[]
  isEditing?: boolean
}> = ({
  productDetailData,
  updateProductDetailData,
  defaultProductDetail,
  isEditing,
}) => {
  const [variantType, setVariantType] = useState<string[]>(['', ''])
  const [variantNames, setVariantNames] = useState<string[][]>([[], []])
  const [openVariantTwo, setOpenVariantTwo] = useState(false)

  const [tempVariantNameOne, setTempVariantNameOne] = useState('')
  const [tempVariantNameTwo, setTempVariantNameTwo] = useState('')

  const [selectKey, setSelectKey] = useState<string[]>([])

  const toggleSelectKey = (vname1: string, vname2?: string) => {
    const key = getKey(vname1, vname2)
    if (!selectKey.includes(key)) {
      setSelectKey([key, ...selectKey])
    } else {
      setSelectKey(selectKey.filter((k) => k !== key))
    }
  }

  const [tempChangePrice, setTempChangePrice] = useState<number | null>(null)
  const [tempChangeStock, setTempChangeStock] = useState<number | null>(null)
  const [tempChangeWeight, setTempChangeWeight] = useState<number | null>(null)
  const [tempChangeVolume, setTempChangeVolume] = useState<number | null>(null)

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

  const handleChangePrice = (key: string, newVal: number) => {
    updateProductDetailData((draft) => {
      draft[key] = {
        ...(draft[key] ?? {
          stock: 0,
          weight: 0,
          size: 0,
          hazardous: false,
          condition: 'new',
          bulk_price: false,
          photo: [],
          variant_detail: [],
        }),
        price: newVal,
      }
    })
  }

  const handleChangeStock = (key: string, newVal: number) => {
    updateProductDetailData((draft) => {
      draft[key] = {
        ...(draft[key] ?? {
          price: 0,
          weight: 0,
          size: 0,
          hazardous: false,
          condition: 'new',
          bulk_price: false,
          photo: [],
          variant_detail: [],
        }),
        stock: newVal,
      }
    })
  }

  const handleChangeWeight = (key: string, newVal: number) => {
    updateProductDetailData((draft) => {
      draft[key] = {
        ...(draft[key] ?? {
          price: 0,
          stock: 0,
          size: 0,
          hazardous: false,
          condition: 'new',
          bulk_price: false,
          photo: [],
          variant_detail: [],
        }),
        weight: newVal,
      }
    })
  }

  const handleChangeVolume = (key: string, newVal: number) => {
    updateProductDetailData((draft) => {
      draft[key] = {
        ...(draft[key] ?? {
          price: 0,
          weight: 0,
          stock: 0,
          hazardous: false,
          condition: 'new',
          bulk_price: false,
          photo: [],
          variant_detail: [],
        }),
        size: newVal,
      }
    })
  }

  const handleChangeImage = (key: string, newVal: string) => {
    updateProductDetailData((draft) => {
      draft[key] = {
        ...(draft[key] ?? {
          price: 0,
          weight: 0,
          size: 0,
          stock: 0,
          hazardous: false,
          condition: 'new',
          bulk_price: false,
          variant_detail: [],
        }),
        photo: [newVal],
      }
    })
  }

  useEffect(() => {
    const lastData = productDetailData
    updateProductDetailData({})
    setSelectKey([])
    setTempChangePrice(null)
    setTempChangeStock(null)
    setTempChangeWeight(null)
    setTempChangeVolume(null)

    const tempVariantNames1 = variantNames[0]
    if (tempVariantNames1 !== undefined) {
      tempVariantNames1.forEach((vname1) => {
        const tempVariantNames2 = variantNames[1]
        if (tempVariantNames2 !== undefined && tempVariantNames2.length > 0) {
          tempVariantNames2.forEach((vname2) => {
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
                    type: variantType[0] ?? '',
                  },
                  {
                    name: vname2,
                    type: variantType[1] ?? '',
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
                  type: variantType[0] ?? '',
                },
              ],
            }
          })
        }
      })
    }
  }, [variantType, variantNames])

  useEffect(() => {
    if (defaultProductDetail) {
      if (defaultProductDetail.length > 0) {
        setOpenVariantTwo(defaultProductDetail.length > 1)

        const tempVariantType = Object.keys(
          defaultProductDetail[0]?.variant ?? {}
        )
        if (tempVariantType.length < 2) {
          tempVariantType.push('')
        }

        const tempVariantNames: string[][] = [[], []]
        defaultProductDetail.forEach((detail) => {
          const key = getKey(
            detail.variant[tempVariantType[0] ?? 0] ?? '',
            tempVariantType[1] ? detail.variant[tempVariantType[1]] : undefined
          )
          const tempVariantDetail: Array<VariantDetailReq> = []
          tempVariantType.forEach((type) => {
            if (type !== '') {
              tempVariantDetail.push({
                name: type,
                type: detail.variant[type] ?? '',
              })
            }
          })

          updateProductDetailData((draft) => {
            draft[key] = {
              price: detail.normal_price,
              stock: detail.stock,
              weight: detail.weight,
              size: detail.size,
              hazardous: false,
              condition: 'new',
              bulk_price: false,
              photo: detail.product_url,
              variant_detail: tempVariantDetail,
            }
          })

          tempVariantType.map((type, idx) => {
            const tempTempVariantNames = tempVariantNames[idx]

            if (
              tempTempVariantNames !== undefined &&
              !tempTempVariantNames.includes(detail.variant[type] ?? '')
            ) {
              tempVariantNames[idx]?.push(detail.variant[type] ?? '')
            }
          })
        })

        setVariantType(tempVariantType)
        setVariantNames(tempVariantNames)
      }
    }
  }, [defaultProductDetail])

  const handleChangeOnClick = () => {
    selectKey.forEach((k) => {
      if (tempChangePrice !== null) {
        handleChangePrice(k, tempChangePrice)
        setTempChangePrice(null)
      }
      if (tempChangeStock !== null) {
        handleChangeStock(k, tempChangeStock)
        setTempChangeStock(null)
      }
      if (tempChangeWeight !== null) {
        handleChangeWeight(k, tempChangeWeight)
        setTempChangeWeight(null)
      }
      if (tempChangeVolume !== null) {
        handleChangeVolume(k, tempChangeVolume)
        setTempChangeVolume(null)
      }
    })
    toast.success('Value has been set')
    setSelectKey([])
  }

  return (
    <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
      <div className="flex items-center gap-3">
        <H3>Product Variants</H3>
        <Chip type={'gray'}>Required</Chip>
      </div>
      <P className="mt-2 flex items-baseline gap-1 text-sm">
        <HiOutlineLightBulb className="min-w-[1rem] text-accent" /> Add product
        variants so your buyer can get the right product. (Max. 2 variant types)
      </P>
      <div className="mt-6 rounded border p-6">
        <H4>Variation 1</H4>
        <div className="mt-2 flex flex-col gap-3 md:flex-row">
          <div className="flex md:w-[30%]">
            <VariationSelector
              defaultVariation={
                defaultProductDetail ? variantType[0] : undefined
              }
              disabledKeyword={variantType[1] ?? ''}
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
              isEditing={isEditing}
            />
          </div>
          <div
            className={cx(
              'input-bordered input flex h-fit min-h-[3rem] w-full flex-wrap items-center gap-3 py-2',
              Boolean(variantType[0]) ? '' : 'input-disabled',
              isEditing ? 'input-disabled' : ''
            )}
          >
            {variantNames[0]?.map((varNames, idx) => {
              return (
                <VariantChip
                  isDefault={isEditing}
                  key={`${varNames}-${idx}-0`}
                  content={varNames}
                  onClose={(n) => {
                    removeVariantName(0, n)
                  }}
                />
              )
            })}
            <input
              disabled={!Boolean(variantType[0]) || isEditing}
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
          <div className="mt-2 flex flex-col gap-3 md:flex-row">
            <div className="flex md:w-[30%]">
              <VariationSelector
                defaultVariation={
                  defaultProductDetail ? variantType[1] : undefined
                }
                disabledKeyword={variantType[0] ?? ''}
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
                isEditing={isEditing}
              />
            </div>
            <div
              className={cx(
                'input-bordered input flex h-fit min-h-[3rem] w-full flex-wrap items-center gap-3 py-2',
                Boolean(variantType[1]) ? '' : 'input-disabled',
                isEditing ? 'input-disabled' : ''
              )}
            >
              {variantNames[1]?.map((varNames, idx) => {
                return (
                  <VariantChip
                    isDefault={isEditing}
                    key={`${varNames}-${idx}-0`}
                    content={varNames}
                    onClose={(n) => {
                      removeVariantName(1, n)
                    }}
                  />
                )
              })}
              <input
                disabled={!Boolean(variantType[1]) || isEditing}
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
          {!isEditing ? (
            <Button buttonType="ghost" onClick={handleOpenVariantTwo}>
              <HiPlus />
              Add Variant Type
            </Button>
          ) : (
            <P className="flex w-fit items-center gap-2 rounded-full bg-error bg-opacity-10 py-1 px-2 text-error">
              <HiExclamationCircle /> You cannot edit Product Variation
            </P>
          )}
        </div>
      )}
      <div className="py-6">
        <Divider />
      </div>
      {(variantNames[0]?.length ?? 0) > 0 &&
      (openVariantTwo ? (variantNames[1]?.length ?? 0) > 0 : true) ? (
        <div className="flex items-start gap-2">
          <VariantSelectionDropdown
            variantNames={variantNames}
            variantType={variantType}
            selectKey={selectKey}
            setSelectKey={setSelectKey}
          />
          {selectKey.length > 0 ? (
            <div className="w-full">
              <div className="min-h-12 flex w-full flex-wrap items-center gap-3 rounded-lg bg-base-200 px-2 py-2 md:py-0">
                <div className="flex max-w-[9rem] items-center gap-1">
                  <P>Price</P>
                  <TextInput
                    inputSize="sm"
                    full
                    placeholder="Price (Rp.)"
                    value={
                      tempChangePrice === null ? undefined : tempChangePrice
                    }
                    onChange={(e) => {
                      const parsed = parseInt(e.target.value)
                      setTempChangePrice(Number.isNaN(parsed) ? 0 : parsed)
                    }}
                  />
                </div>
                <div className="flex max-w-[9rem] items-center gap-1">
                  <P>Stock</P>
                  <TextInput
                    inputSize="sm"
                    full
                    placeholder="Stock"
                    value={
                      tempChangeStock === null ? undefined : tempChangeStock
                    }
                    onChange={(e) => {
                      const parsed = parseInt(e.target.value)
                      setTempChangeStock(Number.isNaN(parsed) ? 0 : parsed)
                    }}
                  />
                </div>
                <div className="flex max-w-[9rem] items-center gap-1">
                  <P>Weight</P>
                  <TextInput
                    inputSize="sm"
                    full
                    placeholder="Weight (grams)"
                    value={
                      tempChangeWeight === null ? undefined : tempChangeWeight
                    }
                    onChange={(e) => {
                      const parsed = parseInt(e.target.value)
                      setTempChangeWeight(Number.isNaN(parsed) ? 0 : parsed)
                    }}
                  />
                </div>
                <div className="flex max-w-[9rem] items-center gap-1">
                  <P>Volume</P>
                  <TextInput
                    inputSize="sm"
                    full
                    placeholder="Volume"
                    value={
                      tempChangeVolume === null ? undefined : tempChangeVolume
                    }
                    onChange={(e) => {
                      const parsed = parseInt(e.target.value)
                      setTempChangeVolume(Number.isNaN(parsed) ? 0 : parsed)
                    }}
                  />
                </div>
                <div className="flex flex-1 justify-end">
                  <Button
                    size="sm"
                    disabled={
                      tempChangePrice === null &&
                      tempChangeStock === null &&
                      tempChangeWeight === null &&
                      tempChangeVolume === null
                    }
                    onClick={handleChangeOnClick}
                  >
                    Set
                  </Button>
                </div>
              </div>
              <P className="mt-1 text-xs">
                Selected {selectKey.length} products
              </P>
            </div>
          ) : (
            <span className="flex h-12 items-center text-sm">
              Select some products
            </span>
          )}
        </div>
      ) : (
        <></>
      )}
      <div className="mt-3 max-w-full flex-col divide-y-[1px] overflow-auto">
        {(variantNames[0]?.length ?? 0) > 0 ? (
          openVariantTwo ? (
            (variantNames[1]?.length ?? 0) > 0 ? (
              variantNames[0]?.map((vname1) => {
                return (
                  <>
                    {variantNames[1]?.map((vname2) => {
                      const key = getKey(vname1, vname2)
                      return (
                        <div className="flex w-fit justify-start p-6" key={key}>
                          <div className="mt-3 w-[3rem]">
                            <input
                              type={'checkbox'}
                              className={'checkbox'}
                              checked={selectKey.includes(key)}
                              defaultChecked={selectKey.includes(key)}
                              onChange={() => toggleSelectKey(vname1, vname2)}
                            />
                          </div>
                          <div className="w-[8.5rem]">
                            <Uploader
                              id={key}
                              title={'Photo'}
                              onChange={(s) => handleChangeImage(key, s)}
                              defaultImage={
                                productDetailData[key]
                                  ? productDetailData[key]?.photo[0]
                                  : undefined
                              }
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
                                label="Weight (grams)"
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
              <EmptyData />
            )
          ) : (
            variantNames[0]?.map((vname) => {
              const key = getKey(vname)
              return (
                <div className="flex w-fit justify-start p-6" key={key}>
                  <div className="mt-3 w-[3rem]">
                    <input
                      type={'checkbox'}
                      className={'checkbox'}
                      checked={selectKey.includes(key)}
                      defaultChecked={selectKey.includes(key)}
                      onChange={() => toggleSelectKey(vname)}
                    />
                  </div>
                  <div className="w-[8.5rem]">
                    <Uploader
                      id={key}
                      title={'Photo'}
                      onChange={(s) => handleChangeImage(key, s)}
                      defaultImage={
                        productDetailData[key]
                          ? productDetailData[key]?.photo[0]
                          : undefined
                      }
                    />
                    <div className="mt-2 min-w-[12rem] pl-2 text-sm ">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold">{variantType[0]}:</span>
                        <span className="max-w-full">{vname}</span>
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
                        label="Weight (grams)"
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
          <EmptyData />
        )}
      </div>
    </div>
  )
}

export default ProductVariants
