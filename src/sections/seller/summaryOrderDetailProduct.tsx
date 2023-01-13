import { Button } from '@/components'
import { ConvertShowMoney } from '@/helper/convertshowmoney'

interface SummaryOrderDetailProductProps {
  total_price: number
  delivery_fee: number
  order_status: number
}

const SummaryOrderDetailProduct: React.FC<SummaryOrderDetailProductProps> = ({
  total_price,
  delivery_fee,
  order_status,
}) => {
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
          <>
            <Button buttonType="primary" size="sm" className="rounded">
              Confirm
            </Button>
            <Button buttonType="primary" outlined size="sm" className="rounded">
              Cancel
            </Button>
          </>
        ) : order_status === 3 ? (
          <Button buttonType="primary" size="sm" className="rounded">
            Create Package
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default SummaryOrderDetailProduct
