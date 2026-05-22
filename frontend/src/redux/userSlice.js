import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
    city: null,
    state: null,
    address: null,
    shopInMyCity: [],
    favourites: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false; // ← data aane pe false
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setFavourites: (state, action) => {
      state.favourites = action.payload;
    },
    toggleFavouriteLocal: (state, action) => {
      const shopId = action.payload.toString();
      const index = state.favourites.indexOf(shopId);
      if (index === -1) {
        state.favourites.push(shopId);
      } else {
        state.favourites.splice(index, 1);
      }
    },
  },
});

export const {
  setUserData,
  setLoading,
  setCity,
  setState,
  setShopInMyCity,
  setAddress,
  setFavourites,
  toggleFavouriteLocal,
} = userSlice.actions;
export default userSlice.reducer;