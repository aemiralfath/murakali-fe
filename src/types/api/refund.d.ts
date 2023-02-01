import type { NullableTime } from './time'

export interface RefundOrderData {
  id: string
  order_id: string
  is_seller_refund: boolean
  is_buyer_refund: boolean
  reason: string
  image: string
  accepted_at: NullableTime
  rejected_at: NullableTime
  refunded_at: NullableTime
  order: {
    id: string
    transaction_id: string
    shop_id: string
    user_id: string
    courier_id: string
    voucher_shop_id?: string
    order_status_id: number
    total_price: number
    delivery_fee: number
    resi_no?: string
    created_at: string
    arrived_at: {
      Time: string
      Valid: boolean
    }
  }
}

export interface ConversationRefundThread {
  user_name: string
  photo_url: string
  refund_data: RefundOrderData
  refund_threads: RefundThread[]
}

export interface RefundThread {
  id: string
  refund_id: string
  user_id: string
  user_name: string
  shop_name: string
  photo_url: string
  is_seller: boolean
  is_buyer: boolean
  text: string
  created_at: string
}

export interface CreateRefundUserRequest {
  image: string
  order_id: string
  reason: string
}

export interface CreateRefundThreadRequest {
  refund_id: string
  text: string
}
