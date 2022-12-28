import { useDeleteAddress, useGetAllAddress } from '@/api/user/address'
import { Button, Chip, H4, P } from '@/components'
import ProfileMenu from '@/layout/template/profile/ProfileMenu'
import { useModal } from '@/hooks'
import type { APIResponse } from '@/types/api/response'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import FormManageAddress from '@/layout/template/profile/FormManageAddress'
import Head from 'next/head'
import MainLayout from '@/layout/MainLayout'
function ManageAddress() {
  const modal = useModal()

  const userAllAddress = useGetAllAddress()
  const deleteAddress = useDeleteAddress()
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

  return (
    <>
      <Head>
        <title>Address | Murakali</title>
        <meta
          name="description"
          content="Address | Murakali E-Commerce Application"
        />
      </Head>
      <MainLayout>
        <div className="grid grid-cols-1 gap-x-0 gap-y-2 md:mx-5 md:grid-cols-4 md:gap-x-2">
          <ProfileMenu selectedPage="address" />
          <div className="border-1 col-span-3 h-full rounded-lg border-solid border-slate-600 p-8 shadow-2xl">
            <Button
              buttonType="primary"
              onClick={() => {
                modal.edit({
                  title: 'Add Address',
                  content: (
                    <>
                      <FormManageAddress isEdit={false} />
                    </>
                  ),
                  closeButton: false,
                })
              }}
            >
              + Add Address
            </Button>
            <hr className="my-3 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>
            {!userAllAddress.isLoading ? (
              userAllAddress.data?.data?.total_rows !== 0 ? (
                <>
                  {userAllAddress.data?.data?.rows.map((address, index) => (
                    <>
                      <div
                        key={index}
                        className="col-span-3  my-2 h-fit rounded-lg border-2 border-solid border-slate-600 p-2 drop-shadow-2xl"
                      >
                        <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                          <div className="col-span-3 flex flex-col gap-y-2 ">
                            <H4>{address.name}</H4>
                            <P>
                              {address.address_detail}, {address.sub_district},{' '}
                              {address.district}, {address.city},
                              {address.province}, Indonesia
                            </P>
                            <div className="flex flex-wrap gap-2">
                              {address.is_default ? (
                                <>
                                  <Chip>Shipping Address</Chip>
                                </>
                              ) : (
                                <></>
                              )}
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
                                      />
                                    </>
                                  ),
                                  closeButton: false,
                                })
                              }}
                            >
                              <FaPencilAlt /> Edit Address
                            </Button>

                            <Button
                              buttonType="accent"
                              onClick={() => {
                                modal.edit({
                                  title: 'Delete Address',
                                  content: (
                                    <>
                                      <P>
                                        Do you really want to delete this
                                        address?
                                      </P>
                                      <div className="mt-2 flex justify-end gap-2">
                                        <Button
                                          type="button"
                                          buttonType="accent"
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
                              <FaTrashAlt /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </>
              ) : (
                <P></P>
              )
            ) : (
              <P>Loading</P>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default ManageAddress
