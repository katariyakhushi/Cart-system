import "@/styles/globals.css";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { hydrateCheckout } from "@/store/slices/checkoutSlice";

const STORAGE_KEY = "eco-checkout-checkout-v1";

const hasAnyAddressValue = (addresses) => {
  if (!Array.isArray(addresses)) return false;
  return addresses.some((addr) => {
    const values = [
      addr?.fullName,
      addr?.email,
      addr?.phone,
      addr?.pinCode,
      addr?.city,
      addr?.state,
    ];
    return values.some((v) => typeof v === "string" && v.trim().length > 0);
  });
};

function CheckoutPersistenceGate({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch(hydrateCheckout(parsed));
      }
    } catch {
      // Ignore localStorage errors (private mode, corrupted payload, etc.)
    }

    let timeoutId = null;
    const unsubscribe = store.subscribe(() => {
      try {
        const checkout = store.getState().checkout;
        const shouldPersist =
          checkout.orderPlaced || hasAnyAddressValue(checkout.shippingAddresses);

        if (!shouldPersist) {
          window.localStorage.removeItem(STORAGE_KEY);
          return;
        }

        const payload = {
          shippingAddresses: checkout.shippingAddresses,
          selectedShippingAddressId: checkout.selectedShippingAddressId,
          orderPlaced: checkout.orderPlaced,
        };

        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        }, 250);
      } catch {
        // Ignore persistence failures.
      }
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [dispatch]);

  return children;
}

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <CheckoutPersistenceGate>
        <Component {...pageProps} />
      </CheckoutPersistenceGate>
    </Provider>
  );
}

