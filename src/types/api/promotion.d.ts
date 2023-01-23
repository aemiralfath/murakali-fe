// TODO: Change, got from Swagger

export interface Promotion {
  discount_percentage: number
  discount_fix_price: number
  min_product_price: number
  max_discount_price: number
  quota: number
  max_quantity: number
  active_date: string
  expired_date: string
}

export interface SellerPromotion {
  id: string
  promotion_name: string
  product_id: string
  product_name: string
  product_thumbnail_url: string
  discount_percentage: number
  discount_fix_price: number
  min_product_price: number
  max_discount_price: number
  quota: number
  max_quantity: number
  actived_date: string
  expired_date: string
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

export interface CreatePromotionSellerRequest {
  name: string
  actived_date: string
  expired_date: string
  product_promotion: ProductPromotion[]
}

export interface ProductPromotion {
  product_id: string
  product_thumbnail_url: string
  product_name: string
  price: number
  category_name: string
  unit_sold: number
  rating: number
  product_subprice: number
  discount_percentage: number
  discount_fix_price: number
  min_product_price: number
  max_discount_price: number
  quota: number
  max_quantity: number
}
