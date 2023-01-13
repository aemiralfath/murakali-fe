import { A, Divider, P, Spinner } from '@/components'
import { useModal } from '@/hooks'
import MainLayout from '@/layout/MainLayout'
import ProductImageCarousel from '@/layout/template/product/ProductImageCarousel'
import type { NextPage } from 'next'
import Head from 'next/head'
// import { useRouter } from 'next/router'
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
  useGetProductById,
  useGetProductImagesByProductID,
  useGetTotalReview,
} from '@/api/product'
import { useGetSellerInfo } from '@/api/seller'

const ProductPage: NextPage = () => {
  // const dummyProduct = product

  const router = useRouter()
  const { pid } = router.query

  const product = useGetProductById(pid as string)

  const modal = useModal()
  const [isLoading] = useState(false)
  const [qty, setQty] = useState(1)

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

  // const [productPromotion, setProductPromotion] = useState<Promotion>()

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

  const totalReview = useGetTotalReview(pid as string)
  const seller = useGetSellerInfo(product.data?.data.products_info.shop_id)
  const productImage = useGetProductImagesByProductID(pid as string)

  return (
    <>
      <Head>
        {/* TODO: Change Page title */}
        <title>{product.data?.data.products_info.title} - Murakali</title>
        <meta name="description" content="Murakali E-Commerce Application" />
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
              <ProductImageCarousel isLoading={isLoading} data={undefined} />
            ) : (
              <div>
                <ProductImageCarousel
                  // TODO: Change image when selectVariant is not undefined
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
            {seller.data?.data && product.data?.data ? (
              <ProductDescription
                seller={seller.data.data}
                productInfo={product.data.data.products_info}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="mt-8 lg:mt-0 lg:pl-6 xl:col-span-2">
            <ProductReview />
          </div>
        </div>
        <Divider />
      </MainLayout>
    </>
  )
}

export default ProductPage
