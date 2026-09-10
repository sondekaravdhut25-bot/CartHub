import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder, verifyPayment, openRazorpayCheckout } from "../services/orderService";
import ErrorMessage from "../components/common/ErrorMessage";

const formatINR = (value) => `₹${value.toLocaleString("en-IN")}`;
const SHIPPING = 60;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: "", city: "", state: "", postalCode: "", country: "India",
  });
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      // 1. Create the order in our DB + a matching Razorpay order
      const orderItems = items.map((i) => ({ product: i.product, quantity: i.quantity }));
      const { order, razorpayOrderId, razorpayKeyId, amount } = await createOrder(orderItems, address);

      // 2. Open Razorpay's checkout modal and wait for the user to pay
      const paymentResponse = await openRazorpayCheckout({
        orderId: order._id,
        razorpayOrderId,
        razorpayKeyId,
        amount,
        user,
      });

      // 3. Verify the payment signature server-side before trusting it
      await verifyPayment(order._id, {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      clearCart();
      navigate("/orders", { state: { justPaid: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display text-2xl text-ink mb-8">Checkout</h1>

      <form onSubmit={handlePay} className="space-y-8">
        {error && <ErrorMessage message={error} />}

        <div>
          <h2 className="text-sm font-medium text-ink mb-4">Shipping address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="street" placeholder="Street address" required value={address.street} onChange={handleChange}
              className="sm:col-span-2 border border-border bg-surface rounded-sm px-3 py-2 text-sm"
            />
            <input
              name="city" placeholder="City" required value={address.city} onChange={handleChange}
              className="border border-border bg-surface rounded-sm px-3 py-2 text-sm"
            />
            <input
              name="state" placeholder="State" required value={address.state} onChange={handleChange}
              className="border border-border bg-surface rounded-sm px-3 py-2 text-sm"
            />
            <input
              name="postalCode" placeholder="Postal code" required value={address.postalCode} onChange={handleChange}
              className="border border-border bg-surface rounded-sm px-3 py-2 text-sm"
            />
            <input
              name="country" value={address.country} onChange={handleChange} disabled
              className="border border-border bg-surface rounded-sm px-3 py-2 text-sm text-ink/50"
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-ink mb-4">Order summary</h2>
          <div className="border border-border rounded-sm divide-y divide-border">
            {items.map((i) => (
              <div key={i.product} className="flex justify-between px-4 py-3 text-sm">
                <span className="text-ink/70">{i.name} × {i.quantity}</span>
                <span className="text-ink">{formatINR(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-ink/70 mt-3">
            <span>Shipping</span>
            <span>{formatINR(SHIPPING)}</span>
          </div>
          <div className="flex justify-between text-base text-ink font-medium mt-1">
            <span>Total</span>
            <span>{formatINR(subtotal + SHIPPING)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full bg-ink text-base text-sm py-3 rounded-sm hover:bg-clay-dark transition-colors disabled:opacity-50"
        >
          {processing ? "Processing…" : `Pay ${formatINR(subtotal + SHIPPING)}`}
        </button>

        <p className="text-xs text-ink/40 text-center">
          Test mode — use Razorpay's test card 4111 1111 1111 1111, any future expiry, any CVV.
        </p>
      </form>
    </div>
  );
}
