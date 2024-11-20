import { createSlice } from '@reduxjs/toolkit'


const initialState : any[] = [];

export const departmentSlicer = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    getDepartments: (state,action) => {
      state = action.payload
      return state;
    }
  },
})

// Action creators are generated for each case reducer function
export const { getDepartments } = departmentSlicer.actions

export default departmentSlicer.reducer