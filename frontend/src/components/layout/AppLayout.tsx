import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  Type,
  History,
  BarChart3,
  Scale,
  Droplets,
  Settings,
  Leaf,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Food", icon: Camera },
  { to: "/analyze", label: "Text Analysis", icon: Type },
  { to: "/history", label: "History", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/weight", label: "Weight Tracker", icon: Scale },
  { to: "/water", label: "Water Tracker", icon: Droplets },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mint-100 dark:bg-[#0B1712] text-ink-900 dark:text-white">
      {/* Mobile topbar */}
      <div className="flex items-center justify-between border-b border-pine-900/10 dark:border-white/10 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <Leaf className="text-pine-600" size={20} /> NutriLens AI
        </div>
        <button onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={clsx(
            "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-pine-900/10 bg-white/70 dark:bg-[#0F241B]/80 backdrop-blur-lg transition-transform lg:static lg:translate-x-0 dark:border-white/10",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col px-4 py-6">
            <div className="mb-8 hidden items-center gap-2 px-2 font-display text-xl font-semibold lg:flex">
              <Leaf className="text-pine-600" size={22} /> NutriLens AI
            </div>

            <nav className="flex-1 space-y-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-grad-forest text-white shadow-glass"
                        : "text-ink-700 hover:bg-pine-50 dark:text-pine-100/80 dark:hover:bg-white/5"
                    )
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 space-y-3 border-t border-pine-900/10 dark:border-white/10 pt-4">
              <div className="flex items-center gap-3 px-2">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-grad-citrus text-sm font-semibold text-white">
                    {(user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user?.user_metadata?.full_name || "Welcome"}</p>
                  <p className="truncate text-xs text-ink-500 dark:text-pine-100/50">{user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2 px-2">
                <button
                  onClick={toggleTheme}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl2 border border-pine-900/10 dark:border-white/10 py-2 text-sm hover:bg-pine-50 dark:hover:bg-white/5"
                >
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === "light" ? "Dark" : "Light"}
                </button>
                <button
                  onClick={signOut}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl2 border border-red-500/20 py-2 text-sm text-red-500 hover:bg-red-500/10"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-h-screen flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
