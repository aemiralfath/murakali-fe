type DataWrapperBase<T> = {
  data: T
  isLoading: false
}

type DataWrapperLoading = {
  data: undefined
  isLoading: true
}

type DataWrapper<T> = DataWrapperBase<T> | DataWrapperLoading
