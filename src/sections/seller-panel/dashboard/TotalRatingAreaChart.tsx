import type { TotalRating } from '@/types/api/sellerperformance'
import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Tooltip,
  YAxis,
  XAxis,
  Bar,
} from 'recharts'

const TotalRatingAreaChart: React.FC<{ totalRating: TotalRating }> = ({
  totalRating,
}) => {
  return (
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
            value: totalRating.rating_5,
          },
          {
            name: '4',
            value: totalRating.rating_4,
          },
          {
            name: '3',
            value: totalRating.rating_3,
          },
          {
            name: '2',
            value: totalRating.rating_2,
          },
          {
            name: '1',
            value: totalRating.rating_1,
          },
        ]}
      >
        <Tooltip />
        <YAxis dataKey="name" type="category" fontSize={12} axisLine={false} />
        <XAxis type="number" fontSize={12} />
        <Bar dataKey="value" fill="#fde047" barSize={20}></Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default TotalRatingAreaChart
