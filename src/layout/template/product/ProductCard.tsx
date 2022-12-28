/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Chip, P } from '@/components'
import formatMoney from '@/helper/formatMoney'
import { HiStar } from 'react-icons/hi'
import type { ProductDetail } from '@/types/api/product'

interface ProductCardProps {
  data: ProductDetail
}

// TODO: Create loading state
const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  return (
    <div>
      <div className="border-grey-200 group h-full w-full scale-100 cursor-pointer rounded-lg border-[1px] border-solid transition-all duration-100 ease-in hover:z-40 hover:border-primary hover:shadow-xl">
        <img
          className="aspect-square rounded-t-lg object-cover"
          src={data.thumbnail_url}
          alt={data.title}
        />
        <div className="my-1 px-3 ">
          {data ? (
            <>
              <Chip type="gray" className="my-2 text-xs uppercase">
                {data.category_name}
              </Chip>
              <P className="overflow-hidden text-ellipsis text-sm line-clamp-2 group-hover:underline">
                {data.title}
              </P>
              <div className="my-2">
                {data.sub_price === 0 ? (
                  <P className="text-[1rem] font-bold text-primary ">
                    {data.min_price === data.max_price ? (
                      <>
                        <span className="text-[0.6rem]">Rp.</span>
                        {formatMoney(data.min_price)}
                      </>
                    ) : (
                      <>
                        <span className="text-[0.6rem]">Rp.</span>
                        {formatMoney(data.min_price)} -
                        <span className="text-[0.6rem]">Rp.</span>
                        {formatMoney(data.max_price)}
                      </>
                    )}
                  </P>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-start ">
                      <P className="mr-2 items-center text-slate-400 ">
                        <span className="text-[0.6rem] line-through">Rp.</span>
                        <span className="text-[0.8rem] line-through">
                          {formatMoney(data.min_price)}
                        </span>
                      </P>
                      <P className="font-bold text-primary">
                        <span className="text-[0.6rem]">Rp.</span>
                        <span className="text-[1rem]  ">
                          {formatMoney(data.sub_price)}
                        </span>
                      </P>
                    </div>
                  </>
                )}
              </div>
              <span className=" text- mb-2 flex  justify-between gap-1 text-gray-500">
                <div className="flex-start flex items-center gap-1">
                  <HiStar className="text-accent" /> {data?.rating_avg}{' '}
                </div>
                <div>
                  {data.unit_sold < 1000 ? data?.unit_sold : '1K+'} Sold
                </div>
              </span>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
