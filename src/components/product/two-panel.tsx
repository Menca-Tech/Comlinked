import type { ReactNode } from "react";

import { focusPanel } from "@/components/product/focus-panel";

/** The two-panel frame: the navy invitation with the logo rings beside the white action, in one
 * raised frame. The claim steps, the Opening and the ask share it. Navy stacks above white on a
 * phone. `focus` says which of the two is the screen's Focus panel: the navy `side` where the
 * invitation leads, or the white `main` where the action does. */
export function TwoPanel({
  side,
  focus,
  children,
}: {
  side: ReactNode;
  focus: "side" | "main";
  children: ReactNode;
}) {
  return (
    <div className="a-two">
      <div className="a-two-side" {...focusPanel(focus === "side")}>
        {side}
      </div>
      <div className="a-two-main" {...focusPanel(focus === "main")}>
        {children}
      </div>
    </div>
  );
}
