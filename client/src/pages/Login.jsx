import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/common/ErrorMessage";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate(searchParams.get("redirect") || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-20">
      <h1 className="font-display text-2xl text-ink mb-2">Welcome back</h1>
      <p className="text-sm text-ink/60 mb-8">Log in to check out and see your order history.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorMessage message={error} />}
        <div>
          <label className="block text-sm text-ink/70 mb-1" htmlFor="email">Email</label>
          <input
            id="email" type="email" required value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-ink/70 mb-1" htmlFor="password">Password</label>
          <input
            id="password" type="password" required value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-base text-sm py-3 rounded-sm hover:bg-clay-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        New here? <Link to="/register" className="text-clay hover:text-clay-dark">Create an account</Link>
      </p>

      <p className="text-xs text-ink/40 mt-8">
        Demo admin: admin@kilnandco.test / admin1234 (after running the seed script)
      </p>
    </div>
  );
}
