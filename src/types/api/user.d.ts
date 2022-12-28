export interface UserData {
  user: UserDetail
}

export interface UserDetail {
  id: string
  email: string
  full_name: string
  user_name: string
  phone_number: string
  gender: 'M' | 'F'
  birth_date: string
  photo_url: string
}

export interface UserProfilePhotoEditRequest {
  photo: File | undefined
}

export interface IUserResponse {
  message: string
  data: IUserData
}
export interface IUserData {
  user: IUserDetail
}
export interface IUserDetail {
  id: string
  email: string
  fullname: string
  username: string
  phone_no: string
  gender: string
  birth_date: string
  photo_url: string
}

export interface IUserUploadPhotoProfile {
  photo_url: File | undefined
}
