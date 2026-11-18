"use client";

import Link from "next/link";

import { Btn } from "@/components/product/shared";
import { paths } from "@/paths";
import { act } from "@/services/comlinked";

/** Resolves a profile gap: open the profile to add the term, or say it isn't offered. Next
 * action shows buttons; the search terms panel shows the prototype's small text links. */
export function GapActions({ term, links = false }: { term: string; links?: boolean }) {
  const add = () => act.addGap(term);
  const dismiss = () => act.dismissGap(term);
  if (links) {
    return (
      <div className="cd-gaplinks">
        <Link href={paths.dashTabs.profile} className="cd-textlink" onClick={add}>
          Add to profile
        </Link>
        <button type="button" className="cd-textlink" onClick={dismiss}>
          We don’t offer this
        </button>
      </div>
    );
  }
  return (
    <div className="a-acts">
      <Btn cls="o sm" onClick={dismiss}>
        We don’t offer this
      </Btn>
      <Link href={paths.dashTabs.profile} className="a-btn sm" onClick={add}>
        Add to profile
      </Link>
    </div>
  );
}
