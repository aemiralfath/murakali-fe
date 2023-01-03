import {
  A,
  Avatar,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  H1,
  H2,
  H3,
  H4,
  NumberInput,
  P,
  PaginationNav,
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
import { HiChevronDown, HiChevronUp, HiPlus, HiTag } from 'react-icons/hi'

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
    price: 1000,
    stock: 4,
    variant: {
      Color: 'White',
      Size: 'L',
    },
  },
  {
    id: '2',
    url: 'https://cf.shopee.co.id/file/34b90d77c25d6753af4d32a539d4a7a5',
    price: 2000,
    stock: 2,
    variant: {
      Color: 'Red',
      Size: 'L',
    },
  },
  {
    id: '3',
    url: 'https://cf.shopee.co.id/file/1899b975c33e700b5f04ab018b2454d6',
    price: 3000,
    stock: 0,
    variant: {
      Color: 'Red',
      Size: 'XL',
    },
  },
  {
    id: '4',
    url: 'https://cf.shopee.co.id/file/1899b975c33e700b5f04ab018b2454d6',
    price: 4000,
    stock: 9,
    variant: {
      Color: 'Green',
      Size: 'XL',
    },
  },
]

const ProductPage: NextPage = () => {
  // const router = useRouter()
  // const { pid } = router.query
  const [isLoading, setIsLoading] = useState(false)

  const [variantNamesState, setVariantNames] = useState<string[]>([])
  const [variantTypesState, setVariantTypes] = useState<{
    [key: string]: string[]
  }>({})
  const [variantMapState, setVariantMap] = useState<
    Array<Array<typeof dummyVariant[0] | undefined>>
  >([])

  const [selectMap, setSelectMap] = useState<number[]>([])
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
  }, [selectMap])

  const [qty, setQty] = useState(1)
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

  const [descriptionOpen, setDescriptionOpen] = useState(false)

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
          <div className="col-span-12 flex flex-col md:flex-row lg:col-span-9">
            {isLoading ? (
              <ProductImageCarousel isLoading={isLoading} data={undefined} />
            ) : (
              <div>
                <ProductImageCarousel
                  data={{ images: dummyProductImages, alt: 'Product Name' }}
                  isLoading={false}
                />
                Share and Like Button goes here
              </div>
            )}
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
                <H2>
                  Kantong Sampah Bagus Trash Bag Roll 45 x 50 cm 24s 24 L -
                  Hitam
                </H2>
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
                    <Chip className="font-bold" type="accent">
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
                                        selectMap[variantNameIdx] ===
                                          variantTypeIdx
                                          ? 'btn-primary'
                                          : 'btn-outline border-gray-200'
                                      )}
                                      onClick={() => {
                                        if (
                                          selectMap[variantNameIdx] ===
                                          variantTypeIdx
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
          </div>
          <div className="col-span-12 mt-6 flex h-fit flex-col gap-4 rounded border p-4 lg:col-span-3 lg:mt-0">
            {isLoading ? (
              <Spinner color="neutral" />
            ) : (
              <>
                <div className="flex flex-1 flex-col gap-2">
                  <H3>Select Variant and Quantity:</H3>
                  {selectVariant ? (
                    <P>
                      {variantNamesState.map((variantName, idx) => {
                        return (
                          <span key={idx}>
                            {selectVariant.variant[variantName] +
                              (idx === 0 ? ', ' : '')}
                          </span>
                        )
                      })}
                    </P>
                  ) : (
                    <span className="italic opacity-50">
                      Please Select Variant
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <NumberInput
                      value={qty}
                      setValue={setQty}
                      maxValue={selectVariant?.stock}
                    />
                    <P>
                      Available:{' '}
                      {selectVariant ? (
                        <span>{selectVariant.stock}</span>
                      ) : (
                        <span className="italic opacity-50">-</span>
                      )}
                    </P>
                  </div>
                </div>
                <Divider />
                <div className="flex flex-1 flex-col gap-2">
                  <H4>Subtotal</H4>
                  <div className="flex items-center justify-between">
                    <P className="text-sm line-through opacity-50">Rp.22.088</P>
                    <P className="flex-1 text-right text-lg font-bold">
                      Rp.22.088
                    </P>
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
              </>
            )}
          </div>
        </div>
        <Divider />
        <div className="grid lg:grid-cols-2 lg:divide-x-[1px] xl:grid-cols-5">
          <div className="lg:pr-6 xl:col-span-3">
            <H3>Sold By</H3>
            <div className="mt-4 items-center rounded border p-2 sm:flex sm:divide-x">
              <div className="flex items-center gap-4 pr-4">
                <Avatar size="lg" />
                <div className="w-fit overflow-ellipsis xl:w-[10rem]">
                  <A className="font-semibold">MurakaliShop</A>
                  <P className="text-sm">DKI Jakarta</P>
                </div>
              </div>
              <div className="mt-4 flex max-w-full flex-wrap items-center justify-between px-4 sm:mt-0 sm:justify-around">
                <div className="text-center">
                  <P className="text-sm line-clamp-1">Rating</P>
                  <P className="text-primary line-clamp-1">23K+</P>
                </div>
                <div className="text-center">
                  <P className="text-sm line-clamp-1">Items Sold</P>
                  <P className="text-primary line-clamp-1">132K+</P>
                </div>
                <div className="text-center">
                  <P className="text-sm line-clamp-1">Item</P>
                  <P className="text-primary line-clamp-1">89</P>
                </div>
              </div>
            </div>

            <H3 className="mt-8">Product Description</H3>
            <P className={cx('mt-2', descriptionOpen ? '' : 'line-clamp-[15]')}>
              WAJIB BACA SAMPAI SELESAI YAA!!
              <br /> Kaos distro Native8 model casual dengan desain yang
              beragam, unik dan berbeda dengan yang lain. Menggunakan bahan
              katun yang berkualitas tinggi, nyaman dipakai untuk melengkapi
              hari harimu.
              <br />
              <br /> Bahan : Cotton Combed 30S (Nyaman, tidak gerah, lembut,
              warna tidak cepat luntur, bahan tidak menyusut) (Khusus warna
              coksu/coklat muda memakai bahan cotton cvc twoton ya, makanya
              harganya berbeda)
              <br /> sablon: Plastisol High Density (Tidak pecah walau di cuci
              berkali kali.)
              <br /> - Jahitan standar distro Bandung, Overdeck kumis, jahitan
              pundak dirantai. Cocok dipakai laki-laki atau perempuan. <br />
              full hangtag
              <br />
              <br /> Perbedaan Warna produk dengan display pada settingan layar
              monitor anda dapat terjadi.
              <br />
              <br /> Hanya tersedia ukuran M , L, XL dan XXL <br />
              Detail ukuran : <br />M : Lebar Dada 48 cm x Panjang 70 cm <br />L
              : Lebar Dada 50 cm x Panjang 72 cm <br />
              XL : Lebar Dada 52 cm x Panjang 74 cm <br />
              XXL : Lebar Dada 55 cm x Panjang 76 cm <br />
              <br />
              Selisih 1-2 Cm pada produk mungkin terjadi dikarenakan proses
              pengembangan dan produksi. Untuk 1kg muat hingga 6 kaos (BELI
              BANYAK = HEMAT ONGKIR) Jangan lupa ambil voucher Diskon dan Gratis
              Ongkos Kirim, Gans
            </P>
            <div className="mt-4">
              <Divider>
                <button
                  className="flex items-center gap-2 text-primary"
                  onClick={() => {
                    setDescriptionOpen(!descriptionOpen)
                  }}
                >
                  {descriptionOpen ? (
                    <>
                      Close <HiChevronUp />
                    </>
                  ) : (
                    <>
                      See More <HiChevronDown />
                    </>
                  )}
                </button>
              </Divider>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:pl-6 xl:col-span-2">
            <H3>Reviews</H3>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex h-fit flex-col gap-4 rounded bg-base-200 p-4 sm:flex-row">
                <div>
                  <RatingStars size="lg" rating={4.8} />
                  <div>
                    <span className="text-xl font-bold">4.8</span> out of 5
                  </div>
                  <div>
                    <P className="text-xs">307 ratings</P>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-1">
                    {/* 68 + 20 + 9 + 1 + 2 */}
                    <div className="group flex items-center gap-2 text-xs hover:cursor-pointer">
                      <P className="group-hover:text-primary-focus">5</P>
                      <progress
                        className="progress h-3 w-full group-hover:progress-primary"
                        value="68"
                        max="100"
                      ></progress>
                      <P className="w-[2rem] text-right group-hover:text-primary-focus">
                        68%
                      </P>
                    </div>
                    <div className="group flex items-center gap-2 text-xs hover:cursor-pointer">
                      <P className="group-hover:text-primary-focus">4</P>
                      <progress
                        className="progress h-3 w-full group-hover:progress-primary"
                        value="20"
                        max="100"
                      ></progress>
                      <P className="w-[2rem] text-right group-hover:text-primary-focus">
                        20%
                      </P>
                    </div>
                    <div className="group flex items-center gap-2 text-xs hover:cursor-pointer">
                      <P className="group-hover:text-primary-focus">3</P>
                      <progress
                        className="progress h-3 w-full group-hover:progress-primary"
                        value="9"
                        max="100"
                      ></progress>
                      <P className="w-[2rem] text-right group-hover:text-primary-focus">
                        9%
                      </P>
                    </div>
                    <div className="group flex items-center gap-2 text-xs hover:cursor-pointer">
                      <P className="group-hover:text-primary-focus">2</P>
                      <progress
                        className="progress h-3 w-full group-hover:progress-primary"
                        value="1"
                        max="100"
                      ></progress>
                      <P className="w-[2rem] text-right group-hover:text-primary-focus">
                        1%
                      </P>
                    </div>
                    <div className="group flex items-center gap-2 text-xs hover:cursor-pointer">
                      <P className="group-hover:text-primary-focus">1</P>
                      <progress
                        className="progress h-3 w-full group-hover:progress-primary"
                        value="2"
                        max="100"
                      ></progress>
                      <P className="w-[2rem] text-right group-hover:text-primary-focus">
                        2%
                      </P>
                    </div>
                  </div>
                </div>
                <div className="">Filter di sini</div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar />
                    <P>Person</P>
                  </div>
                  <div className="flex">
                    <P className="-mt-1 font-semibold leading-5 line-clamp-2">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Omnis aut, exercitationem asperiores perferendis
                      laboriosam quas.
                    </P>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-gray-400 sm:flex-row">
                    <RatingStars rating={5} />
                    <div className="flex gap-2">
                      <P className="whitespace-nowrap">Green, XL</P>
                      <P>•</P>
                      <P className="whitespace-nowrap">2 December 2022</P>
                    </div>
                  </div>
                  <div>
                    <P className="text-sm leading-5">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Corrupti, ad? Voluptatibus molestias in, exercitationem
                      sint asperiores repellat iste eveniet autem.
                    </P>
                  </div>
                </div>
                <Divider />

                <div className="flex justify-center pt-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                  <PaginationNav page={3} total={12} onChange={() => {}} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Divider />
      </MainLayout>
    </>
  )
}

export default ProductPage
