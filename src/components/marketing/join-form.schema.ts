import { z } from "zod";

import { emailAddress, optionalText, requiredText } from "@/components/marketing/form-rules";

export const joinFormSchema = z.object({
  company: requiredText("Enter your company name."),
  name: requiredText("Enter your name."),
  role: requiredText("Choose your role."),
  email: emailAddress("you@yourcompany.com"),
  chamber: optionalText(),
  authorized: z.boolean(),
});

export type JoinFormValues = z.infer<typeof joinFormSchema>;
