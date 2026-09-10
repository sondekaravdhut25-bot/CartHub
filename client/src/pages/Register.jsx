import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/common/ErrorMessage";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-20">
      <h1 className="font-display text-2xl text-ink mb-2">Create an account</h1>
      <p className="text-sm text-ink/60 mb-8">Takes a minute — you'll need it to check out.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorMessage message={error} />}
        <div>
          <label className="block text-sm text-ink/70 mb-1" htmlFor="name">Name</label>
          <input
            id="name" required value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
          />
        </div>
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
            id="password" type="password" required minLength={6} value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border border-border bg-surface rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-base text-sm py-3 rounded-sm hover:bg-clay-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Already have an account? <Link to="/login" className="text-clay hover:text-clay-dark">Log in</Link>
      </p>
    </div>
  );
}
