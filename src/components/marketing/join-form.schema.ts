import { z } from "zod";

export const TEXT_LIMIT = 200;

const limit = [TEXT_LIMIT, `Use ${TEXT_LIMIT} characters or fewer.`] as const;
const requiredText = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .max(...limit);

export const joinFormSchema = z.object({
  company: requiredText("Enter your company name."),
  name: requiredText("Enter your name."),
  role: requiredText("Choose your role."),
  email: requiredText("Enter your work email.").email(
    "Enter a valid email, like you@yourcompany.com.",
  ),
  chamber: z
    .string()
    .trim()
    .max(...limit),
  authorized: z.boolean(),
});

export type JoinFormValues = z.infer<typeof joinFormSchema>;
