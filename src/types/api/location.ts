export interface LocationCostRequest {
  destination: number
  weight: number
  shop_id: string
  product_ids: string[]
}

export interface LocationCostResponse {
  shipping_option: LocationCostResponseDetail[] | null
}

export interface LocationCostResponseDetail {
  courier: {
    id: string
    name: string
    code: string
    service: string
    description: string
    created_at: string
  }
  fee: number
  etd: string
}
