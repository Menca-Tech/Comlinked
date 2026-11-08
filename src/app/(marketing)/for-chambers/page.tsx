import type { Metadata } from "next";

import { ForChambersContent } from "@/components/marketing/for-chambers-content";

export const metadata: Metadata = {
  title: "For chambers",
  description:
    "Bring your chamber’s members onto ComLinked: member import, introductions and leads from their first day. Free for pilot chambers.",
};

export default function ForChambersPage() {
  return <ForChambersContent />;
}
