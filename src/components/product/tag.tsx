import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** How a tag reads: grey unless it takes a tone. */
export type TagTone = "grey" | "accent" | "solid" | "error" | "line";

/** A tag: a small pill that says one thing and cannot be tapped. */
export function Tag({
  tone = "grey",
  cls,
  children,
  ...rest
}: {
  tone?: TagTone;
  cls?: string;
  children: ReactNode;
} & Omit<ComponentProps<"span">, "className" | "children">) {
  return (
    <span className={cn("a-tag", tone !== "grey" && tone, cls)} {...rest}>
      {children}
    </span>
  );
}
