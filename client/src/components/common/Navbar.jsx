import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const navLinkClass = ({ isActive }) =>
  `text-sm tracking-wide transition-colors ${isActive ? "text-ink" : "text-ink/60 hover:text-ink"}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-border bg-base/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl text-ink">
          Kiln <span className="text-clay">&amp;</span> Co
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
          <NavLink to="/shop?category=mugs" className={navLinkClass}>Mugs</NavLink>
          <NavLink to="/shop?category=bowls" className={navLinkClass}>Bowls</NavLink>
          {user?.isAdmin && (
            <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>
          )}
        </nav>

        <div className="flex items-center gap-5">
          <Link to="/cart" className="relative text-sm text-ink/80 hover:text-ink" aria-label="View cart">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-clay text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/orders" className="text-sm text-ink/80 hover:text-ink">Orders</Link>
              <button onClick={handleLogout} className="text-sm text-ink/80 hover:text-ink">
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block text-sm text-ink/80 hover:text-ink">
              Log in
            </Link>
          )}

          <button
            className="md:hidden text-ink"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2 6h18M2 11h18M2 16h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-border px-5 py-4 flex flex-col gap-3 bg-base">
          <NavLink to="/shop" className={navLinkClass} onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/orders" className={navLinkClass} onClick={() => setMenuOpen(false)}>Orders</NavLink>
          {user?.isAdmin && (
            <NavLink to="/admin/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-left text-sm text-ink/80">Log out</button>
          ) : (
            <NavLink to="/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>Log in</NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
