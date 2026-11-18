import type { ReactNode } from "react";

import { focusPanel } from "@/components/product/focus-panel";
import { cn } from "@/lib/utils";

/** One ComDash panel: a section under its title, with an optional note beside the title. A panel
 * with no title is named by `label` instead. `focus` makes it the screen's Focus panel, the one
 * raised panel that holds the thing to act on now. */
export function DashPanel({
  title,
  note,
  label,
  focus = false,
  className,
  children,
}: {
  title?: ReactNode;
  note?: ReactNode;
  label?: string;
  focus?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("cd-panel", className)} aria-label={label} {...focusPanel(focus)}>
      {title ? (
        <div className="cd-ph">
          <h2 className="a-h2">{title}</h2>
          {note ? <span className="cd-note">{note}</span> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** What a panel says before it has anything to show. */
export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="cd-empty">{children}</p>;
}
