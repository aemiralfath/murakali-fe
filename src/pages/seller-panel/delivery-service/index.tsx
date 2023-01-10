import {
  useCreateDeliverySeller,
  useDeleteDeliverySeller,
  useDeliveryServiceSeller,
} from '@/api/seller/delivery-service'
import { Chip, H2 } from '@/components'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import Head from 'next/head'
import Image from 'next/image'

function SellerDeliveryService() {
  const useCouriers = useDeliveryServiceSeller()
  const useCreateCourier = useCreateDeliverySeller()
  const useDeleteCourier = useDeleteDeliverySeller()

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
                              useCreateCourier.mutate(courier.courier_id)
                            } else {
                              useDeleteCourier.mutate(courier.shop_courier_id)
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
