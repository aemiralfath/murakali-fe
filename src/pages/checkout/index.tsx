import { Button, H3, P } from '@/components'
import React, { useEffect, useState } from 'react'
import { FaTicketAlt } from 'react-icons/fa'
import { useModal } from '@/hooks'
import { useGetDefaultAddress } from '@/api/user/address'
import { useGetCart } from '@/api/user/cart'
import { Navbar } from '@/layout/template'
import TitlePageExtend from '@/layout/template/navbar/TitlePageExtend'
import CheckoutSummary from '@/sections/checkout/CheckoutSummary'
import AddressOption from '@/sections/checkout/AddressOption'
import { useRouter } from 'next/router'
import type { CartPostCheckout, PostCheckout } from '@/types/api/checkout'

import { FaAddressCard } from 'react-icons/fa'

import { decrypt } from 'n-krypta'
import ShopCard from '@/sections/checkout/ShopCard'
import { useGetUserWallet } from '@/api/user/wallet'
function Checkout() {
  const cartList = useGetCart()
  const userWallet = useGetUserWallet()
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
          return {
            shop_id: cartDetail.shop.id,
            voucher_shop_id: '',
            courier_id: '',
            product_details,
            courier_fee: 0,
          }
        })
      let tempWallet: string
      if (userWallet.isSuccess) {
        tempWallet = userWallet.data.data.id
      }

      setCheckoutItems({
        wallet_id: tempWallet,
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
            <div className="flex h-fit flex-wrap items-center justify-between gap-10 rounded-lg border-[1px] border-solid border-gray-300 py-5 px-8">
              <div>
                {!defaultAddress.isLoading ? (
                  <>
                    {defaultAddress.data?.data ? (
                      <div>
                        <H3 className="mb-1 font-bold">Shipping Address:</H3>
                        <P className="font-bold">
                          {defaultAddress.data.data.rows[0].name}
                        </P>
                        <P>
                          {defaultAddress.data.data.rows[0].address_detail},{' '}
                          {defaultAddress.data.data.rows[0].sub_district},{' '}
                          {defaultAddress.data.data.rows[0].district},{' '}
                          {defaultAddress.data.data.rows[0].city},
                          {defaultAddress.data.data.rows[0].province}, Indonesia
                          ({defaultAddress.data.data.rows[0].zip_code})
                        </P>
                      </div>
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
                    content: <AddressOption />,
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
                      <div key={cart.id}>
                        <ShopCard
                          courierID={(courierID, deliveryFee) => {
                            const tempCheckoutItem2 =
                              checkoutItems.cart_items.map((cartDetail) => {
                                let tempCourier: string = cartDetail.courier_id
                                let tempDeliveryFee: number =
                                  cartDetail.courier_fee
                                if (cart.shop.id === cartDetail.shop_id) {
                                  tempCourier = courierID
                                  tempDeliveryFee = deliveryFee
                                }

                                return {
                                  shop_id: cartDetail.shop_id,
                                  voucher_shop_id: cartDetail.voucher_shop_id,
                                  courier_id: tempCourier,
                                  product_details: cartDetail.product_details,
                                  courier_fee: tempDeliveryFee,
                                }
                              })
                            setCheckoutItems({
                              wallet_id: checkoutItems.wallet_id,
                              card_number: checkoutItems.card_number,
                              voucher_marketplace_id:
                                checkoutItems.voucher_marketplace_id,
                              cart_items: tempCheckoutItem2,
                            })
                          }}
                          destination={
                            defaultAddress.data?.data
                              ? defaultAddress.data?.data.rows[0].city_id
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
              <div className="flex h-fit items-center  justify-center gap-10 rounded-lg border-[1px] border-solid border-gray-300 py-8 px-8">
                <div className="dropdown">
                  <label
                    tabIndex={0}
                    className="btn-outline btn-primary btn m-1 w-44 gap-2"
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
