export default function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-zinc-100 dark:bg-white/5 ${className}`}
      {...props}
    />
  );
}
