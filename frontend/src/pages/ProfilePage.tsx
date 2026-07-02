import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import GlassCard from "@/components/ui/GlassCard";
import { getProfile, updateProfile } from "@/services/trackingService";
import type { ActivityLevel, Gender } from "@/types";

interface FormValues {
  name: string;
  age: number;
  gender: Gender;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
}

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: "sedentary", label: "Sedentary", desc: "Little to no exercise" },
  { value: "light", label: "Light", desc: "Exercise 1-3 days/week" },
  { value: "moderate", label: "Moderate", desc: "Exercise 3-5 days/week" },
  { value: "active", label: "Active", desc: "Exercise 6-7 days/week" },
  { value: "athlete", label: "Athlete", desc: "Intense daily training" },
];

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>();

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        age: profile.age || undefined,
        gender: profile.gender || "male",
        height_cm: profile.height_cm || undefined,
        weight_kg: profile.weight_kg || undefined,
        activity_level: profile.activity_level || "moderate",
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => updateProfile(values),
    onSuccess: (data) => {
      toast.success("Profile updated");
      queryClient.setQueryData(["profile"], data);
    },
    onError: () => toast.error("Couldn't save your profile. Check the values and try again."),
  });

  const activityLevel = watch("activity_level");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Your profile</h1>
        <p className="text-ink-700 dark:text-pine-100/70">
          Used to calculate your BMR, TDEE, and daily nutrition targets.
        </p>
      </div>

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
        <GlassCard className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input className="input-field" {...register("name", { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Age</label>
              <input type="number" className="input-field" {...register("age", { required: true, valueAsNumber: true })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Gender</label>
              <select className="input-field" {...register("gender", { required: true })}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Height (cm)</label>
              <input type="number" step="0.1" className="input-field" {...register("height_cm", { required: true, valueAsNumber: true })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Weight (kg)</label>
              <input type="number" step="0.1" className="input-field" {...register("weight_kg", { required: true, valueAsNumber: true })} />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="mb-3 text-sm font-medium">Activity level</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {ACTIVITY_LEVELS.map((lvl) => (
              <button
                type="button"
                key={lvl.value}
                onClick={() => setValue("activity_level", lvl.value)}
                className={`rounded-xl2 border p-3 text-left transition ${
                  activityLevel === lvl.value
                    ? "border-pine-600 bg-pine-50 dark:bg-white/10"
                    : "border-pine-900/10 dark:border-white/10"
                }`}
              >
                <p className="text-sm font-semibold">{lvl.label}</p>
                <p className="text-xs text-ink-500 dark:text-pine-100/50">{lvl.desc}</p>
              </button>
            ))}
          </div>
        </GlassCard>

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full sm:w-auto">
          {mutation.isPending ? "Saving…" : "Save profile"}
        </button>
      </form>

      {profile?.bmr && (
        <GlassCard>
          <h2 className="mb-4 font-display text-lg font-semibold">Your calculated targets</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["BMR", `${profile.bmr} kcal`],
              ["TDEE", `${profile.tdee} kcal`],
              ["BMI", `${profile.bmi} (${profile.bmi_category})`],
              ["Calories/day", `${profile.calories_needed} kcal`],
              ["Protein/day", `${profile.protein_needed_g}g`],
              ["Carbs/day", `${profile.carbs_needed_g}g`],
              ["Fat/day", `${profile.fat_needed_g}g`],
              ["Water/day", `${profile.water_needed_ml}ml`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl2 bg-white/50 p-3 dark:bg-white/5">
                <p className="text-xs text-ink-500 dark:text-pine-100/50">{label}</p>
                <p className="font-mono font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
