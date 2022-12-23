export interface UserData {
  user: UserDetail
}

export interface UserDetail {
  role: 1 | 2 | 3
  user_name: string
  email: string
  phone_number: string
  full_name: string
  gender: 'M' | 'F' | null
  birth_date: string | null
  photo_url: string | null
  is_verify: boolean
}

export interface UserProfilePhotoEditRequest {
  photo: File | undefined
}
