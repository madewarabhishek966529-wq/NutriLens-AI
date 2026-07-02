import { Link } from "react-router-dom";
import { Download, Moon, Sun, User, LogOut, FileSpreadsheet, FileText } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { exportCsvUrl, exportPdfUrl } from "@/services/trackingService";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
        <p className="text-ink-700 dark:text-pine-100/70">Appearance, data, and account.</p>
      </div>

      <GlassCard>
        <h2 className="mb-4 font-display text-lg font-semibold">Appearance</h2>
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-xl2 border border-pine-900/10 p-4 dark:border-white/10"
        >
          <div className="flex items-center gap-3">
            {theme === "light" ? <Sun size={18} className="text-mango-500" /> : <Moon size={18} className="text-plum-400" />}
            <span className="font-medium">{theme === "light" ? "Light mode" : "Dark mode"}</span>
          </div>
          <span className="text-sm text-ink-500 dark:text-pine-100/50">Tap to switch</span>
        </button>
      </GlassCard>

      <GlassCard>
        <h2 className="mb-4 font-display text-lg font-semibold">Export your data</h2>
        <div className="flex flex-wrap gap-3">
          <a href={exportCsvUrl()} className="btn-secondary">
            <FileSpreadsheet size={16} /> Export CSV
          </a>
          <a href={exportPdfUrl()} className="btn-secondary">
            <FileText size={16} /> Export PDF
          </a>
        </div>
        <p className="mt-3 text-xs text-ink-500 dark:text-pine-100/50">
          <Download size={12} className="mr-1 inline" /> Downloads your complete nutrition history.
        </p>
      </GlassCard>

      <GlassCard>
        <h2 className="mb-4 font-display text-lg font-semibold">Account</h2>
        <div className="mb-4 flex items-center gap-3">
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="" className="h-12 w-12 rounded-full" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-grad-citrus text-white">
              <User size={20} />
            </div>
          )}
          <div>
            <p className="font-medium">{user?.user_metadata?.full_name}</p>
            <p className="text-sm text-ink-500 dark:text-pine-100/50">{user?.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/profile" className="btn-secondary">
            Edit body stats
          </Link>
          <button onClick={signOut} className="flex items-center gap-2 rounded-full border border-red-500/20 px-6 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
