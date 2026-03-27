import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectCartCount } from "@/store/slices/cartSlice";
import logoImg from "@/src/Images/logo.jpg";

const steps = [
  { id: "products", label: "Products", href: "/" },
  { id: "cart", label: "Cart", href: "/cart" },
  { id: "shipping", label: "Shipping", href: "/checkout/shipping" },
  { id: "payment", label: "Payment", href: "/checkout/payment" },
];

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = router.pathname;
  const cartCount = useSelector(selectCartCount);

  const activeStep =
    pathname === "/"
      ? "products"
      : pathname === "/cart"
      ? "cart"
      : pathname.startsWith("/checkout/shipping")
      ? "shipping"
      : pathname.startsWith("/checkout/payment")
      ? "payment"
      : null;

  return (
    <div className="eco-layout">
      <header className="eco-header">
        <a className="eco-brand eco-brand-link" href="/" aria-label="Go to products">
          <img className="eco-brand-logo" src={logoImg.src} alt="Ecoyaan" />
          <div className="eco-brand-text">
            <div className="eco-brand-name">Ecoyaan</div>
          </div>
        </a>
        <nav className="eco-steps">
          {steps.map((step) => (
            <Link key={step.id} href={step.href}>
              <div
                className={`eco-step ${
                  activeStep === step.id ? "" : "inactive"
                }`}
                style={{ cursor: "pointer" }}
              >
                <span>
                  {step.label}
                  {step.id === "cart" && cartCount > 0
                    ? ` (${cartCount})`
                    : ""}
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </header>
      <main className="eco-main">{children}</main>
    </div>
  );
}

