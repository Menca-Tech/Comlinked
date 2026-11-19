import { isDemoDeployment } from "@/config";

export const DEMO_NOTICE = "Demo. Companies, people and figures are invented.";

/** The quiet line that marks the shared demo deployment. It renders nothing anywhere else, so
 * local development and a real launch stay clean. */
export function DemoNotice({ className }: { className?: string }) {
  if (!isDemoDeployment) return null;
  return <p className={className}>{DEMO_NOTICE}</p>;
}
