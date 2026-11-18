import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/utils";

const fieldControlClass =
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

export interface FieldConfig<Name extends string> {
  name: Name;
  label: string;
  half?: boolean;
  type?: "email";
  inputMode?: "numeric";
  autoComplete?: string;
  placeholder?: string;
  multiline?: boolean;
  options?: { value: string; label: string }[];
}

/** Renders a form's fields from one typed list. */
export function FormFields<Name extends string>({
  fields,
  errorOf,
  registerField,
}: {
  fields: FieldConfig<Name>[];
  errorOf: (name: Name) => string | undefined;
  registerField: (name: Name) => UseFormRegisterReturn;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-3 min-[480px]:grid-cols-2">
      {fields.map((field) => (
        <FormField
          key={field.name}
          id={field.name}
          label={field.label}
          error={errorOf(field.name)}
          className={cn("min-w-0", !field.half && "min-[480px]:col-span-2")}
        >
          {(control) => {
            if (field.options) {
              return (
                <select className={fieldControlClass} {...control} {...registerField(field.name)}>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              );
            }
            if (field.multiline) {
              return (
                <textarea
                  className={cn(fieldControlClass, "h-auto resize-y py-3")}
                  rows={3}
                  {...control}
                  {...registerField(field.name)}
                />
              );
            }
            return (
              <input
                className={fieldControlClass}
                type={field.type ?? "text"}
                inputMode={field.inputMode}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                {...control}
                {...registerField(field.name)}
              />
            );
          }}
        </FormField>
      ))}
    </div>
  );
}

/** A form's one navy button. Disabled until the form's script has loaded. */
export function SubmitButton({ ready, children }: { ready: boolean; children: ReactNode }) {
  return (
    <button
      className="cl-btn flex h-13 w-full cursor-pointer items-center justify-center border border-cl-navy bg-cl-navy tracking-normal text-cl-surface [font:700_15px_var(--font-text)]"
      type="submit"
      disabled={!ready}
    >
      {children}
    </button>
  );
}
