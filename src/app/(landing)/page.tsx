"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import Button from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const FEATURES = [
  {
    title: "Inventory Tracking",
    desc: "Real-time stock levels, low-stock alerts, and automated reorder suggestions.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    title: "Sales & Purchases",
    desc: "Track every transaction, manage suppliers, and monitor profit margins.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "AI-Powered Insights",
    desc: "Upload documents and chat with your business data for actionable insights.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: "Reports & Analytics",
    desc: "Sales reports, profit analysis, and exportable data in CSV or Excel.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const { data: session } = await authClient.getSession();
        if (!cancelled && session?.user) {
          router.replace("/dashboard");
        }
      } catch {
        // not logged in, stay on landing
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
            <Button variant="secondary" onClick={() => router.push("/login")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/register")}>Get Started</Button>
          </div>
        </div>
      </header>

      <section className="flex min-h-screen items-center justify-center px-4 pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1
              custom={0}
              variants={fadeUp}
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
            >
              Smart inventory
              <br />
              <span className="text-blue-600 dark:text-blue-400">
                management
              </span>{" "}
              for your business
            </motion.h1>

            <motion.p
              custom={1}
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400"
            >
              Track stock, manage purchases and sales, gain AI-powered insights,
              and grow your business with a single platform.
            </motion.p>

            <motion.div
              custom={2}
              variants={fadeUp}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button onClick={() => router.push("/register")} className="px-8 py-3 text-base">
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

      <section className="border-t border-gray-200 bg-gray-50 px-4 py-24 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              Everything you need
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-gray-400"
            >
              A complete toolkit for modern inventory management
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i + 2}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-200 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-800"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              Ready to take control?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-4 text-gray-500 dark:text-gray-400"
            >
              Join businesses that use InventraAI to streamline their operations.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="mt-8">
              <Button
                onClick={() => router.push("/register")}
                className="px-10 py-3 text-base"
              >
                Get Started — It&apos;s Free
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
