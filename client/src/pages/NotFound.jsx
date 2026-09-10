import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-5 py-32 text-center">
      <h1 className="font-display text-3xl text-ink mb-3">Page not found</h1>
      <p className="text-ink/60 mb-8">There's nothing thrown at this address.</p>
      <Link to="/" className="text-sm text-clay hover:text-clay-dark">Back to the shop →</Link>
    </div>
  );
}
