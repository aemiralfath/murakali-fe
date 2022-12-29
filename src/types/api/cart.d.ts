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

export interface Cart {
  rows: CartDetail[]
}

export interface CartDetail {
  id: string
  shop: {
    id: string
    name: string
  }
  product_details: ProductCartDetail[]
}

export interface ProductCartDetail {
  id: string
  title: string
  quantity: number

  thumbnail_url: string
  rating_avg: number
  product_price: number

  promo: {
    sub_price: number
    result_discount: number
  }
}

export interface UpdateCart {
  id: string
  quantity: number
}
