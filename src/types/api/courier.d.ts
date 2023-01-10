export interface CourierList {
  rows: CourierData[]
}

export interface CourierData {
  shop_courier_id: string
  courier_id: string
  name: string
  code: string
  service: string
  description: string
  deleted_at: string
  logo: string
}
