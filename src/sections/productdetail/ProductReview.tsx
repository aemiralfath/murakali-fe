import { useGetProductReview } from '@/api/product'
import {
  H3,
  RatingStars,
  P,
  Avatar,
  Divider,
  PaginationNav,
} from '@/components'
import { ProductReview } from '@/types/api/review'
import router from 'next/router'
import React, { useState } from 'react'
import Image from 'next/image'
import { useModal } from '@/hooks'
import moment from 'moment'

type ProgressBarProps = React.HTMLAttributes<HTMLProgressElement> & {
  index: number
  value: number
}

interface ProductReviewProps {
  productID: string
}

interface ReviewProps {
  item: ProductReview
}

const ProgressBar: React.FC<ProgressBarProps> = ({ index, value, ...rest }) => {
  return (
    <div className="group flex items-center gap-2 text-xs hover:cursor-pointer">
      <P className="group-hover:text-primary-focus">{index}</P>
      <progress
        className="progress h-3 w-full group-hover:progress-primary"
        value={`${value}`}
        max="100"
        {...rest}
      ></progress>
      <P className="w-[2rem] text-right group-hover:text-primary-focus">
        {value}%
      </P>
    </div>
  )
}

const ReviewCard: React.FC<ReviewProps> = ({ item }) => {
  const modal = useModal()

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar url={item.photo_url} />
          <P>{item.username}</P>
        </div>
        <div className="flex flex-col gap-2 text-sm text-gray-400 sm:flex-row">
          <RatingStars rating={item.rating} />
          <div className="flex gap-2">
            <P className="whitespace-nowrap">
              {moment(item.created_at).format('D MMMM YYYY')}
            </P>
          </div>
        </div>
        <div>
          <P className="text-sm leading-5">{item.comment}</P>
        </div>
        <div>
          <Image
            src={item.image_url}
            width={100}
            height={100}
            alt={'Sorry'}
            onClick={() => {
              modal.info({
                title: '',
                content: (
                  <div>
                    <Image
                      src={item.image_url}
                      width={500}
                      height={500}
                      alt={'Sorry'}
                    />
                  </div>
                ),
              })
            }}
          />
        </div>
      </div>
      <Divider />
    </>
  )
}

const ProductReview: React.FC<ProductReviewProps> = ({ productID }) => {
  const [withImage, setWithImage] = useState(false)
  const [withComment, setWithComment] = useState(false)
  const [page, setPage] = useState(1)
  const review = useGetProductReview(productID, 0, true, true, 'asc', 6, page)

  return (
    <>
      <H3>Reviews</H3>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex h-fit flex-col gap-4 rounded bg-base-200 p-4 sm:flex-row">
          <div>
            <RatingStars size="lg" rating={4.8} />
            <div>
              <span className="text-xl font-bold">4.8</span> out of 5
            </div>
            <div>
              <P className="text-xs">307 ratings</P>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              {/* 68 + 20 + 9 + 1 + 2 */}
              <ProgressBar index={5} value={68} />
              <ProgressBar index={4} value={20} />
              <ProgressBar index={3} value={9} />
              <ProgressBar index={2} value={1} />
              <ProgressBar index={1} value={2} />
            </div>
          </div>
          <div className="">
            <P className="font-semibold">Filter</P>
            <div className="mt-2 flex flex-wrap gap-x-3 sm:flex-col sm:gap-2">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  defaultChecked={withComment}
                  checked={withComment}
                  onChange={() => setWithComment(!withComment)}
                />
                With Comment
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  defaultChecked={withImage}
                  checked={withImage}
                  onChange={() => setWithImage(!withImage)}
                />
                With Image
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <>
            {review.data?.data.rows?.map((item, index) => {
              return (
                <div key={index}>
                  <ReviewCard item={item} />
                </div>
              )
            })}

            <div className="flex justify-center pt-4">
              {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
              <PaginationNav
                page={page}
                total={review.data?.data.total_pages}
                onChange={(n) => {
                  setPage(n)
                }}
              />
            </div>
          </>
        </div>
      </div>
    </>
  )
}

export default ProductReview
