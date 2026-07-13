"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import Button from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
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
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`group rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-200 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-800 ${spanClasses[span]} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        console.log("AUTH_STATE_DEBUG: [LandingPage] checking session…");
        console.log("AUTH_STATE_DEBUG: [LandingPage] authClient.baseURL:", authClient.baseURL);
        const { data: session } = await authClient.getSession();
        console.log("AUTH_STATE_DEBUG: [LandingPage] session:", session?.user ? { id: session.user.id, email: session.user.email } : null);
        if (!cancelled && session?.user) {
          console.log("AUTH_STATE_DEBUG: [LandingPage] user exists → redirecting to /dashboard");
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error("AUTH_STATE_DEBUG: [LandingPage] getSession threw:", err);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            InventraAI
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="secondary"
              onClick={() => router.push("/login")}
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
            <Button onClick={() => router.push("/register")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex min-h-screen items-center justify-center px-4 pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <span className="mb-4 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Open Beta &mdash; Free to start
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl"
            >
              Smart inventory
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
                management
              </span>{" "}
              for your business
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400"
            >
              Track stock, manage purchases and sales, generate barcodes, gain
              AI-powered insights, and grow your business with a single platform.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button
                onClick={() => router.push("/register")}
                className="px-8 py-3 text-base"
              >
                Start for Free
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/login")}
                className="px-8 py-3 text-base"
              >
                Sign In
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="border-t border-gray-200 bg-gray-50 px-4 py-24 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl"
            >
              Everything you need
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-gray-400"
            >
              A complete toolkit for modern inventory management &mdash; from
              stock tracking to AI-powered business insights.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5"
          >
            {/* 1. Smart Business Control — large card */}
            <BentoCard span="large" className="sm:col-span-2 md:col-span-2 md:row-span-2">
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Smart Business Control
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Manage multiple shops from a single account. Each shop has its
                  own inventory, settings, and subscription. The dashboard gives
                  you a real-time overview of revenue, stock levels, and key
                  metrics at a glance.
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      Multi-Shop
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      Unlimited shops
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      Dashboard
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      Real-time overview
                    </p>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* 2. Inventory Logistics */}
            <BentoCard>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Inventory Logistics
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Generate barcodes and QR codes for every product. Get low-stock
                  and out-of-stock alerts before you run out.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Barcodes
                  </span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    QR Codes
                  </span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Low-Stock Alerts
                  </span>
                </div>
              </div>
            </BentoCard>

            {/* 3. AI-Powered Insights — featured */}
            <BentoCard span="large" className="sm:col-span-2 md:col-span-2 md:row-span-2">
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI-Powered Insights
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Upload your business documents &mdash; PDFs, DOCX, TXT, CSV
                  &mdash; and our AI extracts key information. Ask questions in
                  natural language and get answers grounded in your actual data,
                  complete with source references.
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3 pt-6 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      Documents
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      PDF, DOCX, TXT, CSV
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      Semantic Chat
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      Ask anything
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      Sources
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      Cited answers
                    </p>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* 4. E-Commerce Ops */}
            <BentoCard>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  E-Commerce Operations
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Track expenses by category, generate invoices with custom
                  prefixes, and run detailed sales and profit reports &mdash;
                  exportable to CSV or Excel.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Expenses
                  </span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Invoices
                  </span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Sales Reports
                  </span>
                </div>
              </div>
            </BentoCard>

            {/* 5. Purchases & Suppliers */}
            <BentoCard>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Purchases & Suppliers
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Manage your supplier network and track every purchase with
                  invoice numbers, payment status, and automatic stock updates.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Suppliers
                  </span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Purchase Orders
                  </span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Auto Stock
                  </span>
                </div>
              </div>
            </BentoCard>

            {/* 6. Notifications & Settings */}
            <BentoCard>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Notifications & Settings
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Get alerts for low stock, expiring products, and monthly
                  summaries. Configure your shop&apos;s currency, timezone, tax
                  rates, and invoice branding.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Alerts
                  </span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Monthly Summaries
                  </span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Branding
                  </span>
                </div>
              </div>
            </BentoCard>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl"
            >
              Ready to take control?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-gray-500 dark:text-gray-400"
            >
              Join businesses that use InventraAI to streamline their operations.
              Free to start, no credit card required.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Button
                onClick={() => router.push("/register")}
                className="px-10 py-3 text-base"
              >
                Get Started &mdash; It&apos;s Free
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-gray-200 px-4 py-8 dark:border-gray-800">
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} InventraAI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
