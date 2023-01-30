export interface PostCheckout {
  address_id: string
  wallet_id: string
  card_number: string
  voucher_marketplace_id: string
  voucher_marketplace_total: number
  cart_items: CartPostCheckout[]
}

export interface CartPostCheckout {
  shop_id: string
  voucher_shop_id: string
  voucher_shop_total: number
  courier_id: string
  courier_fee: number
  product_details: ProductPostCheckout[]
}

export interface ProductPostCheckout {
  id: string
  cart_id: string
  quantity: number
  note: string
}
