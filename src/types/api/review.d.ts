export interface RatingProduct {
  rating: number
  count: number
}

export interface TotalRating {
  total_rating: number
  avg_rating: number
  rating_product: RatingProduct[]
}
