import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "@/components/ui/GlassCard";
import { listWeightLogs, logWeight } from "@/services/trackingService";

export default function WeightTrackerPage() {
  const [weight, setWeight] = useState("");
  const queryClient = useQueryClient();

  const { data: logs, isLoading } = useQuery({ queryKey: ["weight-logs"], queryFn: listWeightLogs });

  const logMutation = useMutation({
    mutationFn: (kg: number) => logWeight(kg),
    onSuccess: () => {
      toast.success("Weight logged");
      setWeight("");
      queryClient.invalidateQueries({ queryKey: ["weight-logs"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const latest = logs?.[logs.length - 1];
  const previous = logs?.[logs.length - 2];
  const delta = latest && previous ? Number((latest.weight_kg - previous.weight_kg).toFixed(1)) : null;

  const last7 = logs?.slice(-7) ?? [];
  const weeklyDelta =
    last7.length >= 2 ? Number((last7[last7.length - 1].weight_kg - last7[0].weight_kg).toFixed(1)) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Weight tracker</h1>
        <p className="text-ink-700 dark:text-pine-100/70">Log daily to see your real trend, not just noise.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <div className="mb-3 flex items-center gap-2">
            <Scale className="text-pine-600" size={20} />
            <h2 className="font-display text-lg font-semibold">Log today's weight</h2>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              className="input-field"
              placeholder="kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <button
              onClick={() => weight && logMutation.mutate(Number(weight))}
              disabled={!weight || logMutation.isPending}
              className="btn-primary shrink-0 !px-4"
            >
              Log
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-xl2 bg-white/50 p-3 dark:bg-white/5">
              <p className="text-xs text-ink-500 dark:text-pine-100/50">Current</p>
              <p className="font-mono text-xl font-semibold">{latest ? `${latest.weight_kg}kg` : "—"}</p>
            </div>
            <div className="rounded-xl2 bg-white/50 p-3 dark:bg-white/5">
              <p className="text-xs text-ink-500 dark:text-pine-100/50">Since last entry</p>
              <p className="flex items-center gap-1 font-mono text-xl font-semibold">
                {delta === null ? "—" : (
                  <>
                    {delta > 0 ? <TrendingUp size={16} className="text-red-500" /> : <TrendingDown size={16} className="text-pine-600" />}
                    {delta > 0 ? "+" : ""}
                    {delta}kg
                  </>
                )}
              </p>
            </div>
            <div className="rounded-xl2 bg-white/50 p-3 dark:bg-white/5">
              <p className="text-xs text-ink-500 dark:text-pine-100/50">7-day change</p>
              <p className="font-mono text-xl font-semibold">
                {weeklyDelta === null ? "—" : `${weeklyDelta > 0 ? "+" : ""}${weeklyDelta}kg`}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold">Weight trend</h2>
          {isLoading ? (
            <div className="skeleton h-64 w-full" />
          ) : !logs?.length ? (
            <p className="py-16 text-center text-sm text-ink-500 dark:text-pine-100/50">
              No entries yet — log your weight to start the trend.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1B5E4220" />
                <XAxis dataKey="logged_date" tickFormatter={(d) => format(new Date(d), "MMM d")} fontSize={11} />
                <YAxis domain={["dataMin - 2", "dataMax + 2"]} fontSize={11} />
                <Tooltip labelFormatter={(d) => format(new Date(d), "MMM d, yyyy")} />
                <Line type="monotone" dataKey="weight_kg" stroke="#1B5E42" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
