export interface PerformanceData {
  shop_id: string
  shop_name: string
  shop_created_at: string
  report_updated_at: string
  daily_sales: DailySales[]
  daily_order: DailyOrder[]
  monthly_order: MonthlyOrder
  total_rating: TotalRating
  most_ordered_product: ReportBriefProduct[]
  num_order_by_province: OrdersByProvince[]
  total_sales: TotalSales
}

export interface DailySales {
  date: string
  total_sales: number
}

export interface DailyOrder {
  date: string
  success_order: number
  failed_order: number
}

export interface MonthlyOrder {
  month: string
  success_order: number
  failed_order: number
  success_order_percent_change: number | null
  failed_order_percent_change: number | null
}

export interface TotalRating {
  rating_1: number
  rating_2: number
  rating_3: number
  rating_4: number
  rating_5: number
}

export interface ReportBriefProduct {
  id: string
  title: string
  view_count: number
  unit_sold: number
  thumbnail_url: string
}

export interface OrdersByProvince {
  province_id: number
  num_orders: number
}

export interface TotalSales {
  total_sales: number
  withdrawn_sum: number
  withdrawable_sum: number
}
