import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Consistent title block for the top of a page. */
export default function PageHeader({
  title,
  eyebrow,
  description,
  actions,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="min-w-0 animate-fade-up">
        {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
        <h1 className={cn("page-title", eyebrow && "mt-2")}>{title}</h1>
        {description && <p className="page-lead">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
