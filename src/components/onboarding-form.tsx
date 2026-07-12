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
import Card from "@/components/ui/card";
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
}

export default function OnboardingForm({ onSkip }: OnboardingFormProps) {
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
      await api.post("/shops/onboard", data);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err: unknown) {
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
      <Card className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20"
        >
          <CheckCircle className="h-8 w-8 text-green-500" />
        </motion.div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Shop created!
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Redirecting to your dashboard&hellip;
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Set up your shop
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Tell us about your business to get started
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="h-full rounded-full bg-blue-600"
            initial={false}
            animate={{
              width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" as const }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="mb-8 flex items-center justify-between">
        {STEP_LABELS.map((label, i) => {
          const Icon = STEP_ICONS[i];
          return (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
                  i < step
                    ? "bg-green-500 text-white"
                    : i === step
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {i < step ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </span>
              <span
                className={`text-sm hidden sm:inline transition-colors ${
                  i === step
                    ? "font-medium text-gray-900 dark:text-white"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`mx-1 h-px w-6 transition-colors sm:w-8 ${
                    i < step
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {serverError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
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
              transition={{ duration: 0.25, ease: "easeInOut" as const }}
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
                    <p className="text-xs text-red-500">
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
        <button
          type="button"
          onClick={onSkip}
          className="mt-4 w-full py-2 text-sm text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          Skip for now
        </button>
      )}
    </Card>
  );
}
