type DataWrapperBase<T> = {
  data: T
  isLoading: false
}

type DataWrapperLoading = {
  data?: undefined
  isLoading: true
}

type LoadingDataWrapper<T> = DataWrapperBase<T> | DataWrapperLoading
