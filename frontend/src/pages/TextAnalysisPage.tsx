import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Type as TypeIcon, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "@/components/ui/GlassCard";
import FoodResultCard from "@/components/upload/FoodResultCard";
import { analyzeText, saveFoodLog } from "@/services/foodService";
import type { FoodAnalysisResult, MealType } from "@/types";

const EXAMPLES = ["2 boiled eggs", "150g grilled chicken breast", "1 bowl dal with rice", "1 medium banana", "1 cup black coffee"];

export default function TextAnalysisPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: () => analyzeText(query),
    onSuccess: (data) => setResult(data),
    onError: () => toast.error("Couldn't analyze that description. Try being more specific."),
  });

  const saveMutation = useMutation({
    mutationFn: (params: { mealType: MealType; notes: string }) =>
      saveFoodLog({ analysis: result!, meal_type: params.mealType, notes: params.notes }),
    onSuccess: () => {
      toast.success("Saved to today's log!");
      setResult(null);
      setQuery("");
    },
    onError: () => toast.error("Couldn't save this entry. Please try again."),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Describe a food</h1>
        <p className="mt-1 text-ink-700 dark:text-pine-100/70">
          Type what you ate, with quantity if you can — the more specific, the sharper the estimate.
        </p>
      </div>

      {!result && (
        <GlassCard className="p-6">
          <div className="flex gap-3">
            <input
              className="input-field"
              placeholder='e.g. "150g grilled chicken" or "1 bowl dal"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && query.trim() && analyzeMutation.mutate()}
            />
            <button
              onClick={() => analyzeMutation.mutate()}
              disabled={!query.trim() || analyzeMutation.isPending}
              className="btn-primary shrink-0"
            >
              {analyzeMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <TypeIcon size={18} />}
              Analyze
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                className="rounded-full border border-pine-900/10 px-3 py-1 text-xs text-ink-700 hover:bg-pine-50 dark:border-white/10 dark:text-pine-100/70 dark:hover:bg-white/5"
              >
                {ex}
              </button>
            ))}
          </div>
        </GlassCard>
      )}

      {result && (
        <>
          <FoodResultCard
            result={result}
            saving={saveMutation.isPending}
            onSave={(mealType, notes) => saveMutation.mutate({ mealType, notes })}
          />
          <button onClick={() => setResult(null)} className="btn-secondary">
            <RefreshCcw size={16} /> Analyze another food
          </button>
        </>
      )}
    </div>
  );
}
