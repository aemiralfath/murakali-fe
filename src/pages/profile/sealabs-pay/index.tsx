import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { HiPencil, HiTrash } from 'react-icons/hi'

import Head from 'next/head'

import {
  useDeleteSealabsPay,
  useGetUserSLP,
  useSetDefaultSealabsPay,
} from '@/api/user/slp'
import { Button, Chip, Divider, H1, H2, H3, P, Spinner } from '@/components'
import { useDispatch, useModal } from '@/hooks'
import ProfileLayout from '@/layout/ProfileLayout'
import { closeModal } from '@/redux/reducer/modalReducer'
import FormRegisterSealabsPay from '@/sections/checkout/FormRegisterSealabsPay'
import type { APIResponse } from '@/types/api/response'

import type { AxiosError } from 'axios'
import moment from 'moment'

function SealabsPay() {
  const modal = useModal()
  const sealabspay = useGetUserSLP()
  const sealabspayDelete = useDeleteSealabsPay()
  const sealabspaySetDefault = useSetDefaultSealabsPay()
  const dispatch = useDispatch()

  useEffect(() => {
    if (sealabspayDelete.isSuccess) {
      toast.success('Successfully delete Sealabs-Pay')
      dispatch(closeModal())
    }
  }, [sealabspayDelete.isSuccess])

  useEffect(() => {
    if (sealabspaySetDefault.isError) {
      const errmsg = sealabspaySetDefault.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [sealabspaySetDefault.isError])

  useEffect(() => {
    if (sealabspaySetDefault.isSuccess) {
      toast.success('Successfully set default Sealabs-Pay')
      dispatch(closeModal())
    }
  }, [sealabspaySetDefault.isSuccess])

  useEffect(() => {
    if (sealabspayDelete.isError) {
      const errmsg = sealabspayDelete.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
      dispatch(closeModal())
    }
  }, [sealabspayDelete.isError])

  return (
    <>
      <Head>
        <title>Sealabs-Pay | Murakali</title>
        <meta
          name="description"
          content="Sealabs-Pay | Murakali E-Commerce Application"
        />
      </Head>
      <ProfileLayout selectedPage="sealabs-pay">
        <>
          <div className="flex flex-wrap justify-between gap-y-2">
            <H1 className="text-primary">Manage Sealabs-Pay</H1>
            <Button
              buttonType="primary"
              onClick={() => {
                modal.edit({
                  title: 'Add Sealabs Pay Account',
                  content: (
                    <>
                      <FormRegisterSealabsPay
                        isCheckout={false}
                        postCheckout={undefined}
                        userWallet={undefined}
                        userSLP={[]}
                        totalOrder={0}
                      />
                    </>
                  ),
                  closeButton: false,
                })
              }}
            >
              + Add Sealabs Pay Card
            </Button>
          </div>
          <div className="my-4 h-full">
            <Divider />
            {sealabspay.data?.data &&
              sealabspay.data.data.map((slp, index) => (
                <div className="my-2 rounded border-[1px] p-2" key={index}>
                  <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                    <div className="col-span-3 flex flex-col gap-y-2 ">
                      <H2>{slp.name}</H2>
                      <H3 className=" block truncate font-semibold">
                        {slp.card_number}
                      </H3>
                      <P>
                        Expired At :
                        {moment(slp.active_date).format('DD-MMM-YYYY ')}
                      </P>
                      {slp.is_default ? (
                        <div className="flex flex-wrap gap-2">
                          <Chip>Default</Chip>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className=" flex flex-col justify-center gap-4">
                      <Button
                        buttonType="primary"
                        onClick={() => {
                          modal.edit({
                            title: 'Set Sealabs-Pay as Default',
                            content: (
                              <>
                                <P>
                                  Do you want to set this Sealabs-Pay as
                                  default?
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
                                      sealabspaySetDefault.mutate(
                                        slp.card_number
                                      )
                                    }}
                                  >
                                    Set Default
                                  </Button>
                                </div>
                              </>
                            ),
                            closeButton: false,
                          })
                        }}
                      >
                        <HiPencil /> Set Default
                      </Button>
                      <Button
                        buttonType="primary"
                        outlined
                        onClick={() => {
                          modal.error({
                            title: 'Delete Sealabs-Pay',
                            content: (
                              <>
                                <P>Do you want to delete this Sealabs-Pay?</P>
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
                                      sealabspayDelete.mutate(slp.card_number)
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
              ))}
            {sealabspay.data?.data && sealabspay.data.data.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <H2 className="text-primary">No Sealabs-Pay</H2>
              </div>
            )}
            {sealabspay.isLoading && (
              <div className="flex h-full items-center justify-center">
                <Spinner />
              </div>
            )}
          </div>
        </>
      </ProfileLayout>
    </>
  )
}

export default SealabsPay
