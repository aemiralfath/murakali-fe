import {
  Breadcrumbs,
  Button,
  Chip,
  H1,
  H2,
  H3,
  H4,
  NumberInput,
  P,
  RatingStars,
  Spinner,
} from '@/components'
import cx from '@/helper/cx'
import MainLayout from '@/layout/MainLayout'
import ProductImageCarousel from '@/layout/template/product/ProductImageCarousel'
import type { NextPage } from 'next'
import Head from 'next/head'
// import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { HiPlus, HiTag } from 'react-icons/hi'

const ProductPage: NextPage = () => {
  // const router = useRouter()
  // const { pid } = router.query
  const [isLoading, setIsLoading] = useState(false)

  const dummyBreadcrumbs = [
    { name: 'Jewelry & Watches', link: '#' },
    { name: 'Watches, Parts & Accessories', link: '#' },
    { name: 'Watches', link: '#' },
  ]

  const dummyProductImages = [
    'https://cf.shopee.co.id/file/814ca3bda16a4ef301be591d10b30e5d',
    'https://cf.shopee.co.id/file/901b0c9dea21ebb0210ab0563c8468c2',
    'https://cf.shopee.co.id/file/94863ff0ea3ee5017dc7eea5f5eedaf4',
    'https://cf.shopee.co.id/file/89021cd9d1671e5c0a5819898888fcf0',
    'https://cf.shopee.co.id/file/f51dec13bd33ffd1e30e00a57fc21fff',
  ]
  const dummyVariant = [
    {
      id: '1',
      url: 'https://cf.shopee.co.id/file/79bbd54eae6fc005fc175568ce256806',
      stock: 4,
      variant: {
        Color: 'White',
        Size: 'L',
      },
    },
    {
      id: '2',
      url: 'https://cf.shopee.co.id/file/34b90d77c25d6753af4d32a539d4a7a5',
      stock: 2,
      variant: {
        Color: 'Red',
        Size: 'L',
      },
    },
    {
      id: '3',
      url: 'https://cf.shopee.co.id/file/1899b975c33e700b5f04ab018b2454d6',
      stock: 0,
      variant: {
        Color: 'Red',
        Size: 'XL',
      },
    },
  ]

  const [variantNamesState, setVariantNames] = useState<string[]>([])
  const [variantTypesState, setVariantTypes] = useState<{
    [key: string]: string[]
  }>({})
  const [variantMapState, setVariantMap] = useState<
    Array<Array<typeof dummyVariant[0] | undefined>>
  >([])

  const [selectMap, setSelectMap] = useState<number[]>([])

  useEffect(() => {
    if (dummyVariant) {
      const variantNames = Object.keys(dummyVariant[0].variant)
      setVariantNames(variantNames)
      setSelectMap(Array(variantNames.length).fill(-1))

      const variantTypes = {}
      const variantMap = []

      variantNames.forEach((name) => {
        const types = []
        dummyVariant.forEach((variant) => {
          const varName = variant.variant[name]
          if (!types.includes(varName)) {
            types.push(varName)
          }
        })
        variantTypes[name] = types
      })

      variantTypes[variantNames[0]].forEach((typeNameZero) => {
        const variantTypeNameMap = []
        if (variantNames.length > 1) {
          variantTypes[variantNames[1]].forEach((typeNameOne) => {
            const filtered = dummyVariant.filter((variant) => {
              return (
                variant.variant[variantNames[0]] === typeNameZero &&
                variant.variant[variantNames[1]] === typeNameOne
              )
            })
            if (filtered.length > 0) {
              variantTypeNameMap.push(filtered[0])
            } else {
              variantTypeNameMap.push(undefined)
            }
          })
        } else {
          const filtered = dummyVariant.filter((variant) => {
            return variant.variant[variantNames[0]] === typeNameZero
          })
          if (filtered.length > 0) {
            variantTypeNameMap.push(filtered[0])
          } else {
            variantTypeNameMap.push(undefined)
          }
        }
        variantMap.push(variantTypeNameMap)
      })

      setVariantTypes(variantTypes)
      setVariantMap(variantMap)
    }
  }, [])

  const [selectVariant, setSelectVariant] = useState<
    typeof dummyVariant[0] | undefined
  >()
  useEffect(() => {
    if (!selectMap.includes(-1)) {
      if (variantMapState.length > 0) {
        if (selectMap.length > 1) {
          setSelectVariant(variantMapState[selectMap[0]][selectMap[1]])
        } else {
          setSelectVariant(variantMapState[0][selectMap[0]])
        }
      }
    } else {
      setSelectVariant(undefined)
    }

    console.log('selectVariant', selectVariant)
  }, [selectMap])

  return (
    <>
      <Head>
        {/* TODO: Change Page title */}
        <title>Nama Produk - Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <MainLayout>
        <a
          className="fixed right-0"
          onClick={() => {
            //TODO: Delete this
            setIsLoading(!isLoading)
          }}
        >
          toggle
        </a>
        {isLoading ? (
          <div className="h-[1.25rem] w-[16rem] animate-pulse rounded bg-base-300" />
        ) : (
          <Breadcrumbs data={dummyBreadcrumbs} />
        )}
        <div className="grid grid-cols-12">
          <div className="col-span-9 flex">
            {isLoading ? (
              <ProductImageCarousel isLoading={isLoading} data={undefined} />
            ) : (
              <ProductImageCarousel
                data={{ images: dummyProductImages, alt: 'Product Name' }}
                isLoading={false}
              />
            )}
            <div className="mx-4 flex flex-col gap-2">
              <div className="flex items-center gap-4">
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
              <H2>
                Kantong Sampah Bagus Trash Bag Roll 45 x 50 cm 24’s 24 L - Hitam
              </H2>
              <div className="flex flex-col gap-2 rounded border p-4">
                <H1 className="text-primary">
                  <span className="text-xl">Rp</span>22.088-
                  <span className="text-xl">Rp</span>35.594
                </H1>
                <P className="line-through opacity-60">Rp85.000</P>
                <Chip className="font-bold" type="accent">
                  75% Off
                </Chip>
              </div>
              <div>
                {variantNamesState ? (
                  variantNamesState.map((variantName, idx) => {
                    return (
                      <div
                        key={idx}
                        className={cx('flex flex-col', idx !== 0 ? 'mt-2' : '')}
                      >
                        <H4>{variantName}:</H4>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {variantTypesState[variantName] ? (
                            variantTypesState[variantName].map(
                              (variantType, idx) => {
                                // TODO: Add selecting on Click
                                return (
                                  <>
                                    <button
                                      key={idx}
                                      className={
                                        'rounded border px-2 py-1 transition-all hover:border-primary hover:bg-primary hover:bg-opacity-10 hover:text-primary-focus'
                                      }
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
          </div>
          <div className="col-span-3 flex h-fit flex-col gap-4 rounded border p-4">
            <div className="flex flex-1 flex-col gap-2">
              <H3>Choose Variant and Quantity:</H3>
              <div>
                <NumberInput />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button buttonType="primary" className="rounded">
                <HiTag /> Buy Now
              </Button>
              <Button buttonType="primary" outlined className="rounded">
                <HiPlus /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default ProductPage
