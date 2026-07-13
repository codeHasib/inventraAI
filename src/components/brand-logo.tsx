"use client";

import Image from "next/image";

interface BrandLogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function BrandLogo({ showText = true, size = "md" }: BrandLogoProps) {
  const imgSizes = { sm: 28, md: 32, lg: 40 };
  const textSizes = { sm: "text-base", md: "text-lg", lg: "text-xl" };

  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="Inventra AI"
        width={imgSizes[size]}
        height={imgSizes[size]}
        className="rounded-lg object-contain"
        priority
      />
      {showText && (
        <span className={`font-bold tracking-tight text-zinc-900 dark:text-zinc-100 ${textSizes[size]}`}>
          Inventra<span className="text-emerald-500">AI</span>
        </span>
      )}
    </div>
  );
}
