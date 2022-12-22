export interface UserData {
  user: UserDetail
}

export interface UserDetail {
  id: string
  email: string
  fullname: string
  username: string
  phone_no: string
  gender: 'M' | 'F'
  birth_date: string
  photo_url: string
}

export interface UserProfilePhotoEditRequest {
  photo: File | undefined
}
