import { useGetSellerPerformance } from '@/api/seller/performance'
import { A, Chip, H2, H3, P } from '@/components'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import ColorScale from 'color-scales'
import formatMoney from '@/helper/formatMoney'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import moment from 'moment'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useGetAllProvince } from '@/api/user/address/extra'
import Image from 'next/image'
import { HiOutlineEye } from 'react-icons/hi'
import { useMediaQuery } from '@/hooks'

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
  const sm = useMediaQuery('sm')
  const sellerPerformance = useGetSellerPerformance(false)
  const provinces = useGetAllProvince()

  const [maxOrder, setMaxOrder] = useState(1)
  const colorScale = new ColorScale(0, maxOrder, ['#accafa', '#3b82f6'])

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
        <div className="w-full rounded border bg-white p-5">
          {sellerPerformance.data?.data ? (
            <>
              <div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 lg:col-span-7 xl:col-span-9">
                    <H2>Daily Sales</H2>
                    <div className="h-[24rem] w-full">
                      <ResponsiveContainer width={'100%'} height={'100%'}>
                        <LineChart
                          width={500}
                          height={300}
                          data={sellerPerformance.data.data.daily_order
                            .slice(sm ? 0 : 15)
                            .map((order) => {
                              return {
                                date: moment(order.date).format('D'),
                                success: order.success_order,
                                failed: order.failed_order,
                                month: moment(order.date).format('MMMM'),
                              }
                            })}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="5 5"
                            stroke="#f2f2f2"
                          />{' '}
                          <XAxis xAxisId={0} dataKey="date" fontSize={14} />
                          <XAxis
                            xAxisId={1}
                            dataKey="month"
                            fontSize={12}
                            allowDuplicatedCategory={false}
                          />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="success"
                            stroke="#4ade80"
                            strokeWidth={'3px'}
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="failed"
                            stroke="#ef4444"
                            strokeWidth={'3px'}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-[8rem] w-full">
                      <ResponsiveContainer width={'100%'} height={'100%'}>
                        <AreaChart
                          data={sellerPerformance.data.data.daily_sales
                            .slice(sm ? 0 : 15)
                            .map((order) => {
                              return {
                                date: moment(order.date).format('D'),
                                sales: order.total_sales,
                                month: moment(order.date).format('MMMM'),
                              }
                            })}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <defs>
                            <linearGradient
                              id="colorSuccess"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.6}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis xAxisId={0} dataKey="date" fontSize={14} />

                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#3b82f6"
                            strokeWidth={'2px'}
                            fillOpacity={1}
                            fill={'url(#colorSuccess)'}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="col-span-12 grid grid-cols-1 grid-rows-2 gap-4 lg:col-span-5 xl:col-span-3">
                    <div className="flex flex-col gap-2">
                      <H2>Total Rating</H2>
                      <div className="w-full flex-1 py-2">
                        <ResponsiveContainer height={'100%'}>
                          <BarChart
                            margin={{
                              left: -34,
                            }}
                            height={100}
                            layout="vertical"
                            data={[
                              {
                                name: '5',
                                value:
                                  sellerPerformance.data.data.total_rating
                                    .rating_5,
                              },
                              {
                                name: '4',
                                value:
                                  sellerPerformance.data.data.total_rating
                                    .rating_4 * 1,
                              },
                              {
                                name: '3',
                                value:
                                  sellerPerformance.data.data.total_rating
                                    .rating_3,
                              },
                              {
                                name: '2',
                                value:
                                  sellerPerformance.data.data.total_rating
                                    .rating_2,
                              },
                              {
                                name: '1',
                                value:
                                  sellerPerformance.data.data.total_rating
                                    .rating_1,
                              },
                            ]}
                          >
                            <Tooltip />
                            <YAxis
                              dataKey="name"
                              type="category"
                              fontSize={12}
                              axisLine={false}
                            />
                            <XAxis type="number" fontSize={12} />
                            <Bar
                              dataKey="value"
                              fill="#fde047"
                              barSize={20}
                            ></Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="relative flex flex-col gap-2">
                      <div className="absolute bottom-0 left-0 flex w-full items-center justify-center gap-2 p-2">
                        <P className="text-sm">Total (all time): </P>
                        <P className="text-sm font-semibold">
                          Rp
                          {formatMoney(
                            sellerPerformance.data.data.total_sales.total_sales
                          )}
                        </P>
                      </div>
                      <H2>Total Sales</H2>
                      <div className="w-full flex-1 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart
                            margin={{
                              top: 0,
                              right: 0,
                              bottom: 35,
                            }}
                          >
                            <Pie
                              dataKey="value"
                              data={[
                                {
                                  name: 'Available',
                                  value:
                                    sellerPerformance.data.data.total_sales
                                      .withdrawable_sum,
                                },
                                {
                                  name: 'Withdrawn',
                                  value:
                                    sellerPerformance.data.data.total_sales
                                      .withdrawn_sum,
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              innerRadius={60}
                              labelLine={false}
                            >
                              <LabelList
                                dataKey={'value'}
                                fill={'#000'}
                                position={'inside'}
                                formatter={formatMoney}
                                style={{
                                  paddingTop: '100px',
                                  stroke: 'none',
                                  fontSize: 12,
                                }}
                              />
                              <Cell key="cell-available" fill="#3b82f6" />
                              <Cell key="cell-withdrawn" fill="#accafa" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
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
                    <P className="text-base-300">No Product Yer</P>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="col-span-8 h-fit w-full rounded border bg-white p-5 md:col-span-3">
            {sellerPerformance.data?.data ? (
              <div>
                <H3>Order per Province</H3>
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    rotate: [-5.6, -2, 2],
                    center: [112.4, 1],
                    scale: 1350,
                  }}
                  style={{
                    aspectRatio: '15/8',
                    maxHeight: '20rem',
                  }}
                >
                  <Geographies geography="indonesia.json">
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const foundIndex =
                          sellerPerformance.data.data.num_order_by_province.findIndex(
                            (s) => s.province_id === geo.properties.id
                          )
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={colorScale
                              .getColor(
                                foundIndex === -1
                                  ? 0
                                  : sellerPerformance.data.data
                                      .num_order_by_province[foundIndex]
                                      .num_orders
                              )
                              .toHexString()}
                            className={
                              'transition-all hover:fill-primary-focus'
                            }
                          />
                        )
                      })
                    }
                  </Geographies>
                </ComposableMap>
                {sellerPerformance.data.data.num_order_by_province
                  .slice(0, 5)
                  .map((order) => (
                    <ProgressBar
                      key={order.province_id}
                      label={
                        provinces.data?.data
                          ? provinces.data.data.rows[order.province_id - 1]
                              .province
                          : `${order.province_id}`
                      }
                      value={order.num_orders}
                      max={maxOrder}
                    />
                  ))}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default SellerPanelHome
