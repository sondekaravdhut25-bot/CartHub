import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItem from "../components/cart/CartItem";

const formatINR = (value) => `₹${value.toLocaleString("en-IN")}`;
const SHIPPING = 60;

export default function Cart() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate(user ? "/checkout" : "/login?redirect=/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h1 className="font-display text-2xl text-ink mb-3">Your cart is empty</h1>
        <p className="text-ink/60 mb-8">Nothing to check out yet — go find something worth the shelf space.</p>
        <Link to="/shop" className="bg-ink text-base text-sm px-6 py-3 rounded-sm hover:bg-clay-dark transition-colors">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display text-2xl text-ink mb-8">Your cart</h1>

      <div>
        {items.map((item) => (
          <CartItem key={item.product} item={item} />
        ))}
      </div>

      <div className="mt-8 space-y-2">
        <div className="flex justify-between text-sm text-ink/70">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-ink/70">
          <span>Shipping</span>
          <span>{formatINR(SHIPPING)}</span>
        </div>
        <div className="flex justify-between text-base text-ink pt-2 border-t border-border font-medium">
          <span>Total</span>
          <span>{formatINR(subtotal + SHIPPING)}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full mt-8 bg-ink text-base text-sm py-3 rounded-sm hover:bg-clay-dark transition-colors"
      >
        Proceed to checkout
      </button>
    </div>
  );
}
