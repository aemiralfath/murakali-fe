export interface SellerInfo {
  id: string
  user_id: string
  name: string
  total_product: number
  total_rating: number
  rating_avg: number
  photo_url: string
  created_at: Date
}

export interface SellerOrderStatus {
  order_id: string
  order_status_id: number
}

export interface UpdateNoResiSellerOrder {
  order_id: string
  resi_no: string
  courier_etd: string
}

export interface SellerDetailInfomation {
  id: string
  name: string
  total_product: number
  total_rating: number
  rating_avg: number
  photo_url: string
  created_at: Date
}
