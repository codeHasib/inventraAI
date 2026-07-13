"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    <>
      {/* Desktop navbar */}
      <header className="sticky top-0 z-30 hidden h-16 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 backdrop-blur-md transition-all duration-300 ease-in-out sm:px-6 lg:flex lg:px-8 dark:border-white/[0.08] dark:bg-zinc-900/40">
        <div />

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotificationsOpen((o) => !o)}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300"
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
              <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-xl backdrop-blur-md dark:border-white/[0.08] dark:bg-zinc-900/95">
                <div className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Inventory Alerts</h4>
                  {warnings.length > 0 && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {warnings.length} item{warnings.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {alertsLoading ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
                    </div>
                  ) : warnings.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <PackageX className="mx-auto mb-2 h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">No new alerts</p>
                    </div>
                  ) : (
                    warnings.map((w) => {
                      const isOut = w.status === "OUT_OF_STOCK";
                      return (
                        <div
                          key={w._id}
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5"
                        >
                          <div className="mt-0.5 shrink-0">
                            <AlertTriangle className={`h-4 w-4 ${isOut ? "text-red-500" : "text-amber-500"}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{w.name}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
          <div className="mx-1 hidden h-6 w-px bg-zinc-200 dark:bg-white/10 sm:block" />

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-white/5"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                  {initials}
                </div>
              )}
              <span className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:block">
                {userName}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-zinc-400 dark:text-zinc-500 sm:block" />
            </button>

            {dropdownOpen && (
              <div className="md:absolute md:right-0 md:top-full md:mt-2 md:w-48 md:block z-50 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-xl">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="text-sm font-medium text-zinc-100">
                    {userName}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {user?.email ?? ""}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/dashboard/settings");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/5"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/dashboard/settings");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/5"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-white/10">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
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

      {/* Mobile floating glass navbar */}
      <div className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out md:hidden dark:border-b dark:border-white/10 dark:bg-slate-950/80">
        <div className="flex h-16 items-center justify-between px-4">
          <button
            onClick={onToggleMobile}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-300"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Inventra AI"
              width={28}
              height={28}
              className="rounded-md object-contain"
            />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Inventra<span className="text-emerald-500">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotificationsOpen((o) => !o)}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {warnings.length > 0 && (
                  <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">
                    {warnings.length > 99 ? "99+" : warnings.length}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-xl backdrop-blur-md dark:border-white/[0.08] dark:bg-zinc-900/95">
                  <div className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Inventory Alerts</h4>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {warnings.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <PackageX className="mx-auto mb-2 h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">No new alerts</p>
                      </div>
                    ) : (
                      warnings.map((w) => {
                        const isOut = w.status === "OUT_OF_STOCK";
                        return (
                          <div key={w._id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5">
                            <AlertTriangle className={`h-4 w-4 shrink-0 ${isOut ? "text-red-500" : "text-amber-500"}`} />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{w.name}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {w.currentStock}/{w.minimumStock}
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
            <ThemeToggle />

            {/* Profile dropdown — mobile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-white/5"
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                    {initials}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200/80 bg-white/95 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-slate-900/95">
                  <div className="border-b border-zinc-200/80 px-4 py-3 dark:border-white/10">
                    <p className="text-sm font-medium text-zinc-800 dark:text-slate-200">
                      {userName}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {user?.email ?? ""}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/dashboard/settings");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/dashboard/settings");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </div>
                  <div className="border-t border-zinc-200/80 dark:border-white/10">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
