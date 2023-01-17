import { H2, P } from '@/components'
import React from 'react'

interface TransactionDetailProps {
  transactionId: string
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  transactionId,
}) => {
  return (
    <div>
      <div className="mx-5">
        <H2>Rp. 100</H2>
        <P>Top Up</P>
        <P className="text-sm text-gray-500">Monday 15, 14:10</P>
        <hr />
      </div>
    </div>
  )
}

export default TransactionDetail
