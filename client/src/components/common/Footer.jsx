export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <p className="font-display text-lg text-ink mb-2">CartHub</p>
          <p className="text-sm text-ink/60 max-w-xs">
            Wheel-thrown stoneware, made in small batches. Every piece carries the marks of the hand that shaped it.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink mb-3">Shop</p>
          <ul className="space-y-2 text-sm text-ink/60">
            <li>Mugs</li>
            <li>Bowls</li>
            <li>Vases &amp; Planters</li>
            <li>Tableware</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-ink mb-3">Studio</p>
          <ul className="space-y-2 text-sm text-ink/60">
            <li>Shipping &amp; returns</li>
            <li>Care instructions</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-ink/40 pb-8">
        Built as a portfolio project — demo store, not a real business.
      </div>
    </footer>
  );
}
