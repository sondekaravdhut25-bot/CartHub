import { useCart } from "../../context/CartContext";

const formatINR = (value) => `₹${value.toLocaleString("en-IN")}`;

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-5 border-b border-border">
      <div className="w-20 h-20 bg-surface border border-border rounded-sm overflow-hidden shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : null}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between gap-4">
          <p className="text-sm text-ink">{item.name}</p>
          <p className="text-sm text-ink">{formatINR(item.price * item.quantity)}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-border rounded-sm">
            <button
              className="w-7 h-7 text-ink/60 hover:text-ink"
              onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              className="w-7 h-7 text-ink/60 hover:text-ink"
              onClick={() => updateQuantity(item.product, Math.min(item.stock, item.quantity + 1))}
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.product)}
            className="text-xs text-ink/40 hover:text-rust"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
