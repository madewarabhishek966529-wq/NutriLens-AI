import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { session, loading, signIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  if (!loading && session) return <Navigate to="/dashboard" replace />;

  async function handleSignIn() {
    setSigningIn(true);
    try {
      await signIn();
    } catch (err) {
      toast.error("Google sign-in failed. Please try again.");
      setSigningIn(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-mint-100 px-6 dark:bg-[#0B1712]">
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-grad-citrus opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-[-10%] h-96 w-96 rounded-full bg-grad-plum opacity-20 blur-3xl" />

      <div className="glass-card relative w-full max-w-sm p-8 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl3 bg-grad-forest text-white">
          <Leaf size={26} />
        </div>
        <h1 className="mb-2 font-display text-2xl font-semibold">Welcome to NutriLens AI</h1>
        <p className="mb-8 text-sm text-ink-700 dark:text-pine-100/70">
          Sign in with Google to start logging meals with AI-powered nutrition analysis.
        </p>

        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-pine-900/10 bg-white py-3 text-sm font-semibold text-ink-900 shadow-glass transition hover:bg-mint-50 disabled:opacity-60 dark:border-white/10 dark:bg-white/95"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 16.1 3 9.3 7.5 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 45c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.5C29.6 36.4 26.9 37 24 37c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.2 40.4 16 45 24 45z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.3 36 44 30.6 44 24c0-1.2-.1-2.4-.4-3.5z"/>
          </svg>
          {signingIn ? "Redirecting to Google…" : "Continue with Google"}
        </button>

        <p className="mt-6 text-xs text-ink-500 dark:text-pine-100/40">
          By continuing, you agree that nutrition estimates are AI-generated and not medical advice.
        </p>
      </div>
    </div>
  );
}
