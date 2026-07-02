import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Camera,
  Sparkles,
  LineChart,
  Droplets,
  Scale,
  ArrowRight,
  ScanLine,
  BrainCircuit,
  ClipboardList,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

const FEATURES = [
  {
    icon: Camera,
    title: "Photograph, don't search",
    body: "Point your camera at a plate. NutriLens AI reasons about what's on it — no barcode, no database lookup.",
  },
  {
    icon: Sparkles,
    title: "34 nutrients, one estimate",
    body: "Calories to glycemic index, vitamins to health score — Gemini's vision and language models reason it out live.",
  },
  {
    icon: LineChart,
    title: "Trends that mean something",
    body: "Weekly and monthly graphs for calories, macros, and fiber, so patterns surface instead of getting buried in logs.",
  },
  {
    icon: Droplets,
    title: "Water, dialed to your body",
    body: "Your daily hydration target scales to your actual body weight, not a flat 8-glasses rule.",
  },
  {
    icon: Scale,
    title: "Weight trends, not just numbers",
    body: "Daily entries roll into a trend line, with weekly and monthly reports on gain or loss.",
  },
  {
    icon: BrainCircuit,
    title: "Suggestions that adapt",
    body: "Your last 7 days feed straight back into the model — protein gaps, fiber gaps, and swap ideas built for you.",
  },
];

const STEPS = [
  { icon: ScanLine, title: "Snap or type", body: "Upload a food photo or type something like \"150g grilled chicken\"." },
  { icon: BrainCircuit, title: "AI reasons it out", body: "Gemini Vision and Gemini reason about ingredients, portion, and composition — no database." },
  { icon: ClipboardList, title: "Logged automatically", body: "Calories, macros, and micronutrients land straight in today's dashboard and history." },
];

const TESTIMONIALS = [
  { quote: "I stopped hunting for exact products in a database. I just show it the plate.", name: "Priya S.", role: "Home cook" },
  { quote: "The fiber and protein trend lines told me more in a week than a month of guessing.", name: "Daniel O.", role: "Marathon trainee" },
  { quote: "Portion estimates from a photo are shockingly close to what I'd calculate by hand.", name: "Meera K.", role: "Dietetics student" },
];

const FAQS = [
  { q: "Do you use a nutrition database like USDA or barcode lookups?", a: "No. Every estimate comes from Gemini's vision and language reasoning at the moment you log a food — not a static lookup table." },
  { q: "How accurate are AI-estimated nutrition values?", a: "Estimates are directionally strong for whole and home-cooked foods, and we show a confidence score with every analysis so you know how much to trust a given result." },
  { q: "Is my data private?", a: "Your logs and photos are stored under your account with row-level security in Supabase — only you can read or write your own data." },
  { q: "Can I edit an AI estimate if it looks off?", a: "Yes — every logged entry is editable from your History page." },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-mint-100 dark:bg-[#0B1712] text-ink-900 dark:text-white">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-pine-900/5 bg-mint-100/70 dark:bg-[#0B1712]/70 backdrop-blur-lg dark:border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-display text-xl font-semibold">
            <Leaf className="text-pine-600" size={22} /> NutriLens AI
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#features" className="hover:text-pine-600">Features</a>
            <a href="#how-it-works" className="hover:text-pine-600">How it works</a>
            <a href="#faq" className="hover:text-pine-600">FAQ</a>
            <Link to="/about" className="hover:text-pine-600">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full border border-pine-900/10 p-2 dark:border-white/10">
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link to="/login" className="btn-primary !px-5 !py-2 text-sm">
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24">
        <div className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-grad-citrus opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-[-10%] h-96 w-96 rounded-full bg-grad-plum opacity-20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-pine-50 px-4 py-1.5 text-xs font-semibold text-pine-700 dark:bg-white/5 dark:text-pine-100">
              <Sparkles size={14} /> Powered by Gemini Vision — zero food database
            </span>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              See what you eat.
              <br />
              <span className="bg-grad-forest bg-clip-text text-transparent">Understand what it means.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-700 dark:text-pine-100/70">
              Snap a photo or type a food. NutriLens AI reasons out calories, macros, and 20+ nutrients
              in seconds — no barcode scanning, no database, just AI that actually looks.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/login" className="btn-primary">
                Start tracking free <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="btn-secondary">See how it works</a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card relative mx-auto w-full max-w-sm p-6"
          >
            <p className="mb-4 text-xs font-mono uppercase tracking-wide text-ink-500 dark:text-pine-100/50">
              Live analysis
            </p>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl2 bg-grad-citrus text-white">
                <Camera size={26} />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">Grilled Salmon Bowl</p>
                <p className="text-xs text-ink-500 dark:text-pine-100/50">~320g · confidence 92%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Calories", "486 kcal"],
                ["Protein", "38g"],
                ["Carbs", "41g"],
                ["Fat", "16g"],
                ["Fiber", "6g"],
                ["Health score", "84/100"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl2 bg-white/50 p-3 dark:bg-white/5">
                  <p className="text-xs text-ink-500 dark:text-pine-100/50">{label}</p>
                  <p className="font-mono font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-xl">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Everything a food log should do — none of the barcode hunting</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="glass-card p-6" >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl2 bg-grad-forest text-white">
                  <Icon size={20} />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
                <p className="text-sm text-ink-700 dark:text-pine-100/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 font-display text-3xl font-semibold md:text-4xl">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-grad-citrus font-display text-lg font-semibold text-white">
                  {i + 1}
                </div>
                <Icon className="mb-3 text-pine-600" size={22} />
                <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
                <p className="text-sm text-ink-700 dark:text-pine-100/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 font-display text-3xl font-semibold md:text-4xl">People who stopped searching for their food</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card p-6">
                <p className="mb-4 text-sm italic text-ink-700 dark:text-pine-100/80">"{t.quote}"</p>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-ink-500 dark:text-pine-100/50">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 font-display text-3xl font-semibold md:text-4xl">Frequently asked</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details key={f.q} className="glass-card group p-5">
                <summary className="cursor-pointer list-none font-medium marker:content-none">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-ink-700 dark:text-pine-100/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="glass-card mx-auto flex max-w-4xl flex-col items-center gap-6 bg-grad-forest !border-0 p-12 text-center text-white">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Start seeing your food differently</h2>
          <p className="max-w-md text-pine-50/80">Sign in with Google and log your first meal in under a minute.</p>
          <Link to="/login" className="btn-secondary !bg-white !text-pine-700 hover:!bg-mint-50">
            Get started free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-pine-900/10 px-6 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-ink-500 dark:text-pine-100/50 md:flex-row">
          <div className="flex items-center gap-2 font-display text-base font-semibold text-ink-900 dark:text-white">
            <Leaf className="text-pine-600" size={18} /> NutriLens AI
          </div>
          <p>© {new Date().getFullYear()} NutriLens AI. Nutrition estimates are AI-generated and not medical advice.</p>
          <Link to="/about" className="hover:text-pine-600">About</Link>
        </div>
      </footer>
    </div>
  );
}
