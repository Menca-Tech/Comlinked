import type { Metadata } from "next";

import { ComDashContent } from "@/components/marketing/comdash-content";

export const metadata: Metadata = {
  title: "ComDash",
  description:
    "ComDash shows which companies found, viewed or messaged you, by name, and where you rank in your industry’s searches.",
};

export default function ComDashPage() {
  return <ComDashContent />;
}
