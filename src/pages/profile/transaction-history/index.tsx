import { useGetTransactions } from '@/api/transaction'
import { Divider, H1 } from '@/components'
import ProfileLayout from '@/layout/ProfileLayout'
import Head from 'next/head'

import React from 'react'

function TransactionHistory() {
  const transactions = useGetTransactions()

  return (
    <>
      <Head>
        <title>Transaction History | Murakali</title>
        <meta
          name="description"
          content="Transaction History | Murakali E-Commerce Application"
        />
      </Head>
      <ProfileLayout selectedPage="transaction-history">
        <>
          <H1 className="text-primary">Transactions</H1>
          <div className="my-4">
            <Divider />
          </div>
          <div>
            <div className="rounded border p-2"></div>
          </div>
        </>
      </ProfileLayout>
    </>
  )
}

export default TransactionHistory
