export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded px-4 py-3">
      {message}
    </div>
  );
}
