"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button";
import BrandLogo from "@/components/brand-logo";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-gray-50/80 backdrop-blur-2xl transition-colors duration-300 dark:border-white/5 dark:bg-[#050510]/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="cursor-pointer" onClick={() => router.push("/")}>
          <BrandLogo size="sm" />
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button
            variant="ghost"
            onClick={() => router.push("/login")}
            className="text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white"
          >
            Sign In
          </Button>
          <Button
            onClick={() => router.push("/register")}
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-gray-800 dark:bg-white dark:text-[#050510] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] dark:hover:bg-white/90 dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 z-50 w-full border-b border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-md dark:border-white/5 dark:bg-[#050510]/95 md:hidden"
          >
            <div className="flex flex-col gap-3">
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  router.push("/login");
                  setMobileOpen(false);
                }}
                className="w-full justify-center text-gray-700 hover:text-gray-900 dark:text-white/70 dark:hover:text-white"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  router.push("/register");
                  setMobileOpen(false);
                }}
                className="w-full justify-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm dark:bg-white dark:text-[#050510]"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
