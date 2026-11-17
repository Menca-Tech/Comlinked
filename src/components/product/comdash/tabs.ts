import { paths } from "@/paths";
import { laterItemShown } from "@/services/comlinked";

/** ComDash's five tabs, in order. The AI Lead Agent's is an after-MVP preview. */
export const COMDASH_TABS = [
  { label: "Overview", href: paths.dashTabs.overview, afterMvp: false },
  { label: "Interest Signals", href: paths.dashTabs.signals, afterMvp: false },
  { label: "AI Lead Agent", href: paths.dashTabs.agent, afterMvp: true },
  { label: "Connections", href: paths.dashTabs.connections, afterMvp: false },
  { label: "Profile", href: paths.dashTabs.profile, afterMvp: false },
] as const;

/** The tabs that show, which the frame's tab row and the Presenter Guide both list: the AI Lead
 * Agent's only while the after-MVP previews are on. */
export function comDashTabs() {
  const previews = laterItemShown("previews");
  return COMDASH_TABS.filter((tab) => previews || !tab.afterMvp);
}
