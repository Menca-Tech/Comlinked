"use client";

import Link from "next/link";

import { Btn } from "@/components/product/shared";
import { paths } from "@/paths";
import { act } from "@/services/comlinked";

/** Resolves a profile gap: open the profile to add the term, or say it isn't offered. */
export function GapActions({ term }: { term: string }) {
  return (
    <div className="a-acts">
      <Btn cls="o sm" onClick={() => act.dismissGap(term)}>
        We don’t offer this
      </Btn>
      <Link href={paths.dashTabs.profile} className="a-btn sm" onClick={() => act.addGap(term)}>
        Add to profile
      </Link>
    </div>
  );
}
