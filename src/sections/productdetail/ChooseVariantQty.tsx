import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { HiTag, HiPlus } from 'react-icons/hi'

import { useRouter } from 'next/router'

import { useAddToCart } from '@/api/user/cart'
import { H3, P, NumberInput, Divider, H4, Button } from '@/components'
import formatMoney from '@/helper/formatMoney'
import { useUser } from '@/hooks'
import type { ProductDetail } from '@/types/api/product'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'

interface ChooseVariantQtyProps {
  productID: string
  variantNamesState: string[]
  selectVariant: ProductDetail | undefined
  setSelectVariant: (p: ProductDetail | undefined) => void
  qty: number
  setQty: (p: number) => void
}

const ChooseVariantQty: React.FC<ChooseVariantQtyProps> = ({
  productID,
  variantNamesState,
  selectVariant,
  qty,
  setQty,
}) => {
  const addToCart = useAddToCart()

  useEffect(() => {
    if (addToCart.isSuccess) {
      toast.success('Added to cart!')
    }
  }, [addToCart.isSuccess])
  useEffect(() => {
    if (addToCart.isError) {
      const reason = addToCart.failureReason as AxiosError<APIResponse<null>>
      toast.error(
        reason.response ? reason.response.data.message : reason.message
      )
    }
  }, [addToCart.isError])

  const { user, isLoading } = useUser()
  const router = useRouter()

  return (
    <>
      <div className="flex flex-1 flex-col gap-2">
        <H3>Select Variant and Quantity:</H3>
        {selectVariant ? (
          <P>
            {variantNamesState.map((variantName, idx) => {
              return (
                <span key={idx}>
                  {selectVariant.variant[variantName] +
                    (idx === 0 &&
                    idx === Object.keys(selectVariant.variant).length
                      ? ', '
                      : '')}
                </span>
              )
            })}
          </P>
        ) : (
          <span className="italic opacity-50">-</span>
        )}
        <div className="flex items-center justify-between">
          <NumberInput
            value={qty}
            setValue={setQty}
            maxValue={selectVariant?.stock}
          />
          <P>
            Available:{' '}
            {selectVariant ? (
              <span>{selectVariant.stock}</span>
            ) : (
              <span className="italic opacity-50">-</span>
            )}
          </P>
        </div>
      </div>
      <Divider />
      <div className="flex flex-1 flex-col gap-2">
        <H4>Subtotal</H4>
        <div className="flex items-center justify-between">
          {selectVariant !== undefined ? (
            selectVariant?.discount_price ? (
              <>
                <P className="text-sm line-through opacity-50">
                  Rp.{formatMoney(selectVariant?.normal_price * qty)}
                </P>
                <P className="flex-1 text-right text-lg font-bold">
                  Rp.{formatMoney(selectVariant?.discount_price * qty)}
                </P>
              </>
            ) : (
              <>
                <P className="flex-1 text-right text-lg font-bold">
                  Rp.{formatMoney(selectVariant?.normal_price * qty)}
                </P>
              </>
            )
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {qty <= 0 ? (
          <P className="text-sm italic text-error opacity-80">Out Of Stock</P>
        ) : (
          <>
            {' '}
            {selectVariant ? (
              <></>
            ) : (
              <P className="text-sm italic opacity-60">Please select Variant</P>
            )}
          </>
        )}

        <Button
          buttonType="primary"
          className="rounded"
          disabled={!selectVariant || qty <= 0}
          onClick={() => {
            if (!user && !isLoading) {
              toast.error('You must login first')
              router.push({
                pathname: '/login',
                query: {
                  from: ('/p/' + productID) as string,
                },
              })
            } else {
              if (selectVariant) {
                addToCart.mutate({
                  id: selectVariant.id,
                  quantity: qty,
                })
                router.push('/cart')
              } else {
                toast.error('Please select variant!')
              }
            }
          }}
        >
          <HiTag /> Buy Now
        </Button>
        <Button
          buttonType="primary"
          outlined
          disabled={!selectVariant || qty <= 0}
          className="rounded"
          onClick={() => {
            if (!user && !isLoading) {
              toast.error('You must login first')
              router.push({
                pathname: '/login',
                query: {
                  from: ('/p/' + productID) as string,
                },
              })
            } else {
              if (selectVariant) {
                addToCart.mutate({
                  id: selectVariant.id,
                  quantity: qty,
                })
              } else {
                toast.error('Please select variant!')
              }
            }
          }}
        >
          <HiPlus /> Add to Cart
        </Button>
      </div>
    </>
  )
}

export default ChooseVariantQty
