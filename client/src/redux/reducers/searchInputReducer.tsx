import { createSlice } from '@reduxjs/toolkit'


const initialState : string = "";

export const searchInputSlice = createSlice({
  name: 'searchInput',
  initialState,
  reducers: {
    setInput: (state,action) => {
      state = action.payload
      return state;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setInput } = searchInputSlice.actions

export default searchInputSlice.reducer