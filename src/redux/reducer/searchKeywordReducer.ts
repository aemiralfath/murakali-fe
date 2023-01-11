import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SearchkeywordState {
  keyword: string
}

const initialState: SearchkeywordState = {
  keyword: '',
}

export const SearchkeywordSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchingKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload
    },
  },
})

export const { searchingKeyword } = SearchkeywordSlice.actions
export default SearchkeywordSlice.reducer
