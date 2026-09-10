import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, addProductReview } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const formatINR = (value) => `₹${value.toLocaleString("en-IN")}`;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setReviewSubmitting(true);
    setReviewError("");
    try {
      await addProductReview(product._id, reviewForm);
      const refreshed = await getProductById(id);
      setProduct(refreshed);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="max-w-6xl mx-auto px-5 py-12"><ErrorMessage message={error} /></div>;
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-surface border border-border rounded-sm overflow-hidden">
          {product.images?.[0] && (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">{product.category}</p>
          <h1 className="font-display text-3xl text-ink mb-3">{product.name}</h1>
          {product.numReviews > 0 && (
            <p className="text-sm text-ink/50 mb-4">
              {product.rating.toFixed(1)} ★ ({product.numReviews} review{product.numReviews > 1 ? "s" : ""})
            </p>
          )}
          <p className="text-xl text-clay mb-6">{formatINR(product.price)}</p>
          <p className="text-ink/70 leading-relaxed mb-6">{product.description}</p>
          {product.glaze && (
            <p className="text-sm text-ink/50 mb-8">Glaze: {product.glaze}</p>
          )}

          {product.stock > 0 ? (
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-border rounded-sm">
                <button
                  className="w-9 h-9 text-ink/60 hover:text-ink"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button
                  className="w-9 h-9 text-ink/60 hover:text-ink"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-ink text-base text-sm py-3 rounded-sm hover:bg-clay-dark transition-colors"
              >
                {added ? "Added ✓" : "Add to cart"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-rust mb-4">Currently out of stock</p>
          )}

          <p className="text-xs text-ink/40">{product.stock} in stock</p>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20 max-w-2xl">
        <h2 className="text-lg text-ink mb-6">Reviews</h2>

        {product.reviews?.length > 0 ? (
          <div className="space-y-5 mb-10">
            {product.reviews.map((r) => (
              <div key={r._id} className="border-b border-border pb-5">
                <div className="flex justify-between text-sm">
                  <p className="text-ink font-medium">{r.name}</p>
                  <p className="text-ink/50">{r.rating} ★</p>
                </div>
                <p className="text-sm text-ink/60 mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/50 mb-10">No reviews yet — be the first.</p>
        )}

        <form onSubmit={handleReviewSubmit} className="space-y-3">
          {reviewError && <ErrorMessage message={reviewError} />}
          <div>
            <label className="block text-sm text-ink/70 mb-1" htmlFor="rating">Rating</label>
            <select
              id="rating"
              value={reviewForm.rating}
              onChange={(e) => setReviewForm((f) => ({ ...f, rating: e.target.value }))}
              className="border border-border bg-surface rounded-sm px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-ink/70 mb-1" htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              required
              rows={3}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={reviewSubmitting}
            className="text-sm border border-border rounded-sm px-5 py-2 hover:bg-surface disabled:opacity-50"
          >
            {user ? "Submit review" : "Log in to review"}
          </button>
        </form>
      </section>
    </div>
  );
}
