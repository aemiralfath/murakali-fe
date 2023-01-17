import { useGetAllCategory } from '@/api/category'
import { Button, H2 } from '@/components'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import ProductInfo from '@/sections/sellerpanel/addproduct/ProductInfo'
import ProductShipping from '@/sections/sellerpanel/addproduct/ProductShipping'
import ProductVariants from '@/sections/sellerpanel/addproduct/ProductVariants'
import UploadPhoto from '@/sections/sellerpanel/addproduct/UploadPhoto'
import Head from 'next/head'
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
import type {
  CreateProductReq,
  ProductDetailReq,
  ProductInfoReq,
} from '@/types/api/product'
import { useImmer } from 'use-immer'
import { toast } from 'react-hot-toast'
import { useCreateProduct } from '@/api/product/manage'
import { useLoadingModal } from '@/hooks'
import type { AxiosError } from 'axios'
import type { APIResponse } from '@/types/api/response'
import { useRouter } from 'next/router'

const AddProduct = () => {
  const router = useRouter()
  const { intent, product_id } = router.query

  const setLoadingModal = useLoadingModal()

  const allCategory = useGetAllCategory()
  const createProduct = useCreateProduct()

  useEffect(() => {
    setLoadingModal(createProduct.isLoading)
  }, [createProduct.isLoading])

  useEffect(() => {
    if (createProduct.isSuccess) {
      toast.success('Product Created!')
    }
  }, [createProduct.isSuccess])

  useEffect(() => {
    if (createProduct.isError) {
      const errmsg = createProduct.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [createProduct.isError])

  const [data, updateData] = useImmer<ProductInfoReq>({
    title: '',
    description: '',
    thumbnail: '',
    category_id: '',
  })

  const [condition, setCondition] = useState<'new' | 'used'>('new')
  const [hazardous, setHazardous] = useState<boolean>(false)

  const [productDetailData, updateProductDetailData] = useImmer<{
    [key: string]: ProductDetailReq
  }>({})

  const handleSubmit = () => {
    const yupObject = Yup.object().shape({
      products_info: Yup.object().shape({
        title: Yup.string()
          .min(1, 'Product Name is required')
          .required('Product Name is required'),
        description: Yup.string()
          .min(1, 'Description is required')
          .required('Description is required'),
        thumbnail: Yup.string()
          .min(1, 'Product Picture is required')
          .required('Product Picture is required'),
        category_id: Yup.string(),
      }),
      products_detail: Yup.array().of(
        Yup.object().shape({
          price: Yup.number()
            .min(1, 'Price is required')
            .required('Price is required'),
          stock: Yup.number().min(0, 'Stock cannot negative'),
          weight: Yup.number()
            .min(1, 'Weight is required')
            .required('Weight is required'),
          size: Yup.number()
            .min(1, 'Volume is required')
            .required('Volume is required'),
          hazardous: Yup.boolean().required(
            'Dangerous Goods status is required'
          ),
          condition: Yup.string().required('Condition is required'),
          bulk_price: Yup.boolean(),
          photo: Yup.array().of(Yup.string()).min(1),
          variant_detail: Yup.array().of(
            Yup.object().shape({
              type: Yup.string(),
              name: Yup.string(),
            })
          ),
        })
      ),
    })
    const reqBody: CreateProductReq = {
      products_info: data,
      products_detail: [],
    }
    const tempProductDetail = []
    Object.keys(productDetailData).forEach((key) => {
      const data = productDetailData[key]
      const tempData: ProductDetailReq = { ...data }
      if (data) {
        tempData.bulk_price = false
        tempData.condition = condition
        tempData.hazardous = hazardous

        tempProductDetail.push(tempData)
      }
    })
    reqBody.products_detail = tempProductDetail
    yupObject
      .validate(reqBody)
      .then(() => {
        createProduct.mutate(reqBody)
      })
      .catch((err) => {
        if (err instanceof Yup.ValidationError) {
          toast.error(err.message)
        }
      })
  }

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="product">
        <div className="flex w-full items-center justify-between">
          {intent === 'edit' ? <H2>Edit Product</H2> : <H2>Add Product</H2>}
        </div>
        <UploadPhoto
          setThumbnail={(s) => {
            updateData((draft) => {
              draft.thumbnail = s
            })
          }}
        />
        <ProductInfo
          nameValue={data.title}
          setName={(s) =>
            updateData((draft) => {
              draft.title = s
            })
          }
          setCategoryID={(id) =>
            updateData((draft) => {
              draft.category_id = id
            })
          }
          conditionValue={condition}
          setCondition={setCondition}
          descriptionValue={data.description}
          setDescription={(s) =>
            updateData((draft) => {
              draft.description = s
            })
          }
          categoryData={allCategory.data?.data}
        />
        <ProductVariants
          productDetailData={productDetailData}
          updateProductDetailData={updateProductDetailData}
        />
        <ProductShipping hazardous={hazardous} setHazardous={setHazardous} />
        <Button onClick={handleSubmit}>Test</Button>
      </SellerPanelLayout>
    </div>
  )
}

export default AddProduct
