export interface RatingProduct {
  rating: number
  count: number
}

export interface TotalRating {
  total_rating: number
  avg_rating: number
  rating_product: RatingProduct[]
}

export interface ProductReview {
  id: string
  user_id: string
  product_id: string
  comment: string
  rating: number
  image_url: string
  created_at: Date
  photo_url: string
  username: string
}
