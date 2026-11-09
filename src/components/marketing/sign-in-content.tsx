import { SignInForm } from "@/components/auth/sign-in-form";
import { PageHero } from "@/components/marketing/section";

export function SignInContent({ callbackFailed }: { callbackFailed: boolean }) {
  return (
    <PageHero
      className="flex min-h-[calc(100vh_-_140px)] items-center"
      contentClassName="flex flex-wrap items-center justify-between gap-12"
    >
      <div className="min-w-0 flex-[1_1_380px]">
        <h1 className="cl-h1 mx-0 my-6 max-w-[9em] tracking-[-0.025em] text-balance text-cl-paper">
          Welcome back.
        </h1>
        <p className="m-0 max-w-[26em] text-[19px] leading-[30px] text-cl-on-night-80">
          Sign in as your company’s authorized rep to see your ComDash, connections and ComMail.
        </p>
      </div>
      <div className="cl-pad min-w-0 flex-[0_1_440px] border border-cl-rule bg-cl-surface p-9 text-cl-ink-2">
        <SignInForm callbackFailed={callbackFailed} />
      </div>
    </PageHero>
  );
}
