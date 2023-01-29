import formatMoney from '@/helper/formatMoney'
import type { TotalSales } from '@/types/api/sellerperformance'
import React from 'react'
import {
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const TotalSalesPieChart: React.FC<{ totalSales: TotalSales }> = ({
  totalSales,
}) => {
  return (
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
              value: totalSales.withdrawable_sum,
            },
            {
              name: 'Withdrawn',
              value: totalSales.withdrawn_sum,
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
  )
}

export default TotalSalesPieChart
