import React, { useEffect, useState } from 'react'
import { FaTicketAlt } from 'react-icons/fa'
import { FaShippingFast } from 'react-icons/fa'

import { useGetVoucherShopCheckout } from '@/api/user/checkout'
import { useLocationCost } from '@/api/user/location'
import { Button, H2, P } from '@/components'
import ProductCart from '@/components/card/ProductCart'
import formatMoney from '@/helper/formatMoney'
import type { CartDetail } from '@/types/api/cart'
import type { PostCheckout, ProductPostCheckout } from '@/types/api/checkout'
import type { LocationCostRequest } from '@/types/api/location'
import type { VoucherData } from '@/types/api/voucher'

import { Menu } from '@headlessui/react'
import moment from 'moment'

interface ShopCardProps {
  cart: CartDetail
  index: number
  idProducts: string[] | string
  destination: number
  postCheckout: PostCheckout
  courierID: (
    courierID: string,
    delivery_fee: number,
    voucherID: string,
    voucherPrice: number,
    productDetail: ProductPostCheckout[]
  ) => void
}

const ShopCard: React.FC<ShopCardProps> = ({
  cart,
  index,
  idProducts,
  destination,
  postCheckout,
  courierID,
}) => {
  const locationCost = useLocationCost()
  const voucherShop = useGetVoucherShopCheckout(cart.shop.id)

  const [productD, setProductD] = useState<ProductPostCheckout[]>([])

  useEffect(() => {
    if (postCheckout) {
      setProductD(
        postCheckout.cart_items.filter(
          (item) => cart.shop.id === item.shop_id
        )[0]?.product_details ?? []
      )
    }
  }, [postCheckout])

  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [voucherPrice, setVoucherPrice] = useState<number>(0)
  const [delivery, setDelivery] = useState({
    id: '',
    name: '',
    delivery_fee: 0,
    etd: '',
  })

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

  useEffect(() => {
    if (cart && destination) {
      const tempProductIds: string[] =
        cart.product_details === null
          ? []
          : cart.product_details
              .filter((item) => idProducts.includes(item.id))
              .map((product) => product.id)
      const temp: LocationCostRequest = {
        destination: destination,
        weight: cart.weight,
        shop_id: cart.shop.id,
        product_ids: tempProductIds,
      }
      locationCost.mutate(temp)
    }

    if (cart.product_details !== null) {
      setTotalPrice(
        cart.product_details
          .filter((item) => idProducts.includes(item.id))
          .reduce(
            (prev, p) =>
              prev +
              (p.product_price * p.quantity -
                p.promo.result_discount * p.quantity),
            0
          )
      )
    }
  }, [cart, destination])

  return (
    <div className="z-10 h-full rounded-lg border-[1px] border-solid border-gray-300 py-5 px-8">
      <H2 className="mb-8">
        {index + 1}. {cart.shop.name}
      </H2>
      {cart.product_details !== null ? (
        cart.product_details
          .filter((item) => idProducts.includes(item.id))
          .map((product) => (
            <div className="flex flex-col gap-5" key={product.id}>
              <ProductCart
                forCart={false}
                listProduct={product}
                productNote={(idProduct, note) => {
                  postCheckout.cart_items
                    .filter((item) => cart.shop.id === item.shop_id)
                    .map((shop) => {
                      const temp: ProductPostCheckout[] =
                        shop.product_details.map((product) => {
                          let tempNote: string = product.note
                          if (product.id === idProduct) {
                            tempNote = note
                          }
                          return {
                            id: product.id,
                            cart_id: product.cart_id,
                            quantity: product.quantity,
                            note: tempNote,
                          }
                        })
                      setProductD(temp)
                      courierID(
                        delivery.id,
                        delivery.delivery_fee,
                        voucher.id,
                        voucherPrice,
                        temp
                      )
                    })
                }}
              />
            </div>
          ))
      ) : (
        <></>
      )}

      <div className="flex flex-wrap items-center justify-center gap-y-2 md:justify-end">
        <div className="block">
          <Menu>
            <Menu.Button className="btn-outline btn-primary btn  m-1 w-44 gap-4">
              {delivery.name ? (
                <div className="flex-start flex items-center gap-2">
                  <FaShippingFast />
                  <div className="flex flex-col">
                    <P>{delivery.name}</P>
                    <P>{delivery.etd}</P>
                  </div>
                </div>
              ) : (
                <>
                  <FaShippingFast /> Shipping Option
                </>
              )}
            </Menu.Button>

            {locationCost.data?.data?.data &&
            locationCost.data.data.data.shipping_option !== null ? (
              locationCost.data.data.data.shipping_option.length > 0 ? (
                <div>
                  <Menu.Items className="absolute w-44 origin-top-left  divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none ">
                    {locationCost.data.data.data.shipping_option.map(
                      (shipping, index) => (
                        <div key={index}>
                          <Menu.Item>
                            {() => (
                              <Button
                                onClick={() => {
                                  courierID(
                                    shipping.courier.id,
                                    shipping.fee,
                                    voucher.id,
                                    voucherPrice,
                                    productD
                                  )
                                  setDelivery({
                                    id: shipping.courier.id,
                                    name: shipping.courier.name,
                                    delivery_fee: shipping.fee,
                                    etd: shipping.etd,
                                  })
                                }}
                                className="btn m-2 h-24  w-40  gap-4 border-gray-300 bg-white text-primary outline hover:border-white hover:bg-primary hover:text-white"
                              >
                                <a className="flex flex-col gap-1">
                                  <span className="text-lg font-bold">
                                    {shipping.courier.name}
                                  </span>
                                  <span className="">Rp. {shipping.fee}</span>
                                  <span>
                                    {shipping.etd.replace(/\D/g, '')} Days
                                  </span>
                                </a>
                              </Button>
                            )}
                          </Menu.Item>
                        </div>
                      )
                    )}
                  </Menu.Items>
                </div>
              ) : (
                <Menu.Items className="absolute h-10 w-44  origin-top-left divide-y divide-gray-100  overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-lg focus:outline-none ">
                  <div className=" p-2">
                    <P className=" text-center">No Shipping Option Available</P>
                  </div>
                </Menu.Items>
              )
            ) : (
              <a></a>
            )}
          </Menu>
        </div>

        <div className="block">
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
                  <FaTicketAlt /> Voucher Shop
                </>
              )}
            </Menu.Button>

            {voucherShop.data?.data ? (
              Number(voucherShop.data?.data?.rows?.length) > 0 ? (
                <div>
                  <Menu.Items className="absolute max-h-64 w-56 origin-top-left divide-y divide-gray-100  overflow-x-hidden overflow-y-scroll rounded-md bg-white shadow-lg focus:outline-none ">
                    {voucherShop.data.data.rows?.map((data, index) => (
                      <div className="p-1" key={index}>
                        {data.quota <= 0 ? (
                          <>
                            <Menu.Item>
                              {() => (
                                <Button
                                  disabled
                                  className="btn my-1 mx-auto h-fit w-full gap-1  border-4 border-solid  border-primary bg-gray-500 py-2 
                            text-start text-white "
                                >
                                  <a className="flex flex-col items-center">
                                    <span className="text-lg  font-bold">
                                      Discount{' '}
                                      {data.discount_percentage > 0 ? (
                                        <>{data.discount_percentage}%</>
                                      ) : (
                                        <>
                                          Rp.{' '}
                                          {formatMoney(data.discount_fix_price)}
                                        </>
                                      )}
                                    </span>
                                    <P className="text-md max-w-[70%] truncate break-words">
                                      {data.code}
                                    </P>
                                    <span className=" text-xs ">
                                      Min. Rp.{' '}
                                      {formatMoney(data.min_product_price)}
                                    </span>

                                    <span className=" text-xs ">
                                      until{' '}
                                      {moment(data.expired_date).format(
                                        'DD MMM YYYY '
                                      )}{' '}
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
                                    let tempVoucherPrice: number
                                    if (data.discount_percentage > 0) {
                                      tempVoucherPrice =
                                        (data.discount_percentage / 100) *
                                        totalPrice
                                    } else {
                                      tempVoucherPrice = data.discount_fix_price
                                    }

                                    if (
                                      tempVoucherPrice > data.max_discount_price
                                    ) {
                                      tempVoucherPrice = data.max_discount_price
                                    }
                                    setVoucherPrice(tempVoucherPrice)

                                    courierID(
                                      delivery.id,
                                      delivery.delivery_fee,
                                      data.id,
                                      tempVoucherPrice,
                                      productD
                                    )
                                    setVoucher(data)
                                  }}
                                  className="btn my-1 mx-auto h-fit w-full gap-1  border-4 border-solid  border-primary bg-white py-2 
                            text-start text-primary hover:border-white hover:bg-primary hover:text-white"
                                >
                                  <a className="flex flex-col items-center ">
                                    <span className="text-lg  font-bold">
                                      Discount{' '}
                                      {data.discount_percentage > 0 ? (
                                        <>{data.discount_percentage}%</>
                                      ) : (
                                        <>
                                          Rp.{' '}
                                          {formatMoney(data.discount_fix_price)}
                                        </>
                                      )}
                                    </span>
                                    <P className=" text-md max-w-[80%] truncate break-words">
                                      {data.code}
                                    </P>
                                    <span className=" text-xs ">
                                      Min. Rp.{' '}
                                      {formatMoney(data.min_product_price)}
                                    </span>

                                    <span className=" text-xs ">
                                      until{' '}
                                      {moment(data.expired_date).format(
                                        'DD MMM YYYY '
                                      )}{' '}
                                    </span>
                                  </a>
                                </Button>
                              )}
                            </Menu.Item>
                          </>
                        )}
                      </div>
                    ))}
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

        <div className="border-1 mx-2 flex flex-col gap-2 gap-y-2 border-l-primary px-2 text-primary md:border-l-2">
          <div className="flex justify-between gap-5">
            <h6>Delivery </h6>

            <h6> + Rp.{formatMoney(delivery.delivery_fee)}</h6>
          </div>
          <div className="flex justify-between gap-5">
            <h6>Voucher Shop Total </h6>

            <h6>- Rp.{formatMoney(voucherPrice)}</h6>
          </div>
          <div className="flex justify-between gap-5">
            <h6>Total Order </h6>
            <h6>
              Rp.
              {formatMoney(totalPrice + delivery.delivery_fee - voucherPrice)}
            </h6>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopCard
