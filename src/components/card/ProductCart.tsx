/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiMinus, HiPencilAlt, HiPlus, HiTrash } from 'react-icons/hi'
import { useDispatch } from 'react-redux'

import { useDeleteCart, useUpdateCart } from '@/api/user/cart'
import { A, Button, P, TextInput } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import cx from '@/helper/cx'
import { useDebounce, useModal } from '@/hooks'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { ProductCartDetail } from '@/types/api/cart'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'

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

  const [tempQty, setTempQty] = useState(listProduct.quantity)
  const debouncedQty = useDebounce(tempQty)

  const [openNote, setOpenNote] = useState(false)

  useEffect(() => {
    if (tempQty !== listProduct.quantity) {
      if (debouncedQty <= 0) {
        modal.edit({
          title: 'Delete Cart',
          content: (
            <>
              <P>Do you really want to delete this item?</P>
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  buttonType="primary"
                  onClick={() => {
                    setTempQty(listProduct.quantity)
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
      } else {
        updateCart.mutate({
          id: listProduct.id,
          quantity: debouncedQty,
        })
      }
    }
  }, [debouncedQty])

  useEffect(() => {
    setTempQty(listProduct.quantity)
  }, [listProduct])

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
      setTempQty(listProduct.quantity)
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
    if (input.note != '' && productNote) {
      productNote(listProduct.id, input.note)
    }
  }, [input])
  return (
    <div
      className={cx(
        'z-0 rounded border-[1px] p-2.5 border-solid transition-all',
        rest.checked ? 'border-primary border-opacity-50' : ''
      )}
    >
      <div className="flex flex-wrap justify-between gap-2.5 ">
        <div className="align-center  flex-start flex justify-between">
          {forCart ? (
            <input
              className={cx(
                'checkbox-sm checkbox mr-2.5',
                rest.checked ? 'checkbox-primary' : ''
              )}
              type="checkbox"
              checked={rest.checked}
              readOnly
              {...rest}
            />
          ) : (
            <></>
          )}
          <img
            className="h-24 w-24 object-contain "
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
        <div className={'flex-1 min-w-[200px]'}>
          <P className="font-semibold line-clamp-2">{listProduct.title}</P>
          <P className="mt-1 text-sm">Variant:</P>
          <P className="text-gray-400 text-sm -mt-[2px]">
            {Object.keys(listProduct.variant).map((key) => {
              return `${key}: ${listProduct.variant[key]} `
            })}
          </P>
          {forCart ? (
            <></>
          ) : (
            <div className="ml-0 mt-2 max-w-sm">
              {!openNote ? (
                <A
                  underline
                  className="text-sm flex items-center gap-1"
                  onClick={() => {
                    setOpenNote(true)
                  }}
                >
                  <HiPencilAlt />
                  Add Note
                </A>
              ) : (
                <TextInput
                  type="text"
                  name="note"
                  inputSize="sm"
                  placeholder="Please input note"
                  onChange={handleChange}
                  value={input.note}
                  full
                />
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2.5 min-w-[25%] justify-center">
          <div className="w-fit my-auto">
            <P className="font-semibold text-sm">Sub Total :</P>
            {listProduct.promo.sub_price === 0 ? (
              <P className="font-bold text-lg -mt-1">
                Rp
                {ConvertShowMoney(
                  listProduct.product_price * listProduct.quantity
                )}
              </P>
            ) : (
              <>
                <P className="items-center text-slate-400 ">
                  <span className="text-[0.6rem] line-through">Rp</span>
                  <span className="text-[0.7rem] line-through">
                    {ConvertShowMoney(
                      listProduct.product_price * listProduct.quantity
                    )}
                  </span>
                </P>
                <P className="font-bold text-primary">
                  Rp{' '}
                  {ConvertShowMoney(
                    listProduct.promo.sub_price * listProduct.quantity
                  )}
                </P>
              </>
            )}
            <div className="mt-1 text-sm">
              {listProduct.promo.sub_price === 0 ? (
                <p>Rp{ConvertShowMoney(listProduct.product_price)}/pcs</p>
              ) : (
                <>
                  <p className="items-center text-slate-400 ">
                    <span className="text-[0.6rem] line-through">Rp</span>
                    <span className="text-[0.7rem] line-through">
                      {ConvertShowMoney(listProduct.product_price)}
                    </span>
                  </p>
                  <p>Rp.{ConvertShowMoney(listProduct.promo.sub_price)}/pcs</p>
                </>
              )}
            </div>
          </div>
        </div>
        {forCart ? (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                if (tempQty >= 1) {
                  setTempQty(tempQty - 1)
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 text-gray-500"
            >
              <HiMinus />
            </button>
            <P className="flex h-8 w-8 items-center justify-center">
              {tempQty}
            </P>
            <button
              onClick={() => {
                setTempQty(tempQty + 1)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 text-gray-500"
            >
              <HiPlus />
            </button>

            <button
              onClick={() => {
                modal.edit({
                  title: 'Delete Cart',
                  content: (
                    <>
                      <P>Do you really want to delete this item?</P>
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
              className="btn-outline btn-error ml-8 mr-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-error"
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
      <div></div>
    </div>
  )
}

export default ProductCart
