import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiPencilAlt, HiTrash } from 'react-icons/hi'

import { useDeleteAddress, useGetAllAddress } from '@/api/user/address'
import { useGetUserProfile } from '@/api/user/profile'
import {
  Button,
  Chip,
  Divider,
  H2,
  H3,
  P,
  PaginationNav,
  Spinner,
} from '@/components'
import { useDispatch, useModal } from '@/hooks'
import FormManageAddress from '@/layout/template/profile/FormManageAddress'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'

function ManageAddressSeller() {
  const modal = useModal()
  const [page, setPage] = useState<number>(1)
  const [role, setRole] = useState<number>(1)
  const userAllAddress = useGetAllAddress(page)
  const deleteAddress = useDeleteAddress()
  const userProfile = useGetUserProfile()
  const dispatch = useDispatch()

  useEffect(() => {
    if (deleteAddress.isSuccess) {
      toast.success('Successfully delete address')
      dispatch(closeModal())
    }
  }, [deleteAddress.isSuccess])

  useEffect(() => {
    if (deleteAddress.isError) {
      const errmsg = deleteAddress.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [deleteAddress.isError])

  useEffect(() => {
    if (userProfile.data?.data) {
      setRole(userProfile.data.data.role)
    }
  }, [userProfile.isSuccess])

  return (
    <div className="mt-3 flex h-full flex-col rounded border bg-white p-6 ">
      <div className="flex flex-wrap items-end justify-between">
        <H3>Manage Address</H3>
        <Button
          buttonType="primary"
          size="sm"
          onClick={() => {
            modal.edit({
              title: 'Add Address',
              content: (
                <>
                  <FormManageAddress
                    isEdit={false}
                    role={role}
                    isInShop={true}
                  />
                </>
              ),
              closeButton: false,
            })
          }}
        >
          + Add Address
        </Button>
      </div>
      <div className="my-4">
        <Divider />
      </div>
      {!userAllAddress.isLoading ? (
        userAllAddress.data?.data?.total_rows !== 0 ? (
          <>
            {userAllAddress.data?.data?.rows.map((address, index) => (
              <>
                <div key={index} className="my-2 rounded border-[1px] p-2">
                  <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                    <div className="col-span-3 flex flex-col gap-y-2 ">
                      <H2>{address.name}</H2>
                      <P>
                        {address.address_detail}, {address.sub_district},{' '}
                        {address.district}, {address.city},{address.province},
                        Indonesia
                      </P>
                      <div className="flex flex-wrap gap-2">
                        {address.is_shop_default ? (
                          <>
                            <Chip>Shop Address</Chip>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>

                    <div className=" flex flex-col justify-center gap-4">
                      <Button
                        buttonType="primary"
                        onClick={() => {
                          modal.edit({
                            title: 'Edit Address',
                            content: (
                              <>
                                <FormManageAddress
                                  isEdit={true}
                                  editData={address}
                                  role={role}
                                  isInShop={true}
                                />
                              </>
                            ),
                            closeButton: false,
                          })
                        }}
                      >
                        <HiPencilAlt /> Edit Address
                      </Button>

                      <Button
                        buttonType="primary"
                        outlined
                        onClick={() => {
                          modal.edit({
                            title: 'Delete Address',
                            content: (
                              <>
                                <P>
                                  Do you really want to delete this address?
                                </P>
                                <div className="mt-4 flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    outlined
                                    buttonType="primary"
                                    onClick={() => {
                                      dispatch(closeModal())
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    buttonType="primary"
                                    onClick={() => {
                                      deleteAddress.mutate(address.id)
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
                        <HiTrash /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ))}
            <div className="mt-4 flex justify-end">
              <PaginationNav
                page={page}
                total={userAllAddress.data?.data?.total_pages ?? 1}
                onChange={(p) => {
                  setPage(p)
                }}
              />
            </div>
          </>
        ) : (
          <P></P>
        )
      ) : (
        <Spinner />
      )}

      {userAllAddress.data?.data?.total_pages === 0 ? (
        <div className=" z-10 flex h-full items-center rounded-lg  py-7 px-8">
          <P className="flex w-full items-center justify-center italic text-gray-500">
            Address is Empty!
          </P>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default ManageAddressSeller
