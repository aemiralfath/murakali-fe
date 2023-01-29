import { useGetSellerPerformance } from '@/api/seller/performance'
import { A, Button, Chip, H1, H2, H3, P } from '@/components'
import formatMoney from '@/helper/formatMoney'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useGetAllProvince } from '@/api/user/address/extra'
import Image from 'next/image'
import { HiDownload, HiOutlineEye, HiRefresh } from 'react-icons/hi'
import DailyOrderLineChart from '@/sections/seller-panel/dashboard/DailyOrderLineChart'
import DailySalesAreaChart from '@/sections/seller-panel/dashboard/DailySalesAreaChart'
import TotalRatingAreaChart from '@/sections/seller-panel/dashboard/TotalRatingAreaChart'
import TotalSalesPieChart from '@/sections/seller-panel/dashboard/TotalSalesPieChart'
import OrderPerProvinceMap from '@/sections/seller-panel/dashboard/OrderPerProvinceMap'
import moment from 'moment'

type ProgressBarProps = React.HTMLAttributes<HTMLProgressElement> & {
  label: string
  value: number
  max: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max,
  ...rest
}) => {
  return (
    <div className="group flex items-center gap-2 text-xs hover:cursor-pointer">
      <P className="w-[45%] line-clamp-1 group-hover:text-primary-focus">
        {label}
      </P>
      <progress
        className="progress h-3 w-full group-hover:progress-primary"
        value={`${Math.ceil((value / max) * 100)}`}
        max="100"
        {...rest}
      ></progress>
      <P className="w-[5rem] text-right group-hover:text-primary-focus">
        {value}
      </P>
    </div>
  )
}

const SellerPanelHome = () => {
  const [isUpdate, setIsUpdate] = useState(false)
  const sellerPerformance = useGetSellerPerformance(isUpdate)

  const provinces = useGetAllProvince()

  const [maxOrder, setMaxOrder] = useState(1)

  const today = new Date()
  const currHr = today.getHours()

  useEffect(() => {
    if (sellerPerformance.isSuccess) {
      setIsUpdate(false)
    }
  }, [sellerPerformance.isSuccess])

  useEffect(() => {
    if (sellerPerformance.data?.data.num_order_by_province) {
      setMaxOrder(
        sellerPerformance.data.data.num_order_by_province.reduce(
          (prev, current) =>
            prev > current.num_orders ? prev : current.num_orders,
          0
        )
      )
    }
  }, [sellerPerformance.data])

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout>
        <div className="flex items-baseline justify-between px-3 py-5 sm:px-0">
          <H1>
            Good{' '}
            {currHr < 12 ? 'Morning' : currHr < 18 ? 'Afternoon' : 'Evening'}!
          </H1>
        </div>
        <div className="mt-4 w-full rounded border bg-white p-5">
          <div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-7 xl:col-span-9">
                <H2>Daily Order</H2>
                <div className="h-[24rem] w-full">
                  {sellerPerformance.isSuccess ? (
                    <DailyOrderLineChart
                      dailyOrder={sellerPerformance.data.data.daily_order}
                    />
                  ) : sellerPerformance.isLoading ? (
                    <div className="h-full w-full animate-pulse rounded bg-base-300" />
                  ) : (
                    <></>
                  )}
                </div>
                <div className="h-[8rem] w-full">
                  {sellerPerformance.isSuccess ? (
                    <DailySalesAreaChart
                      dailySales={sellerPerformance.data.data.daily_sales}
                    />
                  ) : sellerPerformance.isLoading ? (
                    <div className="h-full w-full animate-pulse rounded bg-base-300" />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="col-span-12 grid min-h-[32rem] grid-cols-1 grid-rows-2 gap-4 lg:col-span-5 xl:col-span-3">
                <div className="flex flex-col gap-2">
                  <H2>Total Rating</H2>
                  <div className="w-full flex-1 py-2">
                    {sellerPerformance.isSuccess ? (
                      <TotalRatingAreaChart
                        totalRating={sellerPerformance.data.data.total_rating}
                      />
                    ) : sellerPerformance.isLoading ? (
                      <div className="h-full w-full animate-pulse rounded bg-base-300" />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="relative flex flex-col gap-2">
                  <div className="absolute bottom-0 left-0 flex w-full items-center justify-center gap-2 p-2">
                    <P className="text-sm">Total (all time): </P>
                    <P className="text-sm font-semibold">
                      {sellerPerformance.data?.data
                        ? `Rp ${formatMoney(
                            sellerPerformance.data.data.total_sales.total_sales
                          )}`
                        : ''}
                    </P>
                  </div>
                  <H2>Total Sales</H2>
                  <div className="w-full flex-1 p-2">
                    {sellerPerformance.isSuccess ? (
                      <TotalSalesPieChart
                        totalSales={sellerPerformance.data.data.total_sales}
                      />
                    ) : sellerPerformance.isLoading ? (
                      <div className="h-full w-full animate-pulse rounded bg-base-300" />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-8 gap-5">
          <div className="col-span-8 w-full rounded border bg-white p-5 md:col-span-5">
            {sellerPerformance.data?.data ? (
              <div>
                <H3>Most Ordered Product</H3>
                <div className="mt-2 flex flex-col rounded">
                  {sellerPerformance.data.data.most_ordered_product.length >
                  0 ? (
                    sellerPerformance.data.data.most_ordered_product.map(
                      (product) => {
                        return (
                          <div
                            className="flex items-center gap-4 p-2 transition-all hover:bg-base-200"
                            key={product.id}
                          >
                            <Image
                              alt={product.title}
                              src={product.thumbnail_url}
                              width={60}
                              height={60}
                            />
                            <div className="flex-1 p-2">
                              <A className="font-semibold">{product.title}</A>
                              <P className="flex items-center gap-1 text-xs opacity-60">
                                <HiOutlineEye /> {product.view_count}
                              </P>
                            </div>
                            <div className="flex items-center justify-center">
                              <Chip>Sold: {product.unit_sold}</Chip>
                            </div>
                          </div>
                        )
                      }
                    )
                  ) : (
                    <P className="text-base-300">No Product Yet</P>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="col-span-8 w-full md:col-span-3">
            <div className="h-fit w-full rounded border bg-white p-5">
              <div>
                <H3>Order per Province</H3>
                <>
                  {sellerPerformance.isSuccess ? (
                    <OrderPerProvinceMap
                      maxOrder={maxOrder}
                      orders={sellerPerformance.data.data.num_order_by_province}
                    />
                  ) : sellerPerformance.isLoading ? (
                    <div className="aspect-[15/8] h-[20rem] animate-pulse rounded bg-base-300" />
                  ) : (
                    <></>
                  )}
                  {sellerPerformance.data?.data
                    ? sellerPerformance.data.data.num_order_by_province
                        .slice(0, 5)
                        .map((order) => (
                          <ProgressBar
                            key={order.province_id}
                            label={
                              provinces.data?.data
                                ? provinces.data.data.rows[
                                    order.province_id - 1
                                  ].province
                                : `${order.province_id}`
                            }
                            value={order.num_orders}
                            max={maxOrder}
                          />
                        ))
                    : Array(5)
                        .fill(0)
                        .map((num, idx) => {
                          return (
                            <ProgressBar
                              key={`${num}-${idx}`}
                              label={''}
                              value={num}
                              max={maxOrder}
                            />
                          )
                        })}
                </>
              </div>
            </div>
            <div className="mt-4 h-fit w-full rounded border bg-white p-5">
              <P>Data will be updated every 12 hours</P>
              <P className="text-sm opacity-60">
                Last Updated:{' '}
                {sellerPerformance.data?.data
                  ? moment(
                      sellerPerformance.data.data.report_updated_at
                    ).format('DD MMMM YYYY hh:mm A')
                  : '-'}
              </P>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  outlined
                  onClick={() => {
                    setIsUpdate(true)
                    sellerPerformance.refetch()
                  }}
                >
                  <HiRefresh /> Update
                </Button>
                <a
                  className="btn-outline btn flex items-center gap-2"
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(
                      sellerPerformance.data?.data
                        ? sellerPerformance.data.data
                        : {}
                    )
                  )}`}
                  download={'report.json'}
                >
                  <HiDownload /> Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default SellerPanelHome
