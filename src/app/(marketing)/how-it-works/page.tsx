import type { Metadata } from "next";

import { HowItWorksContent } from "@/components/marketing/how-it-works-content";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How ComLinked works: claim your profile, meet 3 matched companies on your first day, then get fresh leads every morning.",
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
