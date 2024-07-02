import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  loginSuccess: false,
  registerSuccess: false,
  todoInput: "",
  todoItemArray: [],
};

export const appSlice = createSlice({
  name: "appslice",
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload;
      return {
        ...state,
        [field]: value,
      };
    },
    resetRedux: (state) => initialState,
  },
});

export const { setField, resetRedux } = appSlice.actions;

export default appSlice.reducer;
