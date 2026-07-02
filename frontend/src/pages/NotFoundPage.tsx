import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-mint-100 px-6 text-center dark:bg-[#0B1712]">
      <Leaf className="text-pine-600" size={32} />
      <h1 className="font-display text-3xl font-semibold">Page not found</h1>
      <p className="text-ink-700 dark:text-pine-100/70">This page wandered off the plate.</p>
      <Link to="/" className="btn-primary mt-2">Back to NutriLens AI</Link>
    </div>
  );
}
