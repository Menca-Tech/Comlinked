import Image from "next/image";
import Link from "next/link";

import { config } from "@/config";
import { paths } from "@/paths";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Link href={paths.home} aria-label={`${config.site.name} home`}>
        <Image
          src="/assets/comlinked-logo.png"
          alt={config.site.name}
          width={160}
          height={32}
          priority
        />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
