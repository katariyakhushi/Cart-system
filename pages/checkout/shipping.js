import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/Layout";
import OrderSummary from "@/components/OrderSummary";
import BottomActionBar from "@/components/BottomActionBar";
import {
  addShippingAddress,
  removeShippingAddress,
  selectShippingAddress,
  selectShippingAddresses,
  selectIsSelectedShippingAddressComplete,
  selectSelectedShippingAddress,
  updateShippingAddress,
} from "@/store/slices/checkoutSlice";

const validateShippingAddress = (addr) => {
  const newErrors = {};
  if (!addr) return newErrors;

  if (!addr.fullName.trim()) newErrors.fullName = "Full name is required";
  if (!addr.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.email)) {
    newErrors.email = "Enter a valid email";
  }
  if (!addr.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(addr.phone)) {
    newErrors.phone = "Phone must be 10 digits";
  }
  if (!addr.pinCode.trim()) newErrors.pinCode = "PIN code is required";
  if (!addr.city.trim()) newErrors.city = "City is required";
  if (!addr.state.trim()) newErrors.state = "State is required";

  return newErrors;
};

export default function ShippingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const shippingAddresses = useSelector(selectShippingAddresses);
  const selectedAddress = useSelector(selectSelectedShippingAddress);
  const isSelectedComplete = useSelector(selectIsSelectedShippingAddressComplete);

  const [errors, setErrors] = useState({});

  const selectedId = selectedAddress?.id;
  const canRemove = shippingAddresses.length > 1 && !!selectedId;

  const getChipLabel = (addr, index) => {
    const name = addr?.fullName?.trim();
    if (name) return name.split(/\s+/)[0];
    return `Address ${index + 1}`;
  };

  const handleChange = (name, value) => {
    if (!selectedId) return;
    dispatch(updateShippingAddress({ id: selectedId, changes: { [name]: value } }));
    if (Object.keys(errors).length) setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateShippingAddress(selectedAddress);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    router.push("/checkout/payment");
  };

  return (
    <Layout>
      <div className="eco-grid eco-grid-2">
        <div className="eco-card">
          <h2 className="eco-section-title">Shipping Addresses</h2>
          <p className="eco-secondary-text">
            Add one or more addresses. Pick the one you want to use, then continue to payment.
          </p>

          <div style={{ marginTop: "1rem" }}>
            <div className="eco-address-chips" aria-label="Saved addresses">
              {shippingAddresses.map((addr, index) => {
                const active = addr.id === selectedId;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    className={`eco-address-chip ${active ? "active" : ""}`}
                    onClick={() => {
                      dispatch(selectShippingAddress(addr.id));
                      setErrors({});
                    }}
                    aria-pressed={active}
                  >
                    {getChipLabel(addr, index)}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="eco-ghost-btn"
                onClick={() => {
                  dispatch(addShippingAddress());
                  setErrors({});
                }}
              >
                + Add address
              </button>

              <button
                type="button"
                className="eco-ghost-btn danger"
                disabled={!canRemove}
                onClick={() => {
                  if (!canRemove) return;
                  dispatch(removeShippingAddress(selectedId));
                  setErrors({});
                }}
              >
                Remove selected
              </button>
            </div>
          </div>

          <form
            id="shipping-address-form"
            onSubmit={handleSubmit}
            style={{ marginTop: "1rem" }}
            noValidate
          >
            <div className="eco-form-grid eco-form-grid-2">
              <div className="eco-field" style={{ gridColumn: "1 / -1" }}>
                <label className="eco-label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  className="eco-input"
                  value={selectedAddress?.fullName ?? ""}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="E.g. Aanya Sharma"
                  autoComplete="name"
                />
                {errors.fullName && <span className="eco-error">{errors.fullName}</span>}
              </div>

              <div className="eco-field">
                <label className="eco-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="eco-input"
                  value={selectedAddress?.email ?? ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && <span className="eco-error">{errors.email}</span>}
              </div>

              <div className="eco-field">
                <label className="eco-label" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="eco-input"
                  value={selectedAddress?.phone ?? ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="10-digit mobile"
                  inputMode="numeric"
                  autoComplete="tel"
                />
                {errors.phone && <span className="eco-error">{errors.phone}</span>}
              </div>

              <div className="eco-field">
                <label className="eco-label" htmlFor="pinCode">
                  PIN Code
                </label>
                <input
                  id="pinCode"
                  name="pinCode"
                  className="eco-input"
                  value={selectedAddress?.pinCode ?? ""}
                  onChange={(e) => handleChange("pinCode", e.target.value)}
                  placeholder="E.g. 560001"
                  inputMode="numeric"
                />
                {errors.pinCode && <span className="eco-error">{errors.pinCode}</span>}
              </div>

              <div className="eco-field">
                <label className="eco-label" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  className="eco-input"
                  value={selectedAddress?.city ?? ""}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="City"
                  autoComplete="address-level2"
                />
                {errors.city && <span className="eco-error">{errors.city}</span>}
              </div>

              <div className="eco-field">
                <label className="eco-label" htmlFor="state">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  className="eco-input"
                  value={selectedAddress?.state ?? ""}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="State"
                  autoComplete="address-level1"
                />
                {errors.state && <span className="eco-error">{errors.state}</span>}
              </div>
            </div>
          </form>
        </div>

        <OrderSummary />
      </div>

      <div className="eco-bottom-actions-spacer" />
      <BottomActionBar
        backLabel="← Back to Cart"
        onBack={() => router.push("/cart")}
        nextLabel="Next Step"
        nextDisabled={!selectedAddress || !isSelectedComplete}
        nextButtonProps={{ type: "submit", form: "shipping-address-form" }}
      />
    </Layout>
  );
}

