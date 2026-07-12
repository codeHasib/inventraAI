import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
