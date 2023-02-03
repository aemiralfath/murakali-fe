import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { HiHome } from 'react-icons/hi'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useGetDefaultAddress } from '@/api/user/address'
import { useGetCart, useUpdateCart } from '@/api/user/cart'
import { useGetVoucherMarketplaceCheckout } from '@/api/user/checkout'
import { useGetUserSLP } from '@/api/user/slp'
import { useGetUserWallet } from '@/api/user/wallet'
import { Button, Divider, P } from '@/components'
import { env } from '@/env/client.mjs'
import cx from '@/helper/cx'
import { useMediaQuery, useModal } from '@/hooks'
import { Navbar } from '@/layout/template'
import Footer from '@/layout/template/footer'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import CheckoutSummary from '@/sections/checkout/CheckoutSummary'
import MarketplaceVoucherMenu from '@/sections/checkout/MarketplaceVoucherMenu'
import ShopCard from '@/sections/checkout/ShopCard'
import AddressOption from '@/sections/checkout/option/AddressOption'
import type {
  CartPostCheckout,
  PostCheckout,
  ProductPostCheckout,
} from '@/types/api/checkout'
import type { VoucherData } from '@/types/api/voucher'

import CryptoJS from 'crypto-js'
import * as z from 'zod'

const CheckoutValues = z.object({
  idProducts: z.array(z.string()),
  idShops: z.array(z.string()),
  price: z.number(),
  subPrice: z.number(),
  quantity: z.number(),
  result_discount: z.number(),
})

export type CheckoutValues = z.infer<typeof CheckoutValues>

const secret = env.NEXT_PUBLIC_SECRET_KEY

function Checkout() {
  const [addresInfo, setAddresInfo] = useState({
    id: '',
    name: '',
    fullAddress: '',
  })
  const cartList = useGetCart()
  const updateCart = useUpdateCart()
  const userWallet = useGetUserWallet()
  const userSLP = useGetUserSLP()
  const defaultAddress = useGetDefaultAddress(true, false, true)
  const xl = useMediaQuery('xl')

  const modal = useModal()
  const router = useRouter()
  const { values, update } = router.query

  const [parsedValues, setParsedValues] = useState<CheckoutValues>()

  useEffect(() => {
    if (typeof values === 'string') {
      try {
        const dec = CryptoJS.AES.decrypt(values, secret).toString(
          CryptoJS.enc.Utf8
        )
        const tempValue = JSON.parse(dec)
        const validValue = CheckoutValues.parse(tempValue)
        setParsedValues(validValue)
      } catch (err) {
        toast.error('Unrecognized items')
        router.back()
      }
    }
  }, [values])

  useEffect(() => {
    if (typeof update === 'string' && update === 'true' && parsedValues) {
      updateCart.mutate({
        id: parsedValues.idProducts[0] ?? '',
        quantity: parsedValues.quantity,
      })
    }
  }, [update, parsedValues])

  const [checkoutItems, setCheckoutItems] = useState<PostCheckout>()

  useEffect(() => {
    if (cartList.data?.data?.rows && parsedValues) {
      const tempCheckoutItem: CartPostCheckout[] = cartList.data.data.rows
        .filter((item) => parsedValues.idShops.includes(item.shop.id))
        .map((cartDetail) => {
          const product_details: ProductPostCheckout[] =
            cartDetail.product_details === null
              ? []
              : cartDetail.product_details
                  .filter((item) => parsedValues.idProducts.includes(item.id))
                  .map((product) => {
                    return {
                      id: product.id,
                      cart_id: '',
                      quantity: product.quantity,
                      note: '',
                    }
                  })
          return {
            shop_id: cartDetail.shop.id,
            voucher_shop_id: '',
            voucher_shop_total: 0,
            courier_id: '',
            product_details: product_details,
            courier_fee: 0,
          }
        })

      setCheckoutItems({
        address_id: '',
        wallet_id: '',
        card_number: '',
        voucher_marketplace_id: '',
        voucher_marketplace_total: 0,
        cart_items: tempCheckoutItem,
      })
    }
  }, [cartList.data?.data, parsedValues])

  const [voucher, setVoucher] = useState<VoucherData>({
    id: '',
    shop_id: '',
    code: '',
    quota: 0,
    actived_date: '',
    expired_date: '',
    discount_percentage: 0,
    discount_fix_price: 0,
    min_product_price: 0,
    max_discount_price: 0,
    created_at: '',
    updated_at: {
      Time: '',
      Valid: false,
    },
    deleted_at: {
      Time: '',
      Valid: false,
    },
  })

  const voucherMarketplace = useGetVoucherMarketplaceCheckout()

  useEffect(() => {
    if (checkoutItems && parsedValues) {
      let tempVoucherPrice: number
      if (voucher.discount_percentage > 0) {
        tempVoucherPrice =
          (voucher.discount_percentage / 100) *
          (parsedValues.subPrice -
            checkoutItems.cart_items.reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.voucher_shop_total,
              0
            ))
      } else {
        tempVoucherPrice = voucher.discount_fix_price
      }

      setCheckoutItems({
        address_id: addresInfo.id,
        wallet_id: checkoutItems.wallet_id,
        card_number: checkoutItems.card_number,
        voucher_marketplace_id: voucher.id,
        voucher_marketplace_total: tempVoucherPrice,
        cart_items: checkoutItems.cart_items,
      })
    }
  }, [voucher, addresInfo, parsedValues])

  useEffect(() => {
    if (defaultAddress.isSuccess) {
      if (defaultAddress.data?.data?.rows[0] !== undefined) {
        setAddresInfo({
          id: defaultAddress.data?.data?.rows[0].id,
          name: defaultAddress.data?.data?.rows[0].name,
          fullAddress:
            defaultAddress.data?.data?.rows[0].address_detail +
            ', ' +
            defaultAddress.data?.data?.rows[0].sub_district +
            ', ' +
            defaultAddress.data?.data?.rows[0].district +
            ', ' +
            defaultAddress.data?.data?.rows[0].city +
            ', ' +
            defaultAddress.data?.data?.rows[0].province +
            ', Indonesia (' +
            defaultAddress.data?.data?.rows[0].zip_code +
            ')',
        })
      }
    }
  }, [defaultAddress])

  return (
    <>
      <Navbar />
      <Head>
        <title>Checkout | Murakali</title>
      </Head>
      <TitlePageExtend title="Checkout" />
      <div className="container my-8 mx-auto mb-10 min-h-screen w-full px-2">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
          <div className="col-span-3 flex flex-col gap-5">
            <div className="flex h-fit flex-col gap-2 rounded border-[1px] border-solid p-5">
              <div>
                <>
                  {addresInfo.fullAddress != '' ? (
                    <div>
                      <P className="mb-1 font-bold">Shipping Address:</P>
                      <P className="font-bold">{addresInfo.name}</P>
                      <P>{addresInfo.fullAddress}</P>
                    </div>
                  ) : (
                    <P className="italic text-gray-400">
                      You don&apos;t have default address, please choose your
                      default address
                    </P>
                  )}
                </>
              </div>
              <div className="flex justify-end">
                <Button
                  buttonType="primary"
                  size="sm"
                  outlined
                  onClick={() => {
                    modal.info({
                      title: 'Choose Address',
                      content: <AddressOption is_shop_address={false} />,
                      closeButton: false,
                    })
                  }}
                >
                  <HiHome /> Choose Other Address
                </Button>
              </div>
            </div>
            <Divider />
            {!cartList.isLoading && checkoutItems && parsedValues ? (
              <>
                {cartList.data?.data ? (
                  cartList.data.data.rows
                    .filter((item) =>
                      parsedValues.idShops.includes(item.shop.id)
                    )
                    .map((cart, index) => (
                      <div key={cart.id} className="flex flex-col gap-4">
                        <ShopCard
                          postCheckout={checkoutItems}
                          courierID={(
                            courierID,
                            deliveryFee,
                            voucherID,
                            voucherPrice,
                            productDetail
                          ) => {
                            const tempCheckoutItem2 =
                              checkoutItems.cart_items.map((cartDetail) => {
                                let tempCourier: string = cartDetail.courier_id
                                let tempDeliveryFee: number =
                                  cartDetail.courier_fee
                                let tempVoucherTotal: number =
                                  cartDetail.voucher_shop_total
                                let tempVoucher: string =
                                  cartDetail.voucher_shop_id
                                let tempProductDetail: ProductPostCheckout[] =
                                  cartDetail.product_details
                                if (cart.shop.id === cartDetail.shop_id) {
                                  tempCourier = courierID
                                  tempDeliveryFee = deliveryFee
                                  tempVoucher = voucherID
                                  tempVoucherTotal = voucherPrice
                                  tempProductDetail = productDetail
                                }

                                return {
                                  shop_id: cartDetail.shop_id,
                                  voucher_shop_id: tempVoucher,
                                  voucher_shop_total: tempVoucherTotal,
                                  courier_id: tempCourier,
                                  product_details: tempProductDetail,
                                  courier_fee: tempDeliveryFee,
                                }
                              })
                            setCheckoutItems({
                              address_id: checkoutItems.address_id,
                              wallet_id: checkoutItems.wallet_id,
                              card_number: checkoutItems.card_number,
                              voucher_marketplace_id:
                                checkoutItems.voucher_marketplace_id,
                              voucher_marketplace_total:
                                checkoutItems.voucher_marketplace_total,
                              cart_items: tempCheckoutItem2,
                            })
                          }}
                          destination={
                            defaultAddress.data?.data?.rows[0] !== undefined
                              ? defaultAddress.data.data.rows[0].city_id
                              : 0
                          }
                          cart={cart}
                          index={index}
                          idProducts={parsedValues.idProducts}
                        />
                        <Divider />
                      </div>
                    ))
                ) : (
                  <P className="flex w-full justify-center">Data is Empty</P>
                )}
              </>
            ) : (
              <P className="flex w-full justify-center">Loading</P>
            )}
          </div>
          <div>
            <div
              className={cx(
                'bg-white p-5  border flex flex-col gap-5',
                xl
                  ? 'col-span-3 rounded'
                  : 'rounded-t-lg fixed bottom-0 left-0 w-full'
              )}
            >
              <MarketplaceVoucherMenu
                voucher={voucher}
                setVoucher={setVoucher}
                voucherMarketplace={voucherMarketplace}
              />
              <Divider />
              {userSLP.data?.data && checkoutItems && parsedValues ? (
                <CheckoutSummary
                  mapPriceQuantity={{ ...parsedValues }}
                  postCheckout={checkoutItems}
                  userWallet={userWallet.data?.data}
                  userSLP={userSLP.data?.data}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkout
