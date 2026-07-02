import { Link } from "react-router-dom";
import { Leaf, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-mint-100 px-6 py-16 dark:bg-[#0B1712]">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-pine-600 hover:underline">
          <ArrowLeft size={16} /> Back home
        </Link>
        <div className="mb-6 flex items-center gap-2 font-display text-2xl font-semibold">
          <Leaf className="text-pine-600" /> About NutriLens AI
        </div>
        <div className="glass-card space-y-4 p-8 text-ink-700 dark:text-pine-100/80">
          <p>
            NutriLens AI estimates nutrition using AI reasoning alone — Google Gemini's vision model
            interprets food photos, and Gemini's language model reasons about ingredients, typical
            recipes, and portion sizes to produce a full nutrient breakdown, with no fixed food
            database or barcode lookup involved.
          </p>
          <p>
            Every analysis includes a confidence score, because AI estimation works best as a fast,
            flexible starting point — not a replacement for a registered dietitian or a medical
            professional. Estimates can be edited after logging if something looks off.
          </p>
          <p>
            Built with React, TypeScript, and FastAPI, with Supabase handling authentication, storage,
            and the Postgres database behind every log.
          </p>
        </div>
      </div>
    </div>
  );
}
