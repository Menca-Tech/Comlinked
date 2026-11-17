// The ComLinked product simulation: state, engine and actions, ported from the
// HTML mockup (docs/mockup/source/app.js). Browser-held by design; see docs/adr/0010.
import { CHAMBER } from "@/services/comlinked/chamber";
import {
  ABOUT_DEFAULT,
  ABOUT_POLISHED,
  AGENT_STATUS,
  AGENT_TYPES,
  AI_LIMIT,
  CAT,
  EDGES,
  FULL_BOOST_AT,
  INDUSTRY,
  MAX_BOOST,
  METRO,
  MODERATE_FIT,
  NEIGHBORS,
  NETWORK,
  NEW_BOOST,
  OTHER_CHAMBER_COMPANIES,
  PLAN_VIEWS,
  POOL,
  PROFILE_UPDATES,
  REPLIES,
  RULES,
  SEARCH_TERMS,
  STRONG_FIT,
  TEMPLATES,
  TOTAL,
  WINS,
} from "@/services/comlinked/data";
import type {
  AgentCandidate,
  AgentRun,
  AgentStep,
  AiField,
  Ask,
  Company,
  ConnectionItem,
  ConnectionItemKind,
  ConnectionRow,
  CountRow,
  DashAlert,
  Funnel,
  InterestedCompany,
  InterestLevel,
  InterestRow,
  Message,
  NextAction,
  NoteGroup,
  PlanView,
  ProfileField,
  RuleKey,
  SearchTerm,
  Signal,
  SignalKind,
  SimState,
  Suggestion,
  TeamData,
  TeamQueueItem,
  TeamRecord,
  TeamRow,
  TextField,
  Thread,
  TimelineEntry,
  ToastAction,
  TopNumber,
  VisibilityDay,
} from "@/services/comlinked/types";

let gen = 0;
let S: SimState;
let current = "home";
let guideOpen = false;

/* ---------- Store ---------- */
let version = 0;
const listeners = new Set<() => void>();
export function emit() {
  version++;
  listeners.forEach(function (l) {
    l();
  });
}
export function subscribe(listener: () => void) {
  listeners.add(listener);
  return function () {
    listeners.delete(listener);
  };
}
export function getVersion() {
  return version;
}
export function getState() {
  return S;
}
export function isGuideOpen() {
  return guideOpen;
}
export function setGuideOpen(open: boolean) {
  guideOpen = open;
  emit();
}
export function currentRoute() {
  return current;
}

/* ---------- Handlers registered by the product shell ---------- */
const handlers = {
  go: function (_route: string) {},
  toast: function (_msg: string, _kicker?: string, _action?: ToastAction) {},
  clearToasts: function () {},
  top: function () {},
};
export function setHandlers(next: Partial<typeof handlers>) {
  Object.assign(handlers, next);
}

/* ---------- Helpers ---------- */
export const cap = function (s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
export const co = function (id: string): Company {
  return POOL.concat(S.extra).find(function (c) {
    return c.id === id;
  }) as Company;
};
export const monthOf = function (d: number) {
  return Math.ceil(d / 30);
};
export const th = function (id: string): Thread {
  return S.threads.find(function (t) {
    return t.id === id;
  }) as Thread;
};
export const threadFor = function (coId: string) {
  return S.threads.find(function (t) {
    return t.co === coId;
  });
};
/** The day a Company claimed its Pre-built Profile, or null while it has not. The only reader of
 * claim days: the Company's data, a claim that followed a staff reminder this session, and for
 * Kalayaan Foods ("me") the day it claimed in the flow. */
export function claimDayOf(id: string): number | null {
  if (id === "me") return S.claimed ? S.joined : null;
  return S.team.claimed[id] ?? co(id).claimDay;
}
/** Whether a Company had claimed its profile by a day, which is today unless one is given. */
export function hasClaimed(id: string, day = S.day) {
  const claimDay = claimDayOf(id);
  return claimDay !== null && claimDay <= day;
}
/** How many Companies in the network, Kalayaan Foods included, had claimed by a day. */
export function claimedCount(day = S.day) {
  return (
    POOL.filter(function (c) {
      return hasClaimed(c.id, day);
    }).length + (hasClaimed("me", day) ? 1 : 0)
  );
}
/** The Activity Score points a Company holds: none until it has claimed. */
export function pointsOf(c: Company) {
  return hasClaimed(c.id) ? c.pts : 0;
}
const later = function (ms: number, fn: () => void) {
  const g = gen;
  setTimeout(function () {
    if (g === gen) fn();
  }, ms);
};
export const initials = function (n: string) {
  const p = n
    .replace(/\b(inc|corp|co|ltd)\b\.?/gi, "")
    .trim()
    .split(/\s+/);
  return ((p[0] || "C")[0]! + (p[1] ? p[1][0] : "")).toUpperCase();
};
/** A simulation day as a date, such as "Day 12". */
export function dayLabel(d: number) {
  return "Day " + d;
}
export const dayName = function (d: number) {
  const n = S.day - d;
  return n <= 0 ? "Today" : n === 1 ? "Yesterday" : n + " days ago";
};
export function pct(x: number) {
  return Math.round(x * 100) + "%";
}
function toast(msg: string, kicker?: string, action?: ToastAction) {
  handlers.toast(msg, kicker, action);
}

function fresh(): SimState {
  return {
    claimed: false,
    claimStep: 0,
    claimSub: null,
    me: {
      name: "Kalayaan Foods Inc.",
      ini: "KF",
      ind: "Food manufacturing",
      city: "Quezon City",
      category: "Food Suppliers",
      gives: ["snacks", "frozen", "privatelabel", "foodmfg"],
      wants: ["grocery", "freight", "packaging"],
      about:
        "family-run maker of banana chips, ube spreads and frozen lumpia, with private-label manufacturing for retailers",
      offer: ["Filipino snacks", "Frozen foods", "Private label"],
      seek: ["Grocery retailers", "Cold-chain freight", "Packaging"],
      products: "",
      projects: [],
      photo: false,
      rep: "Ana Reyes",
      altRep: "Marco Dizon",
      lastUpdate: 1,
      chamber: CHAMBER.shortName,
      website: "kalayaanfoods.example",
    },
    ai: true,
    aiLog: [{ day: 1, on: true, note: "On by default for new companies" }],
    aiUsed: {},
    sel: null,
    day: 1,
    joined: 1,
    ledger: [],
    lists: {},
    leadAct: {},
    conn: {},
    skipCats: {},
    signals: [],
    threads: [],
    drafts: {},
    openThread: null,
    viewCo: null,
    asks: [
      {
        id: "a1",
        co: "hapag",
        text: "Looking for a frozen lumpia supplier for 12 restaurants in Metro Manila.",
        resp: 4,
      },
      {
        id: "a2",
        co: "malaya",
        text: "Looking for shelf-stable Filipino snacks for export to Canada.",
        resp: 6,
      },
      {
        id: "a3",
        co: "pack",
        text: "Looking for snack makers who need compostable pouches.",
        resp: 2,
      },
    ],
    wall: WINS.slice(),
    pendingT: [],
    lastWin: null,
    shares: {},
    invites: [],
    reps: [],
    announcements: [],
    intros: [],
    digest: null,
    rankAtMorning: null,
    cm: { stage: "idle", built: 0, imported: false, draft: null, spike: null },
    extra: [],
    sharePreview: null,
    incoming: [],
    pendingUntil: {},
    notes: [],
    log: [],
    agent: null,
    handoffs: {},
    team: {
      tab: "pilot",
      reminded: {},
      claimed: {},
      helped: {},
      spikes: {},
      log: [],
      agentRuns: 0,
    },
    forms: {
      agentType: "supplier",
      agentNeed: AGENT_TYPES.supplier!.need,
      about: ABOUT_DEFAULT,
      aboutAi: false,
      ask: "",
      askAi: false,
      need: "",
      needAi: false,
      got: "",
      gotAi: false,
      invite: "",
      inviteVia: "Link",
      query: "food",
      broadcast: "",
      introA: "me",
      introB: "maple",
      products: "",
      project: "",
    },
    flags: {},
    dismissedTerms: [],
    addedTerms: [],
    profileFocus: null,
    view: "free",
    otherSignals: [],
    updates: [],
    replyDrafts: {},
    replied: [],
  };
}
export function score() {
  return S.ledger
    .filter(function (l) {
      return l.day > S.day - 30;
    })
    .reduce(function (a, l) {
      return a + l.pts;
    }, 0);
}
export function activityBoost() {
  return Math.min(score() / FULL_BOOST_AT, 1) * MAX_BOOST;
}
export function isNew() {
  return S.day - S.joined < 30;
}
export function boost() {
  return Math.min(MAX_BOOST, activityBoost() + (isNew() ? NEW_BOOST : 0));
}
export function compBoost(p: number) {
  return Math.min(p / FULL_BOOST_AT, 1) * MAX_BOOST;
}
export function rank() {
  const b = boost();
  return (
    1 +
    POOL.filter(function (c) {
      return c.rival && compBoost(pointsOf(c)) > b;
    }).length
  );
}
export function strength() {
  const m = S.me;
  return 65 + (m.products ? 15 : 0) + (m.projects.length ? 10 : 0) + (m.photo ? 10 : 0);
}
export function connected() {
  return Object.keys(S.conn).filter(function (k) {
    return S.conn[k] === "connected";
  });
}
export function engineLog(what: string, why: string) {
  S.log.unshift({ day: S.day, what: what, why: why });
  S.log.length = Math.min(S.log.length, 40);
}
export function notify(type: string, cid: string | null, text: string) {
  S.notes.unshift({ type: type, co: cid, day: S.day, text: text, read: false });
  S.notes.length = Math.min(S.notes.length, 100);
}
export function degrees() {
  const depth: Record<string, number> = {};
  let frontier = connected();
  frontier.forEach(function (id) {
    depth[id] = 1;
  });
  for (let d = 2; frontier.length; d++) {
    const next: string[] = [];
    frontier.forEach(function (id) {
      (NEIGHBORS[id] || []).forEach(function (n) {
        if (!(n in depth)) {
          depth[n] = d;
          next.push(n);
        }
      });
    });
    frontier = next;
  }
  return depth;
}
export function degreeLabel(c: Pick<Company, "id" | "joinedDay">, depth?: Record<string, number>) {
  if (c.joinedDay) return "";
  const d = (depth || degrees())[c.id];
  return d === 1
    ? "1st"
    : d === 2
      ? "2nd"
      : d === 3
        ? "3rd"
        : d !== undefined && d > 3
          ? "3rd+"
          : "";
}
export function mutuals(c: Pick<Company, "id">) {
  const mine = connected();
  return (NEIGHBORS[c.id] || []).filter(function (n) {
    return mine.includes(n);
  });
}
export function fit(c: Company) {
  const m = S.me,
    parts: [string, number][] = [["Starting score", 12]];
  const need = (c.wants || []).filter(function (t) {
    return m.gives.includes(t);
  }).length;
  const give = (c.gives || []).filter(function (t) {
    return m.wants.includes(t);
  }).length;
  const mu = mutuals(c).length,
    skipped = S.skipCats[c.cat] || 0;
  if (need) parts.push(["Seeks what you offer", need >= 2 ? 40 : 30]);
  if (give) parts.push(["Offers what you seek", 30]);
  if (mu) parts.push([mu + " mutual connection" + (mu === 1 ? "" : "s"), Math.min(mu, 3) * 5]);
  if (c.city === m.city) parts.push(["Same city", 10]);
  else if (METRO.test(c.city)) parts.push(["Also in Metro Manila", 5]);
  if (skipped) parts.push(["You skipped " + CAT[c.cat] + " companies", -Math.min(skipped * 8, 16)]);
  if (c.rival) parts.push(["Offers the same as you", -25]);
  return {
    score: Math.max(
      20,
      Math.min(
        98,
        parts.reduce(function (a, p) {
          return a + p[1];
        }, 0),
      ),
    ),
    parts: parts,
  };
}
export function byFit(list: Company[]) {
  return list
    .map(function (c) {
      return { c: c, f: fit(c).score };
    })
    .sort(function (a, b) {
      return b.f - a.f;
    })
    .map(function (x) {
      return x.c;
    });
}
export function attention() {
  const recent = S.ledger
    .filter(function (l) {
      return l.day > S.day - 8;
    })
    .reduce(function (a, l) {
      return a + l.pts;
    }, 0);
  const activity = Math.floor(recent / 15),
    standing = Math.max(0, Math.floor((TOTAL - rank()) / 3)),
    total = 1 + activity + standing;
  return {
    recent: recent,
    activity: activity,
    standing: standing,
    total: total,
    views: Math.min(6, total),
    searches: Math.floor(total / 2),
    requests: total >= 3 ? 1 : 0,
  };
}
export function linkUp(id: string, theyAccepted: boolean) {
  if (S.conn[id] === "connected") return;
  S.conn[id] = "connected";
  delete S.pendingUntil[id];
  award("conn", id);
  if (theyAccepted) notify("accepted", id, co(id).name + " accepted your Connection Request");
}
export const ASK_WORDS: [string, RegExp][] = [
  ["packaging", /packag|pouch|carton|box|label|crate|pallet/],
  ["labels", /label|print/],
  ["pallets", /pallet|crate/],
  ["freight", /freight|deliver|logistic|cold.?chain|chilled|courier|truck|van\b|transport/],
  ["storage", /storage|warehouse/],
  ["grocery", /grocer|retail|store|supermarket|wholesale|shelf/],
  ["restaurants", /restaurant/],
  ["hotels", /hotel/],
  ["catering", /cater/],
  ["canteen", /canteen/],
  ["snacks", /snack|chips|polvoron|pastillas/],
  ["sweets", /candy|sweets|confection|polvoron|pastillas/],
  ["frozen", /frozen|lumpia|siomai/],
  ["produce", /banana|ube|vegetable|produce|fruit/],
  ["ingredients", /ingredient|spice|flour/],
  ["dairy", /milk|dairy|cheese/],
  ["rice", /\brice\b/],
  ["seafood", /fish|seafood/],
  ["export", /export/],
  ["exportadvice", /export.*(advice|consult|requirement)/],
  ["energy", /solar|energy/],
  ["water", /water/],
  ["machinery", /machine|equipment|repair/],
  ["marketing", /marketing|photo|design/],
  ["compliance", /registration|compliance|permit/],
  ["accounting", /account|bookkeep|\btax/],
  ["events", /event/],
  ["distribution", /distribut/],
  ["foodcarts", /food cart/],
];
export function askTags(text: string) {
  const t = text.toLowerCase();
  return ASK_WORDS.filter(function (w) {
    return w[1].test(t);
  }).map(function (w) {
    return w[0];
  });
}
export function offersMe(a: Ask) {
  return (
    a.co !== "me" &&
    co(a.co).wants.some(function (w) {
      return S.me.gives.includes(w);
    })
  );
}
export function makeAsk(text: string) {
  const tags = askTags(text),
    matched = byFit(
      POOL.filter(function (c) {
        return (
          hasClaimed(c.id) &&
          c.gives.some(function (g) {
            return tags.includes(g);
          })
        );
      }),
    );
  const a: Ask = {
    id: "m" + S.day + "-" + S.asks.length,
    co: "me",
    text: text,
    resp: 0,
    notified: matched.length,
    names: matched.slice(0, 2).map(function (c) {
      return c.name;
    }),
    now: [],
    later: [],
  };
  matched.forEach(function (c) {
    if (c.silent) return;
    const f = fit(c).score;
    if (f >= STRONG_FIT) a.now!.push(c.id);
    else if (f >= MODERATE_FIT) a.later!.push(c.id);
  });
  return a;
}
export function answerAsk(a: Ask, c: Company) {
  const t = ensureThread(c.id);
  t.msgs.push({
    from: "them",
    text: "We saw your ask. " + cap(c.why) + " Could we help?",
    day: S.day,
  });
  t.unread = true;
  a.resp++;
  signal(c.id, "messaged");
  notify("reply", c.id, c.name + " responded to your ask");
}
export function overnightAsk() {
  const pool = byFit(
    POOL.filter(function (c) {
      return (
        !c.silent &&
        hasClaimed(c.id) &&
        !S.asks.some(function (a) {
          return a.co === c.id;
        })
      );
    }),
  );
  if (!pool.length) return 0;
  const c = pool[S.day % Math.min(pool.length, 6)]!,
    s = c.seek[0]!,
    what = s.indexOf("Filipino") === 0 ? s : s.charAt(0).toLowerCase() + s.slice(1);
  const a = {
    id: "o" + S.day,
    co: c.id,
    text: "Looking for " + what + " for our " + c.ind.toLowerCase() + " business.",
    resp: S.day % 3,
    day: S.day,
  };
  S.asks.unshift(a);
  if (!offersMe(a)) return 0;
  notify("ask", c.id, c.name + " posted an ask that matches your company");
  return 1;
}
export function allowed(key: RuleKey, cid?: string | null) {
  const L = S.ledger.filter(function (l) {
    return l.key === key;
  });
  const today = L.filter(function (l) {
    return l.day === S.day;
  }).length;
  if (key === "list") return today < 1;
  if (key === "reply") return today < 5;
  if (key === "ask") return today < 3;
  if (key === "conn") return today < 10;
  if (key === "profile")
    return (
      L.filter(function (l) {
        return l.day > S.day - 7;
      }).length < 2
    );
  if (key === "meet")
    return (
      L.filter(function (l) {
        return l.co === cid && l.day > S.day - 7;
      }).length < 2
    );
  if (key === "deal")
    return (
      L.filter(function (l) {
        return l.co === cid && l.day > S.day - 30;
      }).length < 2
    );
  return true;
}
export function award(key: RuleKey, cid?: string | null, quiet?: boolean) {
  const r = RULES[key];
  if (!allowed(key, cid)) {
    toast(r.label + ": limit reached (" + r.limit + "). No points this time.");
    return false;
  }
  S.ledger.unshift({ day: S.day, key: key, pts: r.pts, label: r.label, co: cid || null });
  engineLog(
    "+" + r.pts + " points: " + r.label,
    "Activity Score is now " + score() + ", rank #" + rank() + " of " + TOTAL + ".",
  );
  if (!quiet) toast(r.label + (cid && co(cid) ? ", " + co(cid).name : ""), "+" + r.pts + " points");
  return true;
}
export function signal(cid: string, type: SignalKind, detail?: string) {
  S.signals.unshift({ co: cid, type: type, detail: detail || "", day: S.day });
  const n = co(cid).name;
  // Messages notify where they arrive, so they have no line here.
  const lines: Partial<Record<SignalKind, string>> = {
      viewed: n + " viewed your profile",
      saved: n + " saved your profile",
      search: n + " found you in search" + (detail ? ": " + detail : ""),
      recommended: n + " was recommended your company",
      intro: "Your community manager introduced you to " + n,
    },
    text = lines[type];
  if (text) notify(type === "viewed" ? "view" : type, cid, text);
}
/** Whether a Company shares Kalayaan Foods' trade: it buys what Kalayaan Foods offers, sells what
 * it seeks, or sells the same. The Daily Lead List and overnight attention draw only on these
 * Companies, so the rest of the network stays out of both. */
function sharesMyTrade(c: Company) {
  const m = S.me;
  return (
    c.rival ||
    c.wants.some(function (w) {
      return m.gives.includes(w);
    }) ||
    c.gives.some(function (g) {
      return m.wants.includes(g);
    })
  );
}
export function buildList() {
  if (S.lists[S.day]) return;
  const seen: Record<string, number> = {};
  Object.keys(S.lists).forEach(function (d) {
    S.lists[Number(d)]!.forEach(function (id) {
      seen[id] = 1;
    });
  });
  const cand = byFit(
    POOL.filter(function (c) {
      return !seen[c.id] && !S.conn[c.id] && sharesMyTrade(c);
    }),
  );
  S.lists[S.day] = cand.slice(0, 5).map(function (c) {
    return c.id;
  });
  if (S.lists[S.day]!.length)
    engineLog(
      "Built today’s " + S.lists[S.day]!.length + " leads",
      "Highest Fit Scores among " +
        cand.length +
        " companies not yet seen. Top: " +
        cand[0]!.name +
        ", " +
        fit(cand[0]!).score +
        " fit.",
    );
}
export function finishClaim() {
  S.claimed = true;
  S.flags.claimed = true;
  S.rankAtMorning = rank();
  buildList();
  signal("pack", "recommended");
  signal("maple", "search", "snacks");
  signal("luntian", "viewed");
  S.threads.push({
    id: "t-north",
    co: "north",
    msgs: [
      {
        from: "me",
        text: "Hello Northline Logistics team,\n\nWe are looking for chilled delivery across Metro Manila. Could we discuss your rates?",
        day: S.day - 3,
        ai: false,
      },
    ],
    note: "Your community manager sent this for your company before you claimed your profile.",
    metDone: 0,
    dealDone: 0,
  });
  S.threads.push({
    id: "t-luntian",
    co: "luntian",
    unread: true,
    msgs: [
      {
        from: "them",
        text:
          "Hello " +
          S.me.name +
          " team. We distribute organic products to retailers in Marikina and Antipolo. Are you open to a distribution partnership?",
        day: S.day,
      },
    ],
    metDone: 0,
    dealDone: 0,
  });
  signal("luntian", "messaged");
  notify("reply", "luntian", "Luntian Foods Inc. messaged you in ComMail");
}
export function seedTwoWeeks() {
  const m = S.me;
  const led = function (day: number, key: RuleKey, cid?: string) {
    S.ledger.push({
      day: day,
      key: key,
      pts: RULES[key].pts,
      label: RULES[key].label,
      co: cid || null,
    });
  };
  const sig = function (cid: string, type: SignalKind, day: number, detail?: string) {
    S.signals.push({ co: cid, type: type, detail: detail || "", day: day });
  };
  const me = function (text: string, day: number): Message {
    return { from: "me", text: text, day: day, ai: false };
  };
  const them = function (text: string, day: number): Message {
    return { from: "them", text: text, day: day };
  };
  S.claimed = true;
  S.day = 15;
  S.joined = 1;
  m.products = "Banana chips, ube spread, frozen lumpia";
  m.projects = ["Private-label chips for a Quezon City grocer"];
  m.lastUpdate = 9;
  S.lists[1] = ["maple", "pack", "north", "luntian", "tala"];
  S.lists[14] = ["bayan", "sari", "hapag", "kainan", "malaya"];
  S.conn = { maple: "connected", pack: "connected", tala: "connected" };
  S.leadAct = {
    maple: "connect",
    pack: "connect",
    north: "message",
    luntian: "message",
    tala: "connect",
    bayan: "skip",
  };
  S.skipCats = { freight: 1 };
  led(14, "list");
  led(12, "reply", "pack");
  led(11, "meet", "pack");
  led(9, "profile");
  led(9, "list");
  led(7, "reply", "maple");
  led(7, "ask");
  led(5, "profile");
  led(5, "list");
  led(3, "conn", "tala");
  led(2, "conn", "pack");
  led(2, "reply", "pack");
  led(2, "list");
  led(1, "conn", "maple");
  led(1, "list");
  sig("sari", "viewed", 15);
  sig("hapag", "viewed", 15);
  sig("luntian", "messaged", 15);
  sig("hapag", "saved", 14);
  sig("malaya", "search", 14, "snacks");
  sig("lakbay", "recommended", 13);
  sig("tindahan", "search", 13, "polvoron");
  sig("malaya", "intro", 13);
  sig("pack", "messaged", 12);
  sig("hapag", "viewed", 12);
  sig("palengke", "search", 11, "frozen lumpia");
  sig("maple", "saved", 10);
  sig("maple", "viewed", 9);
  sig("kainan", "search", 8, "frozen lumpia");
  sig("bukas", "recommended", 6);
  sig("paaralan", "search", 6, "banana chips");
  S.otherSignals = [
    { co: "oc-bagwis", type: "viewed", detail: "", day: 14 },
    { co: "oc-harbour", type: "saved", detail: "", day: 13 },
    { co: "oc-bagwis", type: "search", detail: "banana chips", day: 11 },
    { co: "oc-handaan", type: "search", detail: "frozen lumpia", day: 10 },
    { co: "oc-bagwis", type: "viewed", detail: "", day: 8 },
  ];
  S.updates = [
    { co: "pack", day: 13, text: PROFILE_UPDATES.pack ?? "" },
    { co: "maple", day: 8, text: PROFILE_UPDATES.maple ?? "" },
  ];
  S.threads = [
    {
      id: "t-luntian",
      co: "luntian",
      unread: true,
      metDone: 0,
      dealDone: 0,
      msgs: [
        them(
          "Hello " +
            m.name +
            " team. We distribute organic products to retailers in Marikina and Antipolo. Are you open to a distribution partnership?",
          15,
        ),
      ],
    },
    {
      id: "t-pack",
      co: "pack",
      metDone: 1,
      dealDone: 0,
      msgs: [
        me(
          "Hello Pacific Pack Solutions team. We make Filipino snacks and need food-grade pouches. Could we talk?",
          2,
        ),
        them(REPLIES[0]!, 2),
        me("Our product list is attached. We usually start at 5,000 units.", 2),
        them(REPLIES[1]!, 10),
        me("Thursday works. See you at your office.", 10),
        { from: "sys", text: "Both companies confirmed: We met.", day: 11 },
        them(
          "Good to meet your team. We are ready when you are. Shall we confirm the first order?",
          14,
        ),
      ],
    },
    {
      id: "t-maple",
      co: "maple",
      metDone: 0,
      dealDone: 0,
      msgs: [
        me("Hello Maple Bay Grocers team. We would like to supply your Quezon City stores.", 1),
        them(REPLIES[0]!, 7),
        me(
          "Our product list and minimum order quantities are ready. Which lines interest you most?",
          13,
        ),
      ],
    },
    {
      id: "t-north",
      co: "north",
      metDone: 0,
      dealDone: 0,
      msgs: [
        me(
          "Hello Northline Logistics team,\n\nWe are looking for chilled delivery across Metro Manila. Could we discuss your rates?",
          11,
        ),
      ],
    },
  ];
  const earlierAsk = makeAsk("Looking for a packaging supplier in QC");
  earlierAsk.resp = 3;
  earlierAsk.now = [];
  earlierAsk.later = [];
  S.asks.unshift(earlierAsk);
  S.announcements.unshift({ text: "Our next member meeting is on Friday at 3:00 p.m.", day: 13 });
  S.intros.unshift({ a: "me", b: "malaya" });
  S.cm.stage = "done";
  S.cm.built = 12;
  S.cm.imported = true;
  S.flags = {
    claimed: true,
    dashSeen: true,
    listActed: true,
    listDay: 14,
    sent: true,
    asked: true,
  };
  S.conn.buhay = "pending";
  S.pendingUntil.buhay = 16;
  S.conn.tibay = "pending";
  S.incoming = [{ co: "lakbay", day: 15 }];
  buildList();
  S.rankAtMorning = rank();
  const seededAsks = overnightAsk();
  S.digest = {
    day: 15,
    leads: S.lists[15]!.length,
    viewers: ["Sari Central Wholesale", "Hapag Kitchen Group"],
    searches: 2,
    requests: 1,
    asks: seededAsks,
    moved: 3,
    rank: rank(),
  };
  notify("search", "malaya", "Malaya Export Traders found you in search: snacks");
  notify("view", "sari", "Sari Central Wholesale viewed your profile");
  notify("view", "hapag", "Hapag Kitchen Group viewed your profile");
  notify("request", "lakbay", "Lakbay Hotels sent a Connection Request");
  notify("reply", "luntian", "Luntian Foods Inc. messaged you in ComMail");
  notify("digest", null, cap(digestLine()));
  engineLog(
    "Overnight attention: 4",
    "1 base, plus 1 for 22 points in the last 7 days, plus 2 for rank #4.",
  );
}
export function ensureThread(cid: string) {
  let t = threadFor(cid);
  if (!t) {
    t = { id: "t-" + cid, co: cid, msgs: [], metDone: 0, dealDone: 0 };
    S.threads.unshift(t);
  }
  return t;
}
export function actList() {
  if (!S.flags.listActed || S.flags.listDay !== S.day) {
    S.flags.listActed = true;
    S.flags.listDay = S.day;
    award("list");
  }
}
export function aiAvailable() {
  return (S.aiUsed[S.day] || 0) < AI_LIMIT;
}
export function spendAi() {
  S.aiUsed[S.day] = (S.aiUsed[S.day] || 0) + 1;
}
export function jobFor(t: Thread) {
  const last = t.msgs[t.msgs.length - 1];
  if (!last) return "intro";
  if (last.from === "them") return "reply";
  if (last.from === "me" && S.day - last.day >= 3) return "followup";
  return null;
}
export function draftText(job: string, t: Thread) {
  const c = co(t.co),
    m = S.me;
  if (job === "intro")
    return (
      "Hello " +
      c.name +
      " team,\n\nI am " +
      m.rep +
      " from " +
      m.name +
      ", a " +
      m.ind.toLowerCase() +
      " company in " +
      m.city +
      ". I saw that your company " +
      c.why +
      " We offer " +
      m.offer.join(", ").toLowerCase() +
      ", and we would like to explore working together.\n\nWould you have 15 minutes this week?"
    );
  if (job === "reply")
    return (
      "Thank you for reaching out, " +
      c.name +
      ". " +
      m.name +
      " would be glad to continue this. I can share our product list and minimum order quantities today.\n\nWould a short meeting this week work for your team?"
    );
  return (
    "Hello " +
    c.name +
    " team,\n\nI wanted to follow up on our note from earlier this week. " +
    m.name +
    " would still be glad to discuss working with you.\n\nIs there a good time to talk?"
  );
}
export function ensureDraft(t: Thread) {
  const job = jobFor(t);
  if (!S.ai || !job || !aiAvailable()) return;
  const key = job + ":" + t.msgs.length;
  if (t.draftedFor === key || S.drafts[t.id]?.text) return;
  t.draftedFor = key;
  S.drafts[t.id] = { text: draftText(job, t), ai: true };
  spendAi();
}
export function polish(s: string) {
  let t = String(s).trim().replace(/\s+/g, " ");
  if (!t) return t;
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (!/[.?]$/.test(t)) t += ".";
  return t;
}
export function incoming(t: Thread) {
  const n = t.msgs.filter(function (m) {
    return m.from === "them";
  }).length;
  t.msgs.push({ from: "them", text: REPLIES[Math.min(n, REPLIES.length - 1)]!, day: S.day });
  t.unread = !(current === "mail" && S.openThread === t.id);
  signal(t.co, "messaged");
  notify("reply", t.co, co(t.co).name + " replied in ComMail");
  toast(co(t.co).name + " replied in ComMail.");
  emit();
}
export function nextMorning(n: number) {
  const before = S.rankAtMorning || rank();
  S.day += n;
  Object.keys(S.pendingUntil).forEach(function (id) {
    if (S.pendingUntil[id]! > S.day || S.conn[id] !== "pending") return;
    engineLog(
      co(id).name + " accepted overnight",
      "Fit " + fit(co(id)).score + " is moderate, so it accepts by the next morning.",
    );
    linkUp(id, true);
  });
  buildList();
  S.asks.forEach(function (x) {
    if (!x.later || !x.later.length) return;
    x.later.forEach(function (id) {
      answerAsk(x, co(id));
    });
    engineLog(
      x.later.length + " overnight response" + (x.later.length === 1 ? "" : "s") + " to your ask",
      "Moderate fits respond by the next morning.",
    );
    x.later = [];
  });
  const newAsks = overnightAsk();
  const a = attention();
  Object.keys(S.team.reminded).forEach(function (id) {
    if (
      hasClaimed(id) ||
      S.team.reminded[id]! >= S.day ||
      POOL.findIndex(function (c) {
        return c.id === id;
      }) % 2
    )
      return;
    S.team.claimed[id] = S.day;
    teamLog(co(id).name + " claimed its profile after a reminder");
  });
  const pool = byFit(
    POOL.filter(function (c) {
      return S.conn[c.id] !== "connected" && hasClaimed(c.id) && sharesMyTrade(c);
    }),
  );
  const start = pool.length ? S.day % pool.length : 0;
  const pick = function (i: number) {
    return pool[(start + i) % pool.length]!;
  };
  const viewers: string[] = [];
  let searches = 0,
    requests = 0;
  if (pool.length) {
    for (let i = 0; i < a.views; i++) {
      const c = pick(i);
      if (returningViewer(c.id)) signal(c.id, "saved");
      signal(c.id, "viewed");
      viewers.push(c.name);
    }
    for (let i = 0; i < a.searches; i++) {
      const c = pick(a.views + i);
      signal(c.id, "search", (SEARCH_TERMS[(S.day + i) % SEARCH_TERMS.length] ?? "").toLowerCase());
      searches++;
    }
    for (let i = 0; i < pool.length && requests < a.requests; i++) {
      const c = pick(a.views + a.searches + i);
      if (
        S.conn[c.id] ||
        S.incoming.some(function (r) {
          return r.co === c.id;
        })
      )
        continue;
      S.incoming.unshift({ co: c.id, day: S.day });
      notify("request", c.id, c.name + " sent a Connection Request");
      requests++;
    }
  }
  otherChamberMorning();
  connectionUpdateMorning();
  engineLog(
    "Overnight attention: " + a.total,
    "1 base, plus " +
      a.activity +
      " for " +
      a.recent +
      " points in the last 7 days, plus " +
      a.standing +
      " for rank #" +
      rank() +
      ". Result: " +
      viewers.length +
      " views, " +
      searches +
      " searches, " +
      requests +
      " Connection Requests.",
  );
  S.digest = {
    day: S.day,
    leads: (S.lists[S.day] || []).length,
    viewers: viewers,
    searches: searches,
    requests: requests,
    asks: newAsks,
    moved: before - rank(),
    rank: rank(),
  };
  S.rankAtMorning = rank();
  notify("digest", null, cap(digestLine()));
  S.flags.digestReady = true;
  S.viewCo = null;
  toast(digestLine(), "ComLinked, 8:00 a.m.", { label: "Open", act: "nav", arg: "digest" });
  emit();
}
export function digestLine() {
  const d = S.digest!;
  const m =
    d.moved > 0
      ? "you moved up " + d.moved + (d.moved === 1 ? " place" : " places")
      : d.moved < 0
        ? "you moved down " + -d.moved + (d.moved === -1 ? " place" : " places")
        : "you held your place at #" + d.rank;
  return (
    d.leads +
    " new leads, " +
    d.viewers.length +
    (d.viewers.length === 1 ? " company" : " companies") +
    " viewed you, " +
    m
  );
}
export function searchDegree(c: Company) {
  const d = degreeLabel(c),
    m = mutuals(c).length;
  return (d ? " · " + d : "") + (m ? " · " + m + " mutual" : "");
}
/** Notifications of these kinds are grouped per day, with the text that follows the names. */
const GROUPED_NOTES: Record<string, string> = {
  view: "viewed your profile",
  search: "found you in search",
  saved: "saved your profile",
};
export function noteGroups() {
  const groups: NoteGroup[] = [],
    at: Record<string, NoteGroup> = {};
  S.notes.forEach(function (n) {
    const key = GROUPED_NOTES[n.type] ? n.type + n.day : null;
    if (key && at[key]) {
      at[key].items.push(n);
      return;
    }
    const g = { type: n.type, day: n.day, items: [n] };
    groups.push(g);
    if (key) at[key] = g;
  });
  return groups;
}
export function unreadCount() {
  return noteGroups().filter(function (g) {
    return g.items.some(function (n) {
      return !n.read;
    });
  }).length;
}
export function groupText(g: NoteGroup) {
  if (g.items.length === 1) return g.items[0]!.text;
  const names = g.items.map(function (n) {
    return co(n.co!).name;
  });
  const who =
    names.slice(0, 2).join(", ") + (names.length > 2 ? " and " + (names.length - 2) + " more" : "");
  return who + " " + (GROUPED_NOTES[g.type] ?? "");
}
type MemberState = "Not claimed" | "Active" | "Claimed";
interface MemberStanding {
  state: MemberState;
  /** Whether the community manager should make it an introduction. */
  intro: boolean;
}
/** Where a Company stands for the community manager, and whether it still needs an intro. */
function memberStanding(c: Company): MemberStanding {
  const r = teamRec(c),
    claimed = hasClaimed(c.id),
    recent = [0, 1, 2, 3, 4, 5, 6].some(function (n) {
      return activeOn(c, r, Math.max(1, S.day - n));
    });
  return {
    state: !claimed ? "Not claimed" : S.conn[c.id] === "connected" || recent ? "Active" : "Claimed",
    intro: claimed && !r.dayOne && !S.team.helped[c.id],
  };
}
function myStanding(): MemberStanding {
  return {
    state: hasClaimed("me") ? "Active" : "Not claimed",
    intro:
      !connected().length &&
      !S.intros.some(function (i) {
        return i.a === "me" || i.b === "me";
      }),
  };
}
/** The latest members the chamber tools list: Kalayaan Foods, then the first 11 of the network. */
export function members() {
  const list = POOL.slice(0, 11).map(function (c) {
    return { id: c.id, name: c.name, ...memberStanding(c) };
  });
  list.unshift({ id: "me", name: S.me.name, ...myStanding() });
  return list;
}
/** Counts across the whole network for the chamber tools, not only the members listed. */
export function memberTotals() {
  const standings = POOL.map(memberStanding).concat(myStanding());
  return {
    members: NETWORK,
    claimed: claimedCount(),
    active: standings.filter(function (x) {
      return x.state === "Active";
    }).length,
    needIntro: standings.filter(function (x) {
      return x.state !== "Not claimed" && x.intro;
    }).length,
  };
}
export function memberRows() {
  const src = ["Company website", "Facebook page", "Public directory listing"];
  return [{ id: "me", name: S.me.name, ind: S.me.ind, city: S.me.city, source: src[0]! }].concat(
    POOL.slice(0, 11).map(function (c, i) {
      return { id: c.id, name: c.name, ind: c.ind, city: c.city, source: src[(i + 1) % 3]! };
    }),
  );
}
export function agentRunFor(type: string, need: string): AgentRun {
  const m = S.me,
    tags = askTags(need);
  const found =
    type === "customer"
      ? POOL.filter(function (c) {
          return (
            !c.rival &&
            c.wants.some(function (w) {
              return m.gives.includes(w);
            })
          );
        })
      : POOL.filter(function (c) {
          return c.gives.some(function (g) {
            return tags.includes(g);
          });
        });
  const scored = found
    .map(function (c): AgentCandidate {
      const i = POOL.indexOf(c),
        mine = c.wants.filter(function (w) {
          return m.gives.includes(w);
        }).length,
        named = c.gives.filter(function (g) {
          return tags.includes(g);
        }).length,
        mu = mutuals(c).length;
      const need1 =
        type === "customer"
          ? (mine >= 2 ? 21 : 17) + (named ? 4 : 0)
          : Math.min(25, 18 + (mine ? 5 : 0) + (named >= 2 ? 2 : 0));
      const status = !hasClaimed(c.id)
        ? "unclaimed"
        : AGENT_STATUS[c.id] === "optout"
          ? "optout"
          : "agent";
      const cred = Math.min(
        15,
        Math.round(9 + (NEIGHBORS[c.id] || []).length / 2) - (status === "unclaimed" ? 4 : 0),
      );
      const cats = [
        need1,
        8 + ((i * 3) % 7),
        c.city === m.city ? 10 : METRO.test(c.city) ? 8 : 5,
        cred,
        Math.min(13, 4 + Math.round(pointsOf(c) / 14)),
        Math.min(10, 4 + Math.min(mu, 3) * 2),
      ];
      return {
        id: c.id,
        cats: cats,
        desk: cats.reduce(function (a, v) {
          return a + v;
        }, 0),
        status: status,
      };
    })
    .sort(function (a, b) {
      return b.desk - a.desk;
    });
  const top = scored
    .filter(function (c) {
      return c.status === "agent" && !co(c.id).silent;
    })
    .slice(0, 3);
  top.forEach(function (c, i) {
    c.cat7 = i === 1 ? 6 : 4;
  });
  return {
    type: type,
    need: need,
    cands: scored,
    top: top,
    chosen: top[0] || null,
    shown: 3,
    decisions: {},
    tab: "report",
    booked: false,
  };
}
export function agentFinal(A: AgentRun) {
  const q = A.decisions.a === "approve" ? 9 : 3;
  return { q: q, total: A.chosen!.desk + q };
}
export function bandOf(n: number) {
  return n >= 75 ? "Book" : n >= 60 ? "Nurture" : "Drop";
}
export function agentSteps(A: AgentRun): AgentStep[] {
  const m = S.me,
    T = AGENT_TYPES[A.type]!,
    steps: AgentStep[] = [],
    elig = A.cands.filter(function (c) {
      return c.status === "agent";
    }).length;
  let mins = 8 * 60;
  const at = function (step: number) {
    mins += step;
    return (
      String(Math.floor(mins / 60)).padStart(2, "0") + ":" + String(mins % 60).padStart(2, "0")
    );
  };
  const add = function (
    st: number,
    who: AgentStep["who"],
    x: string,
    extra?: Partial<AgentStep> | null,
    step?: number,
  ) {
    steps.push(
      Object.assign({ st: st, who: who, x: x, t: at(step == null ? 1 : step) }, extra || {}),
    );
  };
  add(
    0,
    "sys",
    "Mandate active: " +
      T.label.toLowerCase() +
      " match. " +
      A.need +
      ". Approver: " +
      m.rep +
      ", Owner.",
    null,
    0,
  );
  add(
    1,
    "sys",
    "Searched your chamber network. " +
      A.cands.length +
      " compan" +
      (A.cands.length === 1 ? "y" : "ies") +
      " matched; " +
      elig +
      " passed the knock-out check.",
    null,
    30,
  );
  if (A.cands.length)
    add(
      2,
      "short",
      "Desk scores out of 90." +
        (A.top.length ? " The agent engages the top " + A.top.length + " in parallel." : ""),
      null,
      11,
    );
  if (!A.chosen) {
    add(
      2,
      "sys",
      "No company can be engaged for this mandate. Name a product or service to reach more companies.",
    );
    return steps;
  }
  const c = co(A.chosen.id),
    who = m.name,
    them = c.name;
  add(
    3,
    "mine",
    "Hi, I’m the ComLinked AI agent for " +
      who +
      ", a chamber member in " +
      m.city +
      ". I’m reaching out on their behalf about this need: " +
      A.need +
      ". Is " +
      them +
      " open to inquiries in that area?",
    { ty: "INTRO" },
    21,
  );
  add(
    3,
    "them",
    "Hello, I’m the AI agent for " + them + ". Yes, that is within my mandate. " + cap(T.q),
    { ty: "MANDATE_CHECK" },
  );
  add(4, "mine", who + " is ready to move within the next 8 weeks. " + cap(T.backQ), {
    ty: "QUALIFY_Q",
  });
  add(4, "them", T.a + " Indicative and non-binding.", { ty: "QUALIFY_A", tier: 1 });
  add(4, "them", T.confQ, { ty: "QUALIFY_Q" });
  add(
    5,
    "mine",
    "That is confidential for " +
      who +
      ", so I’ve asked " +
      m.rep +
      " for approval to share it. I’ll come back today.",
    { ty: "DISCLOSURE_PENDING" },
  );
  add(
    5,
    "gate",
    "Your agent wants to share " + T.conf + " with " + them + ".",
    { gate: "a", h: "Gate A: share confidential information?" },
    0,
  );
  if (!A.decisions.a) return steps;
  if (A.decisions.a === "approve") {
    add(
      5,
      "mine",
      "Thanks for waiting. I’m approved to share " +
        T.conf +
        ". Indicative and non-binding. Does that work on your side?",
      { ty: "DISCLOSURE_GRANT", tier: 2 },
      150,
    );
    add(
      5,
      "them",
      "That is within our range. To be clear, I can’t make binding commitments.",
      { ty: "QUALIFY_A" },
      2,
    );
  } else {
    add(
      5,
      "mine",
      "I’m not able to share that. Can we continue without it?",
      { ty: "DISCLOSURE_DECLINE" },
      150,
    );
    add(
      5,
      "them",
      "Understood. Without it, I can’t confirm we are in range.",
      { ty: "QUALIFY_A" },
      2,
    );
  }
  const f = agentFinal(A),
    band = bandOf(f.total);
  add(
    6,
    "sys",
    "Qualification complete. Agent qualification scored " +
      f.q +
      "/10. Final Match Score " +
      f.total +
      "/100: " +
      band +
      ".",
    { final: true },
    2,
  );
  if (band === "Nurture") {
    add(
      6,
      "sys",
      them +
        " moves to Nurture. Its gaps show on ComDash, and the agent re-checks in 30 days or when either profile changes.",
    );
    return steps;
  }
  if (band === "Drop") {
    add(6, "sys", them + " is dropped and the reason is logged. No contact for 90 days.");
    return steps;
  }
  add(
    7,
    "mine",
    "This looks like a strong fit. I’d like to propose a 45-minute video call. Slots: Tuesday at 10:00 a.m., Wednesday at 2:00 p.m. or Thursday at 10:30 a.m., Manila time.",
    { ty: "MEETING_PROPOSAL" },
  );
  add(
    7,
    "them",
    "Thanks. My mandate needs our authorized representative to confirm meetings. I’ve sent the request.",
    { ty: "DISCLOSURE_PENDING" },
  );
  add(7, "sys", them + "’s authorized representative confirmed Wednesday at 2:00 p.m.", null, 139);
  add(
    7,
    "gate",
    them + " accepted a 45-minute video call on Wednesday at 2:00 p.m., Manila time.",
    { gate: "b", h: "Gate B: confirm the meeting?" },
    2,
  );
  if (!A.decisions.b) return steps;
  if (A.decisions.b === "decline") {
    add(
      7,
      "sys",
      "You declined the meeting, so the agent closed the engagement. No contact for 90 days.",
      null,
      19,
    );
    return steps;
  }
  add(
    8,
    "booked",
    "Wednesday at 2:00 p.m. to 2:45 p.m., Manila time, on a video call. Invites go to both companies with the handoff package attached.",
    { ty: "MEETING_BOOKED" },
    20,
  );
  add(
    9,
    "sys",
    "24 hours after the meeting, the agent asks each side one question: proceed, follow up later, or not a fit. The answers recalibrate future scoring.",
    null,
    1,
  );
  return steps;
}
export function agentBlocked(A: AgentRun, steps: AgentStep[]) {
  const last = steps[A.shown - 1];
  return !!(last && last.who === "gate" && !A.decisions[last.gate!]);
}
export function agentBook(A: AgentRun) {
  if (A.booked) return;
  A.booked = true;
  const c = co(A.chosen!.id),
    t = ensureThread(c.id);
  t.handoff = true;
  t.unread = true;
  S.handoffs[c.id] = A;
  t.msgs.push({
    from: "sys",
    text: "The AI Lead Agent booked a meeting for Wednesday at 2:00 p.m., Manila time.",
    day: S.day,
  });
  notify("meeting", c.id, "The AI Lead Agent booked a meeting with " + c.name);
  engineLog(
    "AI Lead Agent booked " + c.name,
    "Match Score " +
      agentFinal(A).total +
      " is 75 or more, and both sides approved. The agent earns no Activity Score points.",
  );
  toast("Meeting booked with " + c.name + ". The handoff package is in ComMail.");
}
export function teamRec(c: Company): TeamRecord {
  const i = POOL.indexOf(c);
  return {
    i: i,
    claimDay: claimDayOf(c.id),
    dayOne: i % 8 !== 5,
    ai: i % 5 !== 1,
    period: 8 + ((i * 7) % 27),
    tier: 1 + Math.round(c.pts / 25),
  };
}
export function activeOn(c: Company, r: TeamRecord, d: number) {
  return r.claimDay != null && d >= r.claimDay && (d * 7 + r.i * 11) % 10 < r.tier;
}
export function teamData(): TeamData {
  const D = Math.min(S.day, 90),
    recs = POOL.map(function (c) {
      return { c: c, r: teamRec(c) };
    });
  const claimedBy = function (day: number) {
    return recs.filter(function (x) {
      return x.r.claimDay != null && x.r.claimDay <= day;
    });
  };
  const activeDays = function (x: { c: Company; r: TeamRecord }, day: number) {
    let n = 0;
    for (let d = Math.max(1, day - 6); d <= day; d++) if (activeOn(x.c, x.r, d)) n++;
    return n;
  };
  const meIn = function (day: number, days: number) {
    return (
      S.claimed &&
      S.ledger.some(function (l) {
        return l.day > day - days && l.day <= day;
      })
    );
  };
  const wacAt = function (day: number) {
    return (
      claimedBy(day).filter(function (x) {
        return activeDays(x, day) > 0;
      }).length + (meIn(day, 7) ? 1 : 0)
    );
  };
  const count = function (key: RuleKey, from?: number) {
    return S.ledger.filter(function (l) {
      return l.key === key && (!from || l.day > from);
    }).length;
  };
  const claimed = claimedBy(D),
    base = claimed.length + (S.claimed ? 1 : 0),
    wac = wacAt(D),
    activeBase = claimed.filter(function (x) {
      return activeDays(x, D) > 0;
    });
  const pace = function (target: number) {
      return (target * D) / 90;
    },
    pct = function (a: number, b: number) {
      return b ? Math.round((a / b) * 100) : 0;
    };
  const inFourteen =
      claimed.filter(function (x) {
        return x.r.claimDay! <= 14;
      }).length + (S.claimed ? 1 : 0),
    claimPct = pct(inFourteen, NETWORK);
  const firstLead =
      claimed.filter(function (x) {
        return x.r.dayOne || S.team.helped[x.c.id];
      }).length + (S.claimed ? 1 : 0),
    firstPct = pct(firstLead, base);
  const myListDays = new Set(
    S.ledger
      .filter(function (l) {
        return l.key === "list" && l.day > D - 7;
      })
      .map(function (l) {
        return l.day;
      }),
  ).size;
  const habit = wac
    ? (activeBase.reduce(function (a, x) {
        return a + activeDays(x, D);
      }, 0) +
        myListDays) /
      wac
    : 0;
  const myMails = S.threads.reduce(function (a, t) {
    return (
      a +
      t.msgs.filter(function (m) {
        return m.from === "me" && m.day > D - 7;
      }).length
    );
  }, 0);
  const mails = wac
    ? (activeBase.reduce(function (a, x) {
        return a + activeDays(x, D) * 0.8;
      }, 0) +
        myMails) /
      wac
    : 0;
  const aiOn =
      claimed.filter(function (x) {
        return x.r.ai;
      }).length + (S.claimed && S.ai ? 1 : 0),
    aiPct = pct(aiOn, base);
  const fresh4 =
      claimed.filter(function (x) {
        const since = D - x.r.claimDay!;
        return since - Math.floor(since / x.r.period) * x.r.period < 30;
      }).length + (S.claimed && S.day - S.me.lastUpdate < 30 ? 1 : 0),
    freshPct = pct(fresh4, base);
  const deals = Math.floor(D / 4.5) + count("deal"),
    wins = Math.floor(D / 10) + count("testimonial"),
    shares = Math.floor(D / 4) + Object.keys(S.shares).length;
  const joined =
      Math.floor(D / 5) +
      S.invites.filter(function (i) {
        return i.joined;
      }).length,
    growth = wac ? joined / wac : 0;
  const row = function (
    goal: string,
    metric: string,
    now: string,
    target: string,
    ratio: number,
    ok: boolean,
  ): TeamRow {
    return {
      goal: goal,
      metric: metric,
      now: now,
      target: target,
      ratio: Math.max(0, Math.min(1, ratio)),
      ok: ok,
    };
  };
  const rows = [
    row(
      "Adoption",
      "Invited companies that claim within 14 days",
      claimPct + "%",
      "40%",
      claimPct / 40,
      claimPct >= (40 * Math.min(D, 14)) / 14,
    ),
    row(
      "Immediate leads",
      "New companies with 3 matches and 1 signal on day one",
      firstPct + "%",
      "90%",
      firstPct / 90,
      firstPct >= 90,
    ),
    row(
      "Daily habit",
      "Days a week active companies open the lead list",
      habit.toFixed(1),
      "3+",
      habit / 3,
      habit >= 3,
    ),
    row(
      "Engagement",
      "Weekly active companies, of claimed profiles",
      pct(wac, base) + "%",
      "50%",
      pct(wac, base) / 50,
      pct(wac, base) >= 50,
    ),
    row(
      "Communication",
      "ComMails sent per active company each week",
      mails.toFixed(1),
      "2+",
      mails / 2,
      mails >= 2,
    ),
    row(
      "AI uptake",
      "Companies with the AI Assistant on",
      aiPct + "%",
      "60%",
      aiPct / 60,
      aiPct >= 60,
    ),
    row(
      "Profile freshness",
      "Profiles updated in the last 30 days",
      freshPct + "%",
      "50%",
      freshPct / 50,
      freshPct >= 50,
    ),
    row(
      "Results",
      "Deals confirmed by both companies",
      String(deals),
      "20",
      deals / 20,
      deals >= pace(20),
    ),
    row(
      "Advocacy",
      "Testimonials posted / shared outside ComLinked",
      wins + " / " + shares,
      "10 / 25",
      wins / 10,
      wins >= pace(10) && shares >= pace(25),
    ),
    row(
      "Growth",
      "New companies joining through invites",
      growth ? "1 for every " + (1 / growth).toFixed(1) : "None yet",
      "1 for every 5",
      growth / 0.2,
      growth >= 0.2,
    ),
  ];
  const queue: TeamQueueItem[] = [];
  if (
    S.claimed &&
    !connected().length &&
    !S.intros.some(function (i) {
      return i.a === "me" || i.b === "me";
    })
  )
    queue.push({
      id: "me",
      name: S.me.name,
      why: "No connection or intro yet",
      act: "intro",
      order: 0,
    });
  recs.forEach(function (x) {
    const id = x.c.id;
    if (S.team.helped[id]) return;
    if (x.r.claimDay == null || x.r.claimDay > D) {
      queue.push({
        id: id,
        name: x.c.name,
        why: "Hasn’t claimed its profile",
        act: "remind",
        order: 2,
      });
      return;
    }
    if (!x.r.dayOne)
      queue.push({ id: id, name: x.c.name, why: "No lead yet", act: "intro", order: 0 });
    else if (D - x.r.claimDay >= 7 && activeDays(x, D) === 0)
      queue.push({ id: id, name: x.c.name, why: "Quiet for 7 days", act: "intro", order: 1 });
  });
  queue.sort(function (a, b) {
    return a.order - b.order;
  });
  const optOuts = Object.keys(AGENT_STATUS).filter(function (k) {
    return AGENT_STATUS[k] === "optout" && hasClaimed(k, D);
  }).length;
  const engagements = Math.floor(D * 1.4) + S.team.agentRuns,
    meetings = Math.floor(D / 5) + Object.keys(S.handoffs).length;
  // A claim email went to every Company that has not claimed, and to those a reminder brought in.
  const emailClaims = Object.keys(S.team.claimed).length,
    emails = recs.length - claimed.length + emailClaims;
  const engRate = pct(meetings, engagements),
    optRate = pct(optOuts, engagements),
    claimRate = pct(emailClaims, emails),
    adopt = pct(base - optOuts, NETWORK);
  const agent = [
    row(
      "Engagement to meeting",
      "Meetings booked ÷ engagements opened",
      engRate + "%",
      "15%",
      engRate / 15,
      engRate >= 15,
    ),
    row(
      "Meeting to opportunity",
      "Meetings where both sides choose proceed",
      "42%",
      "40%",
      42 / 40,
      true,
    ),
    row(
      "Approval turnaround",
      "Median time from request to decision",
      "3.2 hours",
      "Under 4",
      1,
      true,
    ),
    row(
      "Opt-out rate",
      "Opt-outs and declines ÷ engagements",
      optRate + "%",
      "Under 10%",
      optRate ? Math.min(1, 10 / optRate) : 1,
      optRate < 10,
    ),
    row(
      "Profile claim rate",
      "Claims ÷ claim-your-profile emails sent",
      claimRate + "%",
      "20%",
      claimRate / 20,
      claimRate >= 20,
    ),
    row(
      "Agent adoption",
      "Companies with an agent active, by month 6",
      adopt + "%",
      "50%",
      adopt / 50,
      adopt >= 50,
    ),
  ];
  return {
    D: D,
    base: base,
    wac: wac,
    wacAt: wacAt,
    rows: rows,
    queue: queue,
    optOuts: optOuts,
    aiPct: aiPct,
    agent: agent,
    onTrack: rows.filter(function (r) {
      return r.ok;
    }).length,
  };
}
export function teamLog(text: string) {
  S.team.log.unshift({ day: S.day, text: text });
  S.team.log.length = Math.min(S.team.log.length, 30);
}
export function spikeState(id: string) {
  return id === "tala" ? S.cm.spike : S.team.spikes[id];
}

/** Sends a message the person wrote or approved: points, ask answers and the reply that follows. */
function deliver(t: Thread, text: string, ai: boolean) {
  const last = t.msgs[t.msgs.length - 1],
    isReply = last && last.from === "them" && S.day - last.day <= 1;
  t.msgs.push({ from: "me", text: text, day: S.day, ai: ai });
  S.flags.sent = true;
  if (isReply) award("reply", t.co);
  if (t.askId && !t.askDone) {
    t.askDone = true;
    S.flags.asked = true;
    award("ask", t.co);
    const a = S.asks.find(function (x) {
      return x.id === t.askId;
    });
    if (a) {
      a.resp++;
      a.answered = true;
    }
  }
  emit();
  if (!co(t.co).silent && hasClaimed(t.co))
    later(1700, function () {
      incoming(t);
    });
}

const ACT = {
  nav: function (a: string) {
    S.viewCo = null;
    S.openThread = null;
    guideOpen = false;
    go(a);
  },
  guide: function () {
    guideOpen = !guideOpen;
  },
  siteHome: function () {
    guideOpen = false;
    go("home");
  },
  reset: function () {
    startOver();
    go("home");
  },
  demoNew: function () {
    startOver();
    go("claim");
  },
  demoActive: function () {
    startOver();
    seedTwoWeeks();
    go("dash");
  },
  morning: function (a: string) {
    if (!S.claimed) {
      toast("Start a demo first.");
      return;
    }
    guideOpen = false;
    nextMorning(Number(a));
  },
  claimNext: function () {
    S.claimStep = 1;
    emit();
    handlers.top();
  },
  claimConfirm: function (checked: string) {
    if (checked !== "yes") {
      toast("Confirm that you’re authorized to act for your company.");
      return;
    }
    S.claimStep = 2;
    S.claimSub = null;
    emit();
    handlers.top();
  },
  claimSub: function (a: string) {
    S.claimSub = a;
    emit();
    handlers.top();
  },
  claimFinish: function () {
    finishClaim();
    go("matches");
  },
  pickLead: function (a: string) {
    S.sel = a;
    emit();
  },
  viewCo: function (a: string) {
    S.viewCo = a;
    emit();
    handlers.top();
  },
  closeCo: function () {
    S.viewCo = null;
    emit();
  },
  connect: function (id: string) {
    if (S.conn[id]) return;
    const c = co(id),
      f = fit(c).score;
    S.conn[id] = "pending";
    S.leadAct[id] = S.leadAct[id] || "connect";
    actList();
    if (!hasClaimed(id)) {
      engineLog(
        "Connection Request to " + c.name,
        "It has not claimed its profile, so the request stays pending.",
      );
    } else if (f >= STRONG_FIT) {
      engineLog(
        "Connection Request to " + c.name,
        "Fit " + f + " is strong, so it is accepted within seconds.",
      );
      later(1400, function () {
        if (S.conn[id] === "pending") {
          linkUp(id, true);
          emit();
        }
      });
    } else if (f >= MODERATE_FIT) {
      S.pendingUntil[id] = S.day + 1;
      engineLog(
        "Connection Request to " + c.name,
        "Fit " + f + " is moderate, so it is accepted by the next morning.",
      );
    } else {
      engineLog(
        "Connection Request to " + c.name,
        "Fit " + f + " is weak, so it stays pending until withdrawn.",
      );
    }
    emit();
  },
  withdraw: function (id: string) {
    delete S.conn[id];
    delete S.pendingUntil[id];
    delete S.leadAct[id];
    engineLog(
      "Withdrew the request to " + co(id).name,
      "Withdrawing removes the request. The other company is not told.",
    );
    toast("Connection Request withdrawn.");
    emit();
  },
  acceptReq: function (id: string) {
    S.incoming = S.incoming.filter(function (r) {
      return r.co !== id;
    });
    engineLog(
      "Accepted a request from " + co(id).name,
      "Accepting counts in either direction, so it earns points.",
    );
    linkUp(id, false);
    emit();
  },
  ignoreReq: function (id: string) {
    S.incoming = S.incoming.filter(function (r) {
      return r.co !== id;
    });
    engineLog(
      "Ignored a request from " + co(id).name,
      "Ignoring removes the request. The other company is not told.",
    );
    toast("Request ignored. They won’t be notified.");
    emit();
  },
  teamTab: function (t: string) {
    S.team.tab = t;
    emit();
  },
  teamRemind: function (id: string) {
    S.team.reminded[id] = S.day;
    teamLog("Claim reminder sent to " + co(id).name);
    toast("Claim reminder sent to " + co(id).name + ".");
    emit();
  },
  teamIntro: function (id: string) {
    if (id === "me") {
      const p = byFit(
        POOL.filter(function (c) {
          return !S.conn[c.id] && hasClaimed(c.id) && !c.silent;
        }),
      )[0]!;
      S.intros.unshift({ a: "me", b: p.id });
      signal(p.id, "intro");
      teamLog("Introduced " + S.me.name + " to " + p.name);
      toast("Introduction sent to " + S.me.name + " and " + p.name + ".");
    } else {
      const p = co(
        (NEIGHBORS[id] || []).find(function (n) {
          return hasClaimed(n);
        }) || "maple",
      );
      S.intros.unshift({ a: id, b: p.id });
      S.team.helped[id] = S.day;
      teamLog("Introduced " + co(id).name + " to " + p.name);
      toast("Introduction sent to " + co(id).name + " and " + p.name + ".");
    }
    emit();
  },
  teamSpike: function (a: string) {
    const p = a.split("|");
    if (p[0]! === "tala") S.cm.spike = p[1]!;
    else S.team.spikes[p[0]!] = p[1]!;
    teamLog((p[1]! === "ok" ? "Cleared" : "Flagged") + " unusual points for " + co(p[0]!).name);
    emit();
  },
  agentType: function (k: string) {
    S.forms.agentType = k;
    S.forms.agentNeed = AGENT_TYPES[k]!.need;
    emit();
  },
  agentStart: function () {
    const need = S.forms.agentNeed.trim();
    if (!need) {
      toast("Tell the agent what your company needs first.");
      return;
    }
    S.agent = agentRunFor(S.forms.agentType, need);
    if (!S.agent!.chosen) S.agent!.shown = agentSteps(S.agent).length;
    S.team.agentRuns += S.agent!.top.length ? 1 : 0;
    engineLog(
      "AI Lead Agent started",
      S.agent!.cands.length +
        " companies matched the Mandate; " +
        S.agent!.top.length +
        " will be engaged. Only the preview uses these results.",
    );
    emit();
    handlers.top();
  },
  agentRestart: function () {
    S.agent = null;
    emit();
    handlers.top();
  },
  agentNext: function () {
    const A = S.agent!,
      st = agentSteps(A);
    if (A.shown >= st.length || agentBlocked(A, st)) return;
    A.shown++;
    if (st[A.shown - 1]!.who === "booked") agentBook(A);
    emit();
  },
  agentPlay: function () {
    const A = S.agent!,
      st = agentSteps(A);
    while (A.shown < st.length && !agentBlocked(A, st)) {
      A.shown++;
      if (st[A.shown - 1]!.who === "booked") agentBook(A);
    }
    emit();
  },
  agentDecide: function (a: string) {
    const p = a.split("|");
    S.agent!.decisions[p[0] as "a" | "b"] = p[1]!;
    engineLog(
      (p[0]! === "a" ? "Gate A " : "Gate B ") + (p[1]! === "approve" ? "approved" : "declined"),
      "The agent never treats silence as approval, and a person made this decision.",
    );
    emit();
  },
  agentTab: function (t: string) {
    S.agent!.tab = t;
    emit();
  },
  openHandoff: function (id: string) {
    const A = S.handoffs[id];
    if (!A) return;
    S.agent = A;
    A.tab = "report";
    S.openThread = null;
    go("agent");
  },
  openCoThread: function (id: string) {
    const t = threadFor(id);
    if (!t) return;
    S.viewCo = null;
    S.openThread = t.id;
    go("mail");
  },
  message: function (id: string) {
    const t = ensureThread(id);
    if ((S.lists[S.day] || []).includes(id)) {
      S.leadAct[id] = S.leadAct[id] || "message";
      actList();
    }
    S.viewCo = null;
    S.openThread = t.id;
    go("mail");
  },
  skip: function (id: string) {
    S.leadAct[id] = "skip";
    const c = co(id);
    S.skipCats[c.cat] = (S.skipCats[c.cat] || 0) + 1;
    engineLog(
      "Skipped " + c.name,
      "Future " +
        CAT[c.cat] +
        " companies lose " +
        Math.min(S.skipCats[c.cat]! * 8, 16) +
        " fit points.",
    );
    emit();
  },
  openThread: function (id: string) {
    S.openThread = id;
    emit();
    handlers.top();
  },
  closeThread: function () {
    S.openThread = null;
    emit();
  },
  template: function (a: string) {
    const p = a.split("|"),
      t = th(p[0]!);
    S.drafts[t.id] = { text: TEMPLATES[p[1]!]!(co(t.co), S.me), ai: false };
    emit();
  },
  send: function (id: string) {
    const t = th(id),
      d = S.drafts[id],
      text = ((d && d.text) || "").trim();
    if (!text) {
      toast("Write a message first.");
      return;
    }
    delete S.drafts[id];
    deliver(t, text, !!(d && d.ai));
  },
  outcome: function (a: string) {
    const p = a.split("|"),
      t = th(p[0]!),
      kind = p[1] as "met" | "deal";
    t[kind] = "waiting";
    emit();
    later(1500, function () {
      t[kind] = null;
      if (kind === "met") {
        t.metDone++;
        award("meet", t.co);
        t.msgs.push({ from: "sys", text: "Both companies confirmed: We met.", day: S.day });
      } else {
        t.dealDone++;
        S.flags.deal = true;
        const ok = award("deal", t.co);
        t.msgs.push({
          from: "sys",
          text: "Both companies confirmed: We did business.",
          day: S.day,
        });
        if (ok) {
          S.pendingT.push({ co: t.co });
          toast("Tell other companies what happened.", "Testimonial", {
            label: "Write it",
            act: "nav",
            arg: "wins",
          });
        }
      }
      emit();
    });
  },
  toggleAi: function () {
    S.ai = !S.ai;
    S.aiLog.unshift({
      day: S.day,
      on: S.ai,
      note: "Switched " + (S.ai ? "on" : "off") + " by " + S.me.rep,
    });
    if (!S.ai) {
      Object.keys(S.drafts).forEach(function (k) {
        if (S.drafts[k]!.ai) delete S.drafts[k];
      });
      Object.entries(S.replyDrafts).forEach(function ([k, d]) {
        if (d.ai) delete S.replyDrafts[k];
      });
    }
    S.threads.forEach(function (t) {
      t.draftedFor = null;
    });
    toast("AI Assistant is " + (S.ai ? "on" : "off") + ". The change is recorded.");
    emit();
  },
  polishForm: function (k: string) {
    const f = k as TextField;
    if (!S.forms[f].trim()) {
      toast("Write something first.");
      return;
    }
    S.forms[f] = polish(S.forms[f]);
    S.forms[(k + "Ai") as AiField] = true;
    spendAi();
    emit();
  },
  polishT: function () {
    (["need", "got"] as const).forEach(function (k) {
      if (S.forms[k].trim()) {
        S.forms[k] = polish(S.forms[k]);
        S.forms[`${k}Ai` as AiField] = true;
      }
    });
    spendAi();
    emit();
  },
  postAsk: function () {
    const text = S.forms.ask.trim();
    if (!text) {
      toast("Write what your company needs first.");
      return;
    }
    const a = makeAsk(text);
    S.asks.unshift(a);
    S.forms.ask = "";
    S.forms.askAi = false;
    S.flags.asked = true;
    award("ask");
    engineLog(
      "Your ask reached " + a.notified + " compan" + (a.notified === 1 ? "y" : "ies"),
      a.notified
        ? "They offer what it names. " +
            a.now!.length +
            " strong fit" +
            (a.now!.length === 1 ? "" : "s") +
            " will respond now and " +
            a.later!.length +
            " by the next morning."
        : "No company in the network offers what it names.",
    );
    emit();
    a.now!.forEach(function (id, i) {
      later(2200 + i * 900, function () {
        answerAsk(a, co(id));
        toast(co(id).name + " responded to your ask.");
        emit();
      });
    });
    a.now = [];
  },
  respond: function (id: string) {
    const a = S.asks.find(function (x) {
        return x.id === id;
      })!,
      t = ensureThread(a.co);
    t.askId = id;
    t.note = "Responding to: " + a.text;
    S.openThread = t.id;
    go("mail");
  },
  postT: function () {
    const f = S.forms;
    if (!f.need.trim() || !f.got.trim()) {
      toast("Answer both questions first.");
      return;
    }
    const p = S.pendingT.shift()!,
      c = co(p.co);
    const w = { a: S.me.name, b: c.name, need: polish(f.need), got: polish(f.got) };
    S.wall.unshift(w);
    S.lastWin = w;
    f.need = "";
    f.got = "";
    f.needAi = false;
    f.gotAi = false;
    S.flags.posted = true;
    award("testimonial", p.co);
    emit();
    later(1800, function () {
      S.wall.unshift({
        a: c.name,
        b: S.me.name,
        need: "We needed a reliable partner for this order.",
        got: "Their team delivered on time, and we plan to order again.",
      });
      notify("win", p.co, c.name + " posted a testimonial about your deal");
      toast(c.name + " posted its testimonial too.");
      emit();
    });
  },
  sharePreview: function (n: string) {
    S.sharePreview = n;
    emit();
  },
  shareCancel: function () {
    S.sharePreview = null;
    emit();
  },
  share: function (n: string) {
    S.shares[n] = true;
    S.sharePreview = null;
    toast("Shared to " + n + ". This mockup doesn’t post anything.");
    emit();
  },
  polishAbout: function () {
    const f = S.forms;
    if (!f.about.trim()) {
      toast("Write a description first.");
      return;
    }
    f.about = f.about.trim() === ABOUT_DEFAULT ? ABOUT_POLISHED : polish(f.about);
    f.aboutAi = true;
    spendAi();
    emit();
  },
  saveAbout: function () {
    const f = S.forms,
      v = f.about.trim();
    if (!v) {
      toast("Write a description first.");
      return;
    }
    S.me.about = v.replace(/\.$/, "");
    f.aboutAi = false;
    S.me.lastUpdate = S.day;
    toast("Company description saved.");
    emit();
  },
  searchFor: function (name: string) {
    S.forms.query = name;
    S.viewCo = null;
    go("search");
  },
  addProducts: function () {
    const v = S.forms.products.trim();
    if (!v) {
      toast("Add at least one product.");
      return;
    }
    S.me.products = v;
    S.forms.products = "";
    S.me.lastUpdate = S.day;
    award("profile");
    emit();
  },
  addProject: function () {
    const v = S.forms.project.trim();
    if (!v) {
      toast("Describe a recent project.");
      return;
    }
    S.me.projects.unshift(v);
    S.forms.project = "";
    S.me.lastUpdate = S.day;
    award("profile");
    emit();
  },
  addPhoto: function () {
    S.me.photo = true;
    S.me.lastUpdate = S.day;
    award("profile");
    emit();
  },
  swapRep: function () {
    const m = S.me,
      old = m.rep;
    m.rep = m.altRep;
    m.altRep = old;
    toast(
      old +
        " no longer has access. All " +
        connected().length +
        " connections stayed with your company.",
    );
    emit();
  },
  invite: function (via: string) {
    const n = S.forms.invite.trim();
    if (!n) {
      toast("Enter the company you want to invite.");
      return;
    }
    const i = { name: n, via: via, joined: false };
    S.invites.unshift(i);
    S.forms.invite = "";
    emit();
    later(2000, function () {
      i.joined = true;
      S.extra.push({
        id: "inv" + S.extra.length,
        name: n,
        ini: initials(n),
        ind: "New member",
        city: "Joined through your invitation",
        cat: "services",
        why: "joined ComLinked through your invitation.",
        offer: ["New on ComLinked"],
        seek: ["Business partners"],
        pts: 0,
        joinedDay: S.day,
        gives: [],
        wants: [],
        rival: false,
        // A company invited by name: its website isn't known, and it claims as it joins.
        website: "",
        claimDay: S.day,
      });
      award("invite", null, true);
      toast(n + " joined and claimed its profile.", "+10 points");
      emit();
    });
  },
  importPick: function () {
    S.cm.stage = "preview";
    emit();
  },
  importCancel: function () {
    S.cm.stage = S.cm.imported ? "done" : "idle";
    emit();
  },
  importBuild: function () {
    const n = memberRows().length;
    S.cm.stage = "building";
    S.cm.built = 0;
    emit();
    for (let i = 1; i <= n; i++)
      later(260 * i, function () {
        S.cm.built = i;
        if (i === n) {
          S.cm.stage = "done";
          S.cm.imported = true;
          toast(n + " profiles built and " + n + " claim links sent.");
        }
        emit();
      });
  },
  viewDraft: function (id: string) {
    S.cm.draft = id;
    emit();
    handlers.top();
  },
  closeDraft: function () {
    S.cm.draft = null;
    emit();
  },
  makeIntro: function () {
    const f = S.forms;
    if (f.introA === f.introB) {
      toast("Choose two different companies.");
      return;
    }
    S.intros.unshift({ a: f.introA, b: f.introB });
    const other = f.introA === "me" ? f.introB : f.introB === "me" ? f.introA : null;
    if (other) signal(other, "intro");
    toast("Introduction sent to both companies.");
    emit();
  },
  broadcast: function () {
    const v = S.forms.broadcast.trim();
    if (!v) {
      toast("Write the announcement first.");
      return;
    }
    S.announcements.unshift({ text: v, day: S.day });
    S.forms.broadcast = "";
    notify("announce", null, CHAMBER.shortName + " sent an announcement");
    toast("Sent to " + claimedCount() + " members who have claimed.");
    emit();
  },
  spike: function (a: string) {
    S.cm.spike = a;
    emit();
  },
  addGap: function (term: string) {
    if (!S.addedTerms.includes(term)) S.addedTerms.push(term);
    const f = S.forms,
      lists = function (text: string) {
        return text.toLowerCase().includes(term.toLowerCase());
      };
    if (S.me.products) {
      const base = f.about.trim().replace(/\.$/, "");
      if (!lists(base)) f.about = (base ? base + ". " : "") + "We also offer " + term + ".";
      f.aboutAi = false;
      S.profileFocus = "about";
    } else {
      const base = f.products.trim();
      if (!lists(base)) f.products = base ? base + ", " + term : term;
      S.profileFocus = "products";
    }
  },
  dismissGap: function (term: string) {
    if (!S.dismissedTerms.includes(term)) S.dismissedTerms.push(term);
    toast("Got it. This term won’t be flagged again.");
  },
  setView: function (view: string) {
    if (isPlanView(view)) S.view = view;
  },
  startReply: function (itemId: string) {
    const item = connectionItems().find(function (i) {
      return i.id === itemId;
    });
    if (!item || S.replyDrafts[itemId]) return;
    if (S.ai && aiAvailable()) {
      S.replyDrafts[itemId] = { text: ITEM_KINDS[item.kind].draft(item), ai: true };
      spendAi();
    } else S.replyDrafts[itemId] = { text: "", ai: false };
  },
  cancelReply: function (itemId: string) {
    delete S.replyDrafts[itemId];
  },
  sendReply: function (itemId: string) {
    const item = connectionItems().find(function (i) {
        return i.id === itemId;
      }),
      d = S.replyDrafts[itemId],
      text = (d?.text ?? "").trim();
    if (!item) return;
    if (!text) {
      toast("Write a reply first.");
      return;
    }
    const t = ensureThread(item.company.id);
    if (item.askId && t.askId !== item.askId) {
      t.askId = item.askId;
      t.askDone = false;
    }
    delete S.replyDrafts[itemId];
    S.replied.push(itemId);
    toast("Reply sent to " + item.company.name + " in ComMail.");
    deliver(t, text, !!d?.ai);
  },
  focusProfile: function (field: string) {
    const known = PROFILE_FIELDS.find(function (f) {
      return f === field;
    });
    if (known) S.profileFocus = known;
  },
};

/* ---------- Routing and lifecycle ---------- */
function startOver() {
  gen++;
  S = fresh();
  guideOpen = false;
  handlers.clearToasts();
}

/** Applies the mockup's route() logic and returns the route to show. */
export function enterRoute(route: string) {
  if (route !== current) {
    S.viewCo = null;
    S.cm.draft = null;
  }
  current = route;
  if (route !== "claim" && route !== "whats-next" && route !== "home" && !S.claimed) finishClaim();
  if (route === "claim" && S.claimed) current = "dash";
  return current;
}
function go(name: string) {
  handlers.go(enterRoute(name));
  emit();
}

/** Every action a screen can trigger. Each one notifies subscribers when it finishes. */
type ActionMap = typeof ACT;
export const act = Object.fromEntries(
  Object.entries(ACT).map(function ([key, fn]) {
    return [
      key,
      function (arg: string) {
        (fn as (a: string) => void)(arg);
        emit();
      },
    ];
  }),
) as { [K in keyof ActionMap]: ActionMap[K] };

/* ---------- Form fields ---------- */
export function setForm(field: TextField, value: string) {
  S.forms[field] = value;
  const ai = (field + "Ai") as AiField;
  if (S.forms[ai]) S.forms[ai] = false;
  emit();
}
export function setDraft(threadId: string, text: string) {
  S.drafts[threadId] = { text: text, ai: false };
  emit();
}
export function setReplyDraft(itemId: string, text: string) {
  S.replyDrafts[itemId] = { text: text, ai: false };
  emit();
}

/* ---------- Effects the mockup ran while rendering ---------- */
export function markDashSeen() {
  if (!S.flags.dashSeen) {
    S.flags.dashSeen = true;
    emit();
  }
}
export function markDigestRead() {
  if (S.digest && !S.flags.digestRead) {
    S.flags.digestRead = true;
    emit();
  }
}
export function markNotesRead() {
  if (
    S.notes.some(function (n) {
      return !n.read;
    })
  ) {
    S.notes.forEach(function (n) {
      n.read = true;
    });
    emit();
  }
}
export function openDefaultThread() {
  if (!S.openThread && S.threads.length) {
    S.openThread = (
      S.threads.find(function (t) {
        return t.unread;
      }) || S.threads[0]!
    ).id;
    emit();
  }
}
export function prepareThread(id: string) {
  const t = S.threads.find(function (x) {
    return x.id === id;
  });
  if (!t) return;
  const before = t.unread,
    draft = S.drafts[t.id];
  t.unread = false;
  ensureDraft(t);
  if (before !== t.unread || draft !== S.drafts[t.id]) emit();
}

/* ---------- Read models for screens ---------- */
export function mutualText(c: Pick<Company, "id">) {
  const m = mutuals(c);
  if (!m.length) return "";
  const names = m
    .slice(0, 2)
    .map(function (id) {
      return co(id).name;
    })
    .join(" and ");
  return (
    m.length +
    " mutual connection" +
    (m.length === 1 ? "" : "s") +
    ": " +
    names +
    (m.length > 2 ? " and " + (m.length - 2) + " more" : "")
  );
}
export function fitReasons(c: Company) {
  return fit(c).parts.filter(function (p) {
    return p[0] !== "Starting score";
  });
}
export function selectedLead(ids: string[]) {
  const open = function (id: string) {
    return !S.leadAct[id] && !S.conn[id];
  };
  return S.sel && ids.includes(S.sel) && open(S.sel) ? S.sel : ids.find(open) || null;
}
export function firstMatches() {
  return byFit(
    POOL.filter(function (c) {
      return !S.conn[c.id];
    }),
  ).slice(0, 3);
}
export function monthlyTop() {
  const month = monthOf(S.day);
  const mine = S.ledger
    .filter(function (l) {
      return monthOf(l.day) === month;
    })
    .reduce(function (a, l) {
      return a + l.pts;
    }, 0);
  const top = POOL.flatMap(function (c, i) {
    if (!hasClaimed(c.id)) return [];
    return [
      {
        n: c.name,
        p: Math.round(pointsOf(c) * 0.6 * (0.7 + ((i * 7 + month * 13) % 10) / 20)),
        me: false,
      },
    ];
  })
    .concat(hasClaimed("me") ? [{ n: S.me.name, p: mine, me: true }] : [])
    .sort(function (a, b) {
      return b.p - a.p;
    })
    .slice(0, 10);
  return { month: month, top: top };
}
export interface SearchRow {
  me: boolean;
  company: Pick<Company, "name" | "ini" | "ind" | "city">;
  source: Company | null;
  calc: string;
}
export function searchRows(): SearchRow[] | null {
  const q = S.forms.query.trim().toLowerCase();
  if (!q) return null;
  const score1 = function (name: string, ind: string, tags: string[]) {
    if (ind.toLowerCase().indexOf(q) >= 0 || name.toLowerCase().indexOf(q) >= 0) return 100;
    if (tags.join(" ").toLowerCase().indexOf(q) >= 0) return 85;
    return 0;
  };
  const rows: { me: boolean; c: Company | null; r: number; b: number; val: number }[] = POOL.concat(
    S.extra,
  )
    .map(function (c) {
      const r = score1(c.name, c.ind + " " + c.why, c.offer.concat(c.seek));
      const b = c.joinedDay ? (S.day - c.joinedDay < 30 ? NEW_BOOST : 0) : compBoost(pointsOf(c));
      return { me: false, c: c, r: r, b: b, val: r * (1 + b) };
    })
    .filter(function (x) {
      return x.r > 0;
    });
  const mr = score1(S.me.name, S.me.ind + " " + S.me.about, S.me.offer.concat(S.me.seek));
  if (mr > 0) rows.push({ me: true, c: null, r: mr, b: boost(), val: mr * (1 + boost()) });
  rows.sort(function (a, b) {
    return b.val - a.val;
  });
  return rows.slice(0, 12).map(function (x) {
    return {
      me: x.me,
      company: x.c || { name: S.me.name, ini: S.me.ini, ind: S.me.ind, city: S.me.city },
      source: x.c,
      calc: x.r + " × " + (1 + x.b).toFixed(2),
    };
  });
}
export function trendPoints(d: TeamData) {
  const pts: { day: number; v: number }[] = [];
  for (let day = 1; day <= d.D; day++) pts.push({ day: day, v: d.wacAt(day) });
  return pts;
}
/** The radius of a Company's mark on the network map, and of a small one on a crowded ring. */
const MARK_RADIUS = 17,
  SMALL_MARK_RADIUS = 12;
/** With more Companies than this, the outer ring is drawn as two and its marks shrink, so every
 * mark stays clear of its neighbours. */
const CROWDED_RING = 40;
/** The map's rings: 1st degree, 2nd degree, then everyone further out. */
const RINGS = [1, 2, 3] as const;
type Ring = (typeof RINGS)[number];
const OUTER_RING: Ring = 3;
/** How far from the centre each ring sits, and the two rings a crowded outer ring becomes. */
const RING_RADIUS: Record<Ring, number> = { 1: 118, 2: 205, 3: 292 },
  SPLIT_RING_RADIUS = [266, 322] as const;
export function networkLayout() {
  const depth = degrees(),
    cx = 350,
    cy = 350;
  const ringOf = function (c: Company): Ring {
    const d = depth[c.id];
    return d === 1 ? 1 : d === 2 ? 2 : OUTER_RING;
  };
  const rings: Record<Ring, Company[]> = { 1: [], 2: [], 3: [] };
  POOL.forEach(function (c) {
    rings[ringOf(c)].push(c);
  });
  const crowded = rings[OUTER_RING].length > CROWDED_RING;
  const pos: Record<string, { x: number; y: number }> = { me: { x: cx, y: cy } };
  RINGS.forEach(function (r) {
    const list = rings[r],
      split = r === OUTER_RING && crowded,
      inner = Math.ceil(list.length / 2),
      outer = list.length - inner;
    list.forEach(function (c, i) {
      // A split ring alternates between its two rings, each evenly spaced.
      const onOuter = split && i % 2 === 1,
        turn = !split
          ? i / list.length
          : onOuter
            ? (Math.floor(i / 2) + 0.5) / outer
            : i / 2 / inner,
        a = turn * Math.PI * 2 - Math.PI / 2 + r * 0.2,
        radius = split ? SPLIT_RING_RADIUS[onOuter ? 1 : 0] : RING_RADIUS[r];
      pos[c.id] = { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
    });
  });
  const lines = EDGES.map(function (p) {
    return { a: p[0], b: p[1], me: false };
  }).concat(
    connected().map(function (id) {
      return { a: "me", b: id, me: true };
    }),
  );
  const nodes = POOL.map(function (c) {
    const ring = ringOf(c),
      small = crowded && ring === OUTER_RING;
    return {
      id: c.id,
      ini: c.ini,
      name: c.name,
      cls: "d" + ring + (small ? " sm" : ""),
      radius: small ? SMALL_MARK_RADIUS : MARK_RADIUS,
    };
  });
  return {
    pos: pos,
    lines: lines,
    nodes: nodes,
    counts: { 1: rings[1].length, 2: rings[2].length, 3: rings[3].length },
  };
}

/* ---------- Network Ring ---------- */
export interface RingNode {
  company: Company;
  tier: 1 | 2 | 3;
  status: "connected" | "open" | "pending" | "message";
}

function lastActive(id: string) {
  const days = [
    ...S.signals.filter((s) => s.co === id).map((s) => s.day),
    ...S.ledger.filter((l) => l.co === id).map((l) => l.day),
    ...(threadFor(id)?.msgs ?? []).map((m) => m.day),
  ];
  return days.length ? Math.max(...days) : 0;
}

/** 1 for a Connection, 2 for a company sharing a Mutual Connection, otherwise 3. */
function ringTier(c: Pick<Company, "id" | "joinedDay">): 1 | 2 | 3 {
  if (S.conn[c.id] === "connected") return 1;
  return degreeLabel(c) === "2nd" ? 2 : 3;
}

/** What matters today: up to 6 recently active Connections, then today's Leads. */
export function networkRing() {
  const all = connected();
  const inner = all
    .map((id, order) => ({ id, order, active: lastActive(id) }))
    .sort((a, b) => b.active - a.active || b.order - a.order)
    .slice(0, 6);
  const nodes: RingNode[] = inner.map((x) => ({ company: co(x.id), tier: 1, status: "connected" }));
  (S.lists[S.day] ?? [])
    .filter((id) => S.leadAct[id] !== "skip" && S.conn[id] !== "connected")
    .forEach((id) => {
      const company = co(id);
      const status =
        S.conn[id] === "pending" ? "pending" : S.leadAct[id] === "message" ? "message" : "open";
      nodes.push({ company, tier: ringTier(company), status });
    });
  return { nodes, more: all.length - inner.length };
}

/* ---------- ComDash ---------- */
const PROFILE_FIELDS: ProfileField[] = ["about", "products", "project"];
const INTEREST_KINDS: SignalKind[] = ["search", "viewed", "saved", "messaged", "recommended"];
/** Interest Level and the funnel look at the last 14 simulated days. */
const LEVEL_DAYS = 14;
/** Top numbers compare the last 7 days with the 7 before. */
const PERIOD_DAYS = 7;
/** Roles, industries and search terms cover the last 30 days. */
const INSIGHT_DAYS = 30;
/** The Interest Levels, strongest first: the order of lists and of ComDash's level filter. */
export const INTEREST_LEVELS: readonly InterestLevel[] = ["Hot", "Warm", "New"];
/** Which signal to show as the latest when several fall on the same day. */
const KIND_WEIGHT: Record<SignalKind, number> = {
  messaged: 5,
  saved: 4,
  viewed: 3,
  search: 2,
  recommended: 1,
  intro: 0,
};
const SIGNAL_TEXT: Record<SignalKind, string> = {
  search: "Found you in search",
  viewed: "Viewed your profile",
  saved: "Saved your profile",
  messaged: "Messaged you",
  recommended: "Was recommended your company",
  intro: "Introduced by your community manager",
};

/** Interest Signals from other Companies on days after `from`, up to and including `to`. */
function interestBetween(from: number, to: number, coId?: string, signals = S.signals) {
  return signals.filter(function (s) {
    return (
      INTEREST_KINDS.includes(s.type) &&
      s.day > from &&
      s.day <= to &&
      (coId === undefined || s.co === coId)
    );
  });
}
function companiesIn(signals: Signal[]) {
  return Array.from(
    new Set(
      signals.map(function (s) {
        return s.co;
      }),
    ),
  );
}
function returningViewer(coId: string) {
  const mine = S.signals.filter(function (s) {
    return s.co === coId;
  });
  return (
    mine.some(function (s) {
      return s.type === "viewed" && s.day < S.day;
    }) &&
    !mine.some(function (s) {
      return s.type === "saved";
    })
  );
}

/** Hot, Warm or New over the 14 days up to `day`; null when the Company showed no interest. */
export function interestLevel(coId: string, day = S.day): InterestLevel | null {
  const recent = interestBetween(day - LEVEL_DAYS, day, coId);
  return recent.length ? levelOf(recent) : null;
}

/** Separate days of interest that make a Company Hot, and earn the timeline's repeat row. */
const HOT_DAYS = 3;

/** The Interest Level rule from CONTEXT.md, for one Company's recent signals. */
function levelOf(recent: Signal[]): InterestLevel {
  const days = new Set(
    recent.map(function (s) {
      return s.day;
    }),
  ).size;
  const did = function (kind: SignalKind) {
    return recent.some(function (s) {
      return s.type === kind;
    });
  };
  if (days >= HOT_DAYS || did("messaged")) return "Hot";
  if (days >= 2 || did("saved")) return "Warm";
  return "New";
}

export function signalText(s: Signal) {
  return SIGNAL_TEXT[s.type] + (s.type === "search" && s.detail ? ": " + s.detail : "");
}

function timesText(n: number) {
  return n === 1 ? "once" : n === 2 ? "twice" : n + " times";
}

/** One line, such as "Viewed your profile 4 times and saved it". */
function interestSummary(signals: Signal[]) {
  const count = function (kind: SignalKind) {
    return signals.filter(function (s) {
      return s.type === kind;
    }).length;
  };
  const parts: string[] = [];
  if (count("search")) parts.push("found you in search " + timesText(count("search")));
  if (count("viewed")) parts.push("viewed your profile " + timesText(count("viewed")));
  if (count("saved")) parts.push(count("viewed") ? "saved it" : "saved your profile");
  if (count("messaged")) parts.push("messaged you");
  if (count("recommended")) parts.push("was recommended your company");
  const last = parts.pop() ?? "";
  return cap(parts.length ? parts.join(", ") + " and " + last : last);
}

/** One row per signal kind per day, oldest first, with ×N for repeats; searches list their
 * terms. Each row earns its kind's intent points, so a kind counts once a day. A repeat-interest
 * row closes the timeline once the Interest Level rule counts enough separate days. */
function timelineOf(signals: Signal[]): TimelineEntry[] {
  const groups: { day: number; kind: SignalKind; terms: string[]; n: number }[] = [];
  signals
    .slice()
    .sort(function (a, b) {
      return a.day - b.day || KIND_WEIGHT[a.type] - KIND_WEIGHT[b.type];
    })
    .forEach(function (s) {
      let group = groups.find(function (g) {
        return g.day === s.day && g.kind === s.type;
      });
      if (!group) {
        group = { day: s.day, kind: s.type, terms: [], n: 0 };
        groups.push(group);
      }
      group.n++;
      if (s.type === "search" && s.detail && !group.terms.includes(s.detail))
        group.terms.push(s.detail);
    });
  const rows: TimelineEntry[] = groups.map(function (g) {
    return {
      day: g.day,
      text:
        SIGNAL_TEXT[g.kind] +
        (g.n > 1 ? " ×" + g.n : "") +
        (g.terms.length ? ": " + g.terms.join(", ") : ""),
      points: INTENT_POINTS[g.kind] ?? 0,
    };
  });
  const days = separateDays(signals);
  const last = rows[rows.length - 1];
  if (last && days >= HOT_DAYS)
    rows.push({
      day: last.day,
      text: "Repeat interest: signals on " + days + " separate days",
      points: null,
    });
  return rows;
}

/** A timeline's intent points added up, before the cap. */
export function pointsTotal(timeline: TimelineEntry[]) {
  return timeline.reduce(function (sum, e) {
    return sum + (e.points ?? 0);
  }, 0);
}

/** Where the user's Company stands with an interested one: connected, messaged, or neither. */
function statusOf(coId: string): InterestedCompany["status"] {
  if (S.conn[coId] === "connected") return "Connected";
  const thread = threadFor(coId);
  return thread?.msgs.some(function (m) {
    return m.from === "me";
  })
    ? "Messaged"
    : null;
}

function separateDays(signals: Signal[]) {
  return new Set(
    signals.map(function (s) {
      return s.day;
    }),
  ).size;
}

/** Hot, then Warm, then New, latest first, from the given recent Interest Signals. */
function interestRows(recent: Signal[], lookup: (id: string) => Company): InterestedCompany[] {
  return companiesIn(recent)
    .map(function (id) {
      const mine = recent.filter(function (s) {
        return s.co === id;
      });
      const latest = mine.reduce(function (best, s) {
        return s.day > best.day ||
          (s.day === best.day && KIND_WEIGHT[s.type] > KIND_WEIGHT[best.type])
          ? s
          : best;
      });
      const level = levelOf(mine);
      return {
        company: lookup(id),
        level: level,
        latest: latest,
        summary: interestSummary(mine),
        timeline: timelineOf(mine),
        status: statusOf(id),
        light:
          level === "New" &&
          mine.every(function (s) {
            return s.type === "search";
          }),
      };
    })
    .sort(function (a, b) {
      return (
        INTEREST_LEVELS.indexOf(a.level) - INTEREST_LEVELS.indexOf(b.level) ||
        b.latest.day - a.latest.day
      );
    });
}

/** Companies in the user's chamber showing interest in the last 14 days. */
export function interestedCompanies(): InterestedCompany[] {
  return interestRows(interestBetween(S.day - LEVEL_DAYS, S.day), co);
}

/** Intent score points per kind, counted once per kind per day. Growth and Pro only. */
const INTENT_POINTS: Partial<Record<SignalKind, number>> = {
  search: 1,
  recommended: 2,
  viewed: 3,
  saved: 5,
  messaged: 10,
};
const INTENT_CAP = 100;

/** The timeline's points added up, capped at 100. The timeline holds the once-a-day rule. */
function scoreOf(signals: Signal[]) {
  return Math.min(INTENT_CAP, pointsTotal(timelineOf(signals)));
}

/** A Company's intent score over the last 14 days. */
export function intentScore(coId: string) {
  return scoreOf(interestBetween(S.day - LEVEL_DAYS, S.day, coId));
}

function isPlanView(view: string): view is PlanView {
  return view in PLAN_VIEWS;
}

/** Interested Companies as a view shows them. Free is every own-chamber Company with nothing
 * hidden; Growth adds intent scores; Pro adds interest from other chambers. */
export function interestForView(view: PlanView): InterestRow[] {
  const rules = PLAN_VIEWS[view];
  const timeline = function (entries: TimelineEntry[]) {
    return rules.intentScore
      ? entries
      : entries.map(function (e) {
          return { ...e, points: null };
        });
  };
  const own: InterestRow[] = interestedCompanies().map(function (x) {
    return {
      ...x,
      timeline: timeline(x.timeline),
      score: rules.intentScore ? intentScore(x.company.id) : null,
      chamber: null,
      actionable: true,
    };
  });
  if (!rules.otherChambers) return own;
  const recent = interestBetween(S.day - LEVEL_DAYS, S.day, undefined, S.otherSignals);
  const others = interestRows(recent, otherCompany).map(function (x) {
    return {
      ...x,
      score: scoreOf(
        recent.filter(function (s) {
          return s.co === x.company.id;
        }),
      ),
      chamber: x.company.chamber ?? null,
      actionable: false,
    };
  });
  return own.concat(others);
}

function otherCompany(id: string): Company {
  const found = OTHER_CHAMBER_COMPANIES.find(function (c) {
    return c.id === id;
  });
  if (!found) throw new Error("Unknown company in another chamber: " + id);
  return found;
}

/** Each morning one Company in another chamber views or searches, on the Pro view only. */
function otherChamberMorning() {
  const c = OTHER_CHAMBER_COMPANIES[S.day % OTHER_CHAMBER_COMPANIES.length];
  if (!c) return;
  S.otherSignals.unshift(
    S.day % 2
      ? { co: c.id, type: "viewed", detail: "", day: S.day }
      : {
          co: c.id,
          type: "search",
          detail: (SEARCH_TERMS[S.day % SEARCH_TERMS.length] ?? "").toLowerCase(),
          day: S.day,
        },
  );
}

/** Whether the 7 days before the last 7 all fall after the claim. */
function hasPreviousPeriod() {
  return S.day - PERIOD_DAYS * 2 + 1 >= S.joined;
}

/** A change of at least this many shows as a percentage; smaller ones as a count. */
const PERCENT_FROM = 5;

function compare(now: number, before: number): Pick<TopNumber, "change" | "trend"> {
  if (!hasPreviousPeriod()) return { change: null, trend: null };
  if (now === before) return { change: "Same as before", trend: "same" };
  const diff = Math.abs(now - before);
  const trend = now > before ? "up" : "down";
  if (before === 0 || diff < PERCENT_FROM)
    return { change: diff + (trend === "up" ? " more" : " fewer") + " than before", trend: trend };
  return { change: Math.round((diff / before) * 100) + "%", trend: trend };
}

/** The six tiles, in the prototype's order. Adding a tile means one entry here. */
const TILES: { key: SignalKind; label: string }[] = [
  { key: "search", label: "Search appearances" },
  { key: "recommended", label: "Recommendations" },
  { key: "messaged", label: "Messages" },
  { key: "intro", label: "Introductions" },
  { key: "viewed", label: "Profile views" },
  { key: "saved", label: "Profile saves" },
];
/** The highlighted tile, in the spot the prototype gives its top shortlist placements. */
const STAR_TILE: SignalKind = "messaged";

/** The six tiles for the last 7 days, each compared with the 7 days before once there are. */
export function topNumbers(): TopNumber[] {
  const count = function (kind: SignalKind, from: number) {
    return S.signals.filter(function (s) {
      return s.type === kind && s.day > from && s.day <= from + PERIOD_DAYS;
    }).length;
  };
  const now = S.day - PERIOD_DAYS,
    before = now - PERIOD_DAYS;
  return TILES.map(function (tile) {
    const value = count(tile.key, now);
    return {
      key: tile.key,
      label: tile.label,
      value: value,
      star: tile.key === STAR_TILE,
      ...compare(value, count(tile.key, before)),
    };
  });
}

/** Search appearances and recommendations for each day since the claim; empty with none. */
export function visibilityByDay(): VisibilityDay[] {
  const seen = interestBetween(S.joined - 1, S.day).filter(function (s) {
    return s.type === "search" || s.type === "recommended";
  });
  if (!seen.length) return [];
  const days: VisibilityDay[] = [];
  for (let day = S.joined; day <= S.day; day++) {
    const on = seen.filter(function (s) {
      return s.day === day;
    });
    days.push({
      day: day,
      searches: on.filter(function (s) {
        return s.type === "search";
      }).length,
      recommendations: on.filter(function (s) {
        return s.type === "recommended";
      }).length,
    });
  }
  return days;
}

/** The chart's note: where it starts, and whether search appearances are rising, meaning the
 * latest day after the first week beats that week's daily average. */
export function visibilityNote() {
  const days = visibilityByDay();
  const firstWeek = days.filter(function (d) {
    return d.day < S.joined + PERIOD_DAYS;
  });
  const average =
    firstWeek.reduce(function (sum, d) {
      return sum + d.searches;
    }, 0) / (firstWeek.length || 1);
  const latest = days[days.length - 1];
  const rising =
    latest !== undefined && latest.day >= S.joined + PERIOD_DAYS && latest.searches > average;
  return (
    "Since you claimed your profile on " +
    dayLabel(S.joined) +
    (rising ? ". Search appearances are rising." : "")
  );
}

/** One tip per step of the funnel after the first, shown for the step that loses the most. */
const FUNNEL_TIPS = [
  "Most companies that find you stop there. A fuller profile gives them a reason to look closer.",
  "Companies view your profile but few save it. Add your top products and a recent project.",
  "Companies save your profile but few message you. Message the Hot companies first.",
  "Companies message you but few connect. Send a Connection Request after a good conversation.",
];

const FUNNEL_STAGES = [
  "Found you in search",
  "Viewed your profile",
  "Saved your profile",
  "Messaged you",
  "Connected",
];
const STAGE_OF: Partial<Record<SignalKind, number>> = { viewed: 1, saved: 2, messaged: 3 };

/** A step as a share of the one before: whole, or one decimal under 10%; null with a 0. */
function percentOf(count: number, before: number | undefined) {
  if (!count || !before) return null;
  const tenths = Math.round((count / before) * 1000) / 10;
  return (tenths < 10 ? tenths.toFixed(1) : String(Math.round(tenths))) + "%";
}

/** How many Companies reached each stage, or a later one, in the last 14 days; null with none.
 * The suggestion is the tip for the step with the biggest drop. */
export function interestFunnel(): Funnel | null {
  const recent = interestBetween(S.day - LEVEL_DAYS, S.day);
  const found = companiesIn(recent);
  if (!found.length) return null;
  const furthest = found.map(function (id) {
    if (S.conn[id] === "connected") return FUNNEL_STAGES.length - 1;
    return recent.reduce(function (best, s) {
      return s.co === id ? Math.max(best, STAGE_OF[s.type] ?? 0) : best;
    }, 0);
  });
  const counts = FUNNEL_STAGES.map(function (_, stage) {
    return furthest.filter(function (f) {
      return f >= stage;
    }).length;
  });
  let drop: { ratio: number; tip: string | null } = { ratio: 1, tip: null };
  counts.forEach(function (count, i) {
    const before = counts[i - 1];
    if (!before || count / before >= drop.ratio) return;
    drop = { ratio: count / before, tip: FUNNEL_TIPS[i - 1] ?? null };
  });
  return {
    steps: FUNNEL_STAGES.map(function (label, i) {
      const count = counts[i] ?? 0;
      return { label: label, count: count, ofPrevious: percentOf(count, counts[i - 1]) };
    }),
    suggestion: drop.tip,
  };
}

/** Saves, messages, intros and Companies becoming Hot in the last 14 days, newest first. */
export function comDashAlerts(): DashAlert[] {
  const from = S.day - LEVEL_DAYS;
  const alerts: DashAlert[] = [];
  S.signals.forEach(function (s) {
    if (s.day <= from) return;
    const n = co(s.co).name;
    if (s.type === "saved") alerts.push({ day: s.day, text: n + " saved your profile." });
    if (s.type === "messaged") alerts.push({ day: s.day, text: n + " messaged you." });
    if (s.type === "intro")
      alerts.push({ day: s.day, text: "Your community manager introduced you to " + n + "." });
  });
  interestedCompanies().forEach(function (x) {
    if (x.level !== "Hot") return;
    let day = S.day;
    while (day > S.joined && interestLevel(x.company.id, day - 1) === "Hot") day--;
    if (day > from) alerts.push({ day: day, text: x.company.name + " is now Hot." });
  });
  const unique = alerts.filter(function (a, i) {
    return (
      alerts.findIndex(function (b) {
        return b.text === a.text;
      }) === i
    );
  });
  return unique
    .sort(function (a, b) {
      return b.day - a.day;
    })
    .slice(0, 6);
}

function countRows(labels: string[]): CountRow[] {
  const counts: Record<string, number> = {};
  labels.forEach(function (l) {
    counts[l] = (counts[l] || 0) + 1;
  });
  return Object.entries(counts)
    .map(function ([label, count]) {
      return { label: label, count: count };
    })
    .sort(function (a, b) {
      return b.count - a.count || a.label.localeCompare(b.label);
    });
}

/** What searchers in the last 30 days were looking for you as. */
export function searcherRoles(): CountRow[] {
  const searches = interestBetween(S.day - INSIGHT_DAYS, S.day).filter(function (s) {
    return s.type === "search";
  });
  return countRows(
    searches.map(function (s) {
      const c = co(s.co);
      if (
        c.wants.some(function (w) {
          return S.me.gives.includes(w);
        })
      )
        return "Supplier";
      if (
        c.gives.some(function (g) {
          return S.me.wants.includes(g);
        })
      )
        return "Customer";
      return "Partner";
    }),
  );
}

/** Industries with 3 or more interested Companies in the last 30 days. */
export function industryGroups(): CountRow[] {
  const ids = companiesIn(interestBetween(S.day - INSIGHT_DAYS, S.day));
  return countRows(
    ids.map(function (id) {
      return INDUSTRY[co(id).cat] ?? cap(co(id).cat);
    }),
  ).filter(function (row) {
    return row.count >= 3;
  });
}

function profileLists(term: string) {
  const m = S.me;
  const text = [m.offer.join(" "), m.products, m.about, m.projects.join(" ")]
    .join(" ")
    .toLowerCase()
    .replace(/-/g, " ");
  return text.includes(term.toLowerCase());
}

/** Search terms from the last 30 days, flagging those the profile doesn't list. */
export function searchTerms(): SearchTerm[] {
  const searches = interestBetween(S.day - INSIGHT_DAYS, S.day).filter(function (s) {
    return s.type === "search" && s.detail;
  });
  return countRows(
    searches.map(function (s) {
      return s.detail;
    }),
  ).map(function (row) {
    return {
      term: row.label,
      count: row.count,
      gap: !profileLists(row.label) && !S.dismissedTerms.includes(row.label),
      added: S.addedTerms.includes(row.label) && profileLists(row.label),
    };
  });
}

export function profileGaps() {
  return searchTerms().filter(function (t) {
    return t.gap;
  });
}

export function clearProfileFocus() {
  if (S.profileFocus) {
    S.profileFocus = null;
    emit();
  }
}

export function profileCompleteness() {
  const m = S.me,
    missing: string[] = [];
  if (!m.products) missing.push("your top 3 products");
  if (!m.projects.length) missing.push("a recent project");
  if (!m.photo) missing.push("a photo of your work");
  return { percent: strength(), missing: missing };
}

export function interestTotals() {
  const all = interestedCompanies();
  return {
    interested: all.length,
    hot: all.filter(function (x) {
      return x.level === "Hot";
    }).length,
  };
}

export function connectionSummary() {
  return {
    connections: connected().length,
    incoming: S.incoming.length,
    outgoing: Object.keys(S.conn).filter(function (k) {
      return S.conn[k] === "pending";
    }).length,
  };
}

const FRESH_DAYS = 14;

/** The single most useful thing to do, in the fixed 8-step order, with why it was chosen. */
export function nextAction(): NextAction {
  const drafts = Object.entries(S.drafts)
    .filter(function ([, d]) {
      return d.ai && d.text.trim();
    })
    .map(function ([id]) {
      return id;
    });
  if (drafts.length)
    return {
      kind: "drafts",
      threads: drafts,
      rank: 1,
      reason: "Shown because drafts are waiting for your approval, and they always come first.",
    };
  const list = S.lists[S.day] || [];
  const left = list.filter(function (id) {
    return !S.leadAct[id] && !S.conn[id];
  }).length;
  if (left)
    return {
      kind: "leads",
      left: left,
      total: list.length,
      rank: 2,
      reason: "Shown because no drafts are waiting and today’s leads aren’t finished.",
    };
  const asks = S.asks.filter(function (a) {
    return S.conn[a.co] === "connected" && !a.answered && offersMe(a);
  });
  if (asks.length)
    return {
      kind: "ask",
      asks: asks,
      rank: 3,
      reason: "Shown because today’s leads are done and a connection is asking for what you sell.",
    };
  const hot = interestedCompanies().find(function (x) {
    return (
      x.level === "Hot" &&
      !(threadFor(x.company.id)?.msgs ?? []).some(function (m) {
        return m.from === "me";
      })
    );
  });
  if (hot)
    return {
      kind: "hot",
      lead: hot,
      rank: 4,
      reason: "Shown because nothing above needs you and a Hot company hasn’t heard from you.",
    };
  if (S.incoming.length)
    return {
      kind: "requests",
      companies: S.incoming.map(function (r) {
        return r.co;
      }),
      rank: 5,
      reason: "Shown because no Hot company is waiting, and companies are waiting on your reply.",
    };
  const gap = profileGaps()[0];
  if (gap)
    return {
      kind: "gap",
      gap: gap,
      rank: 6,
      reason:
        "Shown because nothing above needs you, and companies searched for something your profile doesn’t list.",
    };
  const days = S.day - S.me.lastUpdate;
  if (days >= FRESH_DAYS)
    return {
      kind: "fresh",
      days: days,
      rank: 7,
      reason: "Shown because nothing above needs you and your profile hasn’t changed in 14 days.",
    };
  return {
    kind: "clear",
    rank: 8,
    reason:
      "Shown because nothing needs you right now. Drafts, today’s leads, asks from your connections, Hot companies, connection requests, profile gaps and a profile check come first.",
  };
}

/* ---------- Connections tab ---------- */
const SUGGESTIONS_SHOWN = 4;

/** Connections first, then requests the Company sent, each in the order they were made. */
export function connectionList(): ConnectionRow[] {
  const rows = Object.keys(S.conn).flatMap(function (id): ConnectionRow[] {
    const status = S.conn[id];
    return status ? [{ company: co(id), status: status }] : [];
  });
  return rows
    .filter(function (r) {
      return r.status === "connected";
    })
    .concat(
      rows.filter(function (r) {
        return r.status === "pending";
      }),
    );
}

/** Connection Requests waiting for the Company's answer, newest first. */
export function invitations() {
  return S.incoming.map(function (r) {
    return { company: co(r.co), day: r.day };
  });
}

/** Companies that could still become Connections: not connected and not asking already. */
function openCompanies() {
  return POOL.filter(function (c) {
    return (
      S.conn[c.id] !== "connected" &&
      hasClaimed(c.id) &&
      !S.incoming.some(function (r) {
        return r.co === c.id;
      })
    );
  });
}

/** Where the Company stands with another: connected, request sent, or neither. */
export function connectionStatus(id: string) {
  return S.conn[id] ?? null;
}

function suggestion(c: Company, why: string): Suggestion {
  return { company: c, why: why };
}

/** Chamber members who share Connections with the Company, most shared first. */
export function chamberSuggestions(): Suggestion[] {
  return byFit(
    openCompanies().filter(function (c) {
      return mutuals(c).length > 0;
    }),
  )
    .sort(function (a, b) {
      return mutuals(b).length - mutuals(a).length;
    })
    .slice(0, SUGGESTIONS_SHOWN)
    .map(function (c) {
      return suggestion(c, mutualText(c));
    });
}

/** Companies that seek what the profile offers, by Fit Score, not already suggested above. */
export function buyerSuggestions(): Suggestion[] {
  const shown = chamberSuggestions().map(function (s) {
    return s.company.id;
  });
  return byFit(
    openCompanies().filter(function (c) {
      return (
        !shown.includes(c.id) &&
        !c.rival &&
        c.wants.some(function (w) {
          return S.me.gives.includes(w);
        })
      );
    }),
  )
    .slice(0, SUGGESTIONS_SHOWN)
    .map(function (c) {
      return suggestion(c, cap(c.why));
    });
}

function poolIdByName(name: string) {
  return POOL.find(function (c) {
    return c.name === name;
  })?.id;
}

interface ItemKind {
  /** The items of this kind from the given Connections, before answered is known. */
  collect: (mine: string[]) => Omit<ConnectionItem, "answered">[];
  /** The AI Assistant's draft reply. The person edits it and taps Send. */
  draft: (item: ConnectionItem) => string;
}

function offerText() {
  return S.me.offer.join(", ").toLowerCase();
}

/** Every kind of item in "From your connections". Adding a kind means one entry here. */
const ITEM_KINDS: Record<ConnectionItemKind, ItemKind> = {
  ask: {
    collect: function (mine) {
      return S.asks
        .filter(function (a) {
          return mine.includes(a.co);
        })
        .map(function (a) {
          return {
            id: "ask:" + a.id,
            kind: "ask",
            label: "Ask",
            company: co(a.co),
            day: a.day ?? null,
            title: "Posted an ask",
            text: a.text,
            askId: a.id,
          };
        });
    },
    draft: function (item) {
      return (
        "Hello " +
        item.company.name +
        " team,\n\nWe saw your ask: “" +
        item.text +
        "” " +
        S.me.name +
        " offers " +
        offerText() +
        ", and we would be glad to help.\n\nCould we send you our product list?"
      );
    },
  },
  win: {
    collect: function (mine) {
      return S.wall.flatMap(function (w) {
        if (w.a === S.me.name || w.b === S.me.name) return [];
        const ids = [w.a, w.b].map(poolIdByName);
        const at = ids.findIndex(function (id) {
          return id !== undefined && mine.includes(id);
        });
        const partner = ids[at];
        if (!partner) return [];
        return [
          {
            id: "win:" + w.a + "|" + w.b,
            kind: "win" as const,
            label: "Success Wall",
            company: co(partner),
            day: null,
            title: "Shared a win with " + (at === 0 ? w.b : w.a),
            text: w.got,
            askId: null,
          },
        ];
      });
    },
    draft: function (item) {
      return (
        "Congratulations to the " +
        item.company.name +
        " team. It is good to see your win on the Success Wall.\n\nIf you ever need " +
        offerText() +
        ", " +
        S.me.name +
        " would be glad to help."
      );
    },
  },
  update: {
    collect: function (mine) {
      return S.updates
        .filter(function (u) {
          return mine.includes(u.co);
        })
        .map(function (u) {
          return {
            id: "update:" + u.co + ":" + u.day,
            kind: "update",
            label: "Profile update",
            company: co(u.co),
            day: u.day,
            title: "Updated its profile",
            text: u.text,
            askId: null,
          };
        });
    },
    draft: function (item) {
      return (
        "Hello " +
        item.company.name +
        " team,\n\nWe saw your update: " +
        item.text +
        " Congratulations. " +
        S.me.name +
        " would be glad to hear how we could work together."
      );
    },
  },
};

/** Asks, Success Wall wins and profile updates by the Company's Connections, newest first.
 * Not a news feed. */
export function connectionItems(): ConnectionItem[] {
  const mine = connected();
  return Object.values(ITEM_KINDS)
    .flatMap(function (kind) {
      return kind.collect(mine);
    })
    .map(function (item) {
      const answered =
        S.replied.includes(item.id) ||
        S.asks.some(function (a) {
          return a.id === item.askId && a.answered;
        });
      return { ...item, answered: answered };
    })
    .sort(function (a, b) {
      return (b.day ?? 0) - (a.day ?? 0);
    });
}

/** Why a reply box starts empty: the AI Assistant is off, or today's AI drafts are used. */
export function emptyReplyNote() {
  return S.ai
    ? "Today’s AI drafts are used up. Write your reply."
    : "The AI Assistant is off. Write your reply.";
}

/** A Company's industry and city, marked "other chamber" with its name when not the user's. */
export function companyLine(c: Pick<Company, "ind" | "city">, chamber?: string | null) {
  return c.ind + " · " + c.city + (chamber ? " · other chamber (" + chamber + ")" : "");
}

/** Each morning one Connection with news posts its profile update. */
function connectionUpdateMorning() {
  const id = connected().find(function (c) {
    return (
      PROFILE_UPDATES[c] &&
      !S.updates.some(function (u) {
        return u.co === c;
      })
    );
  });
  const text = id ? PROFILE_UPDATES[id] : undefined;
  if (id && text) S.updates.unshift({ co: id, day: S.day, text: text });
}

S = fresh();
