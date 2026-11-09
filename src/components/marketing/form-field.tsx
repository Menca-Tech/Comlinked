import type { ReactNode } from "react";

export const fieldControlClass =
  "cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3.5 py-0 text-cl-ink [font:400_16px_var(--font-text)] aria-invalid:border-cl-error";

interface FieldControlProps {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
}

/** A label, its control and the message beside it, with the accessibility wiring between them. */
export function FormField({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <div className="mb-4.5 flex min-w-0 flex-col gap-2">
        <label
          className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
          htmlFor={id}
        >
          {label}
        </label>
        {children({
          id,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
        })}
        {error ? (
          <p className="m-0 text-[14px] leading-[20px] text-cl-error" id={errorId}>
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
