import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Sparkles, Utensils } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { getAISuggestions, getTrends } from "@/services/trackingService";

const MACRO_COLORS = ["#F4A300", "#7B4B94", "#1B5E42"];

export default function AnalyticsPage() {
  const { data: trends, isLoading } = useQuery({ queryKey: ["trends", 30], queryFn: () => getTrends(30) });
  const { data: suggestions } = useQuery({ queryKey: ["suggestions"], queryFn: getAISuggestions });

  const macroData = trends
    ? [
        { name: "Protein", value: trends.macro_distribution.protein_g },
        { name: "Carbs", value: trends.macro_distribution.carbs_g },
        { name: "Fat", value: trends.macro_distribution.fat_g },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Analytics</h1>
        <p className="text-ink-700 dark:text-pine-100/70">30-day trends across calories, macros, and fiber.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <GlassCard>
          <p className="text-xs text-ink-500 dark:text-pine-100/50">Weekly avg calories</p>
          <p className="font-mono text-2xl font-semibold">{trends?.weekly_avg_calories ?? "—"}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-ink-500 dark:text-pine-100/50">Days logged (30d)</p>
          <p className="font-mono text-2xl font-semibold">{trends?.days_logged ?? "—"}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-ink-500 dark:text-pine-100/50">Goal completion</p>
          <p className="font-mono text-2xl font-semibold">
            {trends?.days_logged ? Math.min(100, Math.round((trends.days_logged / 30) * 100)) : 0}%
          </p>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold">Calories, protein & fiber over time</h2>
          {isLoading ? (
            <div className="skeleton h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trends?.series ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1B5E4220" />
                <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), "MMM d")} fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip labelFormatter={(d) => format(new Date(d), "MMM d")} />
                <Legend />
                <Line type="monotone" dataKey="calories" stroke="#F4A300" strokeWidth={2} dot={false} name="Calories" />
                <Line type="monotone" dataKey="protein_g" stroke="#1B5E42" strokeWidth={2} dot={false} name="Protein (g)" />
                <Line type="monotone" dataKey="fiber_g" stroke="#7B4B94" strokeWidth={2} dot={false} name="Fiber (g)" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 font-display text-lg font-semibold">Macro distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={macroData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {macroData.map((_, i) => (
                  <Cell key={i} fill={MACRO_COLORS[i]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <GlassCard className="bg-grad-forest !border-0 text-white">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={20} />
          <h2 className="font-display text-lg font-semibold">AI suggestions</h2>
        </div>
        {!suggestions ? (
          <div className="skeleton h-32 w-full bg-white/10" />
        ) : (
          <div className="space-y-5">
            <p className="text-pine-50/90">{suggestions.headline}</p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-pine-50/60">Boost protein</p>
                <ul className="space-y-1 text-sm text-pine-50/90">
                  {suggestions.foods_to_increase_protein.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-pine-50/60">Boost fiber</p>
                <ul className="space-y-1 text-sm text-pine-50/90">
                  {suggestions.foods_to_increase_fiber.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-pine-50/60">Trim calories</p>
                <ul className="space-y-1 text-sm text-pine-50/90">
                  {suggestions.foods_to_reduce_calories.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {suggestions.healthy_alternatives.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-pine-50/60">
                  <Utensils size={12} /> Healthy swaps
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  {suggestions.healthy_alternatives.map((a) => (
                    <div key={a.instead_of} className="rounded-xl2 bg-white/10 p-3 text-sm">
                      <span className="font-medium">{a.instead_of}</span> → <span className="font-medium">{a.try}</span>
                      <p className="mt-1 text-xs text-pine-50/70">{a.why}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="rounded-xl2 bg-white/10 p-3 text-sm italic">💡 {suggestions.daily_tip}</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
