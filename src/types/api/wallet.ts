export interface WalletUser {
  id: string
  balance: number
  attempt_count: number
  unlocked_at: {
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
