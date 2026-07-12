"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu, X, LogOut, User, Settings, ChevronDown, AlertTriangle, PackageX } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/components/theme-toggle";
import { useAlerts } from "@/hooks/use-alerts";

interface NavbarProps {
  mobileOpen: boolean;
  onToggleMobile: () => void;
}

export default function Navbar({ mobileOpen, onToggleMobile }: NavbarProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { warnings, loading: alertsLoading } = useAlerts();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const userName = user?.name ?? "User";
  const userImage = user?.image;
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        onClick={onToggleMobile}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen((o) => !o)}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {warnings.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                {warnings.length > 99 ? "99+" : warnings.length}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Inventory Alerts</h4>
                {warnings.length > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {warnings.length} item{warnings.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {alertsLoading ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
                  </div>
                ) : warnings.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <PackageX className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">No new alerts</p>
                  </div>
                ) : (
                  warnings.map((w) => {
                    const isOut = w.status === "OUT_OF_STOCK";
                    return (
                      <div
                        key={w._id}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <div className="mt-0.5 shrink-0">
                          <AlertTriangle className={`h-4 w-4 ${isOut ? "text-red-500" : "text-amber-500"}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{w.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {w.currentStock}/{w.minimumStock} &middot; {isOut ? "Out of Stock" : "Low Stock"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Divider */}
        <div className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                {initials}
              </div>
            )}
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-300 sm:block">
              {userName}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email ?? ""}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/dashboard/settings");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/dashboard/settings");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
