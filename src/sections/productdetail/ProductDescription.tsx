import { H3, Avatar, A, P, Divider } from '@/components'
import cx from '@/helper/cx'
import type { ProductInfo } from '@/types/api/product'
import type { SellerInfo } from '@/types/api/seller'
import React, { useState } from 'react'
import { HiChevronUp, HiChevronDown } from 'react-icons/hi'

interface ProductDescription {
  seller: SellerInfo
  productInfo: ProductInfo
}

// TODO: Integrate with Layout
const ProductDescription = ({ seller, productInfo }: ProductDescription) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false)

  return (
    <>
      <H3>Sold By</H3>
      <div className="mt-4 items-center rounded border p-2 sm:flex sm:divide-x">
        <div className="flex items-center gap-4 pr-4">
          <Avatar size="lg" />
          <div className="w-fit overflow-ellipsis xl:w-[10rem]">
            <A className="font-semibold">{seller.name}</A>
            {/* <P className="text-sm">DKI Jakarta</P> */}
          </div>
        </div>
        <div className="mt-4 flex w-full flex-wrap items-center justify-between px-4 sm:mt-0 sm:justify-around">
          <div className="text-center">
            <P className="text-sm line-clamp-1">Rating</P>
            <P className="text-primary line-clamp-1">{seller.total_rating}</P>
          </div>
          {/* <div className="text-center">
            <P className="text-sm line-clamp-1">Items Sold</P>
            <P className="text-primary line-clamp-1">{seller.total_product}</P>
          </div> */}
          <div className="text-center">
            <P className="text-sm line-clamp-1">Item</P>
            <P className="text-primary line-clamp-1">{seller.total_product}</P>
          </div>
        </div>
      </div>

      <H3 className="mt-8">Product Description</H3>
      <P className={cx('mt-2', descriptionOpen ? '' : 'line-clamp-[15]')}>
        {productInfo?.description}
      </P>
      <div className="mt-4">
        <Divider>
          <button
            className="flex items-center gap-2 text-primary"
            onClick={() => {
              setDescriptionOpen(!descriptionOpen)
            }}
          >
            {descriptionOpen ? (
              <>
                Close <HiChevronUp />
              </>
            ) : (
              <>
                See More <HiChevronDown />
              </>
            )}
          </button>
        </Divider>
      </div>
    </>
  )
}

export default ProductDescription
