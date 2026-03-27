import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/Layout";
import OrderSummary from "@/components/OrderSummary";
import BottomActionBar from "@/components/BottomActionBar";
import {
  selectSelectedShippingAddress,
  selectIsSelectedShippingAddressComplete,
  selectOrderPlaced,
  markOrderPlaced,
  selectPlacedOrderDiscountApplied,
  selectPlacedOrderItems,
  selectPlacedOrderShippingFee,
  resetCheckout,
} from "@/store/slices/checkoutSlice";
import {
  clearCart,
  selectCartItems,
  selectDiscount,
  selectShippingFee,
} from "@/store/slices/cartSlice";

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const shippingAddress = useSelector(selectSelectedShippingAddress);
  const isAddressComplete = useSelector(
    selectIsSelectedShippingAddressComplete
  );
  const orderPlaced = useSelector(selectOrderPlaced);
  const cartItems = useSelector(selectCartItems);
  const shippingFee = useSelector(selectShippingFee);
  const discountApplied = useSelector(selectDiscount);

  const placedItems = useSelector(selectPlacedOrderItems);
  const placedShippingFee = useSelector(selectPlacedOrderShippingFee);
  const placedDiscountApplied = useSelector(selectPlacedOrderDiscountApplied);

  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    // Guard against direct navigation to payment without valid shipping details.
    if (!orderPlaced && !isAddressComplete) {
      router.replace("/checkout/shipping");
    }
  }, [isAddressComplete, orderPlaced, router]);

  const handlePay = () => {
    if (isPaying) return;
    if (!isAddressComplete) return;

    setIsPaying(true);
    // Simulate payment success.
    dispatch(
      markOrderPlaced({
        items: cartItems,
        shippingFee,
        discountApplied,
      })
    );
    dispatch(clearCart());
    setIsPaying(false);
  };

  const handleBackToShipping = () => {
    router.push("/checkout/shipping");
  };

  const handleBackToCart = () => {
    dispatch(resetCheckout());
    router.push("/cart");
  };

  const handleStartNewOrder = () => {
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
                  <div>{shippingAddress?.fullName}</div>
                  <div>
                    {shippingAddress?.city}, {shippingAddress?.state} -{" "}
                    {shippingAddress?.pinCode}
                  </div>
                  <div>
                    {shippingAddress?.email} · {shippingAddress?.phone}
                  </div>
                </div>
                <div style={{ marginTop: "0.75rem" }}>
                  <span className="eco-pill">
                    UPI / Card / Netbanking (simulated)
                  </span>
                </div>
              </div>

              <div style={{ marginTop: "1.25rem" }}>
                <span className="eco-secondary-text">
                  Use the sticky <b>Next Step</b> button below to complete payment.
                </span>
              </div>
            </>
          ) : (
            <div className="eco-order-success">
              <div className="eco-order-badge">✓</div>
              <div className="eco-order-title">Order Successful!</div>
              <div className="eco-order-subtitle">
                Thank you for choosing sustainable products. A confirmation email
                will arrive shortly.
              </div>

              <div style={{ marginTop: "1.1rem" }}>
                <h3 className="eco-section-title" style={{ fontSize: "1rem" }}>
                  Delivered To
                </h3>
                <div className="eco-secondary-text" style={{ marginTop: "0.25rem" }}>
                  <div>{shippingAddress?.fullName}</div>
                  <div>
                    {shippingAddress?.city}, {shippingAddress?.state} -{" "}
                    {shippingAddress?.pinCode}
                  </div>
                  <div>
                    {shippingAddress?.email} · {shippingAddress?.phone}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <OrderSummary
          items={orderPlaced ? placedItems : undefined}
          shippingFee={orderPlaced ? placedShippingFee : undefined}
          discountApplied={orderPlaced ? placedDiscountApplied : undefined}
        />
      </div>

      <div className="eco-bottom-actions-spacer" />
      <BottomActionBar
        backLabel={orderPlaced ? "Back to Cart" : "← Back to Shipping"}
        onBack={orderPlaced ? handleBackToCart : handleBackToShipping}
        nextLabel={orderPlaced ? "Start New Order" : "Pay Securely"}
        nextDisabled={orderPlaced ? false : !isAddressComplete || isPaying}
        onNext={orderPlaced ? handleStartNewOrder : handlePay}
      />
    </Layout>
  );
}

