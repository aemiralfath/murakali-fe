import ProfileLayout from '@/layout/ProfileLayout'
import { Navbar } from '@/layout/template'
import React from 'react'

function TransactionHistory() {
  return (
    <div>
      <Navbar />
      <ProfileLayout selectedPage="transaction-history"> </ProfileLayout>
    </div>
  )
}

export default TransactionHistory
