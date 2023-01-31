import { useGetProductReview } from '@/api/product'
import {
  H3,
  RatingStars,
  P,
  Avatar,
  Divider,
  PaginationNav,
} from '@/components'
import type { TotalRating } from '@/types/api/review'
import { ProductReview } from '@/types/api/review'
import React, { useState } from 'react'
import { useModal } from '@/hooks'
import moment from 'moment'

type ProgressBarProps = React.HTMLAttributes<HTMLProgressElement> & {
  index: number
  value: number
}

interface ProductReviewProps {
  productID: string
  rating: TotalRating
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

export const ReviewCard: React.FC<ReviewProps> = ({ item }) => {
  const modal = useModal()

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {item.photo_url === null ? <></> : <Avatar url={item.photo_url} />}
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
          {item.comment === null ? (
            <></>
          ) : (
            <P className="text-sm leading-5">{item.comment}</P>
          )}
        </div>
        <div>
          {item.image_url === null ? (
            <></>
          ) : (
            <img
              src={item.image_url}
              width={100}
              height={100}
              alt={'Sorry'}
              onClick={() => {
                modal.info({
                  title: '',
                  content: (
                    <div>
                      <img
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
          )}
        </div>
      </div>
      <Divider />
    </>
  )
}

const ProductReview: React.FC<ProductReviewProps> = ({ productID, rating }) => {
  const [withImage, setWithImage] = useState(true)
  const [withComment, setWithComment] = useState(true)
  const [page, setPage] = useState(1)
  const review = useGetProductReview(
    productID,
    0,
    withComment,
    withImage,
    'asc',
    6,
    page
  )

  return (
    <>
      <H3>Reviews</H3>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex h-fit max-w-lg flex-col gap-4 rounded bg-base-200 p-4 sm:flex-row">
          <div>
            {rating ? (
              <RatingStars size="lg" rating={rating?.avg_rating} />
            ) : (
              <></>
            )}

            <div className="flex items-baseline gap-1">
              {rating?.avg_rating === null ||
              rating?.avg_rating === undefined ? (
                <span className="text-xl font-bold">0</span>
              ) : (
                <span className="text-xl font-bold">{rating?.avg_rating}</span>
              )}
              out of 5
            </div>
            <div>
              <P className="text-xs">{rating?.total_rating} ratings</P>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              {rating?.avg_rating === null ||
              rating?.avg_rating === undefined ? (
                <>
                  <ProgressBar index={5} value={0} />
                  <ProgressBar index={4} value={0} />
                  <ProgressBar index={3} value={0} />
                  <ProgressBar index={2} value={0} />
                  <ProgressBar index={1} value={0} />
                </>
              ) : (
                <>
                  <ProgressBar
                    index={5}
                    value={
                      (rating?.rating_product[4].count / rating?.total_rating) *
                      100
                    }
                  />
                  <ProgressBar
                    index={4}
                    value={
                      (rating?.rating_product[3].count / rating?.total_rating) *
                      100
                    }
                  />
                  <ProgressBar
                    index={3}
                    value={
                      (rating?.rating_product[2].count / rating?.total_rating) *
                      100
                    }
                  />
                  <ProgressBar
                    index={2}
                    value={
                      (rating?.rating_product[1].count / rating?.total_rating) *
                      100
                    }
                  />
                  <ProgressBar
                    index={1}
                    value={
                      (rating?.rating_product[0].count / rating?.total_rating) *
                      100
                    }
                  />
                </>
              )}
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
          {review.data?.data.rows.length > 0 ? (
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
          ) : (
            <P className="italic text-gray-400">
              There are no reviews for this product, yet.
            </P>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductReview
