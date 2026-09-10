import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "../services/productService";
import ProductGrid from "../components/product/ProductGrid";
import Loader from "../components/common/Loader";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then(setFeatured)
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm text-clay mb-4">Small-batch stoneware, thrown by hand</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] text-ink mb-6">
            Made for the table you actually eat at.
          </h1>
          <p className="text-ink/60 max-w-md mb-8">
            Every mug, bowl, and vase in this shop is wheel-thrown in small batches —
            no two pieces glaze exactly the same way, and that's the point.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-ink text-base px-7 py-3 text-sm rounded-sm hover:bg-clay-dark transition-colors"
          >
            Browse the shop
          </Link>
        </div>
        <div className="aspect-square bg-surface border border-border rounded-sm overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1200"
            alt="Handmade stoneware mugs and bowls arranged on a wooden table"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xl text-ink">Currently in the kiln</h2>
          <Link to="/shop" className="text-sm text-clay hover:text-clay-dark">View all</Link>
        </div>
        {loading ? <Loader /> : <ProductGrid products={featured} />}
      </section>
    </div>
  );
}
