interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm backdrop-blur-md transition-all duration-300 ease-in-out dark:border-white/[0.08] dark:bg-zinc-900/40 ${className}`}
    >
      {children}
    </div>
  );
}
