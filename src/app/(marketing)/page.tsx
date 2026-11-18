import type { Metadata } from "next";

import { HomeContent } from "@/components/marketing/home-content";

export const metadata: Metadata = {
  title: { absolute: "ComLinked: business connections your company keeps" },
};

export default function MarketingPage() {
  return <HomeContent />;
}
