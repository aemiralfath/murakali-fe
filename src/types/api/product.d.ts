export interface ProductDetail {
  title: string
  unit_sold: number
  rating_avg: number
  thumbnail_url: string
  min_price: number
  max_price: number
  sub_price: number
  promo_discount_percentage?: number
  promo_discount_fix_price?: number
  promo_min_product_price?: number
  promo_max_discount_price?: number
  result_discount?: number
  voucher_discount_percentage?: number
  voucher_discount_fix_price?: number
  shop_name: string
  category_name: string
}
