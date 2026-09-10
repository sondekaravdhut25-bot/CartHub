import { Link } from "react-router-dom";

const formatINR = (value) => `₹${value.toLocaleString("en-IN")}`;

export default function ProductCard({ product }) {
  const outOfStock = product.stock === 0;

  return (
    <Link to={`/product/${product.slug || product._id}`} className="group block">
      <div className="aspect-[4/5] bg-surface border border-border overflow-hidden rounded-sm relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 text-sm">No image</div>
        )}
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-ink text-base text-xs px-2 py-1 rounded-sm">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-sm text-ink group-hover:text-clay transition-colors">{product.name}</h3>
        <p className="text-sm text-ink/50 mt-0.5">{formatINR(product.price)}</p>
      </div>
    </Link>
  );
}
