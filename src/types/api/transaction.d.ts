import type { OrderModel } from './order'
import type { NullableTime } from './time'
import type { Voucher } from './Voucher'

export interface TransactionID {
  transaction_id: string
}

export interface Transaction {
  id: string
  voucher_marketplace: Voucher
  wallet_id?: string
  card_number?: number
  invoice?: string
  total_price: number
  expired_at: NullableTime
  orders: OrderModel[]
}
