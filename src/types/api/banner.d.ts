export interface BannerData {
  id: string
  title: string
  content: string
  image_url: string
  page_url: string
  is_active: boolean
}

export interface UpdateBannerData {
  id: string
  is_active: boolean
}
