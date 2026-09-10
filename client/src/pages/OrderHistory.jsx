import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const formatINR = (value) => `₹${value.toLocaleString("en-IN")}`;

const statusColor = {
  pending: "text-ink/50",
  processing: "text-clay",
  shipped: "text-sage",
  delivered: "text-sage-dark",
  cancelled: "text-rust",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display text-2xl text-ink mb-8">Your orders</h1>
      {error && <ErrorMessage message={error} />}

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink/60 mb-6">No orders yet.</p>
          <Link to="/shop" className="text-sm text-clay hover:text-clay-dark">Start shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-border rounded-sm p-5">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-ink/50">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span className={`capitalize font-medium ${statusColor[order.status] || "text-ink"}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-ink/70 mb-3">
                {order.items.map((i) => i.name).join(", ")}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink/50">{order.isPaid ? "Paid" : "Payment pending"}</span>
                <span className="text-ink font-medium">{formatINR(order.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
