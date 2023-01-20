export interface VoucherData {
  id: string
  shop_id: string
  code: string
  quota: number
  actived_date: string
  expired_date: string
  discount_percentage: number
  discount_fix_price: number
  min_product_price: number
  max_discount_price: number
  max_quantity: number
  created_at: string
  updated_at: {
    Time: string
    Valid: boolean
  }
  deleted_at: {
    Time: string
    Valid: boolean
  }
}
