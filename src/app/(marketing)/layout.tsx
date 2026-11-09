import { DemoRibbon } from "@/components/marketing/demo-ribbon";
import { Footer } from "@/components/marketing/footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cl-site min-h-screen bg-cl-paper font-sans text-[16px] leading-[25px] text-cl-ink-2 antialiased">
      <a className="cl-skip" href="#top">
        Skip to content
      </a>
      <DemoRibbon />
      <MarketingNav />
      <main id="top">{children}</main>
      <Footer />
    </div>
  );
}
