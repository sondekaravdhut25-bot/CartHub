import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const formatINR = (value) => `₹${value.toLocaleString("en-IN")}`;
const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display text-2xl text-ink mb-8">Orders</h1>
      {error && <ErrorMessage message={error} />}

      <div className="border border-border rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-ink/60">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Paid</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-border last:border-0 align-top">
                <td className="px-4 py-3">
                  <p className="text-ink">{order.user?.name}</p>
                  <p className="text-ink/40 text-xs">{order.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-ink/60 max-w-xs">
                  {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                </td>
                <td className="px-4 py-3 text-ink">{formatINR(order.totalPrice)}</td>
                <td className="px-4 py-3">
                  <span className={order.isPaid ? "text-sage" : "text-ink/40"}>
                    {order.isPaid ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border border-border bg-surface rounded-sm px-2 py-1.5 text-sm capitalize"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center text-sm text-ink/50 py-10">No orders placed yet.</p>
        )}
      </div>
    </div>
  );
}
