import { useDeleteCart, useUpdateCart } from '@/api/user/cart'
import { Button, H4, P } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'

import { useModal } from '@/hooks'

import { closeModal } from '@/redux/reducer/modalReducer'
import type { ProductCartDetail } from '@/types/api/cart'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import Image from 'next/image'

import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import imageEmpty from '../../../public/asset/image-empty.jpg'

interface ProductCartProps extends React.InputHTMLAttributes<HTMLInputElement> {
  listProduct: ProductCartDetail
  forCart: boolean
}

const ProductCart: React.FC<ProductCartProps> = ({
  listProduct,
  forCart,
  ...rest
}) => {
  const modal = useModal()
  const deleteCart = useDeleteCart()
  const updateCart = useUpdateCart()

  const dispatch = useDispatch()

  useEffect(() => {
    if (updateCart.isSuccess) {
      toast.success('Successfully update cart')
      dispatch(closeModal())
    }
  }, [updateCart.isSuccess])

  useEffect(() => {
    if (updateCart.isError) {
      const errmsg = updateCart.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [updateCart.isError])

  useEffect(() => {
    if (deleteCart.isSuccess) {
      toast.success('Successfully delete cart')
      dispatch(closeModal())
    }
  }, [deleteCart.isSuccess])

  useEffect(() => {
    if (deleteCart.isError) {
      const errmsg = deleteCart.failureReason as AxiosError<APIResponse<null>>
      toast.error(errmsg.response?.data.message as string)
    }
  }, [deleteCart.isError])

  return (
    <label>
      <div className="border-grey-200 z-40 mb-5 rounded-lg border-[1px] border-solid py-5 px-2 transition-all hover:shadow-xl sm:px-8">
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
          <div className="align-center flex justify-center  gap-x-10 gap-y-2 ">
            {forCart ? (
              <input
                className="checkbox-primary checkbox my-auto"
                type="checkbox"
                checked={rest.checked}
                defaultChecked={rest.checked}
                {...rest}
              />
            ) : (
              <></>
            )}
            {!listProduct.thumbnail_url ? (
              <>
                <img
                  className="h-24 w-24 rounded-t-lg object-contain "
                  src={listProduct.thumbnail_url}
                />
              </>
            ) : (
              <>
                <img
                  className="h-24 w-24 rounded-t-lg object-contain "
                  src={imageEmpty.src}
                />
              </>
            )}
          </div>
          <div className={forCart ? 'col-span-2  xl:ml-8' : 'col-span-2  '}>
            <H4>{listProduct.title}</H4>

            <P className="mt-3">Variant:</P>
          </div>
          <div className="my-auto">
            <P className="">Unit Price :</P>{' '}
            {listProduct.promo.sub_price === 0 ? (
              <P>Rp. {ConvertShowMoney(listProduct.product_price)}</P>
            ) : (
              <>
                <P className="items-center text-slate-400 ">
                  <span className="text-[0.6rem] line-through">Rp.</span>

                  <span className="text-[0.7rem] line-through">
                    {ConvertShowMoney(listProduct.product_price)}
                  </span>
                </P>
                <P>Rp. {ConvertShowMoney(listProduct.promo.sub_price)}</P>
              </>
            )}
          </div>
          <div className="my-auto">
            <P className="font-bold text-primary"> Sub Total :</P>

            {listProduct.promo.sub_price === 0 ? (
              <P className="font-bold text-primary">
                Rp.{' '}
                {ConvertShowMoney(
                  listProduct.product_price * listProduct.quantity
                )}
              </P>
            ) : (
              <>
                <P className="items-center text-slate-400 ">
                  <span className="text-[0.6rem] line-through">Rp.</span>

                  <span className="text-[0.7rem] line-through">
                    {ConvertShowMoney(
                      listProduct.product_price * listProduct.quantity
                    )}
                  </span>
                </P>
                <P className="font-bold text-primary">
                  Rp.{' '}
                  {ConvertShowMoney(
                    listProduct.promo.sub_price * listProduct.quantity
                  )}
                </P>
              </>
            )}
          </div>
          {forCart ? (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  if (listProduct.quantity <= 1) {
                    modal.edit({
                      title: 'Delete Address',
                      content: (
                        <>
                          <P>Do you really want to delete this cart?</P>
                          <div className="mt-2 flex justify-end gap-2">
                            <Button
                              type="button"
                              buttonType="primary"
                              onClick={() => {
                                dispatch(closeModal())
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              buttonType="gray"
                              onClick={() => {
                                deleteCart.mutate(listProduct.id)
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </>
                      ),
                      closeButton: false,
                    })
                  } else if (listProduct.quantity > 1) {
                    updateCart.mutate({
                      id: listProduct.id,
                      quantity: listProduct.quantity - 1,
                    })
                  }
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400"
              >
                -
              </button>
              <P className="flex h-8 w-8 items-center justify-center">
                {listProduct.quantity}
              </P>

              <button
                onClick={() => {
                  updateCart.mutate({
                    id: listProduct.id,
                    quantity: listProduct.quantity + 1,
                  })
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400"
              >
                +
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <P>Quantity :</P>
              <P className="flex h-8 w-8 items-center justify-center">
                {listProduct.quantity}
              </P>
            </div>
          )}
        </div>
      </div>
    </label>
  )
}

export default ProductCart
