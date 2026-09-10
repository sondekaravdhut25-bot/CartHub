import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display text-2xl text-ink mb-2">Admin dashboard</h1>
      <p className="text-sm text-ink/60 mb-10">Manage products and orders for the store.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/products"
          className="border border-border rounded-sm p-6 hover:border-clay transition-colors"
        >
          <h2 className="text-ink font-medium mb-1">Products</h2>
          <p className="text-sm text-ink/60">Add, edit, or remove pieces from the catalog.</p>
        </Link>

        <Link
          to="/admin/orders"
          className="border border-border rounded-sm p-6 hover:border-clay transition-colors"
        >
          <h2 className="text-ink font-medium mb-1">Orders</h2>
          <p className="text-sm text-ink/60">View all orders and update fulfillment status.</p>
        </Link>
      </div>
    </div>
  );
}
