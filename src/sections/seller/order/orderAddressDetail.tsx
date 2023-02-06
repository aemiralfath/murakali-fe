import React from 'react'

import { H3, H4, P } from '@/components'
import type { AddressDetail } from '@/types/api/address'

interface OrderAddressDetailProps {
  title: string
  username: string
  phone_number: string
  address: AddressDetail
}

const OrderAddressDetail: React.FC<OrderAddressDetailProps> = ({
  title,
  username,
  phone_number,
  address,
}) => {
  return (
    <>
      <H3>{title}</H3>
      <H4 className="mt-1 py-2">{username}</H4>
      <H4>(+62) {phone_number}</H4>
      <P>
        {address.address_detail}, {address.sub_district}, {address.district},{' '}
        {address.city}, {address.province}, {address.zip_code}
      </P>
    </>
  )
}

export default OrderAddressDetail
