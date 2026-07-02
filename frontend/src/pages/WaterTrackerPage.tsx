import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Droplets, Plus } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "@/components/ui/GlassCard";
import { getProfile, getTodayWater, logWater } from "@/services/trackingService";

const QUICK_AMOUNTS = [150, 250, 330, 500, 750, 1000];

export default function WaterTrackerPage() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: water, isLoading } = useQuery({ queryKey: ["water-today"], queryFn: getTodayWater });

  const logMutation = useMutation({
    mutationFn: logWater,
    onSuccess: () => {
      toast.success("Water logged");
      queryClient.invalidateQueries({ queryKey: ["water-today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const goal = profile?.water_needed_ml ?? 2500;
  const total = water?.total_ml ?? 0;
  const pct = Math.min(100, Math.round((total / goal) * 100));
  const circumference = 2 * Math.PI * 85;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Water tracker</h1>
        <p className="text-ink-700 dark:text-pine-100/70">Your goal scales to your body weight.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="flex flex-col items-center justify-center py-10">
          {isLoading ? (
            <div className="skeleton h-52 w-52 rounded-full" />
          ) : (
            <svg width={220} height={220} viewBox="0 0 220 220">
              <circle cx={110} cy={110} r={85} stroke="#7B4B9420" strokeWidth={16} fill="none" />
              <circle
                cx={110}
                cy={110}
                r={85}
                stroke="#7B4B94"
                strokeWidth={16}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
                transform="rotate(-90 110 110)"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
              <text x="110" y="105" textAnchor="middle" fontFamily="Fraunces" fontSize="30" fontWeight="600" className="fill-ink-900 dark:fill-white">
                {total}ml
              </text>
              <text x="110" y="128" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="12" className="fill-ink-500 dark:fill-pine-100/60">
                of {goal}ml · {pct}%
              </text>
            </svg>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-ink-500 dark:text-pine-100/50">
            <Droplets size={16} className="text-plum-500" /> Daily hydration goal
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 font-display text-lg font-semibold">Quick add</h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => logMutation.mutate(amt)}
                disabled={logMutation.isPending}
                className="flex flex-col items-center gap-1 rounded-xl2 border border-pine-900/10 bg-white/50 py-4 transition hover:bg-pine-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <Plus size={16} className="text-plum-500" />
                <span className="font-mono font-semibold">{amt}ml</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
