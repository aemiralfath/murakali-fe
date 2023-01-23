import {
  Button,
  Chip,
  Divider,
  H2,
  H4,
  P,
  PaginationNav,
  TextInput,
} from '@/components'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLoadingModal } from '@/hooks'
import type { APIResponse, PaginationData } from '@/types/api/response'
import { useRouter } from 'next/router'
import { HiArrowLeft } from 'react-icons/hi'
import Table from '@/components/table'
import Image from 'next/image'
import formatMoney from '@/helper/formatMoney'
import type {
  CreatePromotionSellerRequest,
  ProductPromotion,
  SellerPromotion,
} from '@/types/api/promotion'
import moment from 'moment'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import {
  useCreatePromotion,
  useProductNoPromotionSeller,
  useSellerPromotionDetail,
  useUpdatePromotion,
} from '@/api/seller/promotion'
import type { AxiosError } from 'axios'
const ManagePromotionSeller = () => {
  const router = useRouter()
  const { intent, id } = router.query

  //// handling atas
  const [input, setInput] = useState<CreatePromotionSellerRequest>({
    name: '',
    actived_date: '',
    expired_date: '',
    product_promotion: [],
  })

  const handleChangePromotion = (event: React.FormEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name
    const value = event.currentTarget.value

    setInput((prev) => ({ ...prev, [inputName]: value }))
  }
  //////

  /// selected product
  const [tempDiscountPercentage, setTempDiscountPercentage] = useState<
    number | null
  >(null)
  const [tempDiscountFixPrice, setTempDiscountFixPrice] = useState<
    number | null
  >(null)
  const [tempMinimumProductPrice, setTempMinimumProductPrice] = useState<
    number | null
  >(null)
  const [tempMaxDiscountPrice, setTempMaxDiscountPrice] = useState<
    number | null
  >(null)
  const [tempQuota, setTempQuota] = useState<number | null>(null)
  const [tempMaxQuantity, setTempMaxQuantity] = useState<number | null>(null)

  const handleChange = (
    event: React.FormEvent<HTMLInputElement>,
    id: string
  ) => {
    const inputName = event.currentTarget.name
    const value = event.currentTarget.value
    const num = value === '' ? 0 : parseInt(value)

    const newState = selectedProduct.map((sp) => {
      if (sp.product_id === id) {
        let subprice = sp.price
        let discount = 0
        if (inputName === 'discount_percentage') {
          discount = (sp.price * num) / 100
          subprice = sp.price - discount
        }
        if (inputName === 'discount_fix_price') {
          discount = num
          subprice = sp.price - discount
        }
        return {
          ...sp,
          [inputName]: num,
          product_subprice: Number.isNaN(subprice)
            ? sp.price
            : subprice < 0
            ? 0
            : subprice,
        }
      }
      return sp
    })

    setSelectedProduct(newState)
  }

  const handleChangeDiscountNominal = (
    event: React.FormEvent<HTMLInputElement>,
    id: string
  ) => {
    const value = event.currentTarget.value
    const num = value === '' ? 0 : parseInt(value)

    const newState = selectedProduct.map((sp) => {
      if (sp.product_id === id) {
        const discount = num
        const subprice = sp.price - discount

        return {
          ...sp,
          discount_fix_price: num,
          max_discount_price: num,
          product_subprice: Number.isNaN(subprice)
            ? sp.price
            : subprice < 0
            ? 0
            : subprice,
        }
      }
      return sp
    })

    setSelectedProduct(newState)
  }

  const handleChangeOnClick = () => {
    const newState = selectedProduct.map((sp) => {
      const tempProduct = sp
      selectedProductId.map((id) => {
        if (sp.product_id === id) {
          if (tempDiscountPercentage !== null) {
            tempProduct.discount_percentage = tempDiscountPercentage
            tempProduct.discount_fix_price = 0
          }

          if (tempDiscountFixPrice !== null) {
            tempProduct.discount_fix_price = tempDiscountFixPrice
            tempProduct.discount_percentage = 0
            tempProduct.max_discount_price = tempDiscountFixPrice
          }

          if (tempMinimumProductPrice !== null) {
            tempProduct.min_product_price = tempMinimumProductPrice
          }

          if (tempMaxDiscountPrice !== null) {
            tempProduct.max_discount_price = tempMaxDiscountPrice
          }

          if (tempQuota !== null) {
            tempProduct.quota = tempQuota
          }

          if (tempMaxQuantity !== null) {
            tempProduct.max_quantity = tempMaxQuantity
          }
        }
      })
      return tempProduct
    })
    setTempDiscountPercentage(null)
    setTempDiscountFixPrice(null)
    setTempMinimumProductPrice(null)
    setTempMaxDiscountPrice(null)
    setTempQuota(null)
    setTempMaxQuantity(null)

    setSelectedProduct(newState)
    toast.success('Value has been set')
    setSelectedProductId([])
  }

  const [selectedId, setSelectedId] = useState<string[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string[]>([])

  const toggleSelectedProduct = (id: string) => {
    if (selectedProductId.includes(id)) {
      setSelectedProductId(selectedProductId.filter((sId) => sId !== id))
    } else {
      setSelectedProductId([...selectedProductId, id])
    }
  }

  ///////////

  // untuk dapetin edit dan duplicate
  const [promotionId, setPromotionId] = useState<string>(String(id))
  // going to get shop product here ///
  useEffect(() => {
    if (typeof id === 'string') {
      setPromotionId(id)
    }
  }, [intent, id])

  const [page, setPage] = useState(1)
  const getProductNoPromotionSeller = useProductNoPromotionSeller(10, page)

  const [selectedProduct, setSelectedProduct] = useState<ProductPromotion[]>([])

  const setLoadingModal = useLoadingModal()

  // ganti jadi promotion
  const createPromotion = useCreatePromotion()
  const updatePromotion = useUpdatePromotion()

  const promotionDetail = useSellerPromotionDetail(promotionId)
  // blm buat useGetPromotionbyName
  // const productDetail = useGetProductById(id)
  // ...

  const [saveInput, setSaveInput] = useState<CreatePromotionSellerRequest>({
    name: '',
    actived_date: '',
    expired_date: '',
    product_promotion: [],
  })

  useEffect(() => {
    if (typeof id === 'string') {
      setLoadingModal(promotionDetail.isLoading)
    }
  }, [promotionDetail.isLoading, intent])

  useEffect(() => {
    if (promotionDetail.isSuccess) {
      if (intent === 'add' && typeof id === 'string') {
        toast.success('Data has been filled!')
      }
      setInput({
        ...input,
        name: promotionDetail.data?.data.promotion_name,
        actived_date: promotionDetail.data?.data.actived_date,
        expired_date: promotionDetail.data?.data.expired_date,
      })

      setSaveInput({
        ...saveInput,
        name: promotionDetail.data?.data.promotion_name,
        actived_date: promotionDetail.data?.data.actived_date,
        expired_date: promotionDetail.data?.data.expired_date,
      })
      const pp: ProductPromotion = {
        product_id: promotionDetail.data?.data.product_id,
        product_thumbnail_url: promotionDetail.data?.data.product_thumbnail_url,
        product_name: promotionDetail.data?.data.product_name,
        price: promotionDetail.data?.data.min_price,
        category_name: '',
        unit_sold: 0,
        rating: 0,
        product_subprice: promotionDetail.data?.data.product_sub_min_price,
        discount_percentage: promotionDetail.data?.data.discount_percentage,
        discount_fix_price: promotionDetail.data?.data.discount_fix_price,
        min_product_price: promotionDetail.data?.data.min_product_price,
        max_discount_price: promotionDetail.data?.data.max_discount_price,
        quota: promotionDetail.data?.data.quota,
        max_quantity: promotionDetail.data?.data.max_quantity,
      }
      setSelectedProduct([pp])
    }
  }, [promotionDetail.isSuccess])
  ///////////////////////////////////////////////////////// create promotion example //////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setLoadingModal(createPromotion.isLoading)
  }, [createPromotion.isLoading])
  useEffect(() => {
    if (createPromotion.isSuccess) {
      toast.success('Promotion Created!')
      router.push('/seller-panel/promotion')
    }
  }, [createPromotion.isSuccess])

  useEffect(() => {
    if (createPromotion.isError) {
      const errmsg = createPromotion.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [createPromotion.isError])

  ///////////////////////////////////////////////////////// /////// ///////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////// edit promotion example //////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setLoadingModal(updatePromotion.isLoading)
  }, [updatePromotion.isLoading])

  useEffect(() => {
    if (updatePromotion.isSuccess) {
      toast.success('Promotion Edited!')
      router.push('/seller-panel/promotion')
    }
  }, [updatePromotion.isSuccess])

  useEffect(() => {
    if (updatePromotion.isError) {
      const errmsg = updatePromotion.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [updatePromotion.isError])
  ///////////////////////////////////////////////////////// /////// ///////////////////////////////////////////////////////////////////////////////////////////

  const handleSubmit = () => {
    if (input.name.length <= 0) {
      toast.error('Promotion Name is required')
      return
    }
    if (input.actived_date.length <= 0) {
      toast.error('Actived Date is required')
      return
    }
    if (input.expired_date.length <= 0) {
      toast.error('Expired Date is required')
      return
    }
    if (selectedProduct.length <= 0) {
      toast.error('Selected Product is required')
      return
    }
    const valid = selectedProduct.map((sp) => {
      if (sp.max_quantity <= 0) {
        toast.error(
          `product ${sp.product_name} max product quantity is required`
        )
        return false
      }
      if (sp.max_discount_price <= 0) {
        toast.error(`product ${sp.product_name} maximum discount is required`)
        return false
      }
      if (sp.discount_percentage <= 0 && sp.discount_fix_price <= 0) {
        toast.error(
          `product ${sp.product_name} choose discount percentage / nominal to promotion`
        )
        return false
      }
      return true
    })

    if (valid.includes(false)) {
      return
    }
    const reqBody: CreatePromotionSellerRequest = {
      name: input.name,
      actived_date: moment(input.actived_date)
        .utc()
        .format('DD-MM-YYYY HH:mm:ss')
        .toString(),
      expired_date: moment(input.expired_date)
        .utc()
        .format('DD-MM-YYYY HH:mm:ss')
        .toString(),
      product_promotion: selectedProduct,
    }

    if (intent === 'edit') {
      const pp = selectedProduct.at(0)
      const reqEditBody: SellerPromotion = {
        promotion_id: promotionDetail.data?.data.promotion_id,
        promotion_name: input.name,
        product_id: pp.product_id,
        product_name: pp.product_name,
        product_thumbnail_url: pp.product_thumbnail_url,
        discount_percentage: pp.discount_percentage,
        discount_fix_price: pp.discount_fix_price,
        min_product_price: pp.min_product_price,
        max_discount_price: pp.max_discount_price,
        quota: pp.quota,
        max_quantity: pp.max_quantity,
        actived_date: moment(input.actived_date)
          .utc()
          .format('DD-MM-YYYY HH:mm:ss')
          .toString(),
        expired_date: moment(input.expired_date)
          .utc()
          .format('DD-MM-YYYY HH:mm:ss')
          .toString(),
        created_at: '',
        updated_at: {
          Time: '',
          Valid: false,
        },
        deleted_at: {
          Time: '',
          Valid: false,
        },
      }

      updatePromotion.mutate(reqEditBody)
    } else {
      createPromotion.mutate(reqBody)
    }
  }

  const toggleSelectProduct = (id: string, tproduct: ProductPromotion) => {
    const p: ProductPromotion = {
      product_id: tproduct.product_id,
      product_thumbnail_url: tproduct.product_thumbnail_url,
      product_name: tproduct.product_name,
      price: tproduct.price,
      product_subprice: tproduct.price,
      category_name: tproduct.product_name,
      unit_sold: tproduct.unit_sold,
      rating: tproduct.rating,
      discount_percentage: 0,
      discount_fix_price: 0,
      min_product_price: 0,
      max_discount_price: 0,
      quota: 1,
      max_quantity: 0,
    }
    let exist = false
    selectedProduct.map((sp) => {
      if (p.product_id === sp.product_id) {
        exist = true
      }
    })
    if (exist === false) {
      setSelectedProduct([...selectedProduct, p])
    } else {
      setSelectedProduct(
        selectedProduct.filter((sp) => sp.product_id !== tproduct.product_id)
      )
    }

    if (selectedId.includes(id)) {
      setSelectedId(selectedId.filter((sId) => sId !== id))
    } else {
      setSelectedId([...selectedId, id])
    }
  }

  const formatData = (data?: PaginationData<ProductPromotion>) => {
    if (data?.rows.length > 0) {
      return data.rows.map((row) => ({
        Select: (
          <div>
            <input
              type={'checkbox'}
              className={'checkbox'}
              readOnly
              checked={selectedId.includes(row.product_id)}
              onClick={() => toggleSelectProduct(row.product_id, row)}
            />
          </div>
        ),
        Product: (
          <div className="flex gap-3">
            <div className="w-[65px] flex-1">
              <Image
                src={row.product_thumbnail_url}
                className={'rounded-lg'}
                width={65}
                height={65}
                alt={row.product_name}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-1">
              <P className="w-[30rem] font-semibold line-clamp-2">
                {row.product_name}
              </P>
            </div>
          </div>
        ),
        Stats: (
          <div>
            <div className="flex gap-2">
              <P className="font-semibold">Sold:</P>
              <P className="">{row.unit_sold}</P>
            </div>
            <div className="flex gap-2">
              <P className="font-semibold">Rating (avg.):</P>
              <P className="">{row.rating}</P>
            </div>
          </div>
        ),
        Category: (
          <div>
            <Chip type="gray">{row.category_name}</Chip>
          </div>
        ),
        Price: (
          <div>
            <span className="font-gray-500 text-xs">Rp.</span>
            {formatMoney(row.price)}
          </div>
        ),
      }))
    }

    return [
      {
        Product: '',
        Stats: '',
        Category: '',
        Price: '',
      },
    ]
  }

  ///////////////////////////////////// returnnya disini  /////////////////////////////////////////////////////
  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="promotion">
        <div className="flex w-full items-center justify-between">
          {intent === 'edit' ? <H2>Edit Promotion</H2> : <H2>Add Promotion</H2>}
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

        {/* ///////////////////////////////////////////////////// ini yang atas name ///////////////////////////////////////////////////////// */}
        <div className="md:px-18 mt-3  flex  h-full flex-col rounded border  bg-white p-6 px-5 lg:px-52 ">
          <div className="mt-6 flex justify-between gap-3">
            <div className="w-[30%]">
              <div className="flex items-center gap-3">
                <H4>Promotion Name</H4>
              </div>
            </div>
            <div className="flex-1">
              <TextInput
                name="name"
                full
                value={input.name}
                onChange={handleChangePromotion}
                placeholder="promotion name"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <div className="w-[30%]">
              <div className="flex items-center gap-3">
                <H4>Active Date</H4>
                <Chip type={'gray'}>Required</Chip>
              </div>
              <P className="mt-2 max-w-[20rem] text-sm">Active Voucher Date</P>
            </div>
            <div className="flex flex-1 items-center">
              <TextInput
                type="datetime-local"
                name="actived_date"
                onChange={handleChangePromotion}
                min={moment(Date.now()).format('YYYY-MM-DD HH:mm')}
                placeholder={String(Date.now())}
                value={moment(input.actived_date).format('YYYY-MM-DD HH:mm')}
                disabled={
                  intent === 'edit' &&
                  new Date() > new Date(saveInput.actived_date) &&
                  new Date() < new Date(saveInput.expired_date)
                }
                full
                required
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <div className="w-[30%]">
              <div className="flex items-center gap-3">
                <H4>Expired Date</H4>
                <Chip type={'gray'}>Required</Chip>
              </div>
              <P className="mt-2 max-w-[20rem] text-sm">Expired Voucher Date</P>
            </div>
            <div className="flex flex-1 items-center">
              <TextInput
                type="datetime-local"
                name="expired_date"
                onChange={handleChangePromotion}
                min={moment(input.actived_date).format('YYYY-MM-DD HH:mm')}
                max={
                  intent === 'edit' &&
                  new Date() > new Date(saveInput.actived_date) &&
                  new Date() < new Date(saveInput.expired_date)
                    ? moment(input.expired_date).format('YYYY-MM-DD HH:mm')
                    : ''
                }
                placeholder={String(Date.now())}
                value={moment(input.expired_date).format('YYYY-MM-DD HH:mm')}
                full
                disabled={input.actived_date === ''}
                required
              />
            </div>
          </div>
        </div>

        {/* ///////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////// */}

        {/*///////////////////////////////////////////////////// ini yang diselect productnya  /////////////////////////////////////////////////////*/}

        <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
          <div className="flex items-center gap-3">
            <H2>Selected Product</H2>
          </div>
          <div className="py-6">
            <Divider />
          </div>
          <div className="flex items-start gap-2">
            {selectedProduct.length > 0 ? (
              <div className="w-full">
                <div className="flex h-12 w-full items-center gap-3 rounded-lg bg-base-200 px-2">
                  <input
                    type={'checkbox'}
                    className={'checkbox'}
                    onClick={() => {
                      if (selectedProductId.length < selectedProduct.length) {
                        const tempSelect = selectedProduct.map(
                          (p) => p.product_id
                        )
                        setSelectedProductId(tempSelect)
                      } else {
                        setSelectedProductId([])
                      }
                    }}
                    checked={
                      selectedProductId.length === selectedProduct.length
                    }
                  />
                  <div className="flex max-w-[12rem] items-center gap-1">
                    <P>Discount Percentage</P>
                    <TextInput
                      inputSize="sm"
                      full
                      placeholder="%"
                      value={tempDiscountPercentage}
                      disabled={tempDiscountFixPrice > 0}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value)
                        setTempDiscountPercentage(
                          Number.isNaN(parsed)
                            ? 0
                            : tempDiscountFixPrice > 0
                            ? 0
                            : tempDiscountPercentage > 100
                            ? 100
                            : parsed
                        )
                      }}
                    />
                  </div>
                  <div className="flex max-w-[12rem] items-center gap-1">
                    <P>Discount Nominal</P>
                    <TextInput
                      inputSize="sm"
                      full
                      placeholder="Rp."
                      value={tempDiscountFixPrice}
                      disabled={tempDiscountPercentage > 0}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value)
                        setTempDiscountFixPrice(
                          Number.isNaN(parsed)
                            ? 0
                            : tempDiscountPercentage > 0
                            ? 0
                            : parsed
                        )
                      }}
                    />
                  </div>
                  <div className="flex max-w-[10rem] items-center gap-1">
                    <P>Min Price</P>
                    <TextInput
                      inputSize="sm"
                      full
                      placeholder="Rp."
                      value={tempMinimumProductPrice}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value)
                        setTempMinimumProductPrice(
                          Number.isNaN(parsed) ? 0 : parsed
                        )
                      }}
                    />
                  </div>
                  <div className="flex max-w-[12rem] items-center gap-1">
                    <P>Max Discount</P>
                    <TextInput
                      inputSize="sm"
                      full
                      placeholder="Rp."
                      value={tempMaxDiscountPrice}
                      disabled={tempDiscountFixPrice > 0}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value)
                        setTempMaxDiscountPrice(
                          Number.isNaN(parsed)
                            ? 0
                            : tempDiscountFixPrice > 0
                            ? tempDiscountFixPrice
                            : parsed
                        )
                      }}
                    />
                  </div>

                  <div className="flex max-w-[12rem] items-center gap-1">
                    <P>Quota</P>
                    <TextInput
                      inputSize="sm"
                      full
                      placeholder="Quota"
                      value={tempQuota}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value)
                        setTempQuota(Number.isNaN(parsed) ? 0 : parsed)
                      }}
                    />
                  </div>
                  <div className="flex max-w-[12rem] items-center gap-1">
                    <P>Max Quantity</P>
                    <TextInput
                      inputSize="sm"
                      full
                      placeholder="Qty"
                      value={tempMaxQuantity}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value)
                        setTempMaxQuantity(Number.isNaN(parsed) ? 0 : parsed)
                      }}
                    />
                  </div>
                  <div className="flex flex-1 justify-end">
                    <Button
                      size="sm"
                      disabled={
                        tempDiscountPercentage === null &&
                        tempDiscountFixPrice === null &&
                        tempMinimumProductPrice === null &&
                        tempMaxDiscountPrice === null &&
                        tempQuota === null &&
                        tempMaxQuantity === null
                      }
                      onClick={handleChangeOnClick}
                    >
                      Set
                    </Button>
                  </div>
                </div>
                <P className="mt-1 text-xs">
                  Selected {selectedProductId.length} products
                </P>
              </div>
            ) : (
              <span className="flex h-12 items-center text-sm">
                Select some products
              </span>
            )}
          </div>

          <div className="mt-3 max-w-full flex-col divide-y-[1px] overflow-auto">
            {selectedProduct.length > 0 ? (
              selectedProduct.map((sp, index) => {
                return (
                  <div key={index} className="flex-col py-3">
                    <div className="flex items-center justify-center bg-base-200">
                      <div className=" flex w-fit p-1 align-middle">
                        <div className="mt-3 w-[3rem]">
                          <input
                            type={'checkbox'}
                            className={'checkbox'}
                            checked={selectedProductId.includes(sp.product_id)}
                            onClick={() => toggleSelectedProduct(sp.product_id)}
                            // defaultChecked={selectKey.includes(key)}
                          />
                        </div>
                        <div className="flex flex-1 gap-3">
                          <div className="flex-1">
                            <Image
                              src={sp.product_thumbnail_url}
                              className={'rounded-lg'}
                              width={200}
                              height={200}
                              alt={sp.product_name}
                            />
                          </div>
                          <div className="flex-col gap-2 p-1">
                            <P className="w-[15rem] font-semibold line-clamp-2">
                              {sp.product_name}
                            </P>
                          </div>

                          <div className="flex-auto">
                            <P>Price</P>
                            <P>Rp. {ConvertShowMoney(sp.price)}</P>
                          </div>
                          <div className="flex-auto">
                            <P className="font-bold text-primary">
                              {' '}
                              Price Sale
                            </P>
                            <P className="font-bold text-primary">
                              Rp. {ConvertShowMoney(sp.product_subprice)}
                            </P>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 justify-end px-5 align-middle">
                        <Button
                          size="sm"
                          buttonType="ghost"
                          onClick={() => {
                            setSelectedProduct(
                              selectedProduct.filter(
                                (sp2) => sp2.product_id !== sp.product_id
                              )
                            )
                            setSelectedId(
                              selectedId.filter((id) => id !== sp.product_id)
                            )
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1..product_id
                            )
                            setSelectedProductId(tempSelect)
                          } else {
                            setSelectedProductId([])
                          }5"
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>

                    <div className="ml-10 p-2">
                      <div className="-mt-2 flex gap-2">
                        <div className="">
                          <TextInput
                            name="discount_percentage"
                            label="discount Percentage"
                            value={sp.discount_percentage}
                            disabled={sp.discount_fix_price > 0}
                            onChange={(event) =>
                              handleChange(event, sp.product_id)
                            }
                          />
                          <TextInput
                            name="discount_fix_price"
                            label="discount nominal"
                            value={
                              sp.discount_fix_price > sp.price
                                ? sp.price
                                : sp.discount_fix_price
                            }
                            disabled={sp.discount_percentage > 0}
                            onChange={(event) =>
                              handleChangeDiscountNominal(event, sp.product_id)
                            }
                          />
                        </div>
                        <div className="">
                          <TextInput
                            name="min_product_price"
                            label="minimum product price"
                            value={sp.min_product_price}
                            onChange={(event) =>
                              handleChange(event, sp.product_id)
                            }
                          />
                          <TextInput
                            name="max_discount_price"
                            label="maximum discount"
                            value={sp.max_discount_price}
                            disabled={sp.discount_fix_price > 0}
                            onChange={(event) =>
                              handleChange(event, sp.product_id)
                            }
                          />
                        </div>
                        <div className="">
                          <TextInput
                            name="quota"
                            label="quota"
                            disabled={intent === 'edit'}
                            value={sp.quota}
                            onChange={(event) =>
                              handleChange(event, sp.product_id)
                            }
                          />
                          <TextInput
                            name="max_quantity"
                            label="maximum product quantity"
                            value={sp.max_quantity}
                            onChange={(event) =>
                              handleChange(event, sp.product_id)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={handleSubmit} buttonType="primary">
            {intent === 'edit' ? 'Edit' : 'Save'}
          </Button>
          <Button onClick={() => router.back()} buttonType="primary" outlined>
            Cancel
          </Button>
        </div>
        {/* ///////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////// */}

        {/*///////////////////////////////////////////////////////////// product list  /////////////////////////////////////////////////////////////////*/}
        {intent === 'add' ? (
          <div className="mt-3 flex max-w-full flex-col overflow-auto rounded border bg-white px-6 pt-6">
            <div className="flex w-full items-center justify-between py-5">
              <H2>Select Products</H2>
            </div>
            <Table
              empty={
                getProductNoPromotionSeller.isLoading ||
                getProductNoPromotionSeller.isError
              }
              data={formatData(getProductNoPromotionSeller.data?.data)}
              isLoading={getProductNoPromotionSeller.isLoading}
            />
            <div className="mt-8 flex items-center gap-2">
              <P>Showing</P>
              <P>
                {getProductNoPromotionSeller.data?.data?.limit *
                  (getProductNoPromotionSeller.data?.data?.page - 1) +
                  1}{' '}
                {' - '}
                {getProductNoPromotionSeller.data?.data?.limit *
                  getProductNoPromotionSeller.data?.data?.page}{' '}
                of {getProductNoPromotionSeller.data?.data?.total_rows} entries
              </P>
            </div>
            {getProductNoPromotionSeller.data?.data ? (
              <div className="mt-4 mb-4 flex w-full justify-center py-5">
                <PaginationNav
                  page={page}
                  total={getProductNoPromotionSeller.data.data.total_pages}
                  onChange={(p) => setPage(p)}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        {/* ///////////////////////////////////////////////////// ///////////////////////////////////////////////////////////////////////////////// */}
      </SellerPanelLayout>
    </div>
  )
}

export default ManagePromotionSeller
