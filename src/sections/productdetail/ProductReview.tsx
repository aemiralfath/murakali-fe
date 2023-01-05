import {
  H3,
  RatingStars,
  P,
  Avatar,
  Divider,
  PaginationNav,
} from '@/components'
import React, { useState } from 'react'

type ProgressBarProps = React.HTMLAttributes<HTMLProgressElement> & {
  index: number
  value: number
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

const ReviewCard = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar />
          <P>Person</P>
        </div>
        <div className="flex">
          <P className="-mt-1 font-semibold leading-5 line-clamp-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis aut,
            exercitationem asperiores perferendis laboriosam quas.
          </P>
        </div>
        <div className="flex flex-col gap-2 text-sm text-gray-400 sm:flex-row">
          <RatingStars rating={5} />
          <div className="flex gap-2">
            <P className="whitespace-nowrap">2 December 2022</P>
          </div>
        </div>
        <div>
          <P className="text-sm leading-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti,
            ad? Voluptatibus molestias in, exercitationem sint asperiores
            repellat iste eveniet autem.
          </P>
        </div>
      </div>
      <Divider />
    </>
  )
}

const ProductReview = () => {
  const [withImage, setWithImage] = useState(false)
  const [withComment, setWithComment] = useState(false)

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
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <div className="flex justify-center pt-4">
            {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
            <PaginationNav page={3} total={12} onChange={() => {}} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductReview
