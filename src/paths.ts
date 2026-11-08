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
