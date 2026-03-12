import { useSelector, useDispatch } from "react-redux";
import Layout from "@/components/Layout";
import OrderSummary from "@/components/OrderSummary";
import {
  selectCartItems,
  removeItem,
  updateQuantity,
} from "@/store/slices/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const hasItems = cartItems.length > 0;

  const handleRemove = (productId) => {
    dispatch(removeItem(productId));
  };

  const handleQuantityChange = (productId, value) => {
    const qty = Number(value);
    if (Number.isNaN(qty)) return;
    dispatch(updateQuantity({ productId, quantity: qty }));
  };

  return (
    <Layout>
      <div className="eco-grid eco-grid-2">
        <div className="eco-card" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
          <h2 className="eco-section-title">Your Cart</h2>
          {!hasItems ? (
            <p className="eco-secondary-text">
              Your cart is empty. Go back to the products page to add items.
            </p>
          ) : (
            <div style={{ marginTop: "1rem", flex: 1 }}>
              {cartItems.map((item) => (
                <div key={item.product_id} className="eco-cart-item">
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="eco-cart-image"
                  />
                  <div className="eco-cart-details">
                    <div className="eco-cart-name">
                      {item.product_name}
                    </div>
                    <div className="eco-cart-meta">
                      <label>
                        Qty:&nbsp;
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.product_id,
                              e.target.value
                            )
                          }
                          style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #d1d5db",
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((q) => (
                            <option key={q} value={q}>
                              {q}
                            </option>
                          ))}
                        </select>
                        &nbsp;· ₹{item.product_price}
                      </label>
                    </div>
                    <div className="eco-cart-price">
                      ₹{item.product_price * item.quantity}
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="eco-primary-btn"
                      style={{
                        width: "auto",
                        paddingInline: "1rem",
                        background:
                          "linear-gradient(135deg, #dc2626, #f97316)",
                        boxShadow: "0 10px 20px rgba(220, 38, 38, 0.25)",
                      }}
                      onClick={() => handleRemove(item.product_id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: "1rem" }}>
            <button
              type="button"
              className="eco-primary-btn"
              style={{
                width: "auto",
                paddingInline: "1rem",
                background:
                  "linear-gradient(135deg, #4b5563, #9ca3af)",
                boxShadow: "0 10px 20px rgba(55, 65, 81, 0.25)",
              }}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/";
                }
              }}
            >
              ← Back to Products
            </button>
          </div>
        </div>
        <OrderSummary
          showButton
          buttonLabel="Proceed to Checkout"
          disabled={!hasItems}
          onButtonClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/checkout/shipping";
            }
          }}
        />
      </div>
    </Layout>
  );
}

