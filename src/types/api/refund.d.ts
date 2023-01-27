export interface RefundOrderData {
  id: string
  order_id: string
  is_seller_refund: boolean
  is_buyer_refund: boolean
  reason: string
  image: string
  accepted_at: {
    Time: string
    Valid: boolean
  }
  rejected_at: {
    Time: string
    Valid: boolean
  }
  refunded_at: {
    Time: string
    Valid: boolean
  }
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

export interface CreateRefundUserRequest {
  image: string
  order_id: string
  reason: string
}
