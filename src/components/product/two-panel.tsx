import type { ReactNode } from "react";

import { focusPanel } from "@/components/product/focus-panel";

/** The two-panel frame: the navy invitation with the logo rings beside the white action, in one
 * raised frame. The claim steps, the Opening and the ask share it. Navy stacks above white on a
 * phone. `focus="side"` makes the navy panel the screen's Focus panel. */
export function TwoPanel({
  side,
  focus,
  children,
}: {
  side: ReactNode;
  focus?: "side";
  children: ReactNode;
}) {
  return (
    <div className="a-two">
      <div className="a-two-side" {...focusPanel(focus === "side")}>
        {side}
      </div>
      <div className="a-two-main">{children}</div>
    </div>
  );
}
