import { H3, P, NumberInput, Divider, H4, Button } from '@/components'
import React from 'react'
import { HiTag, HiPlus } from 'react-icons/hi'
import type { ProductDetail } from '@/types/api/product'

interface ChooseVariantQtyProps {
  variantNamesState: string[]
  selectVariant: ProductDetail | undefined
  setSelectVariant: (p: ProductDetail | undefined) => void
  qty: number
  setQty: (p: number) => void
}

const ChooseVariantQty: React.FC<ChooseVariantQtyProps> = ({
  variantNamesState,
  selectVariant,
  qty,
  setQty,
}) => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-2">
        <H3>Select Variant and Quantity:</H3>
        {selectVariant ? (
          <P>
            {variantNamesState.map((variantName, idx) => {
              return (
                <span key={idx}>
                  {selectVariant.variant[variantName] + (idx === 0 ? ', ' : '')}
                </span>
              )
            })}
          </P>
        ) : (
          <span className="italic opacity-50">Please Select Variant</span>
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
          <P className="text-sm line-through opacity-50">Rp.22.088</P>
          <P className="flex-1 text-right text-lg font-bold">Rp.22.088</P>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button buttonType="primary" className="rounded">
          <HiTag /> Buy Now
        </Button>
        <Button buttonType="primary" outlined className="rounded">
          <HiPlus /> Add to Cart
        </Button>
      </div>
    </>
  )
}

export default ChooseVariantQty
