"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import ThemeToggle from "@/components/theme-toggle";
import {
  type OnboardingFormData,
  onboardingSchema,
  CURRENCY_OPTIONS,
} from "@/types/onboarding";

const STEP_FIELDS: (keyof OnboardingFormData)[][] = [
  ["name", "slug", "businessType"],
  ["phone", "email", "address"],
  ["currency"],
];

const STEP_LABELS = ["Business Info", "Contact Details", "Preferences"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface OnboardingFormProps {
  onSkip?: () => void;
}

export default function OnboardingForm({ onSkip }: OnboardingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState("");
  const [businessName, setBusinessName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
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
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBusinessName(value);
    setValue("name", value);
    setValue("slug", slugify(value), { shouldValidate: true });
  };

  const goToStep = async (target: number) => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) {
      setServerError("");
      setStep(target);
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setServerError("");
    try {
      await api.post("/shops/onboard", data);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Something went wrong. Please try again.";
      setServerError(msg);
    }
  };

  return (
    <div className="relative w-full max-w-lg px-4">
      <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <Card>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Set up your shop
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tell us about your business to get started
          </p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  i < step
                    ? "bg-green-500 text-white"
                    : i === step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {i < step ? "\u2713" : i + 1}
              </span>
              <span
                className={`text-sm hidden sm:inline ${
                  i === step
                    ? "font-medium text-gray-900 dark:text-white"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`mx-1 h-px w-8 ${
                    i < step
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {serverError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {step === 0 && (
            <>
              <Input
                label="Business Name"
                placeholder="Acme Corp"
                value={businessName}
                onChange={handleNameChange}
                error={errors.name?.message}
              />
              <Input
                label="Slug"
                placeholder="acme-corp"
                {...register("slug")}
                error={errors.slug?.message}
                className="bg-gray-50 dark:bg-gray-700/50"
              />
              <Input
                label="Business Type"
                placeholder="Retail, Wholesale, etc."
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
              <Textarea
                label="Address"
                placeholder="123 Main St, City, Country"
                rows={3}
                {...register("address")}
                error={errors.address?.message}
              />
            </>
          )}

          {step === 2 && (
            <Select
              label="Currency"
              options={CURRENCY_OPTIONS.map((c) => ({
                value: c.value,
                label: c.label,
              }))}
              {...register("currency")}
              error={errors.currency?.message}
            />
          )}

          <div className="flex gap-3 pt-4">
            {step > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}

            {step < STEP_FIELDS.length - 1 ? (
              <Button
                type="button"
                onClick={() => goToStep(step + 1)}
                className="flex-1"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                loading={isSubmitting}
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
            className="mt-3 w-full py-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Skip for now
          </button>
        )}
      </Card>
    </div>
  );
}
