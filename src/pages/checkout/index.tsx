import React, { useEffect, useState } from 'react'
import { FaTicketAlt } from 'react-icons/fa'
import { FaAddressCard } from 'react-icons/fa'

import { useRouter } from 'next/router'

import { useGetDefaultAddress } from '@/api/user/address'
import { useGetCart } from '@/api/user/cart'
import { useGetVoucherMarketplaceCheckout } from '@/api/user/checkout'
import { useGetUserSLP } from '@/api/user/slp'
import { useGetUserWallet } from '@/api/user/wallet'
import { Button, H3, P } from '@/components'
import formatMoney from '@/helper/formatMoney'
import { useModal } from '@/hooks'
import { Navbar } from '@/layout/template'
import Footer from '@/layout/template/footer'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import CheckoutSummary from '@/sections/checkout/CheckoutSummary'
import ShopCard from '@/sections/checkout/ShopCard'
import AddressOption from '@/sections/checkout/option/AddressOption'
import type {
  CartPostCheckout,
  PostCheckout,
  ProductPostCheckout,
} from '@/types/api/checkout'
import type { VoucherData } from '@/types/api/voucher'

import { Menu } from '@headlessui/react'
import moment from 'moment'
import { decrypt } from 'n-krypta'

function Checkout() {
  const cartList = useGetCart()
  const userWallet = useGetUserWallet()
  const userSLP = useGetUserSLP()
  const defaultAddress = useGetDefaultAddress(true, false, true)

  const modal = useModal()
  const router = useRouter()
  interface LabeledValue {
    price: number
    subPrice: number
    quantity: number
    result_discount: number
  }
  const idProducts = router.query.idProduct
  const idShops = router.query.idShop
  const secret = 'test'

  const [addresInfo, setAddresInfo] = useState({
    id: '',
    name: '',
    fullAddress: '',
  })

  const mapPriceQuantitys: LabeledValue = {
    price: decrypt(String(router.query.price), secret),
    subPrice: decrypt(String(router.query.subPrice), secret),
    quantity: decrypt(String(router.query.quantity), secret),
    result_discount: decrypt(String(router.query.resultDiscount), secret),
  }

  const [checkoutItems, setCheckoutItems] = useState<PostCheckout>()

  useEffect(() => {
    if (cartList.data?.data?.rows && idShops) {
      const tempCheckoutItem: CartPostCheckout[] = cartList.data.data.rows
        .filter((item) => idShops.includes(item.shop.id))
        .map((cartDetail) => {
          const product_details: ProductPostCheckout[] =
            cartDetail.product_details === null
              ? []
              : cartDetail.product_details
                  .filter((item) => idProducts?.includes(item.id))
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
  }, [cartList.data?.data, idShops])

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
    if (checkoutItems) {
      let tempVoucherPrice: number
      if (voucher.discount_percentage > 0) {
        tempVoucherPrice =
          (voucher.discount_percentage / 100) *
          (mapPriceQuantitys.subPrice -
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
  }, [voucher, addresInfo])

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
  }, [defaultAddress.isSuccess])

  return (
    <>
      <Navbar />
      <title>Checkout</title>
      <TitlePageExtend title="Checkout" />
      <div className="container my-8 mx-auto mb-10 min-h-screen w-full px-2">
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-4">
          <div className="col-span-3  flex flex-col gap-5">
            <div className="flex h-fit flex-wrap items-center justify-between gap-10 rounded-lg border-[1px] border-solid border-gray-300 py-5 px-8">
              <div>
                <>
                  {addresInfo.fullAddress != '' ? (
                    <div>
                      <H3 className="mb-1 font-bold">Shipping Address:</H3>
                      <P className="font-bold">{addresInfo.name}</P>
                      <P>{addresInfo.fullAddress}</P>
                    </div>
                  ) : (
                    <P className="italic text-gray-400">
                      You dont have default address, please choose your default
                      address
                    </P>
                  )}
                </>
              </div>
              <Button
                buttonType="primary"
                className="btn-outline"
                onClick={() => {
                  modal.info({
                    title: 'Choose Address',
                    content: <AddressOption is_shop_address={false} />,
                    closeButton: false,
                  })
                }}
              >
                <FaAddressCard /> Change address
              </Button>
            </div>
            {!cartList.isLoading && checkoutItems && idProducts ? (
              <>
                {cartList.data?.data && idShops ? (
                  cartList.data.data.rows
                    .filter((item) => idShops.includes(item.shop.id))
                    .map((cart, index) => (
                      <div key={cart.id}>
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
                          idProducts={idProducts}
                        />
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
            <div className="col-span-3  flex flex-col gap-5">
              <div className="flex h-fit items-center justify-center rounded-lg border-[1px] border-solid border-gray-300 py-8 ">
                <div className="block ">
                  <Menu>
                    <Menu.Button className="btn-outline btn-primary btn  m-1 w-56 gap-4">
                      {voucher.code ? (
                        <div className="flex-start flex items-center gap-2">
                          <FaTicketAlt />
                          <div className="flex flex-col">
                            <P>{voucher.code}</P>
                            {voucher.discount_percentage > 0 ? (
                              <P>{voucher.discount_percentage}%</P>
                            ) : (
                              <P>Rp. {voucher.discount_fix_price}</P>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <FaTicketAlt /> Voucher Marketplace
                        </>
                      )}
                    </Menu.Button>

                    {voucherMarketplace.isSuccess &&
                    voucherMarketplace.data?.data &&
                    voucherMarketplace.data.data.rows !== null ? (
                      voucherMarketplace.data.data.rows.length > 0 ? (
                        <div>
                          <Menu.Items className="absolute max-h-64 w-56 origin-top-left divide-y divide-gray-100  overflow-y-scroll rounded-md bg-white shadow-lg focus:outline-none ">
                            {voucherMarketplace.data?.data?.rows.map(
                              (data, index) => (
                                <div className="px-1" key={index}>
                                  {data.quota <= 0 ? (
                                    <>
                                      <Menu.Item>
                                        {() => (
                                          <Button
                                            disabled
                                            className="btn mx-auto mb-1 h-fit w-full gap-1  border-4 border-solid  border-primary bg-gray-500 py-2 
                            text-start text-white "
                                          >
                                            <a className="flex flex-col items-center ">
                                              <span className="text-lg  font-bold">
                                                Discount{' '}
                                                {data.discount_percentage >
                                                0 ? (
                                                  <>
                                                    {data.discount_percentage}%
                                                  </>
                                                ) : (
                                                  <>
                                                    Rp.{' '}
                                                    {formatMoney(
                                                      data.discount_fix_price
                                                    )}
                                                  </>
                                                )}
                                              </span>
                                              <span className=" text-md  max-w-[80%] truncate break-words">
                                                {data.code}
                                              </span>

                                              <span className=" text-xs ">
                                                Min. Rp.{' '}
                                                {formatMoney(
                                                  data.min_product_price
                                                )}
                                              </span>

                                              <span className=" text-xs ">
                                                until{' '}
                                                {moment(
                                                  data.expired_date
                                                ).format('DD MMM YYYY ')}{' '}
                                              </span>
                                            </a>
                                          </Button>
                                        )}
                                      </Menu.Item>
                                    </>
                                  ) : (
                                    <>
                                      <Menu.Item>
                                        {() => (
                                          <Button
                                            onClick={() => {
                                              setVoucher(data)
                                            }}
                                            className="btn my-1 mx-auto h-fit w-full gap-1  border-4 border-solid  border-primary bg-white py-2 
                            text-start text-primary hover:border-white hover:bg-primary hover:text-white"
                                          >
                                            <a className="flex flex-col items-center ">
                                              <span className="text-lg  font-bold">
                                                Discount{' '}
                                                {data.discount_percentage >
                                                0 ? (
                                                  <>
                                                    {data.discount_percentage}%
                                                  </>
                                                ) : (
                                                  <>
                                                    Rp.{' '}
                                                    {formatMoney(
                                                      data.discount_fix_price
                                                    )}
                                                  </>
                                                )}
                                              </span>
                                              <span className=" text-md max-w-[80%] truncate break-words">
                                                {data.code}
                                              </span>
                                              <span className=" text-xs ">
                                                Min. Rp.{' '}
                                                {formatMoney(
                                                  data.min_product_price
                                                )}
                                              </span>

                                              <span className=" text-xs ">
                                                until{' '}
                                                {moment(
                                                  data.expired_date
                                                ).format('DD MMM YYYY ')}{' '}
                                              </span>
                                            </a>
                                          </Button>
                                        )}
                                      </Menu.Item>
                                    </>
                                  )}
                                </div>
                              )
                            )}
                          </Menu.Items>
                        </div>
                      ) : (
                        <Menu.Items className="absolute h-10 w-56 origin-top-left divide-y divide-gray-100  overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-lg focus:outline-none ">
                          <div className=" p-2">
                            <P className=" text-center">No Voucher Available</P>
                          </div>
                        </Menu.Items>
                      )
                    ) : (
                      <a></a>
                    )}
                  </Menu>
                </div>
              </div>

              {userWallet.data?.data && userSLP.data?.data && checkoutItems ? (
                <CheckoutSummary
                  mapPriceQuantity={mapPriceQuantitys}
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
