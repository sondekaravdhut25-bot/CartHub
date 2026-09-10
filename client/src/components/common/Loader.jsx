export default function Loader() {
  return (
    <div className="flex justify-center items-center py-24" role="status" aria-label="Loading">
      <div className="w-6 h-6 border-2 border-border border-t-clay rounded-full animate-spin" />
    </div>
  );
}
