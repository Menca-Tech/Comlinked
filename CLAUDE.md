# CLAUDE.md

How Claude works in this repo. Stack and architecture rules live in
[`AGENTS.md`](AGENTS.md) — read it first. Domain terms are in
[`CONTEXT.md`](CONTEXT.md); the decisions behind the stack are in
[`docs/adr/`](docs/adr). Project agent config (commands, agents, skills) is in
[`.claude/`](.claude/README.md).

## Product vision

The [**ComLinked MVP Build Plan**](docs/specs/2026-10-11-mvp-build-plan.md) is
our vision and guide. Read it before planning any feature. In short:

- **One job:** get a new company its first real lead within 24 hours, then give
  it a reason to come back every day.
- **Scope test:** a feature must help companies sign up, get leads, return
  daily, talk to other companies or share wins. Anything else waits; check
  Section 6 of the plan before adding something new.
- **Non-negotiables:** free for everyone, with no payments or blurred names. AI
  drafts and a person decides, and every flow works with AI off. Connections
  belong to the company. Mobile first.
- **Pilot:** ECCP, the European Chamber of Commerce of the Philippines, comes
  first (decided 2026-11-10; the plan named PCCI–Quezon City). Which chambers
  follow, and in what order, isn't set; the plan's other candidates are
  PCCI–Quezon City and the Toronto Region Board of Trade.
- **Build by ID and in order:** name features by their plan ID (A1–S3) in plans
  and handoffs, and follow the build order in Section 7.2. Test each one on a
  phone as a new company owner.
- **Open questions:** check the plan's Adoption notes before building a feature
  they name.

## Two sessions: planning → executer

Work flows through two Claude sessions:

- **Planning** shapes the work and produces **one self-contained prompt** — the
  _handoff_.
- **Executer** implements that prompt with **no memory of the planning
  conversation**. The handoff is its only context, so it must carry everything
  the executer needs.

A handoff prompt is a single block covering **Goal · Context · Scope (exact
files) · Approach (pattern + skills) · Acceptance criteria · Verification ·
Guardrails**.

## Standing rule: craft prompts with `prompt-architect`

Every handoff is authored with the **`prompt-architect`** skill (RISEN fits:
role, ordered steps, end product, constraints). Don't hand-write handoffs — run
**`/handoff`**, which invokes `prompt-architect` and emits a ready-to-paste
prompt.

## If you are the planning session

1. Shape the work with **`brainstorming`**, then **`writing-plans`**.
2. Run **`/handoff`** to turn the plan into one self-contained executer prompt.
3. Hand that prompt to a fresh executer session. **Do not implement here.**

## If you are the executer session

1. Follow the handoff prompt **exactly** — it is your full brief.
2. Use the global skills: **`test-driven-development`** for features,
   **`systematic-debugging`** for bugs, **`verification-before-completion`**
   before calling anything done, and **`requesting-code-review`** /
   **`/code-review`** for review.
3. Follow **[`AGENTS.md`](AGENTS.md)** for every stack and architecture rule.
4. Keep each commit green:
   `pnpm lint && pnpm type:check && pnpm test && pnpm build`.
5. Use **Conventional Commits**. Branch off `main`; **never commit to `main`**.
