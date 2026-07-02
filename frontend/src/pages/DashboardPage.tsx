import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Droplets, Flame, Plus, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import GlassCard from "@/components/ui/GlassCard";
import MacroRing from "@/components/ui/MacroRing";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardSummary, getProfile, getTrends } from "@/services/trackingService";
import { format } from "date-fns";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = (user?.user_metadata?.full_name || "there").split(" ")[0];

  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardSummary,
  });
  const { data: weekly } = useQuery({ queryKey: ["trends", 7], queryFn: () => getTrends(7) });
  const { data: monthly } = useQuery({ queryKey: ["trends", 30], queryFn: () => getTrends(30) });

  const today = summary?.today ?? {};
  const waterPct = profile?.water_needed_ml
    ? Math.min(100, Math.round(((summary?.water_intake_ml ?? 0) / profile.water_needed_ml) * 100))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">
            {greeting()}, {firstName} 👋
          </h1>
          <p className="text-ink-700 dark:text-pine-100/70">Here's how today is shaping up.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/upload" className="btn-secondary !py-2 text-sm">
            <Plus size={16} /> Upload food
          </Link>
          <Link to="/analyze" className="btn-primary !py-2 text-sm">
            <Plus size={16} /> Log by text
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold">Today's macros</h2>
          {loadingSummary ? (
            <div className="skeleton h-52 w-full" />
          ) : (
            <MacroRing
              calories={today.calories ?? 0}
              caloriesTarget={profile?.calories_needed ?? 2000}
              rings={[
                { label: "Protein", value: today.protein_g ?? 0, target: profile?.protein_needed_g ?? 100, color: "#F4A300" },
                { label: "Carbs", value: today.carbs_g ?? 0, target: profile?.carbs_needed_g ?? 200, color: "#7B4B94" },
                { label: "Fat", value: today.fat_g ?? 0, target: profile?.fat_needed_g ?? 70, color: "#1B5E42" },
              ]}
            />
          )}
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Water intake</h2>
            <Droplets className="text-plum-500" size={20} />
          </div>
          <p className="font-mono text-3xl font-semibold">{summary?.water_intake_ml ?? 0}ml</p>
          <p className="mb-3 text-xs text-ink-500 dark:text-pine-100/50">
            of {profile?.water_needed_ml ?? "—"}ml goal
          </p>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-pine-50 dark:bg-white/10">
            <div className="h-full rounded-full bg-plum-500 transition-all" style={{ width: `${waterPct}%` }} />
          </div>
          <Link to="/water" className="btn-secondary mt-4 w-full !py-2 text-sm">
            Log water
          </Link>
        </GlassCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-pine-600" />
            <h2 className="font-display text-lg font-semibold">Weekly calories</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weekly?.series ?? []}>
              <defs>
                <linearGradient id="cal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F4A300" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#F4A300" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B5E4220" />
              <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), "EEE")} fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip labelFormatter={(d) => format(new Date(d), "MMM d")} />
              <Area type="monotone" dataKey="calories" stroke="#F4A300" fill="url(#cal)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Flame size={18} className="text-pine-600" />
            <h2 className="font-display text-lg font-semibold">Monthly calories</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly?.series ?? []}>
              <defs>
                <linearGradient id="calMonth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B5E42" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#1B5E42" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B5E4220" />
              <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), "d")} fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip labelFormatter={(d) => format(new Date(d), "MMM d")} />
              <Area type="monotone" dataKey="calories" stroke="#1B5E42" fill="url(#calMonth)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="mb-4 font-display text-lg font-semibold">Recent foods</h2>
        {!summary?.recent_foods?.length ? (
          <p className="py-8 text-center text-sm text-ink-500 dark:text-pine-100/50">
            Nothing logged yet — upload a photo or describe a meal to get started.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summary.recent_foods.map((f) => (
              <div key={f.id} className="rounded-xl2 bg-white/50 p-4 dark:bg-white/5">
                <div className="mb-1 flex items-center justify-between">
                  <p className="truncate font-medium">{f.food_name}</p>
                  <span className="shrink-0 rounded-full bg-pine-50 px-2 py-0.5 text-xs capitalize text-pine-700 dark:bg-white/10 dark:text-pine-100">
                    {f.meal_type}
                  </span>
                </div>
                <p className="font-mono text-sm text-ink-500 dark:text-pine-100/50">
                  {Math.round(f.calories)} kcal · {Math.round(f.protein_g)}g protein
                </p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
