import { z } from "zod";

export interface OnboardingFormData {
  name: string;
  slug: string;
  businessType: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
}

export const onboardingSchema = z.object({
  name: z
    .string()
    .min(1, "Business name is required")
    .max(200, "Business name must be 200 characters or less")
    .trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be 200 characters or less")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  businessType: z.string().min(1, "Business type is required").trim(),
  phone: z.string().min(1, "Phone number is required").trim(),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  address: z.string().min(1, "Address is required").trim(),
  currency: z.string().min(1, "Currency is required"),
});

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "BDT", label: "BDT - Bangladeshi Taka" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "SGD", label: "SGD - Singapore Dollar" },
] as const;
