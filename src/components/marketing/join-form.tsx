"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { fieldControlClass, FormField } from "@/components/marketing/form-field";
import { joinFormSchema, type JoinFormValues } from "@/components/marketing/join-form.schema";
import { cn } from "@/lib/utils";
import { paths } from "@/paths";

const ROLES = ["Owner / CEO", "Sales lead", "Procurement", "Marketing", "Other authorized rep"];

interface JoinField {
  name: Exclude<keyof JoinFormValues, "authorized">;
  label: string;
  half?: boolean;
  type?: "email";
  autoComplete?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

const FIELDS: JoinField[] = [
  {
    name: "company",
    label: "Company name",
    autoComplete: "organization",
    placeholder: "e.g. Kalayaan Foods Inc.",
  },
  { name: "name", label: "Your name", half: true, autoComplete: "name" },
  {
    name: "role",
    label: "Your role",
    half: true,
    options: ROLES.map((role) => ({ value: role, label: role })),
  },
  {
    name: "email",
    label: "Work email",
    type: "email",
    autoComplete: "email",
    placeholder: "you@yourcompany.com",
  },
  {
    name: "chamber",
    label: "Chamber or association (optional)",
    options: [
      { value: "", label: "Not a member yet" },
      { value: "Other chamber or association", label: "Other chamber or association" },
    ],
  },
];

/** Checks the visitor's details, then opens the simulated claim flow. Nothing is stored or sent. */
export function JoinForm() {
  const router = useRouter();
  const navigating = useRef(false);
  // Without JavaScript a native submit would put the values in the web address.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // No defaultValues: react-hook-form then reads each field from the page, which keeps
    // anything a visitor typed before the script finished loading.
  } = useForm<JoinFormValues>({ resolver: zodResolver(joinFormSchema) });

  function openClaimFlow() {
    if (navigating.current) return;
    navigating.current = true;
    router.push(paths.product.claim);
  }

  return (
    <form noValidate onSubmit={handleSubmit(openClaimFlow)}>
      <div className="grid grid-cols-1 gap-x-3 min-[480px]:grid-cols-2">
        {FIELDS.map((field) => (
          <FormField
            key={field.name}
            id={field.name}
            label={field.label}
            error={errors[field.name]?.message}
            className={cn("min-w-0", !field.half && "min-[480px]:col-span-2")}
          >
            {(control) =>
              field.options ? (
                <select className={fieldControlClass} {...control} {...register(field.name)}>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className={fieldControlClass}
                  type={field.type ?? "text"}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  {...control}
                  {...register(field.name)}
                />
              )
            }
          </FormField>
        ))}
      </div>
      <label
        className="mx-0 mt-1.5 mb-6 flex cursor-pointer items-start gap-3 text-[14px] leading-[21px] text-cl-ink-2"
        htmlFor="authorized"
      >
        <input
          className="mx-0 mt-0.5 mb-0 h-4.5 w-4.5 flex-none cursor-pointer accent-cl-accent"
          id="authorized"
          type="checkbox"
          {...register("authorized")}
        />
        <span>I’m authorized to connect my company with other companies on its behalf.</span>
      </label>
      <p className="mx-0 mt-[-8px] mb-5 text-[13px] leading-[19px] text-cl-muted">
        Your profile, and which companies view it, are visible to other companies on ComLinked.
      </p>
      <button
        className="cl-btn flex h-13 w-full cursor-pointer items-center justify-center border border-cl-navy bg-cl-navy tracking-normal text-cl-surface [font:700_15px_var(--font-text)]"
        type="submit"
        disabled={!ready}
      >
        Agree &amp; join
      </button>
    </form>
  );
}
