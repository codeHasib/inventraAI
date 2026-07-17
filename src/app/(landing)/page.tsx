"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import Button from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function BentoCard({
  children,
  className = "",
  span = "default",
}: {
  children: React.ReactNode;
  className?: string;
  span?: "default" | "wide" | "tall" | "large";
}) {
  const spanClasses = {
    default: "",
    wide: "md:col-span-2",
    tall: "md:row-span-2",
    large: "md:col-span-2 md:row-span-2",
  };

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
      className={`group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-xl dark:hover:border-white/20 dark:hover:bg-white/[0.08] sm:p-8 ${spanClasses[span]} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gray-100/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/[0.04] dark:to-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { data, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = data?.user as
    | { id: string; email: string; name: string; shopId?: string | null }
    | undefined;

  useEffect(() => {
    if (isPending) return;

    if (user) {
      if (user.shopId) {
        router.replace("/dashboard");
      } else {
        router.replace("/onboard");
      }
    }
  }, [isPending, user, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#050510] transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-500 dark:border-white/10 dark:border-t-blue-500" />
          <p className="text-sm text-gray-500 dark:text-white/40">Loading&hellip;</p>
        </div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#050510] dark:text-white">
      {/* Background mesh gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[20%] top-[10%] h-[600px] w-[600px] rounded-full bg-indigo-300/30 blur-[120px] dark:bg-indigo-600/20" />
        <div className="absolute right-[10%] top-[30%] h-[500px] w-[500px] rounded-full bg-purple-300/20 blur-[120px] dark:bg-purple-600/15" />
        <div className="absolute bottom-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-blue-300/15 blur-[120px] dark:bg-blue-600/10" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-gray-50/80 backdrop-blur-md transition-all duration-300 dark:border-white/5 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Inventra AI"
              width={32}
              height={32}
              className="rounded-lg object-contain"
              priority
            />
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Inventra<span className="text-emerald-500">AI</span>
            </span>
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

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-16">
        {/* Hero glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[200px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/30 blur-[100px] sm:h-[300px] sm:w-[600px] dark:bg-blue-500/20" />

        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <span className="mb-6 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                OPEN BETA &mdash; FREE TO START
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
              <span className="text-gray-900 dark:text-white">Smart inventory</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                management
              </span>{" "}
              <span className="text-gray-900 dark:text-white">for your business</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-white/50"
            >
              Track stock, manage purchases and sales, generate barcodes, gain
              AI-powered insights, and grow your business with a single platform.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/register")}
                className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3.5 text-base font-medium text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-shadow hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
              >
                Start for Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/login")}
                className="rounded-full border border-gray-300 bg-gray-100 px-8 py-3.5 text-base font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:backdrop-blur-sm dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Sign In
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-20 w-full max-w-5xl px-4"
        >
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-1 shadow-2xl sm:rounded-3xl sm:p-2 dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-xl">
            <div className="rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 p-4 dark:from-gray-900 dark:to-gray-950 sm:rounded-2xl sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="col-span-1 space-y-2 sm:space-y-3">
                  <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-white/10" />
                  <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-white/10" />
                  <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-white/10" />
                </div>
                <div className="col-span-2 space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-indigo-100 p-2 sm:p-3 dark:bg-indigo-500/20">
                      <div className="h-2 w-8 rounded bg-indigo-300/60 dark:bg-indigo-400/40" />
                      <div className="mt-1 h-4 w-12 rounded bg-indigo-400/60 dark:bg-indigo-400/60" />
                    </div>
                    <div className="rounded-lg bg-purple-100 p-2 sm:p-3 dark:bg-purple-500/20">
                      <div className="h-2 w-8 rounded bg-purple-300/60 dark:bg-purple-400/40" />
                      <div className="mt-1 h-4 w-12 rounded bg-purple-400/60 dark:bg-purple-400/60" />
                    </div>
                    <div className="rounded-lg bg-pink-100 p-2 sm:p-3 dark:bg-pink-500/20">
                      <div className="h-2 w-8 rounded bg-pink-300/60 dark:bg-pink-400/40" />
                      <div className="mt-1 h-4 w-12 rounded bg-pink-400/60 dark:bg-pink-400/60" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-20 flex-1 rounded-lg bg-gray-100 dark:bg-white/5" />
                    <div className="h-20 flex-1 rounded-lg bg-gray-100 dark:bg-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid — Features */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Everything you need
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-white/40"
            >
              A complete toolkit for modern inventory management &mdash; from
              stock tracking to AI-powered business insights.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5"
          >
            {/* 1. Smart Business Control — large */}
            <BentoCard span="large" className="sm:col-span-2 md:col-span-2 md:row-span-2">
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Smart Business Control
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-white/40">
                  Manage multiple shops from a single account. Each shop has its
                  own inventory, settings, and subscription. The dashboard gives
                  you a real-time overview of revenue, stock levels, and key
                  metrics at a glance.
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                  <div className="rounded-2xl border border-gray-200/60 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                    <p className="text-xs font-medium text-gray-400 dark:text-white/30">Multi-Shop</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">Unlimited shops</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200/60 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                    <p className="text-xs font-medium text-gray-400 dark:text-white/30">Dashboard</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">Real-time overview</p>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* 2. Inventory Logistics */}
            <BentoCard>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Inventory Logistics
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-white/40">
                  Generate barcodes and QR codes for every product. Get low-stock
                  and out-of-stock alerts before you run out.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    Barcodes
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    QR Codes
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    Low-Stock Alerts
                  </span>
                </div>
              </div>
            </BentoCard>

            {/* 3. AI-Powered Insights — large */}
            <BentoCard span="large" className="sm:col-span-2 md:col-span-2 md:row-span-2">
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI-Powered Insights
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-white/40">
                  Upload your business documents &mdash; PDFs, DOCX, TXT, CSV
                  &mdash; and our AI extracts key information. Ask questions in
                  natural language and get answers grounded in your actual data,
                  complete with source references.
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3 pt-6 sm:grid-cols-3">
                  <div className="rounded-2xl border border-gray-200/60 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                    <p className="text-xs font-medium text-gray-400 dark:text-white/30">Documents</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">PDF, DOCX, TXT, CSV</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200/60 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                    <p className="text-xs font-medium text-gray-400 dark:text-white/30">Semantic Chat</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">Ask anything</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200/60 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                    <p className="text-xs font-medium text-gray-400 dark:text-white/30">Sources</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">Cited answers</p>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* 4. E-Commerce Ops */}
            <BentoCard>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  E-Commerce Operations
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-white/40">
                  Track expenses by category, generate invoices with custom
                  prefixes, and run detailed sales and profit reports &mdash;
                  exportable to CSV or Excel.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    Expenses
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    Invoices
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    Sales Reports
                  </span>
                </div>
              </div>
            </BentoCard>

            {/* 5. Purchases & Suppliers */}
            <BentoCard>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Purchases & Suppliers
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-white/40">
                  Manage your supplier network and track every purchase with
                  invoice numbers, payment status, and automatic stock updates.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    Suppliers
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    Purchase Orders
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    Auto Stock
                  </span>
                </div>
              </div>
            </BentoCard>

            {/* 6. Notifications & Settings */}
            <BentoCard>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Notifications & Settings
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-white/40">
                  Get alerts for low stock, expiring products, and monthly
                  summaries. Configure your shop&apos;s currency, timezone, tax
                  rates, and invoice branding.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    Alerts
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    Monthly Summaries
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-white/50">
                    Branding
                  </span>
                </div>
              </div>
            </BentoCard>
          </motion.div>
        </div>
      </section>

      {/* How It Works — alternating left/right */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-20 text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              How it works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-white/40"
            >
              Three simple steps to transform your inventory management.
            </motion.p>
          </motion.div>

          <div className="space-y-20">
            {/* Step 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={stagger}
              className="flex flex-col items-center gap-8 md:flex-row md:gap-16"
            >
              <motion.div variants={slideFromLeft} className="flex-1">
                <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  01
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  Connect your shop
                </h3>
                <p className="mt-3 leading-relaxed text-gray-500 dark:text-white/40">
                  Sign up in seconds and set up your first shop. Add your
                  products, categories, and supplier information. Our onboarding
                  wizard guides you through every step.
                </p>
              </motion.div>
              <motion.div
                variants={slideFromRight}
                className="flex-1"
              >
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="h-3 w-32 rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <div className="h-3 w-40 rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="h-3 w-28 rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={stagger}
              className="flex flex-col items-center gap-8 md:flex-row-reverse md:gap-16"
            >
              <motion.div variants={slideFromRight} className="flex-1">
                <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                  02
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  Manage & track everything
                </h3>
                <p className="mt-3 leading-relaxed text-gray-500 dark:text-white/40">
                  Record purchases, log sales, adjust stock, and generate
                  barcodes. Every transaction automatically updates your inventory
                  in real time. Get alerts before you run out.
                </p>
              </motion.div>
              <motion.div
                variants={slideFromLeft}
                className="flex-1"
              >
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-gray-200/60 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                      <div className="h-2 w-10 rounded bg-emerald-400/60 dark:bg-emerald-400/40" />
                      <div className="mt-2 h-5 w-16 rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                    <div className="rounded-2xl border border-gray-200/60 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                      <div className="h-2 w-10 rounded bg-rose-400/60 dark:bg-rose-400/40" />
                      <div className="mt-2 h-5 w-12 rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                    <div className="col-span-2 rounded-2xl border border-gray-200/60 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
                      <div className="flex gap-1">
                        {[40, 65, 50, 80, 55, 70, 90].map((h, i) => (
                          <div key={i} className="flex flex-1 items-end">
                            <div
                              className="w-full rounded-t bg-gradient-to-t from-indigo-400/50 to-purple-400/50 dark:from-indigo-500/40 dark:to-purple-500/40"
                              style={{ height: `${h}px` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={stagger}
              className="flex flex-col items-center gap-8 md:flex-row md:gap-16"
            >
              <motion.div variants={slideFromLeft} className="flex-1">
                <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-pink-600 dark:text-pink-400">
                  03
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  Get AI-powered insights
                </h3>
                <p className="mt-3 leading-relaxed text-gray-500 dark:text-white/40">
                  Upload business documents and ask questions in natural language.
                  Our AI extracts key metrics, identifies trends, and gives you
                  actionable recommendations to grow your business.
                </p>
              </motion.div>
              <motion.div
                variants={slideFromRight}
                className="flex-1"
              >
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-500 dark:bg-white/10 dark:text-white/50">
                        Q
                      </div>
                      <div className="h-3 flex-1 self-center rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600 dark:bg-indigo-500/30 dark:text-indigo-300">
                        AI
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-3 w-full rounded bg-indigo-100 dark:bg-indigo-500/10" />
                        <div className="h-3 w-4/5 rounded bg-indigo-100 dark:bg-indigo-500/10" />
                        <div className="h-3 w-3/5 rounded bg-indigo-100 dark:bg-indigo-500/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Ready to take control?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-gray-500 dark:text-white/40"
            >
              Join businesses that use InventraAI to streamline their operations.
              Free to start, no credit card required.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/register")}
                className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-10 py-3.5 text-base font-medium text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-shadow hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
              >
                Get Started &mdash; It&apos;s Free
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-8 dark:border-white/5">
        <p className="text-center text-sm text-gray-400 dark:text-white/20">
          &copy; {new Date().getFullYear()} InventraAI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
