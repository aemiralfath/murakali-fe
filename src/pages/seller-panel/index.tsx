import { useGetSellerPerformance } from '@/api/seller/performance'
import SellerPanelLayout from '@/layout/SellerPanelLayout'
import moment from 'moment'
import Head from 'next/head'
import React from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const SellerPanelHome = () => {
  const sellerPerformance = useGetSellerPerformance(false)

  return (
    <div>
      <Head>
        <title>Murakali | Seller Panel</title>
      </Head>
      <SellerPanelLayout>
        <div className="w-full rounded border bg-white p-2">
          {sellerPerformance.data?.data ? (
            <>
              <AreaChart
                width={730}
                height={250}
                data={sellerPerformance.data.data.daily_sales.map(
                  (daily_sales) => {
                    return {
                      date: moment(daily_sales.date).format('D/MM'),
                      uv: daily_sales.total_sales,
                    }
                  }
                )}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorPv"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  ></linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </>
          ) : (
            <></>
          )}
        </div>
      </SellerPanelLayout>
    </div>
  )
}

export default SellerPanelHome
