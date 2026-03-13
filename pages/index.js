import { useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "@/components/Layout";
import { addItem } from "@/store/slices/cartSlice";

export default function ProductsPage({ products }) {
  const safeProducts = Array.isArray(products) ? products : [];
  const dispatch = useDispatch();
  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = (product) => {
    dispatch(addItem(product));
    setAddingId(product.product_id);
    setTimeout(() => {
      setAddingId(null);
    }, 600);
  };

  return (
    <Layout>
      <div className="eco-card">
        <h2 className="eco-section-title">Products</h2>
        <p className="eco-secondary-text">
          Start your eco-friendly journey by adding products to your cart.
        </p>
        <div style={{ marginTop: "1rem" }}>
          {safeProducts.map((product) => (
            <div key={product.product_id} className="eco-cart-item">
              <img
                src={product.image}
                alt={product.product_name}
                className="eco-cart-image"
              />
              <div className="eco-cart-details">
                <div className="eco-cart-name">
                  {product.product_name}
                </div>
                <div className="eco-cart-meta">
                  ₹{product.product_price} · Qty per add: {product.quantity}
                </div>
                <div className="eco-cart-price">
                  ₹{product.product_price}
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className="eco-primary-btn"
                  style={{ width: "auto", paddingInline: "1rem" }}
                  disabled={addingId === product.product_id}
                  onClick={() => handleAddToCart(product)}
                >
                  {addingId === product.product_id ? "Added ✓" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch(`https://cart-system-sage.vercel.app/api/cart`);
    const data = await res.json();

    return {
      props: {
        products: data.cartItems,
      },
    };
  } catch (e) {
    return {
      props: {
        products: [],
      },
    };
  }
}

