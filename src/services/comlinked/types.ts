// Types for the ComLinked product simulation. See docs/adr/0010.

export interface Company {
  id: string;
  name: string;
  ini: string;
  ind: string;
  city: string;
  cat: string;
  why: string;
  offer: string[];
  seek: string[];
  gives: string[];
  wants: string[];
  rival: boolean;
  pts: number;
  /** Invented, on a reserved example domain. Empty for a company invited by name. */
  website: string;
  /** The day the Company claims its Pre-built Profile, or null when it never does. Ask
   * hasClaimed() or claimDayOf() instead of reading this: they also know about a claim made
   * during the session. */
  claimDay: number | null;
  silent?: boolean;
  joinedDay?: number;
  /** Set only for Companies outside the user's chamber, shown on the Pro view. */
  chamber?: string;
}

/** What one Company may see of another. The description, offers and needs wait for the Claim. */
export type PublicView = Pick<Company, "id" | "name" | "ini" | "ind" | "city" | "website"> &
  ({ claimed: true; description: string; offer: string[]; seek: string[] } | { claimed: false });

/** How a Company uses ComLinked once it has claimed: fixed data held with the Company, so its
 * status in the Activity View never depends on another Company's dealings. */
export interface ActivityRecord {
  /** Whether it had a Lead on the day it claimed. Without one it needs an Intro. */
  firstDayLead: boolean;
  /** The days between the days it acts, counted from its claim day, or null when it acts only on
   * that day. */
  actsEvery: number | null;
}

/** A Company in the chamber's network, with its activity record. */
export interface Member extends Company {
  activity: ActivityRecord;
}

/** One example Company as its data file holds it. The network adds the rest in data.ts. */
export type MemberRow = Omit<Member, "website" | "rival">;

/** A member's one status in the Activity View, in the order the filters list them. */
export type MemberStatus = "Active" | "Quiet" | "Needs an intro" | "Not yet claimed";

/** One member on the Activity View: its name and status, and whether a message is waiting for it
 * to claim. Nothing else about the member, and never who is waiting. */
export interface ActivityRow {
  id: string;
  name: string;
  ini: string;
  status: MemberStatus;
  waiting: boolean;
}

/** One of the Activity View's figures. `of` is the whole it counts out of, where it has one. */
export interface ActivityTile {
  key: "claimed" | "active" | "needIntro" | "deals" | "wins";
  label: string;
  value: number;
  of: number | null;
}

/** What the chamber's Activity View shows on a day: its figures, how many members it has, the
 * count for each status, and the members in the order the list shows them. */
export interface ActivityViewData {
  day: number;
  tiles: ActivityTile[];
  memberCount: number;
  counts: { status: MemberStatus; count: number }[];
  rows: ActivityRow[];
}

/** A member the Community Manager can introduce: one that has claimed. */
export type IntroChoice = Pick<ActivityRow, "id" | "name">;

/** The members an Intro can name, those needing one apart from the rest. */
export interface IntroChoices {
  needIntro: IntroChoice[];
  others: IntroChoice[];
}

/** An Intro between two Companies, on the day it was made. */
export interface Intro {
  a: string;
  b: string;
  day: number;
}

/** The message a member receives from its chamber, inviting it to claim its profile. The chamber
 * approves the real wording. */
export interface ClaimMessageContent {
  from: string;
  to: string;
  subject: string;
  greeting: string;
  /** What the chamber is piloting, then what has been drafted for this Company. */
  paragraphs: string[];
  /** What the member is told under the button that opens the Claim. */
  assurance: string;
  /** The line under the message saying whose wording it is. */
  note: string;
}

/** How a visitor reaches the person who presented the Pilot Preview. */
export interface PresenterContact {
  firstName: string;
  address: string;
  /** Opens a new message to the address, with the subject filled in. */
  mailto: string;
}

/** One row of a Member List: a Company's name and website, with the id the simulation knows it
 * by. A Member List holds no contact details. */
export type MemberListEntry = Pick<Company, "id" | "name" | "website">;

export interface MyCompany {
  name: string;
  ini: string;
  ind: string;
  city: string;
  category: string;
  gives: string[];
  wants: string[];
  about: string;
  offer: string[];
  seek: string[];
  products: string;
  projects: string[];
  photo: boolean;
  rep: string;
  altRep: string;
  lastUpdate: number;
  chamber: string;
  /** Invented, on a reserved example domain. */
  website: string;
}

export type RuleKey =
  "list" | "profile" | "reply" | "ask" | "conn" | "meet" | "deal" | "testimonial" | "invite";

export interface Rule {
  pts: number;
  label: string;
  limit: string;
}

export interface LedgerEntry {
  day: number;
  key: RuleKey;
  pts: number;
  label: string;
  co: string | null;
}

/** The five Interest Signals, plus a community manager's intro. */
export type SignalKind = "search" | "viewed" | "saved" | "messaged" | "recommended" | "intro";

export interface Signal {
  co: string;
  type: SignalKind;
  detail: string;
  day: number;
}

/** See Interest Level in CONTEXT.md. */
export type InterestLevel = "Hot" | "Warm" | "New";

export interface TimelineEntry {
  day: number;
  text: string;
  /** Intent points this entry adds; null where the view shows no intent score, and on the
   * repeat-interest row, which adds none. */
  points: number | null;
}

export interface InterestedCompany {
  company: Company;
  level: InterestLevel;
  latest: Signal;
  summary: string;
  /** Oldest first: one row per kind per day, then a repeat-interest row once there are 3 days. */
  timeline: TimelineEntry[];
  /** "Connected" or "Messaged" once the Company has acted; null leaves Message as the action. */
  status: "Connected" | "Messaged" | null;
  /** A New Company with only search appearances, folded under light activity in the table. */
  light: boolean;
}

/** Free is the MVP. Growth and Pro are a labelled demo of possible future pricing. */
export type PlanView = "free" | "growth" | "pro";

/** One "View as" tier, copied from the ComDash prototype as a demo of possible future pricing. */
export interface PlanViewRules {
  label: string;
  intentScore: boolean;
  /** Whether interest from other chambers is listed, named or not. */
  otherChambers: boolean;
  /** Whose names show: nobody's, the user's own chamber's, or every chamber's. */
  names: "none" | "own" | "all";
  /** How many interested Companies the table lists, or null for all of them. */
  rowsShown: number | null;
  /** How many search terms show, or null for all of them. */
  termsShown: number | null;
  /** Whether alerts name the Company, or come weekly without names. */
  namedAlerts: boolean;
  /** AI Lead Agent engagements a month, with how many are left when the demo starts. */
  agent: { left: number; max: number } | null;
  /** Which chambers the tier reaches, for the plan line. */
  reach: string | null;
  /** What an upgrade button says once it has opened this tier. */
  opened: string;
}

/** What a tier offers next, under the interested companies, and the tier it opens. */
export interface PlanUpsell {
  text: string;
  button: string;
  to: PlanView;
}

/** An alert from a week, without the Company's name. */
export interface WeeklyAlert {
  week: string;
  text: string;
}

/** The search terms a tier shows, and how many more it keeps for the next tier. */
export interface PlanTerms {
  shown: SearchTerm[];
  more: number;
  moreGaps: number;
}

/** An interested Company as the selected view shows it. */
export interface InterestRow extends InterestedCompany {
  /** Only on Growth and Pro. */
  score: number | null;
  /** Whether the tier hides the Company's name, industry, city and latest signal. */
  hidden: boolean;
  /** The other chamber's name, only on Pro; null for the user's own chamber. */
  chamber: string | null;
  /** Whether Message and Connect apply. Companies in other chambers are a demo view only. */
  actionable: boolean;
}

export interface ProfileUpdate {
  co: string;
  day: number;
  text: string;
}

export type ConnectionItemKind = "ask" | "win" | "update";

/** One item in "From your connections". */
export interface ConnectionItem {
  id: string;
  kind: ConnectionItemKind;
  /** Such as "Ask" or "Profile update". */
  label: string;
  company: Company;
  day: number | null;
  title: string;
  text: string;
  /** The ask a reply answers; null for wins and profile updates. */
  askId: string | null;
  answered: boolean;
}

export interface Suggestion {
  company: Company;
  why: string;
}

/** A Connection, or a Connection Request the Company sent. */
export type ConnStatus = "pending" | "connected";

export interface ConnectionRow {
  company: Company;
  status: ConnStatus;
}

export interface TopNumber {
  key: SignalKind;
  label: string;
  value: number;
  /** The highlighted tile. */
  star: boolean;
  /** Such as "38%" or "3 more than before"; null until there is a previous period. */
  change: string | null;
  trend: "up" | "down" | "same" | null;
}

export interface VisibilityDay {
  day: number;
  searches: number;
  recommendations: number;
}

export interface FunnelStep {
  label: string;
  count: number;
  /** Such as "42%" or "9.1%" of the step before; null for the first step, a step of 0 or after
   * an empty one. */
  ofPrevious: string | null;
}

export interface Funnel {
  steps: FunnelStep[];
  /** The tip for the biggest drop; null when no step loses anyone. */
  suggestion: string | null;
}

export interface DashAlert {
  day: number;
  text: string;
}

export interface CountRow {
  label: string;
  count: number;
}

export interface SearchTerm {
  term: string;
  count: number;
  gap: boolean;
  /** Added from its gap line and now saved on the profile. */
  added: boolean;
}

/** Profile editor fields that ComDash can open with focus. */
export type ProfileField = "about" | "products" | "project";

/** The single most useful thing to do, in the fixed 8-step order. */
export type NextAction = { rank: number; reason: string } & (
  | { kind: "drafts"; threads: string[] }
  | { kind: "leads"; left: number; total: number }
  | { kind: "ask"; asks: Ask[] }
  | { kind: "hot"; lead: InterestedCompany }
  | { kind: "requests"; companies: string[] }
  | { kind: "gap"; gap: SearchTerm }
  | { kind: "fresh"; days: number }
  | { kind: "clear" }
);

export interface Note {
  type: string;
  co: string | null;
  day: number;
  text: string;
  read: boolean;
}

export interface NoteGroup {
  type: string;
  day: number;
  items: Note[];
}

export interface Message {
  from: "me" | "them" | "sys";
  text: string;
  day: number;
  ai?: boolean;
}

export interface Thread {
  id: string;
  co: string;
  msgs: Message[];
  metDone: number;
  dealDone: number;
  unread?: boolean;
  note?: string;
  met?: "waiting" | null;
  deal?: "waiting" | null;
  handoff?: boolean;
  askId?: string;
  askDone?: boolean;
  draftedFor?: string | null;
}

export interface Draft {
  text: string;
  ai: boolean;
}

export interface Ask {
  id: string;
  co: string;
  text: string;
  resp: number;
  notified?: number;
  names?: string[];
  now?: string[];
  later?: string[];
  day?: number;
  answered?: boolean;
}

/** A Testimonial on the Success Wall, naming both Companies. */
export interface Win {
  a: string;
  b: string;
  need: string;
  got: string;
  /** The day it was posted. It shows on the Success Wall from that day. */
  day: number;
}

/** A deal two Companies confirmed, with the Testimonial the first of them posted that day. */
export interface Deal {
  /** Company ids. */
  a: string;
  b: string;
  /** The day both Companies confirmed it. */
  day: number;
  testimonial?: { need: string; got: string };
}

export interface Invite {
  name: string;
  via: string;
  joined: boolean;
}

export interface Digest {
  day: number;
  leads: number;
  viewers: string[];
  searches: number;
  requests: number;
  asks: number;
  moved: number;
  rank: number;
}

export interface LogEntry {
  day: number;
  what: string;
  why: string;
}

export type TextField =
  | "agentType"
  | "agentNeed"
  | "about"
  | "ask"
  | "need"
  | "got"
  | "invite"
  | "inviteVia"
  | "query"
  | "broadcast"
  | "introA"
  | "introB"
  | "products"
  | "project";

export type AiField = "aboutAi" | "askAi" | "needAi" | "gotAi";

export type Forms = Record<TextField, string> & Record<AiField, boolean>;

export interface Flags {
  claimed?: boolean;
  dashSeen?: boolean;
  listActed?: boolean;
  listDay?: number;
  sent?: boolean;
  asked?: boolean;
  deal?: boolean;
  posted?: boolean;
  digestRead?: boolean;
  digestReady?: boolean;
}

export interface AgentCandidate {
  id: string;
  cats: number[];
  desk: number;
  status: "agent" | "unclaimed" | "optout";
  cat7?: number;
}

export interface AgentRun {
  type: string;
  need: string;
  cands: AgentCandidate[];
  top: AgentCandidate[];
  chosen: AgentCandidate | null;
  shown: number;
  decisions: { a?: string; b?: string };
  tab: string;
  booked: boolean;
}

export interface AgentStep {
  st: number;
  who: "sys" | "short" | "mine" | "them" | "gate" | "booked";
  x: string;
  t: string;
  ty?: string;
  tier?: number;
  gate?: "a" | "b";
  h?: string;
  final?: boolean;
}

export interface TeamRecord {
  claimDay: number | null;
  ai: boolean;
  period: number;
}

export interface TeamRow {
  goal: string;
  metric: string;
  now: string;
  target: string;
  ratio: number;
  ok: boolean;
}

export interface TeamQueueItem {
  id: string;
  name: string;
  why: string;
  act: "intro" | "remind";
  order: number;
}

export interface TeamData {
  D: number;
  base: number;
  wac: number;
  wacAt: (day: number) => number;
  rows: TeamRow[];
  queue: TeamQueueItem[];
  optOuts: number;
  aiPct: number;
  agent: TeamRow[];
  onTrack: number;
}

export interface SimState {
  claimed: boolean;
  claimStep: number;
  claimSub: string | null;
  /** Whether the chamber's claim message shows before the first claim screen. Only Stop 2 of the
   * Pilot Preview opens on it. */
  claimMessageShown: boolean;
  me: MyCompany;
  ai: boolean;
  aiLog: { day: number; on: boolean; note: string }[];
  aiUsed: Record<number, number>;
  sel: string | null;
  day: number;
  joined: number;
  ledger: LedgerEntry[];
  lists: Record<number, string[]>;
  leadAct: Record<string, string>;
  conn: Record<string, ConnStatus>;
  skipCats: Record<string, number>;
  signals: Signal[];
  threads: Thread[];
  drafts: Record<string, Draft>;
  openThread: string | null;
  viewCo: string | null;
  asks: Ask[];
  /** Testimonials posted this session, newest first. Read the whole wall with successWall(). */
  wall: Win[];
  pendingT: { co: string }[];
  lastWin: Win | null;
  shares: Record<string, boolean>;
  invites: Invite[];
  reps: string[];
  announcements: { text: string; day: number }[];
  /** Every Intro made, by the Community Manager or by staff, newest first. */
  intros: Intro[];
  digest: Digest | null;
  rankAtMorning: number | null;
  cm: {
    stage: "idle" | "preview" | "building" | "done";
    built: number;
    imported: boolean;
    draft: string | null;
    spike: string | null;
  };
  extra: Company[];
  sharePreview: string | null;
  incoming: { co: string; day: number }[];
  pendingUntil: Record<string, number>;
  notes: Note[];
  log: LogEntry[];
  agent: AgentRun | null;
  handoffs: Record<string, AgentRun>;
  team: {
    tab: string;
    reminded: Record<string, number>;
    /** Claims that followed a staff reminder this session, by day. Read with claimDayOf(). */
    claimed: Record<string, number>;
    spikes: Record<string, string>;
    log: { day: number; text: string }[];
    agentRuns: number;
  };
  forms: Forms;
  flags: Flags;
  dismissedTerms: string[];
  /** Gap terms the Company chose to add to its profile. */
  addedTerms: string[];
  profileFocus: ProfileField | null;
  view: PlanView;
  /** Interest from Companies in other chambers, shown only on the Pro view. */
  otherSignals: Signal[];
  updates: ProfileUpdate[];
  replyDrafts: Record<string, Draft>;
  replied: string[];
  /** The Pilot Preview Stop the simulation is on, 0 being the Opening, or null in the full Demo. */
  preview: number | null;
  /** Whether the viewer has left the Pilot Preview's last Stop to look around the member's side
   * on their own. */
  exploring: boolean;
  /** Whether the Stop's side step is open, showing the same screen in another Seat. */
  sideStepShown: boolean;
  /** The demo tiers' AI Lead Agent engagements left this month, and the Companies sent to. */
  agentLeft: Record<PlanView, number>;
  agentSent: string[];
  laterItems: LaterItems;
}

/** The two switches for what is not in the MVP: possible future pricing, and the after-MVP
 * previews (the AI Lead Agent, the Team Dashboard and the Engine). */
export interface LaterItems {
  pricing: boolean;
  previews: boolean;
}
export type LaterItem = keyof LaterItems;

/** Whose view a Pilot Preview Stop shows. */
export type Seat = "community-manager" | "company" | "chamber-contact";

/** How a Stop's state is prepared. The simulation builds each one. */
export type StopState = "opening" | "member-list" | "before-claim" | "next-morning" | "two-weeks";

/** A way from a Stop to the same screen in another Seat, and the words of the way there and back. */
export interface SideStep {
  seat: Seat;
  open: string;
  back: string;
}

/** The Pilot Preview's Opening (number 0) or one of its Stops. */
export interface PreviewStop {
  number: number;
  /** The simulation day it is set on, or null for the Opening and the closing Stop. */
  day: number | null;
  title: string;
  seat: Seat | null;
  /** The screen it opens on. */
  screen: string;
  /** Its own address: the screen, marked with the Stop. */
  href: string;
  state: StopState;
  /** The side step a Stop offers, if any. */
  sideStep?: SideStep;
}

export interface ToastAction {
  label: string;
  act: string;
  arg?: string;
}
