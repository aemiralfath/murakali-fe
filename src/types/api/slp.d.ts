export interface SLPUser {
  card_number: string
  name: string
  is_default: boolean
  active_date: string
}

export interface SLPPayment {
  redirect_url: string
}
