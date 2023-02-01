import React from 'react'
import { HiStar } from 'react-icons/hi'

import { useRouter } from 'next/router'

import { Button, H2, P, PaginationNav } from '@/components'
import type { SellerInfo } from '@/types/api/seller'

interface SellerLayoutProps {
  isLoading: boolean
  data?: SellerInfo[]
  totalPage?: number
  pageShop?: number
  setPageShop?: (page: number) => void
}

const SellerLayout: React.FC<SellerLayoutProps> = ({
  data,
  totalPage,
  isLoading,
  pageShop,
  setPageShop,
}) => {
  const router = useRouter()
  return (
    <div>
      {isLoading ? (
        <>
          {Array.from(Array(8)).map((_, index) => {
            return (
              <div key={'loading' + index}>
                <div className="z-0 mx-5 my-2 animate-pulse rounded-lg border-[1px] border-solid border-gray-300 py-5 px-2 transition-all hover:cursor-pointer hover:shadow-xl sm:px-8 md:mx-20 ">
                  <div className="flex flex-wrap justify-around gap-3 ">
                    <div className="align-center flex flex-wrap items-center  justify-between gap-x-4  ">
                      <div className="h-24 w-24 animate-pulse rounded-full bg-gray-300"></div>
                      <div className="mx-auto block h-8  w-20 animate-pulse   bg-gray-300 font-bold text-primary hover:cursor-pointer hover:underline md:w-64"></div>
                    </div>
                    <div className="my-auto flex-col items-center justify-center  ">
                      <div className=" my-1 h-8 w-20 animate-pulse bg-gray-300 font-bold text-primary"></div>
                      <div className="h-8 w-10 animate-pulse bg-gray-300">
                        {' '}
                      </div>
                    </div>
                    <div className="my-auto flex-col items-center justify-center  ">
                      <div className=" my-1 h-8 w-20 animate-pulse bg-gray-300 font-bold text-primary"></div>
                      <div className="h-8 w-10 animate-pulse bg-gray-300">
                        {' '}
                      </div>
                    </div>

                    <div className="my-auto">
                      <div className="h-8 w-20 animate-pulse bg-gray-300">
                        {' '}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </>
      ) : (
        <>
          {data && data.length > 0 ? (
            <>
              {data.map((shop, index) => (
                <div key={index}>
                  <div
                    className="z-0 mx-5 my-2 rounded-lg border-[1px] border-solid border-gray-300 py-5 px-2 transition-all hover:cursor-pointer hover:shadow-xl sm:px-8 md:mx-20 "
                    onClick={() => {
                      router.push('/seller/' + shop.id)
                    }}
                  >
                    <div className="flex flex-wrap justify-around gap-3 ">
                      <div className="align-center  flex flex-wrap  items-center justify-between gap-x-4 ">
                        <img
                          className="mx-auto h-24 w-24 rounded-full  object-contain"
                          width={100}
                          height={100}
                          alt={shop.name + ' photo'}
                          src={shop.photo_url}
                          loading="lazy"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null
                            currentTarget.src = '/asset/no-image.png'
                          }}
                        />

                        <H2 className="mx-auto block w-full break-words font-bold text-primary hover:cursor-pointer hover:underline md:w-64">
                          {shop.name}
                        </H2>
                      </div>
                      <div className="my-auto text-center">
                        <P className="font-bold text-primary">
                          {shop.total_product}
                        </P>
                        <P className="">Product</P>
                      </div>
                      <div className="my-auto text-center ">
                        <P className="flex items-center font-bold text-primary">
                          <HiStar className="text-accent" /> {shop.rating_avg}
                        </P>
                        <P className="">Rating</P>
                      </div>

                      <div className="my-auto">
                        <Button
                          buttonType="primary"
                          onClick={() => {
                            router.push('/seller/' + shop.id)
                          }}
                        >
                          Go To Shop
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {!isLoading && data?.length !== 0 && setPageShop ? (
                <div className="mt-4 flex w-full justify-center">
                  <PaginationNav
                    total={totalPage ?? 1}
                    page={pageShop ?? 1}
                    onChange={setPageShop}
                    size="sm"
                  />
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <div className="col-span-2 flex w-full flex-col items-center justify-center p-6 sm:col-span-3 md:col-span-4 xl:col-span-6">
              <img
                src={'/asset/sorry.svg'}
                width={300}
                height={300}
                alt={'Sorry'}
              />
              <P className="text-sm italic text-gray-400">
                Sorry, shop you requested is not found.
              </P>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SellerLayout
