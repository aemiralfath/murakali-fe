import { A, Divider, H3, P, Spinner } from '@/components'
import { useModal, useUser } from '@/hooks'
import MainLayout from '@/layout/MainLayout'
import ProductImageCarousel from '@/layout/template/product/ProductImageCarousel'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { HiHeart, HiShare } from 'react-icons/hi'
import ShareModal from '@/sections/productdetail/ShareModal'
import MainProductDetail from '@/sections/productdetail/MainProductDetail'
import type { ProductDetail } from '@/types/api/product'
import ChooseVariantQty from '@/sections/productdetail/ChooseVariantQty'
import ProductDescription from '@/sections/productdetail/ProductDescription'
import ProductReview from '@/sections/productdetail/ProductReview'
import { useRouter } from 'next/router'
import {
  getProductById,
  useGetProductById,
  useGetProductImagesByProductID,
  useGetTotalReview,
} from '@/api/product'
import { useGetSellerInfo } from '@/api/seller'
import { useGetSellerProduct } from '@/api/product'
import ProductCarousel from '@/sections/home/ProductCarousel'
import ProductCard from '@/layout/template/product/ProductCard'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import cx from '@/helper/cx'
import {
  useAddFavProduct,
  useCheckFavoriteProduct,
  useCountSpecificFavoriteProduct,
  useDeleteFavProduct,
} from '@/api/product/favorite'
import { toast } from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { APIResponse } from '@/types/api/response'
import { useGetVoucherShopCheckout } from '@/api/user/checkout'
import formatMoney from '@/helper/formatMoney'
import moment from 'moment'
import DeliveryInformation from '@/sections/productdetail/DeliveryInformation'

const ProductPage: NextPage = () => {
  const router = useRouter()
  const { pid } = router.query
  const { user } = useUser()
  const product = useGetProductById(pid as string)
  const addFavorite = useAddFavProduct()
  const deleteFavorite = useDeleteFavProduct()
  const checkFavorite = useCheckFavoriteProduct()
  const countFavorite = useCountSpecificFavoriteProduct()
  const [checkFav, setCheckFav] = useState(false)
  const [countFav, setCountFav] = useState(0)

  useEffect(() => {
    if (addFavorite.isError) {
      const errmsg = addFavorite.failureReason as AxiosError<APIResponse<null>>
      if (errmsg.response?.data.message === 'Product already in favorite.') {
        toast.success('Product already in favorite')
      } else if (errmsg.response?.data.message === 'Forbidden') {
        toast.error('You must login first')
        router.push({
          pathname: '/login',
          query: {
            from: ('/p/' + pid) as string,
          },
        })
      } else {
        toast.error(errmsg.response?.data.message as string)
      }
    }
  }, [addFavorite.isError])

  useEffect(() => {
    if (deleteFavorite.isError) {
      const errmsg = deleteFavorite.failureReason as AxiosError<
        APIResponse<null>
      >

      toast.error(errmsg.response?.data.message as string)
    }
  }, [deleteFavorite.isError])

  useEffect(() => {
    if (addFavorite.isSuccess) {
      toast.success('Added to Favorite')
      checkFavorite.mutate(pid as string)
      countFavorite.mutate(pid as string)
    }
  }, [addFavorite.isSuccess])

  useEffect(() => {
    if (deleteFavorite.isSuccess) {
      toast.success('Remove from Favorite')
      checkFavorite.mutate(pid as string)
      countFavorite.mutate(pid as string)
    }
  }, [addFavorite.isSuccess, deleteFavorite.isSuccess])

  const totalReview = useGetTotalReview(pid as string)
  const voucherShop = useGetVoucherShopCheckout(
    product.data?.data?.products_info.shop_id
  )
  const seller = useGetSellerInfo(product.data?.data?.products_info.shop_id)
  const productImage = useGetProductImagesByProductID(pid as string)
  const modal = useModal()
  const [isLoading] = useState(false)
  const [qty, setQty] = useState(1)
  const sellerProduct = useGetSellerProduct(
    1,
    12,
    '',
    '',
    '',
    '',
    0,
    0,
    0,
    0,
    seller.data?.data?.id
  )

  const similiarProduct = useGetSellerProduct(
    1,
    24,
    '',
    '',
    '',
    '',
    0,
    0,
    0,
    0,
    product.data?.data?.products_info.category_name
  )

  const recommendedProduct = useGetSellerProduct(
    1,
    24,
    '',
    product.data?.data?.products_info.category_name ?? '',
    'recommended',
    'desc',
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
  useEffect(() => {
    if (product.data?.data) {
      const tempProductDetail = product.data.data.products_detail[0]
      let variantNames: string[] = []

      if (tempProductDetail !== undefined) {
        variantNames = Object.keys(tempProductDetail.variant)
      }
      setVariantNames(variantNames)
      setSelectMap(Array(variantNames.length).fill(-1))

      const variantTypes = {}
      const variantMap: Array<Array<ProductDetail | undefined>> = []

      variantNames.forEach((name) => {
        const types: string[] = []
        if (product.data?.data) {
          product.data.data.products_detail.forEach((variant) => {
            const varName = variant.variant[name] ?? ''
            if (!types.includes(varName)) {
              types.push(varName)
            }
          })
        }

        variantTypes[name] = types
      })

      const name0 = variantNames[0]
      const name1 = variantNames[1]

      if (name0 !== undefined) {
        variantTypes[name0].forEach((typeNameZero) => {
          const variantTypeNameMap: Array<ProductDetail | undefined> = []
          if (name1 !== undefined) {
            variantTypes[name1].forEach((typeNameOne) => {
              const filtered = product.data?.data
                ? product.data.data.products_detail.filter((variant) => {
                    return (
                      variant.variant[name0] === typeNameZero &&
                      variant.variant[name1] === typeNameOne
                    )
                  })
                : []
              if (filtered.length > 0) {
                variantTypeNameMap.push(filtered[0])
              } else {
                variantTypeNameMap.push(undefined)
              }
            })
          } else {
            const filtered = product.data?.data
              ? product.data.data.products_detail.filter((variant) => {
                  return variant.variant[name0] === typeNameZero
                })
              : []
            if (filtered.length > 0) {
              variantTypeNameMap.push(filtered[0])
            } else {
              variantTypeNameMap.push(undefined)
            }
          }
          variantMap.push(variantTypeNameMap)
        })
      }

      setVariantTypes(variantTypes)
      setVariantMap(variantMap)
    }
  }, [product.isLoading])

  useEffect(() => {
    if (!selectMap.includes(-1)) {
      if (variantMapState.length > 0) {
        if (
          selectMap[0] &&
          variantMapState[selectMap[0]] !== undefined &&
          selectMap[1]
        ) {
          const tempMapState = variantMapState[selectMap[0]]
          if (tempMapState !== undefined) {
            setSelectVariant(tempMapState[selectMap[1]])
          }
        } else if (variantMapState[0] && selectMap[0]) {
          setSelectVariant(variantMapState[0][selectMap[0]])
        }
      }
    } else {
      setSelectVariant(undefined)
    }
  }, [selectMap])

  useEffect(() => {
    if (checkFavorite.isSuccess) {
      setCheckFav(Boolean(checkFavorite.data.data.data))
    }
  }, [checkFavorite.isSuccess])
  useEffect(() => {
    if (countFavorite.data?.data) {
      setCountFav(countFavorite.data.data.data ?? 0)
    }
  }, [countFavorite.isSuccess])

  useEffect(() => {
    checkFavorite.mutate(pid as string)
    countFavorite.mutate(pid as string)
  }, [])
  return (
    <>
      <Head>
        <>
          <title>Products - Murakali</title>
          <meta name="description" content="Murakali E-Commerce Application" />
        </>
      </Head>
      <MainLayout>
        <div className="grid grid-cols-12">
          <div className="col-span-12 flex flex-col md:flex-row lg:col-span-9">
            {isLoading ? (
              <ProductImageCarousel isLoading data={undefined} />
            ) : (
              <div>
                {productImage.data?.data && product.data?.data ? (
                  <ProductImageCarousel
                    data={{
                      images: productImage.data?.data,
                      alt: product.data?.data.products_info.title,
                    }}
                    isLoading={false}
                    selectedImageUrl={
                      selectVariant !== undefined
                        ? productImage.data?.data[0] !== undefined
                          ? productImage.data?.data.find((image) => {
                              return (
                                image.product_detail_id === selectVariant?.id
                              )
                            })?.url ?? productImage.data?.data[0].url
                          : undefined
                        : undefined
                    }
                  />
                ) : (
                  <></>
                )}
                <div className="mt-4 md:pl-[2.8rem] xl:pl-[4rem]">
                  <div className="flex items-center gap-3 text-gray-500 md:pl-2">
                    <A
                      className={cx(
                        'flex items-center gap-1 font-semibold',
                        checkFav ? 'text-red-400' : ''
                      )}
                      onClick={() => {
                        if (product.data?.data && user) {
                          if (!checkFav) {
                            addFavorite.mutate(
                              product.data.data.products_info.id
                            )
                          } else if (checkFav) {
                            deleteFavorite.mutate(
                              product.data.data.products_info.id
                            )
                          }
                        } else {
                          toast.error('You must login first')
                          router.push({
                            pathname: '/login',
                            query: {
                              from: ('/p/' + pid) as string,
                            },
                          })
                        }
                      }}
                    >
                      <HiHeart className="text-xl" />
                      <P>
                        Favorite {'('}
                        {countFav > 1000 ? <>{countFav / 1000} K</> : countFav}
                        {')'}
                      </P>
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
            <div>
              <MainProductDetail
                isLoading={product.isLoading}
                variantNamesState={variantNamesState}
                variantTypesState={variantTypesState}
                variantMapState={variantMapState}
                selectMap={selectMap}
                setSelectMap={setSelectMap}
                selectVariant={selectVariant}
                productInfo={product.data?.data?.products_info}
                totalReview={totalReview.data?.data?.total_rating ?? 0}
              />
              <div className="mt-4 md:mx-4 xl:col-span-3">
                {product.isSuccess ? (
                  <DeliveryInformation
                    weight={
                      selectVariant !== undefined ? selectVariant.weight : 0
                    }
                    shopID={product.data?.data?.products_info.shop_id ?? ''}
                    productID={product.data?.data?.products_info.id ?? ''}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div className="mt-4 md:mx-4 xl:col-span-3">
                {seller.data?.data && product.data?.data ? (
                  <ProductDescription
                    seller={seller.data.data}
                    productInfo={product.data.data.products_info}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-12 mt-6 flex h-fit flex-col gap-4 rounded border p-4 lg:col-span-3 lg:mt-0">
            {isLoading ? (
              <Spinner color="neutral" />
            ) : (
              <ChooseVariantQty
                productID={pid as string}
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

        {!voucherShop.data?.data ? (
          <></>
        ) : (
          <>
            {voucherShop.data?.data?.rows.length > 0 ? (
              <div className="mt-8 lg:mt-0 lg:pl-6 xl:col-span-2">
                {' '}
                <H3>Voucher Shop</H3>
                <div className="flex h-full w-full overflow-x-auto">
                  {voucherShop.data?.data.rows.map((voucher, idx) => {
                    return (
                      <div
                        key={'voucher' + idx}
                        className={
                          'my-2 mx-1 h-20 w-64 rounded-lg border-4 border-solid border-primary py-2 px-5 hover:shadow-lg'
                        }
                      >
                        <P className="text-md block max-w-[95%] truncate font-bold text-primary ">
                          {voucher.code}
                        </P>
                        <div className="flex flex-wrap justify-between">
                          <P className=" text-[12px] text-gray-500 ">
                            Min. Rp. {formatMoney(voucher.min_product_price)}
                          </P>
                          <P className=" text-[12px] text-gray-500 ">
                            until{' '}
                            {moment(voucher.expired_date).format(
                              'DD MMM YYYY '
                            )}{' '}
                          </P>
                        </div>

                        <P className=" text-[12px] text-gray-500 ">
                          Quota Left
                          {' ' + voucher.quota}
                        </P>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <P className="mx-5 italic text-gray-400">
                There are no voucher for this product, yet.
              </P>
            )}
          </>
        )}

        <Divider />
        <div className="">
          <div className="mt-8 lg:mt-0 lg:pl-6 xl:col-span-2">
            {totalReview.data?.data ? (
              <ProductReview
                productID={pid as string}
                rating={totalReview.data.data}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        <Divider />
        <H3>Another Products from Seller</H3>
        <ProductCarousel product={sellerProduct.data?.data?.rows ?? []} />
        <Divider />
        <H3>Recommended Product</H3>
        <ProductCarousel product={recommendedProduct.data?.data?.rows ?? []} />
        <Divider />
        <H3>Similiar Products</H3>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {similiarProduct.isLoading ? (
            Array(3)
              .fill('')
              .map((_, idx) => {
                return <ProductCard key={`${idx}`} data={undefined} isLoading />
              })
          ) : similiarProduct.data?.data ? (
            similiarProduct.data.data.rows.map((product, idx) => {
              return (
                <ProductCard
                  key={`${product.title} ${idx}`}
                  data={product}
                  isLoading={false}
                  hoverable
                />
              )
            })
          ) : (
            <div>{'Error'}</div>
          )}
        </div>
      </MainLayout>
    </>
  )
}

export default ProductPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { pid } = context.params as { pid: string }
  const queryClient = new QueryClient()
  let isError = false

  try {
    await queryClient.fetchQuery({
      queryFn: () => getProductById(pid as string),
      queryKey: ['product', pid],
    })
  } catch (error) {
    isError = true
  }
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    notFound: isError,
  }
}
