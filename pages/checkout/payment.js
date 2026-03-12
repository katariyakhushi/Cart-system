import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/Layout";
import OrderSummary from "@/components/OrderSummary";
import {
  selectShippingAddress,
  selectHasAddress,
  selectOrderPlaced,
  markOrderPlaced,
  resetCheckout,
} from "@/store/slices/checkoutSlice";
import { clearCart } from "@/store/slices/cartSlice";

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const shippingAddress = useSelector(selectShippingAddress);
  const hasAddress = useSelector(selectHasAddress);
  const orderPlaced = useSelector(selectOrderPlaced);

  if (!hasAddress && typeof window !== "undefined") {
    router.replace("/checkout/shipping");
  }

  const handlePay = () => {
    // Simulate payment success
    dispatch(markOrderPlaced());
    dispatch(clearCart());
  };

  const handleBackToHome = () => {
    dispatch(resetCheckout());
    router.push("/");
  };

  return (
    <Layout>
      <div className="eco-grid eco-grid-2">
        <div className="eco-card">
          {!orderPlaced ? (
            <>
              <h2 className="eco-section-title">Payment Method</h2>
              <p className="eco-secondary-text">
                For this assignment, we&apos;ll simulate a secure payment.
              </p>

              <div style={{ marginTop: "1rem" }}>
                <h3 className="eco-section-title" style={{ fontSize: "1rem" }}>
                  Shipping To
                </h3>
                <div className="eco-secondary-text" style={{ marginTop: "0.25rem" }}>
                  <div>{shippingAddress.fullName}</div>
                  <div>
                    {shippingAddress.city}, {shippingAddress.state} -{" "}
                    {shippingAddress.pinCode}
                  </div>
                  <div>
                    {shippingAddress.email} · {shippingAddress.phone}
                  </div>
                </div>
                <div style={{ marginTop: "0.75rem" }}>
                  <span className="eco-pill">UPI / Card / Netbanking (simulated)</span>
                </div>
              </div>

              <button
                type="button"
                className="eco-primary-btn"
                onClick={handlePay}
                style={{ marginTop: "1.25rem" }}
              >
                Pay Securely
              </button>
            </>
          ) : (
            <div className="eco-order-success">
              <div className="eco-order-badge">✓</div>
              <div className="eco-order-title">Order Successful!</div>
              <div className="eco-order-subtitle">
                Thank you for choosing sustainable products. A confirmation email
                will arrive shortly.
              </div>
              <button
                type="button"
                className="eco-primary-btn"
                onClick={handleBackToHome}
                style={{ marginTop: "1.25rem", maxWidth: 260 }}
              >
                Back to Cart
              </button>
            </div>
          )}
        </div>

        <OrderSummary />
      </div>
    </Layout>
  );
}

