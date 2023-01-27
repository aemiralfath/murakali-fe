/* eslint-disable @next/next/no-img-element */
import { useDeleteCart, useUpdateCart } from '@/api/user/cart'
import { Button, H4, P, TextInput } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'

import { useModal } from '@/hooks'

import { closeModal } from '@/redux/reducer/modalReducer'
import type { ProductCartDetail } from '@/types/api/cart'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import Image from 'next/image'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { HiTrash } from 'react-icons/hi'

interface ProductCartProps extends React.InputHTMLAttributes<HTMLInputElement> {
  listProduct: ProductCartDetail
  forCart: boolean
  productNote?: (productID: string, note: string) => void
}

const ProductCart: React.FC<ProductCartProps> = ({
  listProduct,
  forCart,
  productNote,
  ...rest
}) => {
  const [input, setInput] = useState({
    note: '',
  })
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

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name
    const value = event.currentTarget.value

    setInput((prev) => ({ ...prev, [inputName]: value }))
  }

  useEffect(() => {
    if (input.note != '') {
      productNote(listProduct.id, input.note)
    }
  }, [input])
  return (
    <label>
      <div className="z-40 mb-5 rounded-lg border-[1px] border-solid border-gray-300 py-5 px-2 transition-all hover:shadow-xl sm:px-8">
        <div className="flex flex-wrap justify-around gap-3 ">
          <div className="align-center  flex-start flex  justify-between gap-x-4 ">
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
            <Image
              className="h-24 w-24 rounded-t-lg object-contain "
              width={100}
              height={100}
              alt={listProduct.title + ' photo'}
              src={listProduct.thumbnail_url}
              loading="lazy"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                currentTarget.src = '/asset/no-image.png'
              }}
            />
          </div>
          <div
            className={
              forCart ? 'w-80 text-center sm:text-left xl:ml-4' : 'w-80  '
            }
          >
            <H4>{listProduct.title}</H4>

            <P className="mt-3">Variant:</P>
            <P className="text-gray-400">
              {Object.keys(listProduct.variant).map((key) => {
                return `${key}: ${listProduct.variant[key]} `
              })}
            </P>
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
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  if (listProduct.quantity <= 1) {
                    modal.edit({
                      title: 'Delete Cart',
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

              <button
                onClick={() => {
                  modal.edit({
                    title: 'Delete Cart',
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
                }}
                className="btn-outline btn-error ml-8 flex h-8 w-8 items-center justify-center rounded-full border-2 border-error"
              >
                <HiTrash />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-end gap-2">
                <P>Quantity :</P>
                <P className="flex h-8 w-8 items-center justify-center">
                  {listProduct.quantity}
                </P>
              </div>
            </>
          )}
        </div>
        <div>
          {forCart ? (
            <></>
          ) : (
            <div className="ml-0 lg:ml-7">
              <TextInput
                label={'Notes'}
                inputSize="md"
                type="text"
                name="note"
                placeholder="please input note"
                onChange={handleChange}
                value={input.note}
              />
            </div>
          )}
        </div>
      </div>
    </label>
  )
}

export default ProductCart
