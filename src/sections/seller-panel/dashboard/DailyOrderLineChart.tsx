import { useMediaQuery } from '@/hooks'
import type { DailyOrder } from '@/types/api/sellerperformance'
import moment from 'moment'
import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
} from 'recharts'

const DailyOrderLineChart: React.FC<{ dailyOrder: DailyOrder[] }> = ({
  dailyOrder,
}) => {
  const sm = useMediaQuery('sm')
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <LineChart
        width={500}
        height={300}
        data={dailyOrder.slice(sm ? 0 : 15).map((order) => {
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
        <CartesianGrid strokeDasharray="5 5" stroke="#f2f2f2" />{' '}
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
  )
}

export default DailyOrderLineChart
