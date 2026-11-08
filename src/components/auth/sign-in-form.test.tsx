import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SignInForm } from "./sign-in-form";

const auth = vi.hoisted(() => ({
  signInWithOAuth: vi.fn(),
  signInWithOtp: vi.fn(),
}));

vi.mock("@/config", () => ({ isSupabaseConfigured: true }));
vi.mock("@/lib/supabase/client", () => ({ createClient: () => ({ auth }) }));

const callback = `${window.location.origin}/auth/callback`;

describe("SignInForm", () => {
  beforeEach(() => {
    auth.signInWithOAuth.mockReset().mockResolvedValue({ error: null });
    auth.signInWithOtp.mockReset().mockResolvedValue({ error: null });
  });

  it.each([
    ["Continue with Google", "google"],
    ["Continue with Facebook", "facebook"],
  ])("%s starts that provider's sign-in and returns to the callback", async (name, provider) => {
    render(<SignInForm />);
    await userEvent.click(screen.getByRole("button", { name }));
    expect(auth.signInWithOAuth).toHaveBeenCalledWith({
      provider,
      options: { redirectTo: callback },
    });
  });

  it("emails a sign-in link and confirms where it went", async () => {
    render(<SignInForm />);
    await userEvent.type(screen.getByLabelText("Work email"), "rep@acme.test");
    await userEvent.click(screen.getByRole("button", { name: "Email me a sign-in link" }));

    expect(auth.signInWithOtp).toHaveBeenCalledWith({
      email: "rep@acme.test",
      options: { emailRedirectTo: callback },
    });
    expect(await screen.findByRole("status")).toHaveTextContent("rep@acme.test");
  });

  it("does not send a link for an invalid email", async () => {
    render(<SignInForm />);
    await userEvent.type(screen.getByLabelText("Work email"), "not-an-email");
    await userEvent.click(screen.getByRole("button", { name: "Email me a sign-in link" }));

    expect(await screen.findByText("Enter a valid work email")).toBeInTheDocument();
    expect(auth.signInWithOtp).not.toHaveBeenCalled();
  });

  it("tells the user when a sign-in link failed", () => {
    render(<SignInForm callbackFailed />);
    expect(screen.getByRole("alert")).toHaveTextContent("didn’t work");
  });
});
