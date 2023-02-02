import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { HiTag, HiPlus } from 'react-icons/hi'

import { useRouter } from 'next/router'

import { useAddToCart } from '@/api/user/cart'
import { H3, P, NumberInput, Divider, H4, Button } from '@/components'
import { env } from '@/env/client.mjs'
import formatMoney from '@/helper/formatMoney'
import { useUser } from '@/hooks'
import type { CheckoutValues } from '@/pages/checkout'
import type { ProductDetail } from '@/types/api/product'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'
import CryptoJS from 'crypto-js'

const secret = env.NEXT_PUBLIC_SECRET_KEY

interface ChooseVariantQtyProps {
  productID: string
  variantNamesState: string[]
  selectVariant: ProductDetail | undefined
  setSelectVariant: (p: ProductDetail | undefined) => void
  qty: number
  setQty: (p: number) => void
  shopID?: string
}

const ChooseVariantQty: React.FC<ChooseVariantQtyProps> = ({
  productID,
  variantNamesState,
  selectVariant,
  qty,
  setQty,
  shopID,
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
        {selectVariant ? (
          <></>
        ) : (
          <P className="text-sm italic opacity-60">Please select Variant</P>
        )}
        <Button
          buttonType="primary"
          className="rounded"
          disabled={!selectVariant}
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
              if (selectVariant && shopID) {
                const tempValues: CheckoutValues = {
                  idProducts: [selectVariant.id],
                  idShops: [shopID],
                  price: selectVariant.normal_price * qty,
                  subPrice:
                    (selectVariant.normal_price -
                      selectVariant.discount_price) *
                    qty,
                  quantity: qty,
                  result_discount: selectVariant.discount_price * qty,
                }

                addToCart.mutate({
                  id: selectVariant.id,
                  quantity: qty,
                })
                router.push({
                  pathname: '/checkout',
                  query: {
                    update: 'true',
                    values: CryptoJS.AES.encrypt(
                      JSON.stringify(tempValues),
                      secret
                    ).toString(),
                  },
                })
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
          disabled={!selectVariant}
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
