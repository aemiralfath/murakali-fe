import { Button } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'
import { useModal } from '@/hooks'
import CancelDelivery from '@/sections/seller-panel/delivery-servis/CancelDelivery'
import ProcessDelivery from '@/sections/seller-panel/delivery-servis/ProcessDelivery'
import type { OrderData } from '@/types/api/order'

import InputResi from '../../seller-panel/delivery-servis/InputResi'
import LabelDelivery from './LabelDelivery'

interface SummaryOrderDetailProductProps {
  total_price: number
  delivery_fee: number
  order_status: number
  order_id: string
  allData: OrderData
}

const SummaryOrderDetailProduct: React.FC<SummaryOrderDetailProductProps> = ({
  total_price,
  delivery_fee,
  order_status,
  order_id,
  allData,
}) => {
  const modal = useModal()
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

      <div>
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
        ) : order_status === 4 || order_status === 5 ? (
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
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default SummaryOrderDetailProduct
