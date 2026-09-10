import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "kiln_cart";

const loadInitialState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { items: [] };
  } catch {
    return { items: [] };
  }
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existing = state.items.find((i) => i.product === product._id);

      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product === product._id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "",
            stock: product.stock,
            quantity,
          },
        ],
      };
    }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.product === action.payload.product ? { ...i, quantity: action.payload.quantity } : i
        ),
      };

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.product !== action.payload) };

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (product, quantity = 1) => dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  const updateQuantity = (productId, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { product: productId, quantity } });
  const removeItem = (productId) => dispatch({ type: "REMOVE_ITEM", payload: productId });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
