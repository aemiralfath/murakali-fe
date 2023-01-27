import {
  useCreateDeliverySeller,
  useDeleteDeliverySeller,
  useDeliveryServiceSeller,
} from '@/api/seller/delivery-service'
import { Button, Chip, H2, P } from '@/components'
import { useModal } from '@/hooks'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

function SellerDeliveryService() {
  const useCouriers = useDeliveryServiceSeller()
  const useCreateCourier = useCreateDeliverySeller()
  const useDeleteCourier = useDeleteDeliverySeller()

  const modal = useModal()
  const dispatch = useDispatch()

  useEffect(() => {
    if (useCreateCourier.isSuccess) {
      toast.success('Successfully add delivery service')
      dispatch(closeModal())
    }
  }, [useCreateCourier.isSuccess])

  useEffect(() => {
    if (useCreateCourier.isError) {
      const errmsg = useCreateCourier.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [useCreateCourier.isError])

  useEffect(() => {
    if (useDeleteCourier.isSuccess) {
      toast.success('Successfully remove delivery service')
      dispatch(closeModal())
    }
  }, [useDeleteCourier.isSuccess])

  useEffect(() => {
    if (useDeleteCourier.isError) {
      const errmsg = useDeleteCourier.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errmsg.response?.data.message as string)
    }
  }, [useDeleteCourier.isError])
  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout selectedPage="delivery-service">
        <H2>Delivery Service</H2>
        <div className="mt-3 grid h-full grid-cols-1 gap-6 rounded border bg-white p-6 md:grid-cols-2 md:gap-6">
          {useCouriers.data?.data?.rows.map((courier, index) => {
            const CourierImage = '/asset/' + courier.code + '.png'
            return (
              <div
                key={index}
                className="col-span-1 rounded border-[1px] bg-white p-8"
              >
                <div className="flex flex-col">
                  <div className="mb-5 px-4">
                    <Image
                      className="h-20 w-20 rounded-t-lg object-contain "
                      src={CourierImage}
                      alt={courier.name}
                      width={150}
                      height={75}
                    />
                  </div>
                </div>
                <div className="w-[40rem] max-w-full border-t-[3px] px-4">
                  <div className="flex items-center py-5">
                    <div className="flex-1 content-center">
                      <label className="flex items-center gap-2 pr-5">
                        <input
                          className="checkbox-primary checkbox checkbox-sm"
                          type="checkbox"
                          checked={
                            courier.deleted_at === '' &&
                            courier.shop_courier_id !== ''
                          }
                          onClick={(event) => {
                            if (event.currentTarget.checked) {
                              modal.edit({
                                title: 'Add Delivery Service',
                                content: (
                                  <>
                                    <P>
                                      Do you really want to add this delivery
                                      service?
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
                                          useCreateCourier.mutate(
                                            courier.courier_id
                                          )
                                        }}
                                      >
                                        Add
                                      </Button>
                                    </div>
                                  </>
                                ),
                                closeButton: false,
                              })
                            } else {
                              modal.edit({
                                title: 'Remove Delivery Service',
                                content: (
                                  <>
                                    <P>
                                      Do you really want to remove this delivery
                                      service?
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
                                        buttonType="primary"
                                        outlined
                                        onClick={() => {
                                          useDeleteCourier.mutate(
                                            courier.shop_courier_id
                                          )
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </>
                                ),
                                closeButton: false,
                              })
                            }
                          }}
                        />
                        <div className="max-w-full">{courier.service}</div>
                      </label>
                    </div>
                    <Chip type="gray">{courier.description}</Chip>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default SellerDeliveryService
