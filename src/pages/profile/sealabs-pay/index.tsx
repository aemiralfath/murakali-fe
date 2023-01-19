import {
  useDeleteSealabsPay,
  useGetUserSLP,
  useSetDefaultSealabsPay,
} from '@/api/user/slp'
import { Button, Chip, Divider, H1, H2, H3, P } from '@/components'
import { useDispatch, useModal } from '@/hooks'
import ProfileLayout from '@/layout/ProfileLayout'
import { closeModal } from '@/redux/reducer/modalReducer'
import Head from 'next/head'
import React from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'

function SealabsPay() {
  const modal = useModal()
  const sealabspay = useGetUserSLP()
  const sealabspayDelete = useDeleteSealabsPay()
  // const sealabspaySetDefault = useSetDefaultSealabsPay()
  const dispatch = useDispatch()

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
          <div className="flex justify-between">
            <H1 className="text-primary">Manage Sealabs-Pay</H1>
          </div>
          <div className="my-4 h-full">
            <Divider />
            {sealabspay.isSuccess &&
              sealabspay.data.data.map((slp, index) => (
                <div className="my-2 rounded border-[1px] p-2" key={index}>
                  <div className=" my-4 mx-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                    <div className="col-span-3 flex flex-col gap-y-2 ">
                      <H2>{slp.name}</H2>
                      <H3>{slp.card_number}</H3>
                      <P>Expired At : {slp.active_date}</P>
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
                        <HiPencil /> Set Default
                      </Button>
                      <Button buttonType="primary" outlined>
                        <HiTrash /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            {sealabspay.isSuccess && sealabspay.data.data.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <H2 className="text-primary">No Sealabs-Pay</H2>
              </div>
            )}
          </div>
        </>
      </ProfileLayout>
    </>
  )
}

export default SealabsPay
