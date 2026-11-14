import { AlertCircle } from "lucide-react";

export default function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-1.5 flex items-center gap-1.5 text-sm text-destructive"
    >
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
