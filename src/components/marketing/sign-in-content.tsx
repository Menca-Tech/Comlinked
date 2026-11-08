import { SignInForm } from "@/components/auth/sign-in-form";

export function SignInContent({ callbackFailed }: { callbackFailed: boolean }) {
  return (
    <section className="cl-dark cl-rings-top-right flex min-h-[calc(100vh_-_140px)] items-center text-cl-paper">
      <div className="cl-hero-pad mx-auto my-0 flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-12 px-5 py-24">
        <div className="min-w-0 flex-[1_1_380px]">
          <h1 className="cl-h1 cl-load mx-0 my-6 max-w-[9em] font-normal tracking-[-0.025em] text-balance text-cl-paper [animation-delay:0.15s]">
            Welcome <span className="text-cl-sky not-italic">back.</span>
          </h1>
          <p className="cl-load m-0 max-w-[26em] text-[19px] leading-[30px] text-cl-on-night-80 [animation-delay:0.28s]">
            Sign in as your company’s authorized rep to see your ComDash, connections and ComMail.
          </p>
        </div>
        <div className="cl-pad cl-load min-w-0 flex-[0_1_440px] border border-cl-rule bg-cl-surface p-9 text-cl-ink-2 [animation-delay:0.3s]">
          <SignInForm callbackFailed={callbackFailed} />
        </div>
      </div>
    </section>
  );
}
