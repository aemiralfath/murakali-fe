import type { OrdersByProvince } from '@/types/api/sellerperformance'
import ColorScale from 'color-scales'
import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const OrderPerProvinceMap: React.FC<{
  orders: OrdersByProvince[]
  maxOrder: number
}> = ({ orders, maxOrder }) => {
  const colorScale = new ColorScale(0, maxOrder, ['#accafa', '#3b82f6'])

  return (
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
            const foundIndex = orders.findIndex(
              (s) => s.province_id === geo.properties.id
            )
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={colorScale
                  .getColor(
                    foundIndex === -1 ? 0 : orders[foundIndex]?.num_orders ?? 0
                  )
                  .toHexString()}
                className={'transition-all hover:fill-primary-focus'}
              />
            )
          })
        }
      </Geographies>
    </ComposableMap>
  )
}

export default OrderPerProvinceMap
