interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "danger" | "warning" | "success";
  className?: string;
}

const variants = {
  default:
    "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-white/60",
  danger:
    "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
