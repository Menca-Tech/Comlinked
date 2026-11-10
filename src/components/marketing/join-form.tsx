"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type FieldConfig, FormFields, SubmitButton } from "@/components/marketing/form-field";
import { joinFormSchema, type JoinFormValues } from "@/components/marketing/join-form.schema";
import { useSingleSubmit } from "@/components/marketing/use-single-submit";
import { paths } from "@/paths";

const ROLES = ["Owner / CEO", "Sales lead", "Procurement", "Marketing", "Other authorized rep"];

const FIELDS: FieldConfig<Exclude<keyof JoinFormValues, "authorized">>[] = [
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
  const { ready, submit } = useSingleSubmit(() => router.push(paths.product.claim));
  const {
    register,
    handleSubmit,
    formState: { errors },
    // No defaultValues: react-hook-form then reads each field from the page, which keeps
    // anything a visitor typed before the script finished loading.
  } = useForm<JoinFormValues>({ resolver: zodResolver(joinFormSchema) });

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <FormFields
        fields={FIELDS}
        errorOf={(name) => errors[name]?.message}
        registerField={(name) => register(name)}
      />
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
      <SubmitButton ready={ready}>Agree &amp; join</SubmitButton>
    </form>
  );
}
