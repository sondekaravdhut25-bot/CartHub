import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/product/ProductGrid";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const CATEGORIES = ["mugs", "bowls", "vases", "planters", "tableware", "decor"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ products: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");

  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    setLoading(true);
    setError("");
    getProducts({
      keyword: searchParams.get("keyword") || undefined,
      category: category || undefined,
      page,
    })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page"); // reset to page 1 on any filter change
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("keyword", keyword);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <h1 className="font-display text-3xl text-ink">Shop the collection</h1>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search pieces…"
            className="border border-border bg-surface rounded-sm px-3 py-2 text-sm w-56"
          />
          <button type="submit" className="text-sm border border-border rounded-sm px-4 py-2 hover:bg-surface">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => updateParam("category", "")}
          className={`text-xs px-3 py-1.5 rounded-full border ${
            !category ? "bg-ink text-base border-ink" : "border-border text-ink/60 hover:text-ink"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => updateParam("category", c)}
            className={`text-xs px-3 py-1.5 rounded-full border capitalize ${
              category === c ? "bg-ink text-base border-ink" : "border-border text-ink/60 hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} />}
      {loading ? <Loader /> : <ProductGrid products={data.products} />}

      {data.pages > 1 && (
        <div className="flex justify-center gap-2 mt-14">
          {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => updateParam("page", String(p))}
              className={`w-8 h-8 text-sm rounded-sm ${
                p === page ? "bg-ink text-base" : "border border-border text-ink/60 hover:text-ink"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
