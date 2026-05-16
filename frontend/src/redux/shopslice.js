import { createSlice } from "@reduxjs/toolkit";

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    shopData: null,
  },
  reducers: {
    setShopData: (state, action) => {
      state.shopData = action.payload;
    },

    addShop: (state, action) => {
      state.shopData.push(action.payload);
    },

    removeShop: (state, action) => {
      state.shopData = state.shopData.filter(
        (shop) => shop._id !== action.payload,
      );
    },

    updateShop: (state, action) => {
      if (!state.shopData) return;
      const index = state.shopData.findIndex(
        (shop) => shop._id === action.payload._id,
      );
      if (index !== -1) {
        state.shopData[index] = {
          ...state.shopData[index],
          ...action.payload,
        };
      }
    },

    addItemToShop: (state, action) => {
      const { shopId, item } = action.payload;
      const shop = state.shopData.find((s) => s._id === shopId);
      if (shop) {
        shop.items.push(item);
      }
    },

    updateItemInShop: (state, action) => {
      const { shopId, updatedItem } = action.payload;
      const shop = state.shopData.find((s) => s._id === shopId);
      if (shop) {
        const index = shop.items.findIndex((i) => i._id === updatedItem._id);
        if (index !== -1) {
          shop.items[index] = updatedItem;
        }
      }
    },

    removeItemFromShop: (state, action) => {
      const { shopId, itemId } = action.payload;
      const shop = state.shopData.find((s) => s._id === shopId);
      if (shop) {
        shop.items = shop.items.filter((item) => item._id !== itemId);
      }
    },

    clearShopState: (state) => {
      state.shopData = null;
    },
  },
});

export const {
  setShopData,
  addShop,
  removeShop,
  updateShop,
  addItemToShop,
  updateItemInShop,
  removeItemFromShop,
  clearShopState,
} = shopSlice.actions;

export default shopSlice.reducer;