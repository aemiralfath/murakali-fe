import { useGetUserWalletHistoryDetail } from '@/api/user/wallet'
import { H1, H4, P, Spinner } from '@/components'
import formatMoney from '@/helper/formatMoney'
import moment from 'moment'
import React from 'react'

interface TransactionDetailProps {
  walletHistoryID: string
  walletID: string
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  walletHistoryID,
  walletID,
}) => {
  const useWalletHistoryDetail = useGetUserWalletHistoryDetail(walletHistoryID)
  return (
    <div>
      {useWalletHistoryDetail.isSuccess ? (
        <div className="mx-5">
          {useWalletHistoryDetail.data?.data?.to === walletID ? (
            <H1 className="font-bold text-green-600">
              + Rp. {formatMoney(useWalletHistoryDetail.data?.data?.amount)}
            </H1>
          ) : (
            <></>
          )}
          {useWalletHistoryDetail.data?.data?.from === walletID ? (
            <H1 className="font-bold text-red-600">
              - Rp. {formatMoney(useWalletHistoryDetail.data?.data?.amount)}
            </H1>
          ) : (
            <></>
          )}

          <H4 className="my-2">
            {useWalletHistoryDetail.data?.data?.description}
          </H4>
          <P className="text-sm text-gray-500">
            {' '}
            {moment(useWalletHistoryDetail.data?.data?.created_at).format(
              'dddd, DD-MM-YYYY HH:mm'
            )}
          </P>

          {useWalletHistoryDetail.data?.data?.transaction?.orders.length > 0 ? (
            <div>
              <div className="mt-4 border-t-4 border-dashed border-gray-400 pt-3 ">
                <P className="font-bold">Transaction ID :</P>
                <P className="mb-6 font-bold">
                  {useWalletHistoryDetail.data?.data?.transaction.id}
                </P>

                {useWalletHistoryDetail.data?.data?.transaction.orders.map(
                  (order, index) => (
                    <div key={'order-' + index} className="my-2">
                      <P className="font-bold">{order.shop_name}</P>
                      {order.detail.map((detail, index) => (
                        <div
                          key={'detail-order-' + index}
                          className="grid grid-cols-1 pl-3 sm:grid-cols-2"
                        >
                          <P>
                            {detail.order_quantity}x {detail.product_title}
                          </P>
                          <P className="flex justify-start sm:justify-end">
                            Rp. {formatMoney(detail.order_total_price)}
                          </P>
                        </div>
                      ))}
                    </div>
                  )
                )}

                <div className="grid grid-cols-1 font-bold sm:grid-cols-2">
                  <P>Total Delivery Fee</P>
                  <P className="flex justify-start sm:justify-end">
                    Rp.{' '}
                    {formatMoney(
                      useWalletHistoryDetail.data?.data?.transaction.orders.reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue.delivery_fee,
                        0
                      )
                    )}
                  </P>
                </div>
              </div>

              <div className="my-2 grid grid-cols-1 border-t-2 border-b-2 border-solid py-2 font-bold sm:grid-cols-2">
                <P>Total Delivery Fee</P>
                <P className="flex justify-start sm:justify-end">
                  Rp.{' '}
                  {formatMoney(
                    useWalletHistoryDetail.data?.data?.transaction.total_price
                  )}
                </P>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default TransactionDetail
