"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { isSupabaseConfigured } from "@/config";
import { createClient } from "@/lib/supabase/client";
import { paths } from "@/paths";

const schema = z.object({ email: z.string().email("Enter a valid work email") });
type Values = z.infer<typeof schema>;
type Pending = "google" | "facebook" | "email" | null;

const NOT_CONFIGURED = "Authentication isn't configured. Set your Supabase environment variables.";
const UNREACHABLE = "Couldn't reach the sign-in service. Please try again.";

const providerButton =
  "cl-btn cl-btn-o border-cl-ink text-cl-ink flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border bg-transparent font-sans text-[15px] font-bold tracking-normal";

function callbackUrl() {
  return `${window.location.origin}${paths.auth.callback}`;
}

export function SignInForm({ callbackFailed = false }: { callbackFailed?: boolean }) {
  const [pending, setPending] = useState<Pending>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  const emailError = form.formState.errors.email?.message;

  async function signInWithProvider(provider: "google" | "facebook") {
    if (!isSupabaseConfigured) {
      toast.error(NOT_CONFIGURED);
      return;
    }
    setPending(provider);
    try {
      const { error } = await createClient().auth.signInWithOAuth({
        provider,
        options: { redirectTo: callbackUrl() },
      });
      // On success the browser is already leaving for the provider, so the
      // buttons stay disabled until the page unloads.
      if (error) {
        toast.error(error.message);
        setPending(null);
      }
    } catch {
      toast.error(UNREACHABLE);
      setPending(null);
    }
  }

  async function sendEmailLink({ email }: Values) {
    if (!isSupabaseConfigured) {
      toast.error(NOT_CONFIGURED);
      return;
    }
    setPending("email");
    try {
      const { error } = await createClient().auth.signInWithOtp({
        email,
        options: { emailRedirectTo: callbackUrl() },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setSentTo(email);
    } catch {
      toast.error(UNREACHABLE);
    } finally {
      setPending(null);
    }
  }

  const heading = (
    <h2 className="mx-0 mt-0 mb-6 text-[30px] leading-[32px] font-normal tracking-[-0.02em] text-cl-ink">
      {sentTo ? "Check your email" : "Sign in to ComLinked"}
    </h2>
  );

  if (sentTo) {
    return (
      <div>
        {heading}
        <p role="status" className="m-0">
          We sent a sign-in link to <strong className="text-cl-ink">{sentTo}</strong>. Open it on
          this device to continue.
        </p>
        <p className="mx-0 mt-3.5 mb-0 text-center">
          <button
            type="button"
            className="cl-navl min-h-[44px] cursor-pointer border-0 px-1 py-3 text-cl-accent-strong underline underline-offset-[3px] [background:none] [font:700_15px_var(--font-text)]"
            onClick={() => setSentTo(null)}
          >
            Use a different email
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      {heading}
      {callbackFailed ? (
        <p
          role="alert"
          className="mx-0 mt-0 mb-5 border border-cl-error-line bg-cl-error-tint p-3 text-[14px] leading-[20px] text-cl-error"
        >
          That sign-in link didn’t work. It may have expired, so please try again.
        </p>
      ) : null}
      <div className="mb-5 grid gap-2.5">
        <button
          type="button"
          className={providerButton}
          disabled={pending !== null}
          onClick={() => signInWithProvider("google")}
        >
          <svg
            className="inline align-baseline"
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 12h6a6 6 0 1 1-1.8-4.3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Continue with Google
        </button>
        <button
          type="button"
          className={providerButton}
          disabled={pending !== null}
          onClick={() => signInWithProvider("facebook")}
        >
          <svg
            className="inline align-baseline"
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path
              d="M13 21v-8h3l.5-3H13V8.5c0-.9.3-1.5 1.6-1.5H17V4.3c-.4 0-1.4-.1-2.5-.1-2.5 0-4 1.5-4 4.1V10H8v3h2.5v8"
              fill="currentColor"
            />
          </svg>
          Continue with Facebook
        </button>
      </div>
      <div className="mx-0 mt-0 mb-5 flex items-center gap-3.5 text-[14px] text-cl-muted">
        <span className="h-[1px] flex-1 bg-cl-rule" />
        or
        <span className="h-[1px] flex-1 bg-cl-rule" />
      </div>
      <form onSubmit={form.handleSubmit(sendEmailLink)} noValidate>
        <div className="mb-4.5 flex flex-col gap-2">
          <label
            className="font-sans text-[14px] leading-[16px] font-bold tracking-normal text-cl-muted"
            htmlFor="si-email"
          >
            Work email
          </label>
          <input
            className="cl-fld h-12 w-full rounded-[8px] border border-cl-grey bg-cl-surface px-3.5 py-0 text-cl-ink [font:400_16px_var(--font-text)]"
            id="si-email"
            type="email"
            autoComplete="email"
            placeholder="you@yourcompany.com"
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "si-email-error" : undefined}
            {...form.register("email")}
          />
          {emailError ? (
            <p id="si-email-error" className="m-0 text-[14px] leading-[20px] text-cl-error">
              {emailError}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          className="cl-btn flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-cl-accent-strong bg-cl-accent-strong font-sans text-[15px] font-bold tracking-normal text-cl-surface"
          disabled={pending !== null}
        >
          {pending === "email" ? "Sending link…" : "Email me a sign-in link"}
        </button>
      </form>
      <p className="mx-0 mt-2.5 mb-0 text-center text-[14px] leading-[20px]">
        New to ComLinked? <Link href={paths.marketing.join}>Create your company profile</Link>
      </p>
    </div>
  );
}
