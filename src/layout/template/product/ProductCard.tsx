/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { Button, Chip, P } from '@/components'
import formatMoney from '@/helper/formatMoney'
import { HiStar } from 'react-icons/hi'
import type { BriefProduct } from '@/types/api/product'
import { useHover, useModal } from '@/hooks'
import { Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import cx from '@/helper/cx'
import { useDeleteFavProduct } from '@/api/product/favorite'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { APIResponse } from '@/types/api/response'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/redux/reducer/modalReducer'
import Image from 'next/image'

type ProductCardProps = LoadingDataWrapper<BriefProduct> & {
  hoverable?: boolean
  forFavPage?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  data,
  isLoading,
  hoverable,
  forFavPage,
}) => {
  const [cartRef, isHover] = useHover()
  const router = useRouter()
  const dispatch = useDispatch()
  const useDeleteFavoriteProduct = useDeleteFavProduct()

  const modal = useModal()

  useEffect(() => {
    if (useDeleteFavoriteProduct.isSuccess) {
      toast.success('Success Delete Favorite Product')
      dispatch(closeModal())
    }
  }, [useDeleteFavoriteProduct.isSuccess])

  useEffect(() => {
    if (useDeleteFavoriteProduct.isError) {
      const errmsg = useDeleteFavoriteProduct.error as AxiosError<
        APIResponse<null>
      >
      toast.error(
        errmsg.response ? errmsg.response.data.message : errmsg.message
      )
      dispatch(closeModal())
    }
  }, [useDeleteFavoriteProduct.isError])

  const [src, setSrc] = useState('/asset/no-image.png')
  useEffect(() => {
    if (data?.thumbnail_url) {
      setSrc(data.thumbnail_url)
    }
  }, [data])

  return (
    <div
      ref={cartRef}
      className={cx(
        'border-grey-200 group z-0 h-full w-full scale-100 cursor-pointer rounded-t-lg rounded-b-lg border-[1px] border-solid transition-all hover:border-primary',
        hoverable ? 'hover:z-40 hover:rounded-b-none hover:shadow-xl' : ''
      )}
    >
      <div
        className="min-h-full"
        onClick={() => {
          router.push('/p/' + data.id)
        }}
      >
        {isLoading ? (
          <div className="aspect-square animate-pulse rounded-t-lg bg-base-200 object-cover" />
        ) : (
          <Image
            className="aspect-square rounded-t-lg object-cover"
            src={src}
            alt={data.title}
            height={300}
            width={300}
            loading={'lazy'}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              setSrc('/asset/no-image.png')
            }}
          />
        )}
        <div className="my-1 flex min-h-full flex-col px-3">
          {isLoading ? (
            <>
              <div className="my-2 h-[1rem] w-[4rem] animate-pulse rounded bg-base-200" />
              <P className="h-[2.5rem] w-full animate-pulse rounded bg-base-200" />
              <div className="my-2 h-[1.5rem] w-[80%] animate-pulse rounded bg-base-200" />
              <span className=" text- mb-2 flex  justify-between gap-1 text-gray-500">
                <div className="my-2 h-[1rem] w-[4rem] animate-pulse rounded bg-base-200" />
              </span>
            </>
          ) : (
            <>
              <Chip type="gray" className="my-2 text-xs uppercase">
                {data.category_name}
              </Chip>
              <P className="h-[2.5rem] overflow-hidden text-ellipsis text-sm line-clamp-2 group-hover:underline">
                {data.title}
              </P>
              <div className="my-2 h-full">
                {data.sub_price === 0 ? (
                  <P className="flex h-[1.5rem] overflow-hidden text-[1rem] font-bold text-primary">
                    {data.min_price === data.max_price ? (
                      <>
                        <span className="text-[0.6rem]">Rp.</span>
                        {formatMoney(data.min_price)}
                      </>
                    ) : (
                      <>
                        <span className="text-[0.6rem]">Rp.</span>
                        {formatMoney(data.min_price)}-
                        <span className="text-[0.6rem]">Rp.</span>
                        <span className="bg-green-200">
                          {formatMoney(data.max_price)}
                        </span>
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
          )}
        </div>
      </div>
      {hoverable ? (
        <Transition
          show={isHover}
          enter={'duration-50'}
          enterFrom={'scale-y-0 opacity-0'}
          enterTo={'scale-y-100 opacity-100'}
          leave={'duration-50'}
          leaveFrom={'scale-y-100 opacity-100'}
          leaveTo={'scale-y-0 opacity-0'}
          className={
            'absolute z-40 block origin-top -translate-x-[1px] transition-all'
          }
          style={{
            width: `calc(100% + 2px)`,
          }}
        >
          {forFavPage ? (
            <>
              <div className="grid grid-cols-2 gap-1  bg-primary p-2">
                <div>
                  <Button
                    size="xs"
                    buttonType="ghost"
                    className="w-full text-white"
                    onClick={() => {
                      modal.edit({
                        title: 'Delete Favorite',
                        content: (
                          <>
                            <P>
                              Do you really want to delete this favorite
                              product?
                            </P>
                            <div className="mt-4 flex justify-end gap-2">
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
                                  useDeleteFavoriteProduct.mutate(data.id)
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
                  >
                    Delete <br></br>Favorite
                  </Button>
                </div>
                <div>
                  <Button
                    size="xs"
                    buttonType="ghost"
                    className="w-full text-white"
                    onClick={() => {
                      router.push('/p/' + data.id)
                    }}
                  >
                    Detail<br></br>Product
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1 rounded-b-lg bg-primary p-2">
                <div>
                  <Button
                    size="xs"
                    className="w-full text-white"
                    buttonType="white"
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: Add OnClick
                    }}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-1 rounded-b-lg bg-primary p-2">
                <div>
                  <Button
                    size="xs"
                    buttonType="ghost"
                    className="w-full text-white"
                    onClick={() => {
                      router.push('/p/' + data.id)
                    }}
                  >
                    See Details
                  </Button>
                </div>
                <div>
                  <Button
                    size="xs"
                    buttonType="white"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: Add OnClick
                    }}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </Transition>
      ) : (
        <></>
      )}
    </div>
  )
}

export default ProductCard
