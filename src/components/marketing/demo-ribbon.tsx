import Link from "next/link";

import { paths } from "@/paths";

export function DemoRibbon() {
  return (
    <div className="border-b border-b-cl-rule bg-cl-paper">
      <p className="mx-auto my-0 max-w-[1200px] px-5 py-1.5 font-sans text-[13px] leading-[18px] text-cl-muted">
        Working mockup. All companies and figures are example data.{" "}
        <Link className="font-bold whitespace-nowrap" href={paths.product.root}>
          Try the product
        </Link>
      </p>
    </div>
  );
}
