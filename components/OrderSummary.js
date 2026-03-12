import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectShippingFee,
  selectDiscount,
} from "@/store/slices/cartSlice";

export default function OrderSummary({
  showButton = false,
  buttonLabel,
  onButtonClick,
  disabled,
  items: itemsProp,
  shippingFee: shippingFeeProp,
  discountApplied: discountAppliedProp,
}) {
  const itemsFromStore = useSelector(selectCartItems);
  const shippingFeeFromStore = useSelector(selectShippingFee);
  const discountFromStore = useSelector(selectDiscount);

  const items = itemsProp ?? itemsFromStore;
  const shippingFee = shippingFeeProp ?? shippingFeeFromStore;
  const discountApplied = discountAppliedProp ?? discountFromStore;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );
  const grandTotal = subtotal + shippingFee - discountApplied;

  return (
    <div className="eco-card">
      <h2 className="eco-section-title">Order Summary</h2>
      {items.length === 0 ? (
        <p className="eco-secondary-text">
          Your cart is empty. Add some eco-friendly products to get started.
        </p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.product_id} className="eco-cart-item">
              <img
                src={item.image}
                alt={item.product_name}
                className="eco-cart-image"
              />
              <div className="eco-cart-details">
                <div className="eco-cart-name">{item.product_name}</div>
                <div className="eco-cart-meta">
                  Qty: {item.quantity} · ₹{item.product_price}
                </div>
                <div className="eco-cart-price">
                  ₹{item.product_price * item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: "0.75rem", borderTop: "1px solid #e5e7eb", paddingTop: "0.75rem" }}>
        <div className="eco-summary-row muted">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="eco-summary-row muted">
          <span>Shipping</span>
          <span>₹{shippingFee}</span>
        </div>
        {discountApplied > 0 && (
          <div className="eco-summary-row muted">
            <span>Discount</span>
            <span>-₹{discountApplied}</span>
          </div>
        )}
        <div className="eco-summary-row eco-summary-total">
          <span>Grand Total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>
      {showButton && (
        <button
          type="button"
          className="eco-primary-btn"
          onClick={onButtonClick}
          disabled={disabled}
        >
          {buttonLabel}
        </button>
      )}
      <p className="eco-secondary-text">
        Your order supports eco-friendly products and small sustainable businesses.
      </p>
    </div>
  );
}

