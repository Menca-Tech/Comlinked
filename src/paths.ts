/** The address parameter that names a Pilot Preview Stop. */
const STOP_PARAM = "stop";

export const paths = {
  home: "/",
  marketing: {
    howItWorks: "/how-it-works",
    comDash: "/comdash",
    forChambers: "/for-chambers",
    join: "/#join",
    free: "/#free",
    chamberPilot: "/for-chambers#pilot",
    chamberHow: "/for-chambers#how",
    chamberFaq: "/for-chambers#faq",
  },
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    signUpConfirm: "/auth/sign-up-confirm",
    resetPassword: "/auth/reset-password",
    updatePassword: "/auth/update-password",
    callback: "/auth/callback",
  },
  product: {
    root: "/app",
    claim: "/app/claim",
    matches: "/app/matches",
    dash: "/app/dash",
    leads: "/app/leads",
    mail: "/app/mail",
    asks: "/app/asks",
    wins: "/app/wins",
    company: "/app/company",
    search: "/app/search",
    digest: "/app/digest",
    chamber: "/app/chamber",
    "whats-next": "/app/whats-next",
    notifications: "/app/notifications",
    engine: "/app/engine",
    agent: "/app/agent",
    team: "/app/team",
  },
  /** ComDash tabs. The Overview is ComDash itself. */
  dashTabs: {
    overview: "/app/dash",
    signals: "/app/dash/signals",
    agent: "/app/dash/agent",
    connections: "/app/dash/connections",
    profile: "/app/dash/profile",
    /** Interest Signals with one Company's timeline drawer open. */
    signalsFor: (companyId: string) => `/app/dash/signals?company=${encodeURIComponent(companyId)}`,
  },
  /** The Pilot Preview: its Opening, its closing screen, and each Stop's own address. */
  preview: {
    opening: "/app/preview",
    ask: "/app/preview/ask",
    stopParam: STOP_PARAM,
    /** A Stop's address: the screen it opens on, marked with the Stop. */
    stop: (screen: string, stop: number | string) => `${screen}?${STOP_PARAM}=${stop}`,
  },
  dashboard: {
    overview: "/dashboard",
    blank: "/dashboard/blank",
    customers: {
      list: "/dashboard/customers",
      create: "/dashboard/customers/create",
      details: (customerId: string) => `/dashboard/customers/${customerId}`,
    },
    team: {
      members: "/dashboard/team/members",
      permissions: "/dashboard/team/permissions",
    },
    roleSettings: "/dashboard/role-settings",
    settings: {
      profile: "/dashboard/settings",
      security: "/dashboard/settings/security",
    },
  },
} as const;

/** A product screen, by the name its address starts with under /app. */
export type ProductRoute = keyof typeof paths.product;
