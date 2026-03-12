import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shippingAddress: {
    fullName: "",
    email: "",
    phone: "",
    pinCode: "",
    city: "",
    state: "",
  },
  hasAddress: false,
  orderPlaced: false,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    saveShippingAddress(state, action) {
      state.shippingAddress = action.payload;
      state.hasAddress = true;
    },
    markOrderPlaced(state) {
      state.orderPlaced = true;
    },
    resetCheckout(state) {
      state.shippingAddress = initialState.shippingAddress;
      state.hasAddress = false;
      state.orderPlaced = false;
    },
  },
});

export const { saveShippingAddress, markOrderPlaced, resetCheckout } =
  checkoutSlice.actions;

export const selectShippingAddress = (state) => state.checkout.shippingAddress;
export const selectHasAddress = (state) => state.checkout.hasAddress;
export const selectOrderPlaced = (state) => state.checkout.orderPlaced;

export default checkoutSlice.reducer;

