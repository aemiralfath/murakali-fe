export interface WalletUser {
  id: string
  balance: number
  attempt_count: number
  unlocked_at: {
    Time: string
    Valid: boolean
  }
}
