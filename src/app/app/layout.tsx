import type { Metadata } from "next";

import { ProductShell } from "@/components/product/product-shell";

import "./product.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function ProductLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ProductShell>{children}</ProductShell>;
}
