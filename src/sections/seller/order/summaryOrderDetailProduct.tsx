import { useWithdrawOrderBalance } from '@/api/seller/order'
import { useGetRefundThreadSeller } from '@/api/seller/refund'
import { Button, P } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import { useModal } from '@/hooks'
import CancelDelivery from '@/sections/seller-panel/delivery-servise/CancelDelivery'
import ProcessDelivery from '@/sections/seller-panel/delivery-servise/ProcessDelivery'
import type { OrderData } from '@/types/api/order'
import type { APIResponse } from '@/types/api/response'
import type { AxiosError } from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

import InputResi from '../../seller-panel/delivery-servise/InputResi'
import LabelDelivery from './LabelDelivery'

interface SummaryOrderDetailProductProps {
  total_price: number
  delivery_fee: number
  order_status: number
  order_id: string
  is_withdraw: boolean
  allData: OrderData
}

const CheckOrderRefund: React.FC<{ data?: OrderData }> = ({ data }) => {
  const router = useRouter()
  const getRefundThread = useGetRefundThreadSeller(data?.order_id)
  return (
    <div>
      <Button
        size="sm"
        buttonType="ghost"
        outlined
        className="min-w-full rounded text-gray-500"
        onClick={() => {
          router.push('/seller-panel/order/refund-thread?id=' + data?.order_id)
        }}
      >
        Refund Thread
      </Button>
      {data.is_refund ? (
        <>
          {getRefundThread.data?.data?.refund_data.accepted_at.Valid ? (
            <div className="whitespace-pre-line">
              <P className="text-xs opacity-50">
                This File Complaint has been accepted at{' '}
                {moment(
                  getRefundThread.data?.data?.refund_data.accepted_at.Time
                )
                  .utcOffset(420)
                  .format('DD MMMM YYYY HH:mm:ss')
                  .toString()}
                {'.'}
                <P>please wait the system to process refund order.</P>
              </P>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          {getRefundThread.data?.data?.refund_data.rejected_at.Valid ? (
            <div className="whitespace-pre-line">
              <P className="text-xs opacity-50">
                File Complaint has been rejected at{' '}
                {moment(
                  getRefundThread.data?.data?.refund_data.rejected_at.Time
                )
                  .utcOffset(420)
                  .format('DD MMMM YYYY HH:mm:ss')
                  .toString()}
                {'.'}
                <P>please wait the system to process refund order.</P>
              </P>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  )
}

const SummaryOrderDetailProduct: React.FC<SummaryOrderDetailProductProps> = ({
  total_price,
  delivery_fee,
  order_status,
  order_id,
  is_withdraw,
  allData,
}) => {
  const modal = useModal()
  const withdrawOrderBalance = useWithdrawOrderBalance()
  function inputResiModal() {
    modal.edit({
      title: 'Input Modal',
      content: (
        <InputResi
          orderID={order_id}
          courierETD={allData.courier_etd.replace(/\D/g, '')}
        />
      ),
      closeButton: false,
    })
  }
  function labelDelivery() {
    modal.info({
      title: 'Label Delivery',
      content: (
        <>
          <LabelDelivery allData={allData} />
        </>
      ),
      closeButton: false,
    })
  }

  function confirmationModal(orderID: string, orderStatus: number) {
    modal.info({
      title: 'Confirm Status Order Change',
      content: <ProcessDelivery orderID={orderID} orderStatus={orderStatus} />,
      closeButton: false,
    })
  }

  function cancelModal(orderID: string) {
    modal.error({
      title: 'Cancel Order',
      content: <CancelDelivery orderID={orderID} />,
      closeButton: false,
    })
  }

  useEffect(() => {
    if (withdrawOrderBalance.isSuccess) {
      toast.success('Withdraw balance success!')
    }
  }, [withdrawOrderBalance.isSuccess])

  useEffect(() => {
    if (withdrawOrderBalance.isError) {
      const errMsg = withdrawOrderBalance.failureReason as AxiosError<
        APIResponse<null>
      >
      toast.error(errMsg.response?.data.message as string)
    }
  }, [withdrawOrderBalance.isError])
  return (
    <div className="max-w-full flex-none overflow-x-auto p-4">
      <div className=" overflow-x-auto whitespace-nowrap border-solid border-gray-300">
        <div className="flex flex-col gap-y-5 py-5">
          <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
            <div>Total Price</div>
            <div className="flex justify-start lg:justify-end">
              Rp. {ConvertShowMoney(total_price)}
            </div>
          </div>
          <div className=" grid grid-cols-1 gap-1 lg:grid-cols-2 ">
            <div>Delivery Fee</div>
            <div className="flex justify-start lg:justify-end">
              Rp. {ConvertShowMoney(delivery_fee)}
            </div>
          </div>
          <hr></hr>
          <div className="grid grid-cols-1 gap-1 font-bold lg:grid-cols-2">
            <div>All Total</div>
            <div className="flex justify-start lg:justify-end">
              Rp. {ConvertShowMoney(total_price + delivery_fee)}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[16rem] min-w-full max-w-full">
        {order_status === 7 ? (
          <>
            <Button
              onClick={() => {
                withdrawOrderBalance.mutate(order_id)
              }}
              buttonType="primary"
              size="sm"
              className="rounded"
              disabled={is_withdraw}
            >
              Withdraw Balance
            </Button>
          </>
        ) : (
          <></>
        )}
        {order_status === 2 ? (
          <div className="flex justify-between">
            <Button
              onClick={() => {
                confirmationModal(order_id, order_status + 1)
              }}
              buttonType="primary"
              size="sm"
              className="rounded"
            >
              Confirm
            </Button>
            <Button
              onClick={() => {
                cancelModal(order_id)
              }}
              buttonType="primary"
              outlined
              size="sm"
              className="rounded"
            >
              Cancel
            </Button>
          </div>
        ) : order_status === 3 ? (
          <Button
            buttonType="primary"
            size="sm"
            className="rounded"
            wide
            onClick={() => {
              inputResiModal()
            }}
          >
            Create Package
          </Button>
        ) : order_status === 4 || order_status === 5 || order_status === 6 ? (
          <>
            <Button
              buttonType="primary"
              size="sm"
              className="rounded"
              wide
              onClick={() => {
                labelDelivery()
              }}
            >
              Label Delivery
            </Button>
            {order_status === 6 ? <CheckOrderRefund data={allData} /> : <></>}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default SummaryOrderDetailProduct
