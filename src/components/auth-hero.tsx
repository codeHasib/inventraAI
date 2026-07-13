"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function AuthHero() {
  const pathname = usePathname();
  const isRegister = pathname.includes("/register");

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-950 p-12">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Mesh gradient orbs */}
      <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-emerald-600/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-indigo-600/8 blur-[100px]" />

      {/* Radial glow behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[80px]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-md space-y-6 text-center"
      >
        {/* Emerald accent line */}
        <div className="mx-auto h-1 w-12 rounded-full bg-emerald-500" />

        {/* Headline */}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {isRegister ? (
            <>Join the Future of{" "}<span className="text-emerald-400">Logistics</span></>
          ) : (
            <>Welcome back to{" "}<span className="text-emerald-400">Inventra AI</span></>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-base leading-relaxed text-zinc-400">
          Manage your global inventory ecosystem, track multi-warehouse assets, and unlock
          predictive supply analytics with elite speed and precision.
        </p>

        {/* Decorative bottom accent */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <div className="h-px w-8 bg-white/10" />
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
          <div className="h-px w-8 bg-white/10" />
        </div>
      </motion.div>
    </div>
  );
}
