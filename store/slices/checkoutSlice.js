import { createSlice } from "@reduxjs/toolkit";

const createId = () => {
  // eslint-disable-next-line no-undef
  const hasCrypto = typeof crypto !== "undefined";
  if (hasCrypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `addr_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const createEmptyAddress = () => ({
  id: createId(),
  fullName: "",
  email: "",
  phone: "",
  pinCode: "",
  city: "",
  state: "",
});

const normalizeAddress = (value) => {
  if (!value || typeof value !== "object") return null;
  const addr = value;
  return {
    id: typeof addr.id === "string" && addr.id ? addr.id : createId(),
    fullName: typeof addr.fullName === "string" ? addr.fullName : "",
    email: typeof addr.email === "string" ? addr.email : "",
    phone: typeof addr.phone === "string" ? addr.phone : "",
    pinCode: typeof addr.pinCode === "string" ? addr.pinCode : "",
    city: typeof addr.city === "string" ? addr.city : "",
    state: typeof addr.state === "string" ? addr.state : "",
  };
};

const initialEmptyAddress = createEmptyAddress();

const initialState = {
  shippingAddresses: [initialEmptyAddress],
  selectedShippingAddressId: initialEmptyAddress.id,
  orderPlaced: false,
  placedOrderItems: [],
  placedOrderShippingFee: 50,
  placedOrderDiscountApplied: 0,
};

const isNonEmpty = (v) => typeof v === "string" && v.trim().length > 0;

const isAddressComplete = (addr) => {
  if (!addr) return false;
  // Keep this in sync with the shipping form validation.
  return (
    isNonEmpty(addr.fullName) &&
    isNonEmpty(addr.email) &&
    isNonEmpty(addr.phone) &&
    isNonEmpty(addr.pinCode) &&
    isNonEmpty(addr.city) &&
    isNonEmpty(addr.state) &&
    /^\d{10}$/.test(addr.phone.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.email.trim())
  );
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    hydrateCheckout(state, action) {
      const payload = action.payload || {};
      const hydratedAddresses = Array.isArray(payload.shippingAddresses)
        ? payload.shippingAddresses
            .map(normalizeAddress)
            .filter(Boolean)
        : [];

      const normalized = hydratedAddresses.length
        ? hydratedAddresses
        : [createEmptyAddress()];

      state.shippingAddresses = normalized;
      state.selectedShippingAddressId = normalized.find(
        (a) => a.id === payload.selectedShippingAddressId
      )
        ? payload.selectedShippingAddressId
        : normalized[0].id;
      state.orderPlaced = Boolean(payload.orderPlaced);
    },
    addShippingAddress(state) {
      const next = createEmptyAddress();
      state.shippingAddresses.push(next);
      state.selectedShippingAddressId = next.id;
    },
    updateShippingAddress(state, action) {
      const { id, changes } = action.payload || {};
      const addr = state.shippingAddresses.find((a) => a.id === id);
      if (!addr || !changes || typeof changes !== "object") return;
      Object.assign(addr, changes);
    },
    removeShippingAddress(state, action) {
      const id = action.payload;
      const remaining = state.shippingAddresses.filter((a) => a.id !== id);

      if (!remaining.length) {
        const fresh = createEmptyAddress();
        state.shippingAddresses = [fresh];
        state.selectedShippingAddressId = fresh.id;
        return;
      }

      state.shippingAddresses = remaining;
      if (!remaining.some((a) => a.id === state.selectedShippingAddressId)) {
        state.selectedShippingAddressId = remaining[0].id;
      }
    },
    selectShippingAddress(state, action) {
      const id = action.payload;
      if (state.shippingAddresses.some((a) => a.id === id)) {
        state.selectedShippingAddressId = id;
      }
    },
    markOrderPlaced(state, action) {
      state.orderPlaced = true;
      const payload = action.payload || {};
      state.placedOrderItems = Array.isArray(payload.items) ? payload.items : [];
      state.placedOrderShippingFee =
        typeof payload.shippingFee === "number"
          ? payload.shippingFee
          : state.placedOrderShippingFee;
      state.placedOrderDiscountApplied =
        typeof payload.discountApplied === "number"
          ? payload.discountApplied
          : state.placedOrderDiscountApplied;
    },
    resetCheckout(state) {
      const fresh = createEmptyAddress();
      state.shippingAddresses = [fresh];
      state.selectedShippingAddressId = fresh.id;
      state.orderPlaced = false;
      state.placedOrderItems = [];
      state.placedOrderShippingFee = 50;
      state.placedOrderDiscountApplied = 0;
    },
  },
});

export const {
  hydrateCheckout,
  addShippingAddress,
  updateShippingAddress,
  removeShippingAddress,
  selectShippingAddress,
  markOrderPlaced,
  resetCheckout,
} = checkoutSlice.actions;

export const selectShippingAddresses = (state) =>
  state.checkout.shippingAddresses;

export const selectSelectedShippingAddressId = (state) =>
  state.checkout.selectedShippingAddressId;

export const selectSelectedShippingAddress = (state) => {
  const selectedId = state.checkout.selectedShippingAddressId;
  return (
    state.checkout.shippingAddresses.find((a) => a.id === selectedId) ||
    null
  );
};

export const selectOrderPlaced = (state) => state.checkout.orderPlaced;

export const selectPlacedOrderItems = (state) => state.checkout.placedOrderItems;
export const selectPlacedOrderShippingFee = (state) =>
  state.checkout.placedOrderShippingFee;
export const selectPlacedOrderDiscountApplied = (state) =>
  state.checkout.placedOrderDiscountApplied;

export const selectIsSelectedShippingAddressComplete = (state) =>
  isAddressComplete(selectSelectedShippingAddress(state));

export default checkoutSlice.reducer;

