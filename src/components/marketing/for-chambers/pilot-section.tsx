import { PilotForm } from "@/components/marketing/pilot-form";
import { Section } from "@/components/marketing/section";

export function PilotSection() {
  return (
    <Section id="pilot" className="pt-0">
      <div className="cl-pad max-w-[640px] min-w-0 border border-cl-rule bg-cl-surface p-9 text-cl-ink-2">
        <h2 className="cl-h2 mx-0 mt-0 mb-2 text-cl-ink">Request a pilot</h2>
        <p className="mx-0 mt-0 mb-7 text-[15px] leading-[22px] text-cl-muted">
          Tell us about your chamber to start planning a pilot with your members.
        </p>
        <PilotForm />
      </div>
    </Section>
  );
}
