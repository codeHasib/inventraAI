"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Store,
  Phone,
  MapPin,
} from "lucide-react";
import api from "@/lib/axios";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import {
  type OnboardingFormData,
  onboardingSchema,
  STEP_FIELDS,
  STEP_LABELS,
  CURRENCY_OPTIONS,
  TIMEZONE_OPTIONS,
} from "@/types/onboarding";

const TOTAL_STEPS = STEP_FIELDS.length;

const STEP_ICONS = [Store, Phone, MapPin];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 240 : -240,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -240 : 240,
    opacity: 0,
  }),
};

interface OnboardingFormProps {
  onSkip?: () => void;
  skipLoading?: boolean;
  skipError?: string;
}

export default function OnboardingForm({ onSkip, skipLoading, skipError }: OnboardingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [stepValid, setStepValid] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      slug: "",
      businessType: "",
      phone: "",
      email: "",
      address: "",
      currency: "USD",
      timezone: "",
    },
  });

  const currentFields = STEP_FIELDS[step];
  const watchedValues = useWatch({ control, name: currentFields });

  useEffect(() => {
    let cancelled = false;
    trigger(currentFields, { shouldFocus: false }).then((valid) => {
      if (!cancelled) setStepValid(valid);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues, step]);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue("name", value);
      setValue("slug", slugify(value), { shouldValidate: true });
    },
    [setValue]
  );

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step], { shouldFocus: false });
    if (valid && step < TOTAL_STEPS - 1) {
      setDirection(1);
      setServerError("");
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setServerError("");
      setStep((s) => s - 1);
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setServerError("");
    try {
      const payload = {
        name: data.name.trim(),
        slug: data.slug.trim(),
        businessType: data.businessType.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
        currency: data.currency || "USD",
        timezone: data.timezone || "UTC",
      };
      await api.post("/shops/onboard", payload);
      setSuccess(true);
      setTimeout(() => window.location.href = "/dashboard", 1200);
    } catch (err: unknown) {
      // console.error("Validation Error:", (err as any)?.response?.data);
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = axiosErr.response?.status;
      const message =
        axiosErr.response?.data?.message ?? "Something went wrong. Please try again.";

      if (status === 400 && /slug/i.test(message)) {
        setError("slug", {
          type: "manual",
          message: "This slug is already taken",
        });
        setDirection(-1);
        setStep(0);
      } else {
        setServerError(message);
      }
    }
  };

  if (success) {
    return (
      <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
        >
          <CheckCircle className="h-8 w-8 text-indigo-400" />
        </motion.div>
        <h2 className="text-xl font-bold text-white">
          Shop created!
        </h2>
        <p className="mt-2 text-sm text-white/40">
          Redirecting to your dashboard&hellip;
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
      {/* Decorative grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative corner accent */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">
            Set up your shop
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Tell us about your business to get started
          </p>
        </div>

        {/* Step pipeline */}
        <div className="mb-8 flex items-center justify-between px-2">
          {STEP_LABELS.map((label, i) => {
            const Icon = STEP_ICONS[i];
            const isCompleted = i < step;
            const isCurrent = i === step;
            return (
              <div key={`step-${i}`} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      borderColor: isCompleted || isCurrent ? "rgba(99,102,241,1)" : "rgba(255,255,255,0.1)",
                      backgroundColor: isCompleted
                        ? "rgba(99,102,241,0.15)"
                        : isCurrent
                          ? "rgba(99,102,241,1)"
                          : "rgba(255,255,255,0.03)",
                      boxShadow: isCompleted
                        ? "0 0 12px rgba(99,102,241,0.25)"
                        : isCurrent
                          ? "0 0 20px rgba(99,102,241,0.35)"
                          : "0 0 0px rgba(99,102,241,0)",
                    }}
                    transition={{ duration: 0.4 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2"
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-indigo-400" />
                    ) : (
                      <Icon className={`h-4 w-4 ${isCurrent ? "text-white" : "text-white/30"}`} />
                    )}
                  </motion.div>
                  <span
                    className={`mt-2 text-xs hidden sm:block transition-colors duration-300 ${
                      isCurrent ? "text-white font-medium" : isCompleted ? "text-indigo-300/60" : "text-white/20"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className="relative mx-2 flex items-center sm:mx-3">
                    <div className="h-px w-8 sm:w-16 bg-white/10" />
                    <motion.div
                      initial={false}
                      animate={{
                        scaleX: isCompleted ? 1 : 0,
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-0 h-px w-8 sm:w-16 origin-left bg-indigo-500"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs text-white/30">
            <span>
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={false}
              animate={{
                width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300 backdrop-blur-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative overflow-hidden" style={{ minHeight: 200 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-5"
              >
                {step === 0 && (
                  <>
                    <Input
                      label="Shop Name"
                      placeholder="Acme Corp"
                      {...register("name", {
                        onChange: handleNameChange,
                      })}
                      error={errors.name?.message}
                    />
                    {errors.slug && (
                      <p className="text-xs text-red-400">
                        {errors.slug.message}
                      </p>
                    )}
                    <Input
                      label="Business Type"
                      placeholder="Retail, Wholesale, E-commerce..."
                      {...register("businessType")}
                      error={errors.businessType?.message}
                    />
                  </>
                )}

                {step === 1 && (
                  <>
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...register("phone")}
                      error={errors.phone?.message}
                    />
                    <Input
                      label="Business Email"
                      type="email"
                      placeholder="contact@acme.com"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <Textarea
                      label="Address"
                      placeholder="123 Main St, City, Country"
                      rows={3}
                      {...register("address")}
                      error={errors.address?.message}
                    />
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Select
                        label="Currency"
                        options={CURRENCY_OPTIONS.map((c) => ({
                          value: c.value,
                          label: c.label,
                        }))}
                        {...register("currency")}
                        error={errors.currency?.message}
                      />
                      <Select
                        label="Timezone"
                        options={[
                          { value: "", label: "Select timezone" },
                          ...TIMEZONE_OPTIONS,
                        ]}
                        {...register("timezone")}
                        error={errors.timezone?.message}
                      />
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={goBack}
                className="flex-1"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back
              </Button>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={!stepValid}
                className="flex-1"
              >
                Next
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!stepValid}
                className="flex-1"
              >
                Create Shop
              </Button>
            )}
          </div>
        </form>

        {onSkip && (
          <div className="mt-4">
            {skipError && (
              <p className="mb-2 text-center text-xs text-red-400">{skipError}</p>
            )}
            <button
              type="button"
              onClick={onSkip}
              disabled={skipLoading}
              className="flex w-full items-center justify-center gap-2 py-2 text-sm text-slate-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50 underline-offset-4 hover:underline"
            >
              {skipLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Setting up&hellip;
                </>
              ) : (
                "Skip for now"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
