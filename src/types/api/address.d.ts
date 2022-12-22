export interface AddressData {
  limit: number
  page: number
  sort: string
  total_rows: number
  total_pages: number
  rows: AddressDetail[]
}

export interface AddressDetail {
  id: string
  user_id: string
  name: string
  province_id: number
  city_id: number
  province: string
  city: string
  district: string
  sub_district: string
  address_detail: string
  zip_code: string
  is_default: boolean
  is_shop_default: boolean
}

export interface Province {
  rows: ProvinceDetail[]
}
export interface ProvinceDetail {
  province_id: string
  province: string
}

export interface City {
  rows: CityDetail[]
}
export interface CityDetail {
  city_id: string
  city: string
}

export interface SubDistrict {
  rows: SubDistrictDetail[]
}
export interface SubDistrictDetail {
  sub_district: string
}

export interface Urban {
  rows: UrbanDetail[]
}
export interface UrbanDetail {
  urban: string
  postalcode: string
}

export interface FetchParamInfo {
  province: string
  city: string
  sub_district: string
  urban: string
}
