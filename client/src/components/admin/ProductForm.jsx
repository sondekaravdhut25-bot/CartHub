import { useState } from "react";

const CATEGORIES = ["mugs", "bowls", "vases", "planters", "tableware", "decor"];

export default function ProductForm({ initialValues, onSubmit, submitLabel = "Save product" }) {
  const [form, setForm] = useState(
    initialValues || {
      name: "",
      description: "",
      category: "mugs",
      price: "",
      stock: "",
      images: "",
      glaze: "",
      isFeatured: false,
    }
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div>
        <label className="block text-sm text-ink/70 mb-1" htmlFor="name">Name</label>
        <input
          id="name" name="name" required value={form.name} onChange={handleChange}
          className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1" htmlFor="description">Description</label>
        <textarea
          id="description" name="description" required rows={4} value={form.description} onChange={handleChange}
          className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink/70 mb-1" htmlFor="category">Category</label>
          <select
            id="category" name="category" value={form.category} onChange={handleChange}
            className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-ink/70 mb-1" htmlFor="glaze">Glaze / finish</label>
          <input
            id="glaze" name="glaze" value={form.glaze} onChange={handleChange}
            className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink/70 mb-1" htmlFor="price">Price (₹)</label>
          <input
            id="price" name="price" type="number" min="0" required value={form.price} onChange={handleChange}
            className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-ink/70 mb-1" htmlFor="stock">Stock</label>
          <input
            id="stock" name="stock" type="number" min="0" required value={form.stock} onChange={handleChange}
            className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1" htmlFor="images">
          Image URLs (comma-separated)
        </label>
        <input
          id="images" name="images" value={form.images} onChange={handleChange}
          placeholder="https://example.com/mug.jpg"
          className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
        Feature on homepage
      </label>

      <button
        type="submit"
        disabled={saving}
        className="bg-ink text-base text-sm px-6 py-2.5 rounded-sm hover:bg-clay-dark transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
