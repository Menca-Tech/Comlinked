import { paths } from "@/paths";

/** ComDash's five tabs, in order. The frame's tab row and the presenter guide both list them. */
export const COMDASH_TABS = [
  { label: "Overview", href: paths.dashTabs.overview },
  { label: "Interest Signals", href: paths.dashTabs.signals },
  { label: "AI Lead Agent", href: paths.dashTabs.agent },
  { label: "Connections", href: paths.dashTabs.connections },
  { label: "Profile", href: paths.dashTabs.profile },
] as const;
