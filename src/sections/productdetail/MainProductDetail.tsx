import { Chip, H1, H2, H4, P, RatingStars, Spinner } from '@/components'
import cx from '@/helper/cx'
import type { ProductDetail } from '@/types/api/product'
import React from 'react'

// TODO: Add interface to Rating, Sold Count, Title, Prices
interface MainProductDetailProps {
  isLoading: boolean
  variantNamesState: string[]
  variantTypesState: { [key: string]: string[] }
  variantMapState: Array<Array<ProductDetail | undefined>>
  selectMap: number[]
  setSelectMap: (p: number[]) => void
  selectVariant: ProductDetail | undefined
}

const MainProductDetail = ({
  isLoading,
  variantNamesState,
  variantTypesState,
  variantMapState,
  selectMap,
  setSelectMap,
  selectVariant,
}: MainProductDetailProps) => {
  const getDisabledStatus = (
    variantNameIdx: number,
    variantTypeIdx: number
  ): boolean => {
    if (variantNamesState.length === 1) {
      return variantMapState[0][variantTypeIdx] === undefined
    } else {
      if (variantNameIdx === 0) {
        if (selectMap[1] !== -1) {
          return variantMapState[variantTypeIdx][selectMap[1]] === undefined
            ? true
            : variantMapState[variantTypeIdx][selectMap[1]].stock === 0
        } else {
          return false
        }
      } else {
        if (selectMap[0] !== -1) {
          return variantMapState[selectMap[0]][variantTypeIdx] === undefined
            ? true
            : variantMapState[selectMap[0]][variantTypeIdx].stock === 0
        } else {
          return false
        }
      }
    }
  }

  const modifySelectMap = (index: number, value: number) => {
    const nextState = selectMap.map((s, i) => {
      if (i === index) {
        return value
      } else {
        return s
      }
    })

    setSelectMap(nextState)
  }

  return (
    <div className="mx-0 mt-4 flex flex-col gap-2 md:mx-4 md:mt-0">
      {isLoading ? (
        <div className="h-[1.25rem] w-[16rem] animate-pulse rounded bg-base-300" />
      ) : (
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4 md:justify-start">
          <div className="flex items-center gap-1">
            <RatingStars rating={4.8} />
            <P className="text-sm">4.8</P>
          </div>
          <div className="h-[1.5rem] w-[1px] bg-gray-200" />
          <div className="flex items-center gap-1">
            <P className="font-bold">307</P>
            <P className="text-sm">Rating</P>
          </div>
          <div className="h-[1.5rem] w-[1px] bg-gray-200" />
          <div className="flex items-center gap-1">
            <P className="font-bold">2K+</P>
            <P className="text-sm">Sold</P>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="h-[2rem] w-[100%] animate-pulse rounded bg-base-300" />
      ) : (
        <H2>Kantong Sampah Bagus Trash Bag Roll 45 x 50 cm 24s 24 L - Hitam</H2>
      )}
      <div className="flex flex-col gap-2 rounded border p-4">
        {isLoading ? (
          <div className="h-[8rem] w-full animate-pulse rounded bg-base-300" />
        ) : (
          <>
            <H1 className="text-primary">
              {selectVariant ? (
                <>
                  <span className="text-lg xl:text-xl">Rp</span>
                  {selectVariant.price}
                </>
              ) : (
                <>
                  <span className="text-lg xl:text-xl">Rp</span>22.088-
                  <span className="text-lg xl:text-xl">Rp</span>35.594
                </>
              )}
            </H1>
            <P className="line-through opacity-60">Rp85.000</P>
            <Chip className="font-bold" type="error">
              75% Off
            </Chip>
          </>
        )}
      </div>
      <div>
        {variantNamesState ? (
          variantNamesState.map((variantName, variantNameIdx) => {
            return (
              <div
                key={variantNameIdx}
                className={cx(
                  'flex flex-col',
                  variantNameIdx !== 0 ? 'mt-2' : ''
                )}
              >
                <H4>{variantName}:</H4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {variantTypesState[variantName] ? (
                    variantTypesState[variantName].map(
                      (variantType, variantTypeIdx) => {
                        return (
                          <>
                            <button
                              key={variantTypeIdx}
                              disabled={getDisabledStatus(
                                variantNameIdx,
                                variantTypeIdx
                              )}
                              className={cx(
                                'btn-sm btn rounded-sm',
                                selectMap[variantNameIdx] === variantTypeIdx
                                  ? 'btn-primary'
                                  : 'btn-outline border-gray-200'
                              )}
                              onClick={() => {
                                if (
                                  selectMap[variantNameIdx] === variantTypeIdx
                                ) {
                                  modifySelectMap(variantNameIdx, -1)
                                } else {
                                  modifySelectMap(
                                    variantNameIdx,
                                    variantTypeIdx
                                  )
                                }
                              }}
                            >
                              {variantType}
                            </button>
                          </>
                        )
                      }
                    )
                  ) : (
                    <div>
                      <Spinner />
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div>
            <Spinner />
          </div>
        )}
      </div>
    </div>
  )
}

export default MainProductDetail
