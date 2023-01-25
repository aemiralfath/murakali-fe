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
  const seller = useGetSellerInfo(product.data?.data.products_info.shop_id)
  const productImage = useGetProductImagesByProductID(pid as string)
  const modal = useModal()
  const [isLoading] = useState(false)
  const [qty, setQty] = useState(1)
  const sellerProduct = useGetSellerProduct(
    1,
    12,
    '',
    '',
    seller.data?.data.id,
    '',
    '',
    0,
    0,
    0,
    0
  )

  const similiarProduct = useGetSellerProduct(
    1,
    24,
    '',
    product.data?.data.products_info.category_name,
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
  useEffect(() => {
    if (product.isSuccess) {
      const variantNames = Object.keys(
        product.data.data.products_detail[0].variant
      )
      setVariantNames(variantNames)
      setSelectMap(Array(variantNames.length).fill(-1))

      const variantTypes = {}
      const variantMap = []

      variantNames.forEach((name) => {
        const types = []
        product.data.data.products_detail.forEach((variant) => {
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
            const filtered = product.data.data.products_detail.filter(
              (variant) => {
                return (
                  variant.variant[variantNames[0]] === typeNameZero &&
                  variant.variant[variantNames[1]] === typeNameOne
                )
              }
            )
            if (filtered.length > 0) {
              variantTypeNameMap.push(filtered[0])
            } else {
              variantTypeNameMap.push(undefined)
            }
          })
        } else {
          const filtered = product.data.data.products_detail.filter(
            (variant) => {
              return variant.variant[variantNames[0]] === typeNameZero
            }
          )
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
  }, [product.isLoading])

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

  useEffect(() => {
    if (checkFavorite.isSuccess) {
      setCheckFav(checkFavorite.data.data.data)
    }
  }, [checkFavorite.isSuccess])
  useEffect(() => {
    if (countFavorite.isSuccess) {
      setCountFav(countFavorite.data.data.data)
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
        {/* {isLoading ? (
          <div className="h-[1.25rem] w-[16rem] animate-pulse rounded bg-base-300" />
        ) : (
          <Breadcrumbs data={dummyBreadcrumbs} />
        )} */}
        <div className="grid grid-cols-12">
          <div className="col-span-12 flex flex-col md:flex-row lg:col-span-9">
            {isLoading ? (
              <ProductImageCarousel isLoading data={undefined} />
            ) : (
              <div>
                <ProductImageCarousel
                  data={{
                    images: productImage.data?.data,
                    alt: product.data?.data.products_info.title,
                  }}
                  isLoading={false}
                  selectedImageUrl={
                    selectVariant !== undefined
                      ? productImage.data?.data.filter((image) => {
                          return image.product_detail_id === selectVariant?.id
                        })[0].url
                      : productImage.data?.data[0].url
                  }
                />
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
                productInfo={product.data?.data.products_info}
                totalReview={totalReview.data?.data?.total_rating ?? 0}
              />
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
        <div className="">
          <div className="mt-8 lg:mt-0 lg:pl-6 xl:col-span-2">
            <ProductReview
              productID={pid as string}
              rating={totalReview.data?.data}
            />
          </div>
        </div>
        <Divider />
        <H3>Another Products from Seller</H3>
        <ProductCarousel product={sellerProduct.data?.data.rows} />
        <Divider />
        <H3>Similiar Products</H3>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {similiarProduct.isLoading ? (
            Array(3)
              .fill('')
              .map((_, idx) => {
                return <ProductCard key={`${idx}`} data={undefined} isLoading />
              })
          ) : similiarProduct.isSuccess ? (
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
  const { pid } = context.params
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
