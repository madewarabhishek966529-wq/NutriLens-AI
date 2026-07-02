import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth, startOfWeek, subDays } from "date-fns";
import { Search, Trash2, Pencil, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "@/components/ui/GlassCard";
import { deleteFoodLog, listFoodLogs, updateFoodLog } from "@/services/foodService";
import type { FoodLog } from "@/types";

type RangeKey = "today" | "yesterday" | "week" | "month" | "custom";

export default function HistoryPage() {
  const [range, setRange] = useState<RangeKey>("week");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<FoodLog>>({});
  const queryClient = useQueryClient();

  const { start, end } = useMemo(() => {
    const now = new Date();
    switch (range) {
      case "today":
        return { start: format(now, "yyyy-MM-dd"), end: undefined };
      case "yesterday": {
        const y = subDays(now, 1);
        return { start: format(y, "yyyy-MM-dd"), end: format(y, "yyyy-MM-dd") + "T23:59:59" };
      }
      case "week":
        return { start: format(startOfWeek(now), "yyyy-MM-dd"), end: undefined };
      case "month":
        return { start: format(startOfMonth(now), "yyyy-MM-dd"), end: undefined };
      case "custom":
        return { start: customStart || undefined, end: customEnd || undefined };
      default:
        return { start: undefined, end: undefined };
    }
  }, [range, customStart, customEnd]);

  const { data: logs, isLoading } = useQuery({
    queryKey: ["food-logs", start, end, search],
    queryFn: () => listFoodLogs({ start_date: start, end_date: end, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFoodLog,
    onSuccess: () => {
      toast.success("Entry deleted");
      queryClient.invalidateQueries({ queryKey: ["food-logs"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; updates: Partial<FoodLog> }) => updateFoodLog(params.id, params.updates),
    onSuccess: () => {
      toast.success("Entry updated");
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["food-logs"] });
    },
  });

  const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "week", label: "This week" },
    { key: "month", label: "This month" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">History</h1>
        <p className="text-ink-700 dark:text-pine-100/70">Every meal you've logged, searchable and editable.</p>
      </div>

      <GlassCard className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setRange(opt.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                range === opt.key
                  ? "bg-grad-forest text-white"
                  : "border border-pine-900/10 text-ink-700 dark:border-white/10 dark:text-pine-100/70"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {range === "custom" && (
          <div className="flex flex-wrap gap-3">
            <input type="date" className="input-field" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
            <input type="date" className="input-field" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
          </div>
        )}

        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            className="input-field pl-11"
            placeholder="Search foods…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </GlassCard>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 w-full" />
          ))}
        </div>
      ) : !logs?.length ? (
        <GlassCard className="py-16 text-center text-ink-500 dark:text-pine-100/50">
          No entries found for this range. Try a different filter or log a meal.
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <GlassCard key={log.id} className="p-4">
              {editingId === log.id ? (
                <div className="grid gap-3 sm:grid-cols-5">
                  <input
                    className="input-field sm:col-span-2"
                    defaultValue={log.food_name}
                    onChange={(e) => setEditValues((v) => ({ ...v, food_name: e.target.value }))}
                  />
                  {(["calories", "protein_g", "carbs_g", "fat_g"] as const).map((field) => (
                    <input
                      key={field}
                      type="number"
                      className="input-field"
                      defaultValue={log[field]}
                      onChange={(e) => setEditValues((v) => ({ ...v, [field]: Number(e.target.value) }))}
                    />
                  ))}
                  <div className="flex gap-2 sm:col-span-5">
                    <button
                      onClick={() => updateMutation.mutate({ id: log.id, updates: editValues })}
                      className="btn-primary !py-1.5 text-sm"
                    >
                      <Check size={14} /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary !py-1.5 text-sm">
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{log.food_name}</p>
                      <span className="rounded-full bg-pine-50 px-2 py-0.5 text-xs capitalize text-pine-700 dark:bg-white/10 dark:text-pine-100">
                        {log.meal_type}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-ink-500 dark:text-pine-100/50">
                      {format(new Date(log.logged_at), "MMM d, h:mm a")} · {Math.round(log.calories)} kcal · P{" "}
                      {Math.round(log.protein_g)}g · C {Math.round(log.carbs_g)}g · F {Math.round(log.fat_g)}g
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(log.id);
                        setEditValues({});
                      }}
                      className="rounded-full border border-pine-900/10 p-2 hover:bg-pine-50 dark:border-white/10 dark:hover:bg-white/5"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(log.id)}
                      className="rounded-full border border-red-500/20 p-2 text-red-500 hover:bg-red-500/10"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
