import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** One ComDash panel: a titled section with an optional note beside the title. */
export function DashPanel({
  title,
  note,
  className,
  children,
}: {
  title: ReactNode;
  note?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("cd-panel", className)}>
      <div className="cd-ph">
        <h2 className="a-h2">{title}</h2>
        {note ? <span className="cd-note">{note}</span> : null}
      </div>
      {children}
    </section>
  );
}

/** What a panel says before it has anything to show. */
export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="cd-empty">{children}</p>;
}
