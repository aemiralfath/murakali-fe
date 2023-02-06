import type { Promotion } from './promotion'
import type { NullableTime } from './time'

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
  shop_id?: string
}

export interface ProductDetail {
  id: string
  product_url: string[]
  normal_price: number
  stock: number
  discount_price: number
  weight: number
  size: number
  hazardous: boolean
  condition: 'new' | 'used'
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
  sku: string
  unit_sold: number
  rating_avg: number
  thumbnail_url: string
  min_price: number
  max_price: number
  view_count: number
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
  province: string
  created_at: string
  updated_at: NullableTime
  listed_status: boolean
}

export interface VariantDetailReq {
  type: string
  name: string
}

export interface ProductDetailReq {
  price: number
  stock: number
  weight: number
  size: number
  hazardous: boolean
  condition: 'new' | 'used'
  bulk_price: boolean
  photo: string[]
  variant_detail: VariantDetailReq[]
}

export interface ProductInfoReq {
  title: string
  description: string
  thumbnail: string
  category_id: string
  listed_status: boolean
}

export interface CreateProductReq {
  products_info: ProductInfoReq
  products_detail: ProductDetailReq[]
}

export interface EditProductReq {
  products_info_update: ProductInfoReq
  products_detail_update: Array<
    ProductDetailReq & {
      product_detail_id: string
      variant_info_update: []
      variant_id_remove: []
    }
  >
  products_detail_id_remove: []
}

export interface ProductImages {
  product_detail_id?: string
  url: string
}
export interface ProductQuery {
  search?: string
  category?: string
  limit?: number
  page?: number
  sort_by?: string
  sort?: string
  min_price?: number
  max_price?: number
  min_rating?: number
  max_rating?: number
  shop_id?: string
  province_ids?: string
  listed_status?: 0 | 1 | 2
}
