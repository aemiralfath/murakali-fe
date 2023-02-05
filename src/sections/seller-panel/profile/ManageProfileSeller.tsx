import React from 'react'

import { useGetSellerDetailInformation } from '@/api/seller'
import { Avatar, Button, H3, P } from '@/components'
import { useModal } from '@/hooks'

import FormEditSellerInformation from './FormEditProfile'

function ManageProfileSeller() {
  const modal = useModal()
  const useSellerDetailInformation = useGetSellerDetailInformation()

  return (
    <>
      <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
        <H3>Manage Profile Seller</H3>
        <div className=" mx-2 mt-8 flex flex-col gap-2 md:flex-row">
          <div className="flex justify-center flex-col items-center ">
            <Avatar
              size="xl"
              url={useSellerDetailInformation.data?.data?.photo_url}
            />
            <P className=" text-gray-500 line-clamp-2 w-52 italic mt-2 text-center">
              Go to profile page if you want to change photo
            </P>
          </div>
          <div className=" mx-2 mt-8 grid grid-cols-1 gap-2 md:grid-cols-3">
            <div className="col-span-2 mt-8 flex flex-col gap-2 sm:mt-0 ">
              {!useSellerDetailInformation.isLoading ? (
                useSellerDetailInformation.data?.data ? (
                  <div className="flex w-fit flex-col gap-3 sm:ml-4">
                    <div className="">
                      <P className="text-sm leading-3 opacity-70">Shop Name</P>
                      <P className="text-lg font-semibold">
                        {useSellerDetailInformation.data.data.name}
                      </P>
                    </div>

                    <div className="mt-4">
                      <Button
                        outlined
                        buttonType="primary"
                        onClick={() => {
                          modal.edit({
                            title: 'Edit Seller Information',
                            content: (
                              <>
                                <FormEditSellerInformation />
                              </>
                            ),
                            closeButton: false,
                          })
                        }}
                      >
                        Edit Seller Information
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>Handle no data!</>
                )
              ) : (
                <div className="ml-4 flex flex-col gap-3">
                  <div className="">
                    <P className="h-[1.25rem] w-[4rem] animate-pulse rounded bg-base-200 text-sm"></P>
                    <P className="h-[1.75rem] w-[7rem] animate-pulse rounded bg-base-200 text-lg"></P>
                  </div>
                  <div className="">
                    <P className="h-[1.25rem] w-[4rem] animate-pulse rounded bg-base-200 text-sm"></P>
                    <P className="h-[1.75rem] w-[7rem] animate-pulse rounded bg-base-200 text-lg"></P>
                  </div>
                  <div className="">
                    <P className="h-[1.25rem] w-[4rem] animate-pulse rounded bg-base-200 text-sm"></P>
                    <P className="h-[1.75rem] w-[7rem] animate-pulse rounded bg-base-200 text-lg"></P>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ManageProfileSeller
