import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  // Standard shipping fee for the assignment
  shippingFee: 50,
  discountApplied: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const incoming = action.payload;
      const existing = state.items.find(
        (item) => item.product_id === incoming.product_id
      );
      if (existing) {
        existing.quantity += incoming.quantity ?? 1;
      } else {
        state.items.push({
          ...incoming,
          quantity: incoming.quantity ?? 1,
        });
      }
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find(
        (it) => it.product_id === productId
      );
      if (!item) return;
      const nextQty = Number.isFinite(quantity) ? quantity : item.quantity;
      if (nextQty <= 0) {
        state.items = state.items.filter(
          (it) => it.product_id !== productId
        );
      } else {
        item.quantity = nextQty;
      }
    },
    removeItem(state, action) {
      const productId = action.payload;
      state.items = state.items.filter(
        (item) => item.product_id !== productId
      );
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, updateQuantity, removeItem, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectShippingFee = (state) => state.cart.shippingFee;
export const selectDiscount = (state) => state.cart.discountApplied;
export const selectCartCount = (state) =>
  state.cart.items.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0
  );
export const selectSubtotal = (state) =>
  state.cart.items.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );
export const selectGrandTotal = (state) =>
  selectSubtotal(state) + state.cart.shippingFee - state.cart.discountApplied;

export default cartSlice.reducer;

