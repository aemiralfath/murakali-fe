export interface CartData {
  title: string
  thumbnail_url: string
  price: number
  discount_percentage: number
  discount_fix_price: number
  min_product_price: number
  max_discount_price: number
  result_discount: number
  sub_price: number
  quantity: number
  variant_name: string
  variant_type: string
}

export interface HoverCartData {
  limit: number
  total_item: number
  cart_items: CartData[]
}
