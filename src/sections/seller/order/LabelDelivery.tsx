import { Button, H2, H3, Icon, P } from '@/components'
import { closeModal } from '@/redux/reducer/modalReducer'
import type { OrderData } from '@/types/api/order'
import React, { useRef } from 'react'
import Barcode from 'react-barcode'
import { useDispatch } from 'react-redux'
import OrderAddressDetail from './orderAddressDetail'
import ReactToPrint from 'react-to-print'
interface LabelDeliveryProps {
  allData: OrderData
}

const LabelDelivery: React.FC<LabelDeliveryProps> = ({ allData }) => {
  const dispatch = useDispatch()
  const componentRef = useRef()
  return (
    <div>
      <div
        className="mx-auto my-auto w-96 border-8 border-solid border-black p-4"
        ref={componentRef}
      >
        <div className="mb-2 flex flex-row items-center justify-center  border-b-4 border-black pb-2">
          <div className="w-32 text-white">
            <Icon color="black" />
          </div>
        </div>
        <div className="mb-2 flex flex-col items-center justify-center border-b-4 border-black pb-2">
          <H2 className="font-bold">Invoice</H2>

          <Barcode value={allData.invoice} />
        </div>
        <div className="mb-2 flex justify-between border-b-4 border-black pb-2">
          <div>
            <H3 className="font-bold">Delivery Info</H3>
            <P>{allData.courier_name}</P>
            <P>{allData.courier_description}</P>
          </div>
          <div>
            <P className="mt-5">
              Weight :{' '}
              {allData.detail.reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.product_weight,
                0
              ) / 1000}{' '}
              kg
            </P>
          </div>
        </div>
        <div className="mb-2 grid grid-cols-2 border-b-4 border-dashed  border-black pb-2">
          <div className="mr-2 border-r-2 border-black pr-2">
            <OrderAddressDetail
              title={'From'}
              username={allData.shop_name}
              phone_number={allData.shop_phone_number}
              address={allData.seller_address}
            />
          </div>
          <div>
            <OrderAddressDetail
              title={'Destination'}
              username={allData.buyer_username}
              phone_number={allData.buyer_phone_number}
              address={allData.buyer_address}
            />
          </div>
        </div>

        <div className="flex-rows flex items-center justify-center">
          <P className="font-bold">Resi Number</P>

          <Barcode value={allData.resi_no} />
        </div>
      </div>

      <div className="mt-2 flex justify-center gap-2">
        <Button
          type="button"
          buttonType="gray"
          onClick={() => {
            dispatch(closeModal())
          }}
        >
          Close
        </Button>
        <ReactToPrint
          trigger={() => (
            <Button type="button" buttonType="gray">
              Print
            </Button>
          )}
          content={() => componentRef.current}
        />
      </div>
    </div>
  )
}

export default LabelDelivery
