import { A, Breadcrumbs, Divider, P, Spinner } from '@/components'
import { useMediaQuery, useModal } from '@/hooks'
import MainLayout from '@/layout/MainLayout'
import ProductImageCarousel from '@/layout/template/product/ProductImageCarousel'
import type { NextPage } from 'next'
import Head from 'next/head'
// import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { HiHeart, HiShare } from 'react-icons/hi'
import ShareModal from '@/sections/productdetail/ShareModal'
import MainProductDetail from '@/sections/productdetail/MainProductDetail'
import product, {
  dummyBreadcrumbs,
  dummyProductImages,
} from '@/dummy/productDetailData'
import type { ProductDetail } from '@/types/api/product'
import ChooseVariantQty from '@/sections/productdetail/ChooseVariantQty'
import ProductDescription from '@/sections/productdetail/ProductDescription'
import ProductReview from '@/sections/productdetail/ProductReview'
import Image from 'next/image'
import ProductCard from '@/layout/template/product/ProductCard'
import { useRecommendedProduct } from '@/api/product/recommended'
import { useGetSellerProduct } from '@/api/product'

const ProductPage: NextPage = () => {
  const dummyProduct = product

  // const router = useRouter()
  // const { pid } = router.query
  const modal = useModal()
  const [isLoading, setIsLoading] = useState(false)
  const [qty, setQty] = useState(1)
  const sellerProduct = useGetSellerProduct(
    1,
    12,
    '',
    '',
    '',
    '',
    '',
    0,
    0,
    0,
    0
  )

  const [variantNamesState, setVariantNames] = useState<string[]>([])
  const [variantTypesState, setVariantTypes] = useState<{
    [key: string]: string[]
  }>({})
  const [variantMapState, setVariantMap] = useState<
    Array<Array<ProductDetail | undefined>>
  >([])

  const [selectMap, setSelectMap] = useState<number[]>([])
  const [selectVariant, setSelectVariant] = useState<
    ProductDetail | undefined
  >()

  const sm = useMediaQuery('sm')
  const md = useMediaQuery('md')
  const lg = useMediaQuery('lg')
  const recommendedProduct = useRecommendedProduct()

  useEffect(() => {
    if (dummyProduct) {
      const variantNames = Object.keys(dummyProduct.products_detail[0].variant)
      setVariantNames(variantNames)
      setSelectMap(Array(variantNames.length).fill(-1))

      const variantTypes = {}
      const variantMap = []

      variantNames.forEach((name) => {
        const types = []
        dummyProduct.products_detail.forEach((variant) => {
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
            const filtered = dummyProduct.products_detail.filter((variant) => {
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
          const filtered = dummyProduct.products_detail.filter((variant) => {
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
  {
    console.log(sellerProduct.data?.data)
  }

  return (
    <>
      <Head>
        {/* TODO: Change Page title */}
        <title>Nama Produk - Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
      </Head>
      <MainLayout>
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
                  // TODO: Change image when selectVariant is not undefined
                  data={{ images: dummyProductImages, alt: 'Product Name' }}
                  isLoading={false}
                />
                <div className="mt-4 md:pl-[2.8rem] xl:pl-[4rem]">
                  <div className="flex items-center gap-3 text-gray-500 md:pl-2">
                    <A className="flex items-center gap-1 font-semibold">
                      <HiHeart className="text-xl" />
                      <P>Favorite</P>
                    </A>
                    <P>•</P>
                    <A
                      className="flex items-center gap-1 font-semibold"
                      onClick={() => {
                        modal.info({
                          title: 'Share this Product',
                          content: <ShareModal />,
                        })
                      }}
                    >
                      <HiShare className="text-xl" />
                      <P>Share</P>
                    </A>
                  </div>
                </div>
              </div>
            )}
            <MainProductDetail
              isLoading={isLoading}
              variantNamesState={variantNamesState}
              variantTypesState={variantTypesState}
              variantMapState={variantMapState}
              selectMap={selectMap}
              setSelectMap={setSelectMap}
              selectVariant={selectVariant}
            />
          </div>
          <div className="col-span-12 mt-6 flex h-fit flex-col gap-4 rounded border p-4 lg:col-span-3 lg:mt-0">
            {isLoading ? (
              <Spinner color="neutral" />
            ) : (
              <ChooseVariantQty
                qty={qty}
                setQty={setQty}
                selectVariant={selectVariant}
                setSelectVariant={setSelectVariant}
                variantNamesState={variantNamesState}
              />
            )}
          </div>
        </div>
        <Divider />
        <div className="grid lg:grid-cols-2 lg:divide-x-[1px] xl:grid-cols-5">
          <div className="lg:pr-6 xl:col-span-3">
            <ProductDescription />
          </div>
          <div className="mt-8 lg:mt-0 lg:pl-6 xl:col-span-2">
            <ProductReview />
          </div>
        </div>
        <Divider />
        <h4>PRODUCTS FROM THE SAME SELLER</h4>
        {sm ? (
          md ? (
            lg ? (
              <div className="carousel h-[430px] w-full">
                <div
                  id="slide1"
                  className="carousel-item relative grid w-full grid-cols-6 gap-4"
                >
                  {sellerProduct.isLoading ? (
                    Array(3)
                      .fill('')
                      .map((_, idx) => {
                        return (
                          <ProductCard
                            key={`${idx}`}
                            data={undefined}
                            isLoading
                          />
                        )
                      })
                  ) : sellerProduct.isSuccess ? (
                    sellerProduct.data.data.rows
                      .slice(0, 6)
                      .map((product, idx) => {
                        return (
                          <ProductCard
                            key={`${product.title} ${idx}`}
                            data={product}
                            isLoading={false}
                            hoverable={false}
                          />
                        )
                      })
                  ) : (
                    <div>{'Error'}</div>
                  )}
                  {sellerProduct.data?.data.rows.length > 6 ? (
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <a href="#slide2" className="btn-circle btn">
                        ❮
                      </a>
                      <a href="#slide2" className="btn-circle btn">
                        ❯
                      </a>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  id="slide2"
                  className="carousel-item relative grid w-full grid-cols-6 gap-4"
                >
                  {sellerProduct.isLoading ? (
                    Array(3)
                      .fill('')
                      .map((_, idx) => {
                        return (
                          <ProductCard
                            key={`${idx}`}
                            data={undefined}
                            isLoading
                          />
                        )
                      })
                  ) : sellerProduct.isSuccess ? (
                    sellerProduct.data.data.rows
                      .slice(7, 12)
                      .map((product, idx) => {
                        return (
                          <ProductCard
                            key={`${product.title} ${idx}`}
                            data={product}
                            isLoading={false}
                            hoverable={false}
                          />
                        )
                      })
                  ) : (
                    <div>{'Error'}</div>
                  )}

                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide1" className="btn-circle btn">
                      ❮
                    </a>
                    <a href="#slide1" className="btn-circle btn">
                      ❯
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="carousel h-[430px] w-full">
                <div
                  id="slide1"
                  className="carousel-item relative grid w-full grid-cols-4 gap-4"
                >
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />

                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide3" className="btn-circle btn">
                      ❮
                    </a>
                    <a href="#slide2" className="btn-circle btn">
                      ❯
                    </a>
                  </div>
                </div>
                <div
                  id="slide2"
                  className="carousel-item relative grid w-full grid-cols-4 gap-4"
                >
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />

                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide1" className="btn-circle btn">
                      ❮
                    </a>
                    <a href="#slide3" className="btn-circle btn">
                      ❯
                    </a>
                  </div>
                </div>
                <div
                  id="slide3"
                  className="carousel-item relative grid w-full grid-cols-4 gap-4"
                >
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />
                  <img
                    src={
                      'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                    }
                    className="col-span-1 w-full"
                  />

                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide2" className="btn-circle btn">
                      ❮
                    </a>
                    <a href="#slide1" className="btn-circle btn">
                      ❯
                    </a>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="carousel h-[430px] w-full">
              <div
                id="slide1"
                className="carousel-item relative grid w-full grid-cols-3 gap-4"
              >
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />

                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a href="#slide4" className="btn-circle btn">
                    ❮
                  </a>
                  <a href="#slide2" className="btn-circle btn">
                    ❯
                  </a>
                </div>
              </div>
              <div
                id="slide2"
                className="carousel-item relative grid w-full grid-cols-3 gap-4"
              >
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />

                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a href="#slide1" className="btn-circle btn">
                    ❮
                  </a>
                  <a href="#slide3" className="btn-circle btn">
                    ❯
                  </a>
                </div>
              </div>
              <div
                id="slide3"
                className="carousel-item relative grid w-full grid-cols-3 gap-4"
              >
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />

                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a href="#slide2" className="btn-circle btn">
                    ❮
                  </a>
                  <a href="#slide4" className="btn-circle btn">
                    ❯
                  </a>
                </div>
              </div>
              <div
                id="slide4"
                className="carousel-item relative grid w-full grid-cols-3 gap-4"
              >
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />
                <img
                  src={
                    'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                  }
                  className="col-span-1 w-full"
                />

                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a href="#slide3" className="btn-circle btn">
                    ❮
                  </a>
                  <a href="#slide1" className="btn-circle btn">
                    ❯
                  </a>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="carousel h-[430px] w-full">
            <div
              id="slide1"
              className="carousel-item relative grid w-full grid-cols-2 gap-4"
            >
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide6" className="btn-circle btn">
                  ❮
                </a>
                <a href="#slide2" className="btn-circle btn">
                  ❯
                </a>
              </div>
            </div>
            <div
              id="slide2"
              className="carousel-item relative grid w-full grid-cols-2 gap-4"
            >
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide1" className="btn-circle btn">
                  ❮
                </a>
                <a href="#slide3" className="btn-circle btn">
                  ❯
                </a>
              </div>
            </div>
            <div
              id="slide3"
              className="carousel-item relative grid w-full grid-cols-2 gap-4"
            >
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide2" className="btn-circle btn">
                  ❮
                </a>
                <a href="#slide4" className="btn-circle btn">
                  ❯
                </a>
              </div>
            </div>
            <div
              id="slide4"
              className="carousel-item relative grid w-full grid-cols-2 gap-4"
            >
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide3" className="btn-circle btn">
                  ❮
                </a>
                <a href="#slide5" className="btn-circle btn">
                  ❯
                </a>
              </div>
            </div>
            <div
              id="slide5"
              className="carousel-item relative grid w-full grid-cols-2 gap-4"
            >
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide4" className="btn-circle btn">
                  ❮
                </a>
                <a href="#slide6" className="btn-circle btn">
                  ❯
                </a>
              </div>
            </div>
            <div
              id="slide6"
              className="carousel-item relative grid w-full grid-cols-2 gap-4"
            >
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />
              <img
                src={
                  'https://res.cloudinary.com/dhpao1zxi/image/upload/v1672385947/afdemumjkucfm826c1xm.jpg'
                }
                className="col-span-1 w-full"
              />

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide5" className="btn-circle btn">
                  ❮
                </a>
                <a href="#slide1" className="btn-circle btn">
                  ❯
                </a>
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    </>
  )
}

export default ProductPage
