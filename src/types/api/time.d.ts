export type NullableTime =
  | {
      Time: null
      Valid: false
    }
  | {
      Time: string
      Valid: true
    }
