export interface OrderData {
  order_id: string
  order_status: number
  total_price: number
  delivery_fee: number
  resi_no: string
  shop_id: string
  shop_name: string
  voucher_code: string
  created_at: string
  detail: OrderProductDetail[]
}

export interface OrderProductDetail {
  product_detail_id: string
  product_id: string
  product_title: string
  product_detail_url: string
  order_quantity: number
  order_item_price: number
  order_total_price: number
}
