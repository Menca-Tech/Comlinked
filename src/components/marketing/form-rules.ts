import { z } from "zod";

export const TEXT_LIMIT = 200;
export const MESSAGE_LIMIT = 1000;

const tooLong = (limit: number) => `Use ${limit} characters or fewer.`;

export const optionalText = (limit = TEXT_LIMIT) => z.string().trim().max(limit, tooLong(limit));

export const requiredText = (message: string) => optionalText().min(1, message);

export const emailAddress = (example: string) =>
  requiredText("Enter your work email.").email(`Enter a valid email, like ${example}.`);
