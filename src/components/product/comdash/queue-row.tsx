import type { ReactNode } from "react";

/** One Company in a ComDash list: its name, a detail line and its actions. */
export function QueueRow({
  name,
  meta,
  children,
}: {
  name: string;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="cd-qrow">
      <div className="cd-qrow-t">
        <strong>{name}</strong>
        {meta ? <span>{meta}</span> : null}
      </div>
      {children ? <div className="a-acts">{children}</div> : null}
    </div>
  );
}
