import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/productService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const formatINR = (value) => `₹${value.toLocaleString("en-IN")}`;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = () => {
    setLoading(true);
    getProducts({ limit: 100 })
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-ink">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-ink text-base text-sm px-5 py-2.5 rounded-sm hover:bg-clay-dark transition-colors"
        >
          Add product
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="border border-border rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-ink/60">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-ink">{p.name}</td>
                <td className="px-4 py-3 text-ink/60 capitalize">{p.category}</td>
                <td className="px-4 py-3 text-ink/60">{formatINR(p.price)}</td>
                <td className="px-4 py-3 text-ink/60">{p.stock}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link to={`/admin/products/${p._id}/edit`} className="text-clay hover:text-clay-dark">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id, p.name)}
                    disabled={deletingId === p._id}
                    className="text-ink/40 hover:text-rust disabled:opacity-50"
                  >
                    {deletingId === p._id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center text-sm text-ink/50 py-10">No products yet — add your first one.</p>
        )}
      </div>
    </div>
  );
}
