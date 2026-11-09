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
  silent?: boolean;
  joinedDay?: number;
}

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

export interface Signal {
  co: string;
  type: string;
  detail: string;
  day: number;
}

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

export interface Win {
  a: string;
  b: string;
  need: string;
  got: string;
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
  i: number;
  claimDay: number | null;
  dayOne: boolean;
  ai: boolean;
  period: number;
  tier: number;
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
  conn: Record<string, "pending" | "connected">;
  skipCats: Record<string, number>;
  signals: Signal[];
  threads: Thread[];
  drafts: Record<string, Draft>;
  openThread: string | null;
  viewCo: string | null;
  asks: Ask[];
  wall: Win[];
  pendingT: { co: string }[];
  lastWin: Win | null;
  shares: Record<string, boolean>;
  invites: Invite[];
  reps: string[];
  announcements: { text: string; day: number }[];
  intros: { a: string; b: string }[];
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
    claimed: Record<string, number>;
    helped: Record<string, number>;
    spikes: Record<string, string>;
    log: { day: number; text: string }[];
    agentRuns: number;
  };
  forms: Forms;
  flags: Flags;
}

export interface ToastAction {
  label: string;
  act: string;
  arg?: string;
}
