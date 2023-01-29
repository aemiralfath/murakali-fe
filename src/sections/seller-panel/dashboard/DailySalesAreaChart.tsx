import { useMediaQuery } from '@/hooks'
import type { DailySales } from '@/types/api/sellerperformance'
import moment from 'moment'
import React from 'react'
import { ResponsiveContainer, AreaChart, XAxis, Tooltip, Area } from 'recharts'

const DailySalesAreaChart: React.FC<{ dailySales: DailySales[] }> = ({
  dailySales,
}) => {
  const sm = useMediaQuery('sm')

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <AreaChart
        data={dailySales.slice(sm ? 0 : 15).map((order) => {
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
          <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
  )
}

export default DailySalesAreaChart
