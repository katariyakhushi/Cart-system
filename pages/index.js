import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/Layout";
import { addItem, selectCartCount } from "@/store/slices/cartSlice";
import bambooImg from "@/src/Images/bamboo.webp";
import bagsImg from "@/src/Images/bags.jpg";

export default function ProductsPage({ products }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const safeProducts = Array.isArray(products) ? products : [];
  const cartCount = useSelector(selectCartCount);
  const hasItems = cartCount > 0;

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
              <div className="eco-product-actions">
                <button
                  type="button"
                  className="eco-secondary-btn eco-product-card-btn"
                  onClick={() => dispatch(addItem(product))}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="eco-bottom-actions-spacer" />
      <div className="eco-bottom-actions" role="region" aria-label="Products actions">
        <div className="eco-bottom-actions-inner">
          <div className="eco-bottom-actions-buttons eco-bottom-actions-buttons-single">
            <button
              type="button"
              className="eco-primary-btn eco-bottom-next-btn"
              disabled={!hasItems}
              onClick={() => router.push("/cart")}
            >
              {hasItems ? `Proceed to cart (${cartCount})` : "Proceed to cart"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  try {
    const proto = req?.headers?.["x-forwarded-proto"] ?? "http";
    const host = req?.headers?.host;
    const baseUrl = host ? `${proto}://${host}` : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/cart`);
    const data = await res.json();

    return {
      props: {
        products: (data.cartItems || []).map((p) => {
          if (p?.product_id === 101) return { ...p, image: bambooImg.src };
          if (p?.product_id === 102) return { ...p, image: bagsImg.src };
          return p;
        }),
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

