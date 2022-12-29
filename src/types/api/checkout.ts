export interface PostCheckout {
  wallet_id: string
  card_number: string
  voucher_marketplace_id: string
  cart_items: CartPostCheckout[]
}

export interface CartPostCheckout {
  shop_id: string
  voucher_shop_id: string
  courier_id: string
  product_details: ProductPostCheckout[]
}

export interface ProductPostCheckout {
  id: string
  quantity: number
  sub_price: number
}
