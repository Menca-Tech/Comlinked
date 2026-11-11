import { redirect } from "next/navigation";

import { paths } from "@/paths";

/** An unknown ComDash tab opens the Overview. */
export default function Page() {
  redirect(paths.dashTabs.overview);
}
