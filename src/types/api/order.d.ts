import type { AddressDetail } from '@/types/api/address'
export interface OrderData {
  order_id: string
  order_status: number
  total_price: number
  delivery_fee: number
  resi_no: string
  shop_id: string
  shop_name: string
  shop_phone_number: string
  voucher_code: string
  created_at: string
  invoice: string
  courier_name: string
  courier_etd: string
  courier_code: string
  courier_service: string
  courier_description: string
  buyer_username: string
  buyer_phone_number: string
  buyer_address: AddressDetail
  seller_address: AddressDetail
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
  product_weight: number
  variant: {
    [key: string]: string
  }
}
