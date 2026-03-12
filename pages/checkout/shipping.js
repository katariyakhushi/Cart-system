import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/Layout";
import OrderSummary from "@/components/OrderSummary";
import {
  saveShippingAddress,
  selectShippingAddress,
} from "@/store/slices/checkoutSlice";

export default function ShippingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const savedAddress = useSelector(selectShippingAddress);

  const [form, setForm] = useState(savedAddress);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(savedAddress);
  }, [savedAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (!form.pinCode.trim()) newErrors.pinCode = "PIN code is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(saveShippingAddress(form));
    router.push("/checkout/payment");
  };

  return (
    <Layout>
      <div className="eco-grid eco-grid-2">
        <div className="eco-card">
          <h2 className="eco-section-title">Shipping Address</h2>
          <p className="eco-secondary-text">
            We&apos;ll use this information to deliver your eco-friendly order.
          </p>
          <form
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
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="E.g. Aanya Sharma"
                />
                {errors.fullName && (
                  <span className="eco-error">{errors.fullName}</span>
                )}
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
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <span className="eco-error">{errors.email}</span>
                )}
              </div>

              <div className="eco-field">
                <label className="eco-label" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="eco-input"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                />
                {errors.phone && (
                  <span className="eco-error">{errors.phone}</span>
                )}
              </div>

              <div className="eco-field">
                <label className="eco-label" htmlFor="pinCode">
                  PIN Code
                </label>
                <input
                  id="pinCode"
                  name="pinCode"
                  className="eco-input"
                  value={form.pinCode}
                  onChange={handleChange}
                  placeholder="E.g. 560001"
                />
                {errors.pinCode && (
                  <span className="eco-error">{errors.pinCode}</span>
                )}
              </div>

              <div className="eco-field">
                <label className="eco-label" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  className="eco-input"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                {errors.city && (
                  <span className="eco-error">{errors.city}</span>
                )}
              </div>

              <div className="eco-field">
                <label className="eco-label" htmlFor="state">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  className="eco-input"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                />
                {errors.state && (
                  <span className="eco-error">{errors.state}</span>
                )}
              </div>
            </div>

            <button type="submit" className="eco-primary-btn">
              Continue to Payment
            </button>
          </form>
        </div>

        <OrderSummary />
      </div>
    </Layout>
  );
}

