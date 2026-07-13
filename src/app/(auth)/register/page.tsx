"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { registerSchema, type RegisterFormData } from "@/types/auth";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");

    const { error: signUpError } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (signUpError) {
      setServerError(
        signUpError.message ?? "Registration failed. Please try again."
      );
      return;
    }

    setSuccess(true);

    try {
      const { data: session } = await authClient.getSession();
      const user = session?.user as
        | { shopId?: string | null }
        | undefined;
      const destination = user?.shopId ? "/dashboard" : "/onboard";
      setTimeout(() => router.push(destination), 900);
    } catch {
      setTimeout(() => router.push("/onboard"), 900);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
          >
            <CheckCircle className="h-16 w-16 text-indigo-500" />
          </motion.div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Account created!
          </p>
          <p className="text-sm text-gray-500 dark:text-white/40">
            Redirecting&hellip;
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          variants={container}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-xl dark:shadow-2xl sm:p-10">
            {/* Header */}
            <motion.div variants={item} className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                <User className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create your account
              </h1>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-white/40">
                Get started with InventraAI
              </p>
            </motion.div>

            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
              >
                {serverError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <motion.div variants={item} className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-white/60"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    className={`w-full rounded-lg border bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 dark:bg-white/5 dark:text-white dark:placeholder-white/30 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-300 focus:border-indigo-500 dark:border-white/10"
                    }`}
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div variants={item} className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-white/60"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full rounded-lg border bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 dark:bg-white/5 dark:text-white dark:placeholder-white/30 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-300 focus:border-indigo-500 dark:border-white/10"
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div variants={item} className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-white/60"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className={`w-full rounded-lg border bg-gray-50 py-2.5 pl-10 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 dark:bg-white/5 dark:text-white dark:placeholder-white/30 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-300 focus:border-indigo-500 dark:border-white/10"
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 transition-colors hover:text-gray-600 dark:text-white/30 dark:hover:text-white/60"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div variants={item}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-[#050510]"
                >
                  {isSubmitting ? (
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </button>
              </motion.div>
            </form>

            <motion.p variants={item} className="mt-6 text-center text-sm text-gray-500 dark:text-white/40">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
              >
                Sign in
              </a>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
