export interface CategoryData {
  id: string
  parent_id: string
  name: string
  photo_url: string
  child_category: CategoryData[]
}
