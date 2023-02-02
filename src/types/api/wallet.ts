import type { OrderData } from './order'

export interface WalletUser {
  id: string
  balance: number
  attempt_count: number
  unlocked_at: {
    Time: string
    Valid: boolean
  }
  active_date: {
    Time: string
    Valid: boolean
  }
}

export interface TopUpWallet {
  card_number: string
  amount: number
}

export interface WalletHistory {
  id: string
  from: string
  to: string
  amount: number
  description: string
  created_at: string
}

export interface WalletHistoryDetail {
  amount: number
  created_at: number
  description: string
  from: string
  to: string
  transaction: {
    id: string
    voucher_marketplace_id: string
    invoice: string
    total_price: number
    paid_at: {
      Time: string
      Valid: true
    }
    orders: OrderData[]
  }
}
