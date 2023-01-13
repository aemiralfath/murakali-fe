import type { Promotion } from './promotion'

export interface ProductInfo {
  id: string
  sku: string
  title: string
  description: string
  view_count: number
  favorite_count: number
  unit_sold: number
  listed_status: boolean
  thumbnail_url: string
  rating_avg: number
  min_price: number
  max_price: number
  category_name: string
  category_url: string
  shop_id: string
}

export interface ProductDetail {
  id: string
  normal_price: number
  stock: number
  discount_price: number
  weight: number
  size: number
  hazardous: boolean
  condition: string
  bulk_price: boolean
  variant: {
    [key: string]: string
  }
}
export interface Product {
  products_info: ProductInfo
  promotions_info: Promotion
  products_detail: ProductDetail[]
}

export interface BriefProduct {
  id: string
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

export interface ProductImages {
  product_detail_id?: string
  url: string
}
export interface ProductQuery {
  search: string
  category: string
  limit: number
  page: number
  sort_by: string
  sort: string
  min_price: number
  max_price: number
  min_rating: number
  max_rating: number
  shop_id: string
  province_ids: string
}
