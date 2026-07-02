import { useCallback, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UploadCloud, Loader2, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "@/components/ui/GlassCard";
import FoodResultCard from "@/components/upload/FoodResultCard";
import { analyzeImage, saveFoodLog } from "@/services/foodService";
import type { FoodAnalysisResult, MealType } from "@/types";

export default function UploadFoodPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const analyzeMutation = useMutation({
    mutationFn: () => analyzeImage(file!, note),
    onSuccess: (data) => setResult(data),
    onError: () => toast.error("Couldn't analyze that image. Try a clearer photo."),
  });

  const saveMutation = useMutation({
    mutationFn: (params: { mealType: MealType; notes: string }) =>
      saveFoodLog({ analysis: result!, meal_type: params.mealType, notes: params.notes }),
    onSuccess: () => {
      toast.success("Saved to today's log!");
      reset();
    },
    onError: () => toast.error("Couldn't save this entry. Please try again."),
  });

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  function reset() {
    setFile(null);
    setPreview(null);
    setNote("");
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Upload a food photo</h1>
        <p className="mt-1 text-ink-700 dark:text-pine-100/70">
          Pizza, rice, curry, salad — snap it and let AI reason out the nutrition.
        </p>
      </div>

      {!result && (
        <GlassCard className="p-6">
          {!preview ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl2 border-2 border-dashed py-16 text-center transition ${
                dragActive ? "border-pine-500 bg-pine-50 dark:bg-white/5" : "border-pine-900/15 dark:border-white/15"
              }`}
            >
              <UploadCloud size={36} className="text-pine-600" />
              <p className="font-medium">Drag & drop a food photo, or click to browse</p>
              <p className="text-xs text-ink-500 dark:text-pine-100/50">JPEG, PNG, or WEBP — up to 8MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <img src={preview} alt="Food preview" className="mx-auto max-h-80 w-full rounded-xl2 object-cover" />
              <input
                className="input-field"
                placeholder="Add context, e.g. 'no oil, homemade' (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => analyzeMutation.mutate()}
                  disabled={analyzeMutation.isPending}
                  className="btn-primary flex-1"
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Analyzing…
                    </>
                  ) : (
                    "Analyze with AI"
                  )}
                </button>
                <button onClick={reset} className="btn-secondary">
                  <RefreshCcw size={16} /> Reset
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {result && (
        <>
          <FoodResultCard
            result={result}
            saving={saveMutation.isPending}
            onSave={(mealType, notes) => saveMutation.mutate({ mealType, notes })}
          />
          <button onClick={reset} className="btn-secondary">
            <RefreshCcw size={16} /> Analyze another photo
          </button>
        </>
      )}
    </div>
  );
}
