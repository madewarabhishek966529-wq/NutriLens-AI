import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Utensils, Save } from "lucide-react";
import type { FoodAnalysisResult, MealType } from "@/types";
import GlassCard from "@/components/ui/GlassCard";

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

const NUTRIENT_ROWS: [string, keyof FoodAnalysisResult, string][] = [
  ["Calories", "calories", "kcal"],
  ["Protein", "protein_g", "g"],
  ["Carbs", "carbs_g", "g"],
  ["Fat", "fat_g", "g"],
  ["Fiber", "fiber_g", "g"],
  ["Sugar", "sugar_g", "g"],
  ["Sodium", "sodium_mg", "mg"],
  ["Potassium", "potassium_mg", "mg"],
  ["Calcium", "calcium_mg", "mg"],
  ["Iron", "iron_mg", "mg"],
  ["Water content", "water_content_percent", "%"],
  ["Glycemic index", "glycemic_index_estimate", ""],
];

export default function FoodResultCard({
  result,
  onSave,
  saving,
}: {
  result: FoodAnalysisResult;
  onSave: (mealType: MealType, notes: string) => void;
  saving: boolean;
}) {
  const [mealType, setMealType] = useState<MealType>(result.meal_type || "snack");
  const [notes, setNotes] = useState("");

  return (
    <div className="animate-fade-up space-y-6">
      <GlassCard className="p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">{result.food_name}</h2>
            <p className="mt-1 text-sm text-ink-700 dark:text-pine-100/70">{result.description}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-pine-50 px-3 py-1.5 text-xs font-semibold text-pine-700 dark:bg-white/5 dark:text-pine-100">
            {result.is_healthy ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            Health score {Math.round(result.health_score)}/100
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {NUTRIENT_ROWS.map(([label, key, unit]) => (
            <div key={label} className="rounded-xl2 bg-white/50 p-3 dark:bg-white/5">
              <p className="text-xs text-ink-500 dark:text-pine-100/50">{label}</p>
              <p className="font-mono font-semibold">
                {Math.round(Number(result[key]) * 10) / 10}
                {unit}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-pine-700 dark:text-pine-100">
              <CheckCircle2 size={16} /> Benefits
            </p>
            <ul className="space-y-1 text-sm text-ink-700 dark:text-pine-100/70">
              {result.benefits.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-500">
              <XCircle size={16} /> Watch out for
            </p>
            <ul className="space-y-1 text-sm text-ink-700 dark:text-pine-100/70">
              {result.disadvantages.map((d) => (
                <li key={d}>• {d}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-xl2 bg-white/50 p-3 text-sm dark:bg-white/5">
            <Clock size={16} className="text-pine-600" />
            <span>Best time: {result.best_time_to_eat}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl2 bg-white/50 p-3 text-sm dark:bg-white/5">
            <Utensils size={16} className="text-pine-600" />
            <span>Recommended: {result.recommended_quantity}</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">Save this entry</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {MEAL_TYPES.map((m) => (
            <button
              key={m}
              onClick={() => setMealType(m)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                mealType === m
                  ? "bg-grad-forest text-white"
                  : "border border-pine-900/10 text-ink-700 dark:border-white/10 dark:text-pine-100/70"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <textarea
          className="input-field mb-4 min-h-[80px] resize-none"
          placeholder="Add a note (optional)…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button onClick={() => onSave(mealType, notes)} disabled={saving} className="btn-primary w-full sm:w-auto">
          <Save size={18} /> {saving ? "Saving…" : "Save to today's log"}
        </button>
      </GlassCard>
    </div>
  );
}
