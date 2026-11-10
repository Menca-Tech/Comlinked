"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { type FieldConfig, FormFields, SubmitButton } from "@/components/marketing/form-field";
import { pilotFormSchema, type PilotFormValues } from "@/components/marketing/pilot-form.schema";
import { useSingleSubmit } from "@/components/marketing/use-single-submit";
import { paths } from "@/paths";

const FIELDS: FieldConfig<keyof PilotFormValues>[] = [
  { name: "chamber", label: "Chamber or association", autoComplete: "organization" },
  { name: "name", label: "Your name", half: true, autoComplete: "name" },
  { name: "role", label: "Your role", half: true, placeholder: "e.g. Executive Director" },
  {
    name: "memberCount",
    label: "Member companies (optional)",
    half: true,
    inputMode: "numeric",
    placeholder: "e.g. 150",
  },
  {
    name: "email",
    label: "Work email",
    half: true,
    type: "email",
    autoComplete: "email",
    placeholder: "you@yourchamber.org",
  },
  { name: "message", label: "Message (optional)", multiline: true },
];

/** Checks the request, says nothing was sent, then opens the chamber tools. */
export function PilotForm() {
  const router = useRouter();
  const { ready, submit } = useSingleSubmit(() => {
    toast("This is a demo, so nothing was sent. Opening the chamber tools.");
    router.push(paths.product.chamber);
  });
  // No defaultValues: react-hook-form then reads each field from the page, which keeps
  // anything a visitor typed before the script finished loading.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PilotFormValues>({ resolver: zodResolver(pilotFormSchema) });

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <FormFields
        fields={FIELDS}
        errorOf={(name) => errors[name]?.message}
        registerField={(name) => register(name)}
      />
      <SubmitButton ready={ready}>Request a pilot</SubmitButton>
    </form>
  );
}
