import type { Metadata } from "next";

import { SignInContent } from "@/components/marketing/sign-in-content";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to ComLinked with Google, Facebook or an email link.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <SignInContent callbackFailed={error === "auth_callback"} />;
}
