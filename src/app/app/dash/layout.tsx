import { ComDashFrame } from "@/components/product/comdash/comdash-frame";

export default function ComDashLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ComDashFrame>{children}</ComDashFrame>;
}
