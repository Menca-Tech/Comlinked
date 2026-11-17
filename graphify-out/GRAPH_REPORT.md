# Graph Report - Comlinked (2026-11-17)

## Corpus Check

- 450 files · ~241,090 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 8, .css 3, .example 1)

## Summary

- 2516 nodes · 6978 edges · 105 communities (94 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 240 edges (avg confidence: 0.86)
- Token cost: 1,038,933 input · 0 output

## Community Hubs (Navigation)

- Forms, Charts and Auth UI
- Simulation Engine Core
- ComDash Screens
- Stack and AI Agent PDFs
- MVP Feature Catalog A1-S3
- Pilot Preview Claim Tickets
- Dev Dependencies
- Simulation Network Data
- Project Skills and Quality Bar
- Product Shell and Preview
- Website Redesign Tickets
- Marketing Nav and App Icons
- Dashboard Sidebar Nav
- Seed Data and Types
- Agent and Team Screens
- Product Vision and Workflow
- Lead Board and Search
- Adoption Notes and Pilot Decisions
- Pilot Preview E2E Tests
- Matches, Leads and ComMail
- Runtime Dependencies
- Connections and Next Action
- Contributor Rules (AGENTS.md)
- Domain Glossary Core
- Marketing Hero and Sign-in
- Sheet, Breadcrumb, Avatar UI
- ComDash Redesign Tickets
- SRS Referenced Documents
- Team Members and Tables
- For Chambers Page
- E2E and A11y Gates
- Org Roles and Authz
- Asks and Wins Screens
- React 19 and CSP Guidance
- Product Smoke E2E Tests
- Clean Architecture and Seam
- Design System Modes
- SRS AI Lead Agent
- CI Workflow
- Dropdown and User Menu
- Chamber Member Import
- Interest and Intent Scoring
- Multi-tenancy and Standards Specs
- CodeQL Workflow
- Env Config and Optional Services
- Roles and Membership Glossary
- AI Lead Agent Simulator
- Claim and Company Profile
- Demo Guide and Engine Screen
- How It Works Page
- Simulation Actions and Awards
- TypeScript Config
- SRS Activity Score Rules
- Homepage and First Chamber
- Join Form Fields
- Customers Service (mock)
- SRS Roles and Access Rules
- Customer Server Actions
- ComDash Marketing Page
- shadcn Components Config
- ComDash Redesign Spec
- Customer Form and Select
- Marketing Form Validation
- Drizzle Customers DB
- Package Scripts
- Docker Compose
- Loading and Status Badges
- Chamber Glossary Terms
- SRS Claim and Data Entities
- Product Bars and Tabs
- Logger
- Server Env and DB Gap
- SRS Connect and Share Features
- Auth Layout and OG Image
- Claude Commands and Handoff
- Multi-tenancy Migration
- Unit Test Tooling
- Preview Ask and Benefits
- Dialog Components
- PostHog and Mock-first ADRs
- Dependabot Config
- Root Layout and Theme
- Notifications Screen
- SEO Robots and Sitemap
- ESLint Config
- Analytics Consent
- CSP and Middleware
- FAQ Question Sections
- Server Action Security Pattern
- Prettier Config
- SRS Connections and Notifications
- Drizzle Kit Config
- Package Manager Pins
- Member Standing Helpers
- GitHub Issue Templates
- Initial Drizzle Migration
- PostCSS Config
- ADR Rule for Hard Choices
- shadcn + Tailwind Only Rule
- Use Client on Leaves Rule
- Agent Message Types

## God Nodes (most connected - your core abstractions)

1. `cn()` - 161 edges
2. `useSimulation()` - 114 edges
3. `next` - 73 edges
4. `react` - 69 edges
5. `Btn()` - 62 edges
6. `co()` - 58 edges
7. `paths` - 46 edges
8. `Button()` - 40 edges
9. `Section()` - 39 edges
10. `act` - 38 edges

## Surprising Connections (you probably didn't know these)

- `Tab memory for reload (rememberStop / stopAfterReload)` --references--> `useAddressEntry()` [INFERRED]
  .scratch/pilot-preview/issues/03-walk-the-preview-and-hide-later-items.md → src/components/product/product-shell.tsx
- `Scope test: sign up, get leads, return daily, talk to companies, share wins` --semantically_similar_to--> `Element job test: remove any element whose removal loses nothing` [INFERRED] [semantically similar]
  CLAUDE.md → docs/design-system/README.md
- `T15 Claim-your-profile outreach` --semantically_similar_to--> `A2 Claim your profile` [INFERRED] [semantically similar]
  docs/specs/2026-10-21-ai-lead-agent.pdf → docs/specs/2026-10-11-mvp-build-plan.md
- `AI transparency` --semantically_similar_to--> `C3 AI Assistant switch` [INFERRED] [semantically similar]
  docs/specs/2026-10-21-ai-lead-agent.pdf → docs/specs/2026-10-11-mvp-build-plan.md
- `Shared-trade rule for leads (sharesMyTrade)` --references--> `sharesMyTrade()` [EXTRACTED]
  .scratch/pilot-preview/issues/01-claim-day-and-network-of-100.md → src/services/comlinked/simulation.ts

## Import Cycles

- None detected.

## Hyperedges (group relationships)

- **Env-gated optional integrations (inert/mock/disabled when unconfigured)** — _claude_skills_drizzle_data_skill_mock_first_selector, _claude_skills_supabase_auth_skill_configured_or_disabled, _claude_skills_posthog_skill_opt_in_inert [EXTRACTED 1.00]
- **Strict nonce CSP mechanism across middleware, layout and integrations** — _claude_skills_coding_standards_skill_strict_nonce_csp, _claude_skills_nextjs_app_router_skill_dynamic_root_layout_nonce, _claude_skills_nextjs_app_router_skill_edge_middleware_nonce, _claude_skills_posthog_skill_session_replay_worker_src, _claude_skills_supabase_auth_skill_middleware_session_refresh [INFERRED 0.85]
- **Server Action security contract (validate, re-authorize, then mutate via seam)** — _claude_skills_coding_standards_skill_server_action_authz, _claude_skills_forms_validation_skill_two_boundary_validation, _claude_skills_nextjs_app_router_references_server_actions_action_pattern, _claude_skills_supabase_auth_skill_getuser_not_getsession, _claude_skills_nextjs_app_router_skill_reads_rsc_writes_actions [INFERRED 0.85]
- **Pilot Preview ticket sequence (01 to 06)** — _scratch_pilot_preview_issues_01_claim_day_and_network_of_100, _scratch_pilot_preview_issues_02_export_story_and_basics_before_claim, _scratch_pilot_preview_issues_03_walk_the_preview_and_hide_later_items, _scratch_pilot_preview_issues_04_member_list_message_and_the_ask, _scratch_pilot_preview_issues_05_eccp_activity_view, _scratch_pilot_preview_issues_06_names_run_of_show_and_final_check [EXTRACTED 1.00]
- **Screens walked by the Pilot Preview's Stops** — _scratch_pilot_preview_issues_03_walk_the_preview_and_hide_later_items_six_stops, _scratch_pilot_preview_issues_03_walk_the_preview_and_hide_later_items_opening, _scratch_pilot_preview_issues_03_walk_the_preview_and_hide_later_items_story_bar, _scratch_pilot_preview_issues_04_member_list_message_and_the_ask_member_list_import, _scratch_pilot_preview_issues_04_member_list_message_and_the_ask_claim_message, _scratch_pilot_preview_issues_05_eccp_activity_view_activity_view, _scratch_pilot_preview_issues_04_member_list_message_and_the_ask_the_ask [INFERRED 0.85]
- **Website redesign tickets 01 to 10 and the two fast-track sessions** — _scratch_website_redesign_issues_01_quiet_authority_foundation, _scratch_website_redesign_issues_02_homepage_hero_network_ring, _scratch_website_redesign_issues_03_network_ring_sequence, _scratch_website_redesign_issues_04_homepage_sections, _scratch_website_redesign_issues_05_validated_join_form, _scratch_website_redesign_issues_06_homepage_review_with_richard, _scratch_website_redesign_issues_07_for_chambers_page, _scratch_website_redesign_issues_08_how_it_works_page, _scratch_website_redesign_issues_09_comdash_page, _scratch_website_redesign_issues_10_final_cleanup_and_check, _scratch_website_redesign_fast_track_session_1_homepage, _scratch_website_redesign_fast_track_session_2_pages_and_final_check [EXTRACTED 1.00]
- **Runs-with-nothing-configured gating (mock seam, DB selector, lazy client, inert analytics)** — docs_adr_0003_mock_first_service_seam_mock_by_default, docs_adr_0006_drizzle_data_layer_mock_db_selector, docs_adr_0006_drizzle_data_layer_lazy_db_singleton, docs_adr_0007_analytics_posthog_opt_in_inert [EXTRACTED 1.00]
- **RLS-backed tenant and Chamber Network isolation** — docs_adr_0005_multi_tenancy_rls_isolation, docs_adr_0005_multi_tenancy_active_org_cookie, docs_adr_0006_drizzle_data_layer_seam_scoped_authz, docs_adr_0009_company_directory_and_chambers_network_boundary_rls, docs_adr_0009_company_directory_and_chambers_private_data [INFERRED 0.85]
- **Pilot Preview walkthrough vocabulary** — context_pilot_preview, context_stop, context_seat, context_story_bar, context_presenter_guide, context_run_of_show, context_demo [EXTRACTED 1.00]
- **Server-side tenancy authorization helpers** — docs_specs_2026_07_15_multi_tenancy_getactiveorg, docs_specs_2026_07_15_multi_tenancy_requireorgrole, docs_specs_2026_07_15_multi_tenancy_isplatformsuperadmin, docs_specs_2026_07_15_multi_tenancy_hasorgrole [EXTRACTED 1.00]
- **Daily lead loop: digest, act, talk and close, share, rank rises** — docs_specs_2026_10_11_mvp_build_plan_daily_lead_loop, docs_specs_2026_10_11_mvp_build_plan_d1_morning_digest, docs_specs_2026_10_11_mvp_build_plan_d2_daily_lead_list, docs_specs_2026_10_11_mvp_build_plan_c2_commail, docs_specs_2026_10_11_mvp_build_plan_c4_outcome_buttons, docs_specs_2026_10_11_mvp_build_plan_s1_testimonial_prompt, docs_specs_2026_10_11_mvp_build_plan_s3_one_tap_share, docs_specs_2026_10_11_mvp_build_plan_d3_activity_score_and_search_rank [INFERRED 0.85]
- **Pilot Preview walk: Stops, Story Bar, Seats and prepared states** — docs_specs_2026_11_17_pilot_preview_stops, docs_specs_2026_11_17_pilot_preview_story_bar, docs_specs_2026_11_17_pilot_preview_seats, docs_specs_2026_11_17_pilot_preview_prepared_states, docs_specs_2026_11_17_pilot_preview_two_weeks_in_seed [EXTRACTED 1.00]
- **Daily Lead Loop Steps** — docs_specs_2026_11_09_comlinked_srs_daily_lead_loop, docs_specs_2026_11_09_comlinked_srs_d1_morning_digest, docs_specs_2026_11_09_comlinked_srs_d2_daily_lead_list, docs_specs_2026_11_09_comlinked_srs_c2_commail, docs_specs_2026_11_09_comlinked_srs_c3_ai_assistant_switch, docs_specs_2026_11_09_comlinked_srs_c4_outcome_buttons, docs_specs_2026_11_09_comlinked_srs_s1_testimonial_prompt, docs_specs_2026_11_09_comlinked_srs_s3_one_tap_share, docs_specs_2026_11_09_comlinked_srs_d3_activity_score_and_search_rank [EXTRACTED 1.00]
- **AI Lead Agent Safety Controls** — docs_specs_2026_11_09_comlinked_srs_llm_judgment_deterministic_enforcement, docs_specs_2026_11_09_comlinked_srs_disclosure_tiers, docs_specs_2026_11_09_comlinked_srs_agent_knock_outs, docs_specs_2026_11_09_comlinked_srs_agent_rate_limits, docs_specs_2026_11_09_comlinked_srs_append_only_agent_log, docs_specs_2026_11_09_comlinked_srs_agent_authority_matrix, docs_specs_2026_11_09_comlinked_srs_agent_message_envelope [INFERRED 0.85]
- **Claim and First-day Onboarding Flow** — docs_specs_2026_11_09_comlinked_srs_uc01_claim_pre_built_profile, docs_specs_2026_11_09_comlinked_srs_a1_pre_built_company_profiles, docs_specs_2026_11_09_comlinked_srs_a2_claim_your_profile, docs_specs_2026_11_09_comlinked_srs_a3_easy_sign_in, docs_specs_2026_11_09_comlinked_srs_l1_day_one_matches, docs_specs_2026_11_09_comlinked_srs_claim_link, docs_specs_2026_11_09_comlinked_srs_consent_record [INFERRED 0.85]
- **Daily lead loop: digest, act, talk and close, share the win, rank rises** — docs_specs_2026_10_11_mvp_build_plan_daily_lead_loop, docs_specs_2026_10_11_mvp_build_plan_d1_morning_digest, docs_specs_2026_10_11_mvp_build_plan_d2_daily_lead_list, docs_specs_2026_10_11_mvp_build_plan_c2_commail, docs_specs_2026_10_11_mvp_build_plan_c4_outcome_buttons, docs_specs_2026_10_11_mvp_build_plan_s1_testimonial_prompt, docs_specs_2026_10_11_mvp_build_plan_d3_activity_score_and_search_rank [INFERRED 0.85]
- **AI Lead Agent 10-stage workflow with two human gates** — docs_specs_2026_10_21_ai_lead_agent_mandate, docs_specs_2026_10_21_ai_lead_agent_gate_a_confidential_disclosure, docs_specs_2026_10_21_ai_lead_agent_score_bands, docs_specs_2026_10_21_ai_lead_agent_gate_b_meeting_confirmation, docs_specs_2026_10_21_ai_lead_agent_handoff_package, docs_specs_2026_10_21_ai_lead_agent_t16_capture_outcome [EXTRACTED 1.00]
- **Secured at every layer (defense in depth)** — docs_presentations_comlinked_stack_overview_defense_in_depth, docs_presentations_comlinked_stack_overview_pkce_sign_in_flow, docs_presentations_comlinked_stack_overview_role_based_access_control, docs_presentations_comlinked_stack_overview_row_level_security, docs_presentations_comlinked_stack_overview_react_hook_form_zod, docs_presentations_comlinked_stack_overview_browser_hardening, docs_presentations_comlinked_stack_overview_github_actions_codeql_dependabot [EXTRACTED 1.00]

## Communities (105 total, 11 thin omitted)

### Community 0 - "Forms, Charts and Auth UI"

Cohesion: 0.05
Nodes (97): @hookform/resolvers, react, react-hook-form, sonner, zod, metadata, ResetPasswordPage(), metadata (+89 more)

### Community 1 - "Simulation Engine Core"

Cohesion: 0.03
Nodes (90): ActionMap, AFTER_MVP_SCREENS, aiAvailable(), ASK_WORDS, compare(), draftText(), ensureDraft(), fresh() (+82 more)

### Community 2 - "ComDash Screens"

Cohesion: 0.07
Nodes (58): ComDashLayout(), Page(), Page(), AlertsPanel(), ComDashFrame(), CountBars(), DashPanel(), EmptyNote() (+50 more)

### Community 3 - "Stack and AI Agent PDFs"

Cohesion: 0.06
Nodes (42): Application Stack Overview, GitHub Actions / CodeQL / Dependabot, Next.js 15 / React 19 / TypeScript (strict), OWASP Top 10 mapping, PostgreSQL (Supabase) + Drizzle ORM, PostHog product analytics, React Hook Form + Zod validation, Supabase Auth (+34 more)

### Community 4 - "MVP Feature Catalog A1-S3"

Cohesion: 0.06
Nodes (54): A1 Pre-built company profiles, A2 Claim your profile, A3 Easy sign-in, A4 Profile strength meter, A5 Invite your business partners, Anthropic API, Anti-gaming rules, Build order (Section 7.2) (+46 more)

### Community 5 - "Pilot Preview Claim Tickets"

Cohesion: 0.08
Nodes (30): Connections tab panels, Pilot Preview 01: One claim day per Company, and a network of 100 under ECCP's name, ECCP (European Chamber of Commerce of the Philippines), Kalayaan Foods (story Company), Mockup network data rules as Vitest cases, Network of 100 Companies under ECCP, Pilot Preview 02: Kalayaan's first export shipment, and basics only before a Claim, First export shipment of banana chips to Europe (+22 more)

### Community 6 - "Dev Dependencies"

Cohesion: 0.06
Nodes (47): author, devDependencies, @commitlint/cli@^19.8.0, @commitlint/config-conventional@^19.8.0, eslint@^9.23.0, eslint-config-next@^15.5.7, husky@^9.1.7, jsdom@^26.0.0 (+39 more)

### Community 7 - "Simulation Network Data"

Cohesion: 0.07
Nodes (45): AGENT_TYPES, CAT, CHAMBER_DEALS, INDUSTRY, NEIGHBORS, NETWORK, RULES, TEAM_SPIKES (+37 more)

### Community 8 - "Project Skills and Quality Bar"

Cohesion: 0.08
Nodes (18): anime-js skill, anime.js v4 ESM named exports (animate, createTimeline, stagger), coding-standards skill (12-category checker), data-tables skill, Opt-in row models (core, filtered, pagination, sorted), TanStack Table v8 (headless) with shadcn Table + flexRender, forms-validation skill, react-hook-form + zodResolver (+10 more)

### Community 9 - "Product Shell and Preview"

Cohesion: 0.11
Nodes (37): metadata, ProductLayout(), Page(), focusMainHeading(), isDesktop(), isRoute(), ProductRoot(), ProductShell() (+29 more)

### Community 10 - "Website Redesign Tickets"

Cohesion: 0.11
Nodes (29): Pull request template, Website redesign fast track, session 1: demo leftovers and the homepage, Website redesign fast track, session 2: remaining pages, final check and review pack, Website redesign 01: Quiet authority foundation, --color-cl-navy token (#133E5E), PageHero, Section and SectionIntro (section.tsx), Website redesign 02: Homepage hero with the Network Ring, ExampleTag (+21 more)

### Community 11 - "Marketing Nav and App Icons"

Cohesion: 0.08
Nodes (20): next, contentType, size, GET(), metadata, metadata, TeamLayout(), contentType (+12 more)

### Community 12 - "Dashboard Sidebar Nav"

Cohesion: 0.10
Nodes (35): DashboardLayout(), navItems, AppSidebar(), TopBar(), Separator(), SidebarContent(), SidebarContext, SidebarContextProps (+27 more)

### Community 13 - "Seed Data and Types"

Cohesion: 0.05
Nodes (40): ABOUT_DEFAULT, ABOUT_POLISHED, AGENT_CATS, AGENT_STAGES, AGENT_STATUS, AgentType, AI_LIMIT, APP (+32 more)

### Community 14 - "Agent and Team Screens"

Cohesion: 0.13
Nodes (34): Page(), Page(), Page(), SettingsTabs(), Agenda(), Agent(), HandoffPackage(), Mandate() (+26 more)

### Community 15 - "Product Vision and Workflow"

Cohesion: 0.08
Nodes (29): CLAUDE.md: how Claude works in this repo, ECCP pilot comes first (decided 2026-11-10), Executer skills: test-driven-development, systematic-debugging, verification-before-completion, code review, Handoff prompt (Goal, Context, Scope, Approach, Acceptance criteria, Verification, Guardrails), ComLinked MVP Build Plan (docs/specs/2026-10-11-mvp-build-plan.md), Activity Score, AI Assistant, AI Draft (+21 more)

### Community 16 - "Lead Board and Search"

Cohesion: 0.16
Nodes (34): Page(), ClaimMark(), LeadActions(), LeadCard(), LeadDetail(), LeadHead(), leadOutcome(), LeadRow() (+26 more)

### Community 17 - "Adoption Notes and Pilot Decisions"

Cohesion: 0.07
Nodes (37): Platform Role: superadmin, Adoption notes, Company profiles must be visible across Organizations (Adoption note 1), ECCP as first pilot, Richard (plan author and presenter), Staff access to private content (Adoption note 15), ComLinked MVP feature status, Decisions agreed for the demo (+29 more)

### Community 18 - "Pilot Preview E2E Tests"

Cohesion: 0.08
Nodes (24): at(), backLink(), BLOCKING_IMPACTS, closeGuide(), expectOpening(), expectStop(), explore(), exploreLink() (+16 more)

### Community 19 - "Matches, Leads and ComMail"

Cohesion: 0.12
Nodes (25): Page(), Page(), Page(), Page(), LeadBoard(), angleFor(), DESCRIBE, Geometry (+17 more)

### Community 20 - "Runtime Dependencies"

Cohesion: 0.06
Nodes (35): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, dayjs@^1.11.13, @hookform/resolvers@^4.1.3, lucide-react@^0.469.0, motion@^14.10.1, next@^15.5.7 (+27 more)

### Community 21 - "Connections and Next Action"

Cohesion: 0.16
Nodes (25): Page(), ConnectAction(), ConnectionsTab(), FromConnections(), GapActions(), InvitationsPanel(), InviteActions(), ManageConnections() (+17 more)

### Community 22 - "Contributor Rules (AGENTS.md)"

Cohesion: 0.11
Nodes (26): AGENTS.md: agent and contributor guide, Conventional Commits enforced by commitlint, Stack: Next.js 15, React 19, strict TypeScript, Tailwind v4, shadcn/ui, Supabase auth, Vitest, Playwright, pnpm, Auth Strategy, Marketing Landing, Reference Feature (Customers), Service Seam, Web App Template (seed starter; Acme leftovers) (+18 more)

### Community 23 - "Domain Glossary Core"

Cohesion: 0.09
Nodes (32): CONTEXT.md: shared vocabulary glossary, Ask (Asks Board), Chamber Network, Claim, ComLinked (the product), ComMail, Company, Daily Lead List (+24 more)

### Community 24 - "Marketing Hero and Sign-in"

Cohesion: 0.14
Nodes (23): metadata, SignInPage(), ActivityViewPanel(), COUNTS, MEMBERS, ComDashHeroSection(), ChamberHeroSection(), CENTRE (+15 more)

### Community 25 - "Sheet, Breadcrumb, Avatar UI"

Cohesion: 0.12
Nodes (24): radix-ui, AvatarBadge(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink() (+16 more)

### Community 26 - "ComDash Redesign Tickets"

Cohesion: 0.13
Nodes (19): ComDash redesign 01: Session 1 shell, Overview and Next action, ComDash five tabs with own addresses, ComDash prototype (comdash-prototype.html), ComDash Overview panels, Profile gap actions (Add to profile / We don't offer this), Saved signal kind, ComLinked service seam (src/services/comlinked), ComDash redesign 02: Session 2 Interest Signals, Connections, plan switcher and final check (+11 more)

### Community 27 - "SRS Referenced Documents"

Cohesion: 0.08
Nodes (21): A3 Easy Sign-in, AI Lead Agent Simulator, AI Lead Agent Task Document and Process Specification, Architecture Decision Records (ADR 0001-0009), Clickable Mockup, ComLinked Design System, ComLinked MVP Build Plan, ComLinked Software Requirements Specification (+13 more)

### Community 28 - "Team Members and Tables"

Cohesion: 0.20
Nodes (20): metadata, TeamMembersPage(), metadata, TeamPermissionsPage(), CustomersTable(), rows, MembersTable(), PermissionsMatrix() (+12 more)

### Community 29 - "For Chambers Page"

Cohesion: 0.18
Nodes (20): ForChambersPage(), metadata, ASKS, AsksSection(), ChamberCommitmentsSection(), COMMITMENTS, ForChambersContent(), ChamberHowSection() (+12 more)

### Community 30 - "E2E and A11y Gates"

Cohesion: 0.08
Nodes (13): BLOCKING_IMPACTS, BLOCKING_IMPACTS, expectFinishedRing(), LAPTOP, PHONE, PUBLIC_PAGES, ring(), WIDTHS (+5 more)

### Community 31 - "Org Roles and Authz"

Cohesion: 0.14
Nodes (22): hasOrgRole(role, ...allowed), Create-Organization onboarding, Org Role (owner / admin / member), requireOrgRole(...roles), @supabase/supabase-js, metadata, SettingsPage(), RoleGuard() (+14 more)

### Community 32 - "Asks and Wins Screens"

Cohesion: 0.16
Nodes (21): Page(), Page(), ItemCard(), ReplyBox(), AskRow(), Asks(), Thread(), Wins() (+13 more)

### Community 33 - "React 19 and CSP Guidance"

Cohesion: 0.10
Nodes (9): React 19 reference, <Context> as provider, use() API (promise / context), nextjs-app-router skill, posthog skill, supabase-auth skill, Three @supabase/ssr client contexts (browser, server, middleware), nextConfig (+1 more)

### Community 34 - "Product Smoke E2E Tests"

Cohesion: 0.11
Nodes (18): BLOCKING_IMPACTS, claimNewCompany(), claimToMatches(), companyRow(), guide(), hotCompany(), openProfile(), openSearch() (+10 more)

### Community 35 - "Clean Architecture and Seam"

Cohesion: 0.14
Nodes (7): clean-architecture skill, Drizzle + RLS future tenancy postures (reference), drizzle-data skill, ADR 0003: Mock-first typed Service Seam, Customers reference feature (copy-me slice), Mock Service Seam (default for un-wired features), Server-only Data Access Layer / service seam

### Community 36 - "Design System Modes"

Cohesion: 0.13
Nodes (18): App Mode, Authorized Representative, ComLinked Design System, Demo, Presenter Guide, Site Mode, Hand-written HTML mockup with simulated engine (frozen backup), ComLinked Design System README (+10 more)

### Community 37 - "SRS AI Lead Agent"

Cohesion: 0.11
Nodes (12): Agent Meeting Booking, Agent Message Envelope and Types, AI Lead Agent, ECCP Pilot (European Chamber of Commerce of the Philippines), Handoff Package, Mandate, OD-01 Canadian Agent Pilot Timing, OD-06 Agent Autonomy vs 'AI Drafts, a Person Decides' (+4 more)

### Community 38 - "CI Workflow"

Cohesion: 0.09
Nodes (24): if, permissions, runs-on, steps, env, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL, jobs (+16 more)

### Community 39 - "Dropdown and User Menu"

Cohesion: 0.18
Nodes (17): lucide-react, columns, UserMenu(), ModeToggle(), Avatar(), AvatarFallback(), DropdownMenu(), DropdownMenuCheckboxItem() (+9 more)

### Community 40 - "Chamber Member Import"

Cohesion: 0.19
Nodes (20): Page(), Page(), BuildProgress(), ListPreview(), MemberImport(), MemberListBox(), MemberListRow(), Chamber() (+12 more)

### Community 41 - "Interest and Intent Scoring"

Cohesion: 0.12
Nodes (25): comDashAlerts(), companiesIn(), countRows(), industryGroups(), intentScore(), interestBetween(), interestedCompanies(), interestForView() (+17 more)

### Community 42 - "Multi-tenancy and Standards Specs"

Cohesion: 0.11
Nodes (18): Spec: Multi-tenant foundation (organizations, memberships, RLS), active_org HTTP-only cookie, Active Organization, Service-seam integration tests against local Supabase, Sequenced delivery T1-T6, getActiveOrg(), Email invitations, Membership (+10 more)

### Community 43 - "CodeQL Workflow"

Cohesion: 0.08
Nodes (23): name, permissions, runs-on, steps, jobs, analyze, name, on (+15 more)

### Community 44 - "Env Config and Optional Services"

Cohesion: 0.17
Nodes (12): computeAuthDisabled(), isAnalyticsConfigured, Env, env, envSchema, parseEnv(), captureServer(), createClient() (+4 more)

### Community 45 - "Roles and Membership Glossary"

Cohesion: 0.14
Nodes (18): Active Organization, Guard (route and component), Membership, Org Role (owner, admin, member), Platform Role (superadmin), Role (Org Role or Platform Role), Superadmin, ADR 0005: Multi-tenancy with organizations, memberships and RLS (+10 more)

### Community 46 - "AI Lead Agent Simulator"

Cohesion: 0.14
Nodes (20): Full AI lead-generation agent (Phase 2), Postponed until after the MVP (Section 6), ComLinked Lead Agent Simulator, blocked(), Disclosure tiers (Tier 1 / Tier 2), Gate A: share confidential information (human approval), Gate B: confirm the meeting (both sides), Handoff package (selection report, agenda, transcript) (+12 more)

### Community 47 - "Claim and Company Profile"

Cohesion: 0.19
Nodes (15): Page(), Page(), Page(), ProfileTab(), Claim(), ClaimMessage(), Welcome(), CompanyProfile() (+7 more)

### Community 48 - "Demo Guide and Engine Screen"

Cohesion: 0.21
Nodes (19): Page(), DemoGuide(), KeyValue(), LATER_ITEMS, StopLink(), Engine(), NetworkMap(), Row() (+11 more)

### Community 49 - "How It Works Page"

Cohesion: 0.17
Nodes (14): HowItWorksPage(), metadata, DailyLeadLoop(), STEPS, AI_JOBS, AiSection(), CLAIM_POINTS, ClaimSection() (+6 more)

### Community 50 - "Simulation Actions and Awards"

Cohesion: 0.20
Nodes (21): actList(), answerAsk(), attentionReason(), award(), buildList(), byFit(), digestLine(), engineLog() (+13 more)

### Community 51 - "TypeScript Config"

Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+12 more)

### Community 52 - "SRS Activity Score Rules"

Cohesion: 0.16
Nodes (14): A4 Profile Strength Meter, A5 Invite Your Business Partners, ActivityLedger, SRS Approvals, Connection Degree, D1 Morning Digest, D2 Daily Lead List, D3 Activity Score and Search Rank (+6 more)

### Community 53 - "Homepage and First Chamber"

Cohesion: 0.16
Nodes (14): MarketingPage(), metadata, detail, FirstChamber(), firstChamberSchema, complete, ChamberSection(), HomeContent() (+6 more)

### Community 54 - "Join Form Fields"

Cohesion: 0.19
Nodes (14): FieldConfig, FieldControlProps, FormField(), FormFields(), SubmitButton(), JoinSection(), REASONS, FIELDS (+6 more)

### Community 55 - "Customers Service (mock)"

Cohesion: 0.14
Nodes (8): CustomersService, createCustomer(), ListCustomersOptions, nextId(), store, MOCK_CUSTOMERS, Customer, Paginated

### Community 56 - "SRS Roles and Access Rules"

Cohesion: 0.13
Nodes (13): AI Lead Agent KPIs, Agent Paid Tiers (placeholder), Chamber and Community Manager Basics (FR-CH), ComLinked Staff (Platform Role superadmin), Community Manager, Company Member (Org Role member), CONTEXT.md Domain Glossary, Free Inbound-only Agent (AG-21) (+5 more)

### Community 57 - "Customer Server Actions"

Cohesion: 0.19
Nodes (14): createCustomerAction(), CustomerFormState, customerSchema, deleteCustomerAction(), updateCustomerAction(), CustomerDetailPage(), metadata, CustomersPage() (+6 more)

### Community 58 - "ComDash Marketing Page"

Cohesion: 0.16
Nodes (11): ComDashPage(), metadata, ClimbSection(), POINTS, ComDashContent(), SignalsSection(), EXAMPLE_MATCHES, ACTIONS (+3 more)

### Community 59 - "shadcn Components Config"

Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 60 - "ComDash Redesign Spec"

Cohesion: 0.16
Nodes (17): D4 Freshness nudges, L2 ComDash interest signals, Premium plans, paywall blur, Stripe checkout (postponed), ComDash marketing page, ComDash redesign, ComDash prototype (comdash-prototype.html, outside the repo), Five ComDash tabs with their own routes, Intent score (Growth and Pro demo views only) (+9 more)

### Community 61 - "Customer Form and Select"

Cohesion: 0.22
Nodes (15): CreateCustomerPage(), Action, CustomerForm(), Field(), INITIAL, CompanySelect(), Select(), SelectContent() (+7 more)

### Community 62 - "Marketing Form Validation"

Cohesion: 0.22
Nodes (11): emailAddress(), MESSAGE_LIMIT, optionalText(), requiredText(), TEXT_LIMIT, tooLong(), joinFormSchema, valid (+3 more)

### Community 63 - "Drizzle Customers DB"

Cohesion: 0.24
Nodes (14): drizzle-orm@^0.45.2, drizzle-orm, getDb(), CustomerRow, customers, customerStatus, NewCustomerRow, createCustomer() (+6 more)

### Community 64 - "Package Scripts"

Cohesion: 0.12
Nodes (17): scripts, build, db:generate, db:migrate, db:reset, db:studio, db:types, dev (+9 more)

### Community 65 - "Docker Compose"

Cohesion: 0.12
Nodes (15): context, dockerfile, driver, options, max-file, max-size, services, web (+7 more)

### Community 66 - "Loading and Status Badges"

Cohesion: 0.18
Nodes (10): DashboardLoading(), rowKeys, statCardKeys, STATUS, StatusBadge(), Badge(), badgeVariants, SidebarMenuSkeleton() (+2 more)

### Community 67 - "Chamber Glossary Terms"

Cohesion: 0.24
Nodes (15): Activity View, Chamber, Chamber Contact, Chamber Leader, ComLinked Staff, Community Manager, Member List, Pilot (90-day launch at ECCP) (+7 more)

### Community 68 - "SRS Claim and Data Entities"

Cohesion: 0.20
Nodes (15): A1 Pre-built Company Profiles, A2 Claim Your Profile, Anthropic API, ClaimLink, Company, ConsentRecord, L1 Day-one Matches, L4 Community Manager Intros (+7 more)

### Community 69 - "Product Bars and Tabs"

Cohesion: 0.24
Nodes (14): Bar, barFor(), BottomTabs(), CompanyBar(), currentIf(), NO_TABS, PlainBar(), SEAT_BARS (+6 more)

### Community 70 - "Logger"

Cohesion: 0.21
Nodes (6): logger, createLogger(), Logger, LoggerOptions, LogLevel, LogLevelNumber

### Community 71 - "Server Env and DB Gap"

Cohesion: 0.18
Nodes (7): server-only@^0.0.1, server-only, isDatabaseConfigured, ServerEnv, serverEnv, serverEnvSchema, Database

### Community 72 - "SRS Connect and Share Features"

Cohesion: 0.20
Nodes (11): C2 ComMail, C3 AI Assistant Switch, C4 Outcome Buttons (We met / We did business), L3 Asks Board, S1 Testimonial Prompt, S2 Success Wall, S3 One-tap Share, Test Approach (+3 more)

### Community 73 - "Auth Layout and OG Image"

Cohesion: 0.18
Nodes (7): @supabase/ssr, alt, contentType, size, Config, config, ResponseCookie

### Community 74 - "Claude Commands and Handoff"

Cohesion: 0.24
Nodes (6): Project subagents README, /handoff command, /ship command, /verify command, .claude agent configuration README, settings.json (shared permission allowlist + hooks)

### Community 75 - "Multi-tenancy Migration"

Cohesion: 0.29
Nodes (10): customers_organization_id_idx, invitations_organization_id_idx, memberships_user_id_idx, public.create_organization(), public.customers, public.has_org_role(), public.invitations, public.is_org_member() (+2 more)

### Community 76 - "Unit Test Tooling"

Cohesion: 0.15
Nodes (9): ADR-0005, @testing-library/react@^16.2.0, @testing-library/user-event@^14.6.1, vitest@^3.0.5, @testing-library/react, @testing-library/user-event, vitest, auth (+1 more)

### Community 77 - "Preview Ask and Benefits"

Cohesion: 0.22
Nodes (9): Page(), ContactPresenter(), PreviewAsk(), MEMBER_BENEFITS, CHAMBER, PRESENTER, presenterContact(), PREVIEW_CLOSING (+1 more)

### Community 78 - "Dialog Components"

Cohesion: 0.38
Nodes (11): DeleteCustomerDialog(), Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay() (+3 more)

### Community 79 - "PostHog and Mock-first ADRs"

Cohesion: 0.29
Nodes (8): Service selector: customers.db.ts vs customers.mock.ts via isDatabaseConfigured, ADR 0007: PostHog analytics, opt-in, reverse-proxied, privacy-first, Node pin bumped to 22.23.1 for posthog-node, PostHog (posthog-js, posthog-node, @posthog/react), /relay same-origin reverse proxy (kept in sync in three places), Session Replay CSP delta: worker-src 'self' blob:, Strict per-request nonce CSP with strict-dynamic, Node 22 and pnpm 10 pinned via Volta and packageManager

### Community 80 - "Dependabot Config"

Cohesion: 0.18
Nodes (10): patterns, all-dependencies, interval, updates, directory, groups, open-pull-requests-limit, package-ecosystem (+2 more)

### Community 81 - "Root Layout and Theme"

Cohesion: 0.27
Nodes (8): next-themes@^0.4.4, next-themes, metadata, nunitoSans, RootLayout(), sourceSerif, ThemeProvider(), Toaster()

### Community 82 - "Notifications Screen"

Cohesion: 0.38
Nodes (8): Page(), NoteRow(), Notifications(), NewMark(), dayName(), groupText(), markNotesRead(), noteGroups()

### Community 83 - "SEO Robots and Sitemap"

Cohesion: 0.42
Nodes (6): robots(), sitemap(), getSiteURL(), buildRobots(), buildSitemap(), SITEMAP_ROUTES

### Community 84 - "ESLint Config"

Cohesion: 0.22
Nodes (6): compat, __dirname, eslintConfig, __filename, @eslint/eslintrc@^3.3.1, @eslint/eslintrc

### Community 85 - "Analytics Consent"

Cohesion: 0.33
Nodes (7): posthog-js@^1.409.5, posthog-js, hasOptedIn(), hasOptedOut(), loaded(), optIn(), optOut()

### Community 86 - "CSP and Middleware"

Cohesion: 0.33
Nodes (6): analyticsSessionReplay, buildCsp(), CspOptions, createClient(), config, middleware()

### Community 87 - "FAQ Question Sections"

Cohesion: 0.43
Nodes (5): QUESTIONS, QUESTIONS, QuestionsSection(), Question, Questions()

### Community 88 - "Server Action Security Pattern"

Cohesion: 0.38
Nodes (3): useActionState(action, initialState), Server Actions repo pattern (reference), CustomerFormState { ok, errors? }

### Community 89 - "Prettier Config"

Cohesion: 0.29
Nodes (6): plugins, printWidth, semi, singleQuote, tailwindStylesheet, trailingComma

### Community 90 - "SRS Connections and Notifications"

Cohesion: 0.40
Nodes (5): Authorized Representative, C1 Company Connections, Mutual Connection, Notification Center (FR-NTF), OD-10 Confirm Authorized Representative Roles

### Community 91 - "Drizzle Kit Config"

Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, drizzle-kit@^0.31.10, dotenv, drizzle-kit

### Community 92 - "Package Manager Pins"

Cohesion: 0.30
Nodes (5): pnpm, onlyBuiltDependencies, volta, node, pnpm

### Community 93 - "Member Standing Helpers"

Cohesion: 0.50
Nodes (5): activeOn(), members(), memberStanding(), memberTotals(), myStanding()

## Ambiguous Edges - Review These

- `Accessibility target WCAG 2.2 AA, axe zero violations` → `axe a11y gate on serious/critical violations` [AMBIGUOUS]
  .claude/skills/coding-standards/SKILL.md · relation: conceptually_related_to
- `Roles from app_metadata.role via src/lib/authz.ts (never trust client metadata)` → `Two-tier roles: Org Role on Membership, Platform Role in app_metadata` [AMBIGUOUS]
  AGENTS.md · relation: conceptually_related_to
- `Repo-as-template framing (keep changes general)` → `ADR 0008: Free MVP product direction` [AMBIGUOUS]
  CONTRIBUTING.md · relation: conceptually_related_to
- `Free for everyone (no payments, no blurred names)` → `Monetization tiers (Member, Growth, Pro, Enterprise / Chamber Partner)` [AMBIGUOUS]
  docs/specs/2026-10-21-ai-lead-agent.pdf · relation: conceptually_related_to
- `PCCI-Quezon City (pilot chamber)` → `PCCC (Philippine Canadian Chamber of Commerce) pilot` [AMBIGUOUS]
  docs/specs/2026-10-21-ai-lead-agent.pdf · relation: conceptually_related_to

## Knowledge Gaps

- **59 isolated node(s):** `ADR-0005`, `settings.json (shared permission allowlist + hooks)`, `anime.js v4 ESM named exports (animate, createTimeline, stagger)`, `use() API (promise / context)`, `Bug report issue template` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 479 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `ComDash redesign 02: Session 2 Interest Signals, Connections, plan switcher and final check` connect `ComDash Redesign Tickets` to `Design System Modes`, `Pilot Preview Claim Tickets`, `Demo Guide and Engine Screen`, `Adoption Notes and Pilot Decisions`, `ComDash Redesign Spec`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `useSimulation()` (e.g. with `getVersion()` and `subscribe()`) actually correct?**
  _`useSimulation()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ADR-0005`, `settings.json (shared permission allowlist + hooks)`, `anime.js v4 ESM named exports (animate, createTimeline, stagger)` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Forms, Charts and Auth UI` be split into smaller, more focused modules?**
  _Cohesion score 0.05002422480620155 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Marketing Nav and App Icons` to `Forms, Charts and Auth UI`, `ComDash Screens`, `Dev Dependencies`, `Product Shell and Preview`, `Dashboard Sidebar Nav`, `Runtime Dependencies`, `Connections and Next Action`, `Marketing Hero and Sign-in`, `Team Members and Tables`, `For Chambers Page`, `Org Roles and Authz`, `Asks and Wins Screens`, `React 19 and CSP Guidance`, `Dropdown and User Menu`, `Env Config and Optional Services`, `Demo Guide and Engine Screen`, `How It Works Page`, `Homepage and First Chamber`, `Join Form Fields`, `Customer Server Actions`, `ComDash Marketing Page`, `Product Bars and Tabs`, `Auth Layout and OG Image`, `Preview Ask and Benefits`, `Root Layout and Theme`, `SEO Robots and Sitemap`, `CSP and Middleware`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._

### Low-confidence Hints

_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Accessibility target WCAG 2.2 AA, axe zero violations` and `axe a11y gate on serious/critical violations`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Roles from app_metadata.role via src/lib/authz.ts (never trust client metadata)` and `Two-tier roles: Org Role on Membership, Platform Role in app_metadata`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
