import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurantId: null,
  restaurantName: "",
  items: [],
  pendingItem: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { item, restaurantId, restaurantName } = action.payload;

      // Alag restaurant — conflict store karo, popup dikhega
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.pendingItem = { item, restaurantId, restaurantName };
        return;
      }

      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;

      const existing = state.items.find((i) => i._id === item._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },

    removeFromCart: (state, action) => {
      const index = state.items.findIndex((i) => i._id === action.payload);
      if (index === -1) return;

      if (state.items[index].quantity === 1) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity -= 1;
      }

      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = "";
      }
    },

    confirmClearAndAdd: (state) => {
      const { item, restaurantId, restaurantName } = state.pendingItem;
      state.items = [{ ...item, quantity: 1 }];
      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;
      state.pendingItem = null;
    },

    dismissConflict: (state) => {
      state.pendingItem = null;
    },

    clearCart: () => initialState,
  },
});

export const {
  addToCart,
  removeFromCart,
  confirmClearAndAdd,
  dismissConflict,
  clearCart,
} = cartSlice.actions;

// Selectors callback
export const selectCartItems = (state) => state.cart.items;
export const selectPendingItem = (state) => state.cart.pendingItem;
export const selectCartRestaurantName = (state) => state.cart.restaurantName;

// Helper Function
export const selectTotalItems = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectTotalPrice = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0);

export default cartSlice.reducer;





