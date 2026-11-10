import { z } from "zod";

import {
  emailAddress,
  MESSAGE_LIMIT,
  optionalText,
  requiredText,
} from "@/components/marketing/form-rules";

const WHOLE_NUMBER = /^[1-9]\d*$/;

export const pilotFormSchema = z.object({
  chamber: requiredText("Enter your chamber or association."),
  name: requiredText("Enter your name."),
  role: requiredText("Enter your role."),
  memberCount: optionalText().refine(
    (value) => value === "" || WHOLE_NUMBER.test(value),
    "Enter a number, like 150.",
  ),
  email: emailAddress("you@yourchamber.org"),
  message: optionalText(MESSAGE_LIMIT),
});

export type PilotFormValues = z.infer<typeof pilotFormSchema>;
