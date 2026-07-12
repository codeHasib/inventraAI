"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
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
    <div className="w-full max-w-lg p-8">
      <h1 className="text-2xl font-bold text-center mb-2">Set Up Your Shop</h1>
      <p className="text-sm text-gray-500 text-center mb-8">
        Tell us about your business to get started.
      </p>

      <div className="flex items-center justify-between mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                i < step
                  ? "bg-green-500 text-white"
                  : i === step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {i < step ? "\u2713" : i + 1}
            </span>
            <span
              className={`text-sm hidden sm:inline ${
                i === step ? "font-medium text-gray-900" : "text-gray-400"
              }`}
            >
              {label}
            </span>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`w-8 h-px mx-1 ${
                  i < step ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {serverError && (
        <div className="mb-6 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {step === 0 && (
          <>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1"
              >
                Business Name
              </label>
              <input
                id="name"
                type="text"
                value={businessName}
                onChange={handleNameChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Acme Corp"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium mb-1"
              >
                Slug
              </label>
              <input
                id="slug"
                type="text"
                {...register("slug")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="acme-corp"
              />
              {errors.slug && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="businessType"
                className="block text-sm font-medium mb-1"
              >
                Business Type
              </label>
              <input
                id="businessType"
                type="text"
                {...register("businessType")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Retail, Wholesale, etc."
              />
              {errors.businessType && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.businessType.message}
                </p>
              )}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-1"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                {...register("phone")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
              >
                Business Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contact@acme.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-1"
              >
                Address
              </label>
              <textarea
                id="address"
                {...register("address")}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="123 Main St, City, Country"
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium mb-1"
            >
              Currency
            </label>
            <select
              id="currency"
              {...register("currency")}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CURRENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="text-xs text-red-500 mt-1">
                {errors.currency.message}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}

          {step < STEP_FIELDS.length - 1 ? (
            <button
              type="button"
              onClick={() => goToStep(step + 1)}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Creating shop..." : "Create Shop"}
            </button>
          )}
        </div>
      </form>

      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
        >
          Skip for now
        </button>
      )}
    </div>
  );
}
