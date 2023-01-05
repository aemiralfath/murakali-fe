import { Button, H2, H3, H4, P } from '@/components'

import React, { useEffect, useState } from 'react'
import ProductCart from '../../components/card/ProductCart'

import { FaTicketAlt, FaShippingFast } from 'react-icons/fa'
import { useModal } from '@/hooks'

import { useGetDefaultAddress } from '@/api/user/address'
import { useGetCart } from '@/api/user/cart'
import { Navbar } from '@/layout/template'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import CheckoutSummary from '@/sections/checkout/CheckoutSummary'
import AddressOption from '@/sections/checkout/AddressOption'
import { useRouter } from 'next/router'
import type { CartPostCheckout, PostCheckout } from '@/types/api/checkout'

import { FaAddressCard } from 'react-icons/fa'

import { decrypt } from 'n-krypta'
function Checkout() {
  const cartList = useGetCart()
  const defaultAddress = useGetDefaultAddress(true, false)
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
  const mapPriceQuantitys: LabeledValue = {
    price: decrypt(String(router.query.price), secret),
    subPrice: decrypt(String(router.query.subPrice), secret),
    quantity: decrypt(String(router.query.quantity), secret),
    result_discount: decrypt(String(router.query.resultDiscount), secret),
  }

  const [checkoutItems, setCheckoutItems] = useState<PostCheckout>()
  useEffect(() => {
    if (cartList.data?.data) {
      const tempCheckoutItem: CartPostCheckout[] = cartList.data.data.rows
        .filter((item) => idShops.includes(item.shop.id))
        .map((cartDetail) => {
          const product_details = cartDetail.product_details
            .filter((item) => idProducts.includes(item.id))
            .map((product) => {
              return {
                id: product.id,
                quantity: product.quantity,
                sub_price:
                  product.product_price * product.quantity -
                  product.promo.result_discount * product.quantity,
              }
            })

          //hardcode courier id
          return {
            shop_id: cartDetail.shop.id,
            voucher_shop_id: '',
            courier_id: '98c1921e-b80e-40f3-9cba-fe8806097517',
            product_details,
          }
        })

      setCheckoutItems({
        wallet_id: '',
        card_number: '',
        voucher_marketplace_id: '',
        cart_items: tempCheckoutItem,
      })
    }
  }, [cartList.data?.data])

  return (
    <>
      <Navbar />
      <TitlePageExtend title="Checkout" />

      <div className="container my-8 mx-auto mb-10 min-h-screen w-full px-2">
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-4">
          <div className="col-span-3  flex flex-col gap-5">
            <div className="border-grey-200 flex h-fit items-center justify-between gap-10 rounded-lg border-[1px] border-solid py-5 px-8">
              <div>
                {!defaultAddress.isLoading ? (
                  <>
                    {defaultAddress.data?.data ? (
                      defaultAddress.data.data.rows
                        .filter((item) => item.is_default)
                        .map((address) => (
                          <div key={address.id}>
                            <H3 className="mb-1 font-bold">
                              Shipping Address:
                            </H3>
                            <P className="font-bold">{address.name}</P>
                            <P>
                              {address.address_detail}, {address.sub_district},{' '}
                              {address.district}, {address.city},
                              {address.province}, Indonesia ({address.zip_code})
                            </P>
                          </div>
                        ))
                    ) : (
                      <P className="font-bold">
                        You dont have default address, please choose your
                        default address
                      </P>
                    )}
                  </>
                ) : (
                  <></>
                )}
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
            {!cartList.isLoading ? (
              <>
                {cartList.data?.data ? (
                  cartList.data.data.rows
                    .filter((item) => idShops.includes(item.shop.id))
                    .map((cart, index) => (
                      <div
                        className="border-grey-200 z-10 h-full rounded-lg border-[1px] border-solid py-5 px-8"
                        key={cart.id}
                      >
                        <H2 className="mb-8">
                          {index + 1}. {cart.shop.name}
                        </H2>
                        {cart.product_details
                          .filter((item) => idProducts.includes(item.id))
                          .map((product) => (
                            <div
                              className="flex flex-col gap-5"
                              key={product.id}
                            >
                              <ProductCart
                                forCart={false}
                                listProduct={product}
                              />
                            </div>
                          ))}
                        <div className="flex items-center justify-end">
                          <div className="dropdown">
                            <label
                              tabIndex={0}
                              className="btn-outline btn-primary  btn m-1 gap-2"
                            >
                              <FaShippingFast /> Shipping Option
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu rounded-box z-50 w-52 bg-base-100 p-2 shadow"
                            >
                              <li>
                                <a>Item 1</a>
                              </li>
                              <li>
                                <a>Item 2</a>
                              </li>
                            </ul>
                          </div>
                          <div className="dropdown">
                            <label
                              tabIndex={0}
                              className="btn-outline btn-primary  btn m-1 gap-2"
                            >
                              <FaTicketAlt /> Voucher Shop
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu rounded-box z-50 w-52 bg-base-100 p-2 shadow"
                            >
                              <li>
                                <a>Item 1</a>
                              </li>
                              <li>
                                <a>Item 2</a>
                              </li>
                            </ul>
                          </div>
                          <H4 className="text-primary">
                            | Sub Total Rp.{' '}
                            {ConvertShowMoney(
                              cart.product_details
                                .filter((item) => idProducts.includes(item.id))
                                .reduce(
                                  (prev, p) =>
                                    prev +
                                    (p.product_price * p.quantity -
                                      p.promo.result_discount * p.quantity),
                                  0
                                )
                            )}
                          </H4>
                        </div>
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
              <div className="border-grey-200 flex h-fit  items-center justify-center gap-10 rounded-lg border-[1px] border-solid py-8 px-8">
                <div className="dropdown">
                  <label
                    tabIndex={0}
                    className="btn-outline btn-primary btn-wide btn m-1 gap-2"
                  >
                    <FaTicketAlt /> Voucher Murakali
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu rounded-box z-50 w-52 bg-base-100 p-2 shadow"
                  >
                    <li>
                      <a>Item 1</a>
                    </li>
                    <li>
                      <a>Item 2</a>
                    </li>
                  </ul>
                </div>
              </div>

              <CheckoutSummary
                mapPriceQuantity={mapPriceQuantitys}
                postCheckout={checkoutItems}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout
