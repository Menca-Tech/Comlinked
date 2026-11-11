import { DashPanel } from "@/components/product/comdash/dash-panel";

/** Placeholder for the tabs that arrive in the next update. */
export function ComingNext({ title }: { title: string }) {
  return (
    <DashPanel title={title}>
      <p className="a-why">Coming in the next update.</p>
    </DashPanel>
  );
}
