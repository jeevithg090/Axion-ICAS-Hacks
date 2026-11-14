import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  /** Render the wordmark in white (for dark hero backgrounds). */
  inverted?: boolean;
}

export default function Logo({ className, inverted }: Props) {
  return (
    <Link
      to="/"
      aria-label="ICAS home"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md text-lg font-extrabold tracking-tight",
        inverted ? "text-white" : "text-foreground",
        className,
      )}
    >
      <img
        src="/logo.svg"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8"
        decoding="async"
      />
      <span>ICAS</span>
    </Link>
  );
}
