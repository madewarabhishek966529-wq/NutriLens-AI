import { Leaf } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-mint-100 dark:bg-[#0B1712]">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-xl3 bg-grad-forest text-white shadow-glass">
          <Leaf size={28} />
        </div>
        <p className="font-mono text-sm text-ink-500 dark:text-pine-100/60">Loading NutriLens AI…</p>
      </div>
    </div>
  );
}
