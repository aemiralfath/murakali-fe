import React, { useState } from 'react'
import { HiChevronUp, HiChevronDown } from 'react-icons/hi'

import { useRouter } from 'next/router'

import { H3, Avatar, A, P, Divider } from '@/components'
import cx from '@/helper/cx'
import type { ProductInfo } from '@/types/api/product'
import type { SellerInfo } from '@/types/api/seller'

interface ProductDescription {
  seller: SellerInfo
  productInfo: ProductInfo
}

// TODO: Integrate with Layout
const ProductDescription = ({ seller, productInfo }: ProductDescription) => {
  const router = useRouter()
  const [descriptionOpen, setDescriptionOpen] = useState(false)

  return (
    <>
      <H3 className="mt-8">Product Description</H3>
      <P
        className={cx(
          'mt-2 break-words max-w-lg ',
          descriptionOpen ? 'line-clamp-4' : 'line-clamp-[15]'
        )}
      >
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
      <div className="mt-4 items-center rounded border p-2 sm:flex sm:divide-x">
        <div className="flex items-center gap-4 pr-4">
          <A
            className="font-semibold"
            onClick={() => {
              router.push('/seller/' + seller.id)
            }}
          >
            <Avatar size="lg" url={seller.photo_url} />
          </A>
          <div className="w-fit flex-1 overflow-ellipsis xl:w-[10rem]">
            <A
              className="font-semibold"
              onClick={() => {
                router.push('/seller/' + seller.id)
              }}
            >
              {seller.name}
            </A>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-wrap items-center justify-between px-4 sm:mt-0 sm:justify-around">
          <div className="text-center">
            <P className="text-sm line-clamp-1">Rating</P>
            <P className="text-primary line-clamp-1">{seller.total_rating}</P>
          </div>

          <div className="text-center">
            <P className="text-sm line-clamp-1">Item</P>
            <P className="text-primary line-clamp-1">{seller.total_product}</P>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDescription
