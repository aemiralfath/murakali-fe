import { H2, H4, P } from '@/components'
import type { AddressDetail } from '@/types/api/address'
import React from 'react'

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
      <H2>{title}</H2>
      <H4 className="mt-4 py-3">{username}</H4>
      <H4>(+62) {phone_number}</H4>
      <P>
        {address.address_detail}, {address.sub_district}, {address.district},{' '}
        {address.city}, {address.province}, {address.zip_code}
      </P>
    </>
  )
}

export default OrderAddressDetail
