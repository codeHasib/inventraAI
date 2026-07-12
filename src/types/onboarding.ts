import { z } from "zod";

export interface OnboardingFormData {
  name: string;
  slug: string;
  businessType: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  timezone: string;
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
  timezone: z.string().min(1, "Timezone is required"),
});

export const STEP_FIELDS: (keyof OnboardingFormData)[][] = [
  ["name", "slug", "businessType"],
  ["phone", "email"],
  ["address", "currency", "timezone"],
];

export const STEP_LABELS = ["Identity", "Contact", "Location & Preferences"];

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

export const TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "America/Toronto", label: "Eastern (Canada)" },
  { value: "America/Vancouver", label: "Pacific (Canada)" },
  { value: "Europe/London", label: "GMT / London" },
  { value: "Europe/Paris", label: "CET / Paris" },
  { value: "Europe/Berlin", label: "CET / Berlin" },
  { value: "Europe/Moscow", label: "MSK / Moscow" },
  { value: "Asia/Dubai", label: "GST / Dubai" },
  { value: "Asia/Kolkata", label: "IST / India" },
  { value: "Asia/Dhaka", label: "BST / Bangladesh" },
  { value: "Asia/Singapore", label: "SGT / Singapore" },
  { value: "Asia/Shanghai", label: "CST / Shanghai" },
  { value: "Asia/Tokyo", label: "JST / Tokyo" },
  { value: "Australia/Sydney", label: "AEST / Sydney" },
  { value: "Pacific/Auckland", label: "NZST / Auckland" },
] as const;
