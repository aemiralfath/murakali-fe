import { useDeleteAddress, useGetAllAddress } from '@/api/user/address'
import { Button, Chip, Divider, H1, H2, P } from '@/components'
import { useModal } from '@/hooks'
import type { APIResponse } from '@/types/api/response'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import FormManageAddress from '@/layout/template/profile/FormManageAddress'
import Head from 'next/head'
import ProfileLayout from '@/layout/ProfileLayout'
import { HiPencilAlt, HiTrash } from 'react-icons/hi'

// TODO: Fix Address Combobox behavior

function ManageAddress() {
  const modal = useModal()

  const [page, setPage] = useState<number>(1)
  const userAllAddress = useGetAllAddress(page)
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
      <ProfileLayout selectedPage="address">
        <>
          <div className="flex justify-between">
            <H1 className="text-primary">Manage Address</H1>
            {userAllAddress.data?.data?.total_rows !== 0 ? (
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
            ) : (
              <></>
            )}
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
              </>
            ) : (
              <P></P>
            )
          ) : (
            <P>Loading</P>
          )}
          <div className="flex justify-end">
            <div className="btn-group">
              {Array.from(Array(userAllAddress.data?.data?.total_pages)).map(
                (_, index) => {
                  return (
                    <button
                      key={index}
                      defaultValue={1}
                      value={index + 1}
                      onClick={() => {
                        setPage(index + 1)
                      }}
                      className={index + 1 === page ? 'btn-active btn' : 'btn'}
                    >
                      {index + 1}
                    </button>
                  )
                }
              )}
            </div>
          </div>
        </>
      </ProfileLayout>
    </>
  )
}

export default ManageAddress
