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
  EditProductReq,
  ProductDetailReq,
  ProductInfoReq,
} from '@/types/api/product'
import { useImmer } from 'use-immer'
import { toast } from 'react-hot-toast'
import { useCreateProduct, useEditProduct } from '@/api/product/manage'
import { useLoadingModal } from '@/hooks'
import type { AxiosError } from 'axios'
import type { APIResponse } from '@/types/api/response'
import { useRouter } from 'next/router'
import { useGetProductById } from '@/api/product'
import { HiArrowLeft } from 'react-icons/hi'
import ManagePromotionSaction from '@/sections/seller-panel/promotion/ManagePromotion'

const ManagePromotionSeller = () => {
  const router = useRouter()
  const { intent, promotion_id } = router.query
  const [id, setId] = useState<string>()
  useEffect(() => {
    if (typeof promotion_id === 'string') {
      setId(promotion_id)
    }
  }, [intent, promotion_id])

  const setLoadingModal = useLoadingModal()

  const createProduct = useCreateProduct()
  const editProduct = useEditProduct()

  const productDetail = useGetProductById(id)

  useEffect(() => {
    if (typeof promotion_id === 'string') {
      setLoadingModal(productDetail.isLoading)
    }
  }, [productDetail.isLoading, intent])

  useEffect(() => {
    setLoadingModal(createProduct.isLoading)
  }, [createProduct.isLoading])

  useEffect(() => {
    if (createProduct.isSuccess) {
      toast.success('Product Created!')
      router.push('/seller-panel/products')
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

  useEffect(() => {
    setLoadingModal(editProduct.isLoading)
  }, [editProduct.isLoading])

  useEffect(() => {
    if (editProduct.isSuccess) {
      toast.success('Product Edited!')
      router.push('/seller-panel/products')
    }
  }, [editProduct.isSuccess])

  useEffect(() => {
    if (editProduct.isError) {
      const errmsg = editProduct.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [editProduct.isError])

  const [data, updateData] = useImmer<ProductInfoReq>({
    title: '',
    description: '',
    thumbnail: '',
    category_id: '',
    listed_status: true,
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
          variant_detail: Yup.array()
            .of(
              Yup.object().shape({
                type: Yup.string(),
                name: Yup.string(),
              })
            )
            .min(1, 'Variant detail is invalid'),
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
        if (intent === 'edit') {
          const reqEditBody: EditProductReq = {
            products_info_update: reqBody.products_info,
            products_detail_update: reqBody.products_detail.map((r, idx) => {
              return {
                ...r,
                product_detail_id:
                  productDetail.data.data.products_detail[idx].id,
                variant_id_remove: [],
                variant_info_update: [],
              }
            }),
            products_detail_id_remove: [],
          }
          editProduct.mutate({ id: id, data: reqEditBody })
        } else {
          createProduct.mutate(reqBody)
        }
      })
      .catch((err) => {
        if (err instanceof Yup.ValidationError) {
          toast.error(err.message)
        }
      })
  }

  useEffect(() => {
    if (productDetail.isSuccess) {
      if (intent === 'add' && typeof promotion_id === 'string') {
        toast.success('Data has been filled!')
      }

      const data = productDetail.data.data
      updateData((draft) => {
        draft.title = data.products_info.title
        draft.description = data.products_info.description
      })
      setCondition(data.products_detail[0]?.condition)
      setHazardous(data.products_detail[0]?.hazardous)
    }
  }, [productDetail.isSuccess])

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="product">
        <div className="flex w-full items-center justify-between">
          {intent === 'edit' ? <H2>Edit Product</H2> : <H2>Add Product</H2>}
          <Button
            size={'sm'}
            buttonType="primary"
            outlined
            onClick={() => {
              router.back()
            }}
          >
            <HiArrowLeft /> Back
          </Button>
        </div>
        <ManagePromotionSaction
          nameValue={data.title}
          setName={(s) =>
            updateData((draft) => {
              draft.title = s
            })
          }
        />
        <ProductVariants
          productDetailData={productDetailData}
          updateProductDetailData={updateProductDetailData}
          defaultProductDetail={productDetail.data?.data.products_detail}
          isEditing={intent === 'edit'}
        />
        <ProductShipping hazardous={hazardous} setHazardous={setHazardous} />
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={handleSubmit} buttonType="primary">
            {intent === 'edit' ? 'Edit' : 'Save'}
          </Button>
          <Button onClick={() => router.back()} buttonType="primary" outlined>
            Cancel
          </Button>
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default ManagePromotionSeller
