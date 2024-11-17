import { createSlice } from '@reduxjs/toolkit'


const initialState : any[] = [];

export const officeSlicer = createSlice({
  name: 'office',
  initialState,
  reducers: {
    getOffices: (state,action) => {
      state = action.payload
      return state;
    }
  },
})

// Action creators are generated for each case reducer function
export const { getOffices } = officeSlicer.actions

export default officeSlicer.reducer