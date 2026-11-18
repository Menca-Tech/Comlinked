import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  act,
  AGENT_TYPES,
  agentRunFor,
  CAT,
  CHAMBER,
  CHAMBER_DEALS,
  chamberClaimed,
  chamberCounts,
  formatCount,
  importProgress,
  UNNAMED_MEMBERS,
  dealsConfirmed,
  EUROPEAN_EDGES,
  EUROPEAN_MEMBERS,
  INDUSTRY,
  NEIGHBORS,
  EXAMPLE_COMPANIES,
  PLAN_VIEWS,
  agentSteps,
  claimDayOf,
  claimMessage,
  hasClaimed,
  buyerSuggestions,
  chamberSuggestions,
  connectionItems,
  connectionList,
  connectionStatus,
  currentSeat,
  currentStop,
  INTEREST_LEVELS,
  companyLine,
  dayLabel,
  pointsTotal,
  presenterContact,
  intentScore,
  interestForView,
  planLine,
  planShown,
  planUpsell,
  termsForPlan,
  weeklyAlerts,
  invitations,
  setHandlers,
  setReplyDraft,
  shownRoute,
  comDashAlerts,
  connectionSummary,
  industryGroups,
  interestFunnel,
  interestLevel,
  interestedCompanies,
  jobFor,
  matchReason,
  profileCompleteness,
  profileGaps,
  searchTerms,
  searcherRoles,
  topNumbers,
  visibilityByDay,
  visibilityNote,
  allowed,
  award,
  byFit,
  co,
  degreeLabel,
  digestLine,
  enterRoute,
  exploring,
  firstMatches,
  fit,
  fitReasons,
  getState,
  groupText,
  markDashSeen,
  markDigestRead,
  markNotesRead,
  activityView,
  GROUP_PREVIEW,
  introChoices,
  managerSpike,
  MEMBER_STATUSES,
  memberGroups,
  memberStatus,
  monthlyTop,
  onSideStep,
  mutualText,
  nextAction,
  networkLayout,
  networkRing,
  noteGroups,
  openDefaultThread,
  pointsOf,
  POOL,
  prepareThread,
  publicView,
  strength,
  rank,
  RULES,
  score,
  searchDegree,
  searchRows,
  successWall,
  selectedLead,
  setDraft,
  setForm,
  teamData,
  TEAM_SPIKES,
  TOTAL,
  trendPoints,
  unreadCount,
  waitingForClaim,
  importResult,
  laterItemShown,
  memberList,
  nextStop,
  openStop,
  PREVIEW_CLOSING,
  PREVIEW_OPENING,
  PREVIEW_STOPS,
  previewStop,
  previousStop,
  rememberStop,
  SEAT_LINES,
  stopAfterReload,
  stopForAddress,
  stopLine,
} from "@/services/comlinked";
import type { ConnectionItem } from "@/services/comlinked";
import {
  approver,
  backupAdmin,
  contactRequestsToMe,
  meetingAttendees,
  KALAYAAN_LOGO,
  KALAYAAN_PEOPLE,
  PEOPLE,
  peopleRows,
  peopleSeenBy,
  previewOfMe,
  primaryAdmin,
  roleLabel,
  signature,
  signedIn,
} from "@/services/comlinked";

function newCompany() {
  act.demoNew();
  act.claimNext();
  act.claimConfirm("yes");
  act.claimFinish();
}

beforeEach(() => {
  vi.useFakeTimers();
  act.demoNew();
});

describe("claiming", () => {
  it("requires the authorization confirmation", () => {
    act.claimNext();
    act.claimConfirm("");
    expect(getState().claimStep).toBe(1);
    act.claimConfirm("yes");
    expect(getState().claimStep).toBe(2);
  });

  it("offers the three best matches before claiming and lists them after", () => {
    expect(firstMatches().map((c) => c.id)).toEqual(["maple", "nordhavn", "pack"]);
    newCompany();
    const ids = getState().lists[1]!.slice(0, 3);
    expect(ids).toEqual(["maple", "nordhavn", "pack"]);
    expect(ids.map((id) => fit(co(id)).score)).toEqual([92, 92, 87]);
  });
});

describe("connections", () => {
  beforeEach(newCompany);

  it("accepts a strong fit within seconds and lifts mutual companies by 5", () => {
    const before = fit(co("pack")).score;
    expect(degreeLabel(co("pack"))).toBe("");
    act.connect("maple");
    expect(getState().conn.maple).toBe("pending");
    vi.advanceTimersByTime(1500);
    expect(getState().conn.maple).toBe("connected");
    expect(fit(co("pack")).score).toBe(before + 5);
    expect(degreeLabel(co("pack"))).toBe("2nd");
    expect(mutualText(co("pack"))).toContain("Maple Bay Grocers");
  });

  it("accepts a moderate fit the next morning", () => {
    act.connect("maple");
    vi.advanceTimersByTime(1500);
    const score = fit(co("tala")).score;
    expect(score).toBeGreaterThanOrEqual(50);
    expect(score).toBeLessThan(80);
    act.connect("tala");
    vi.advanceTimersByTime(2000);
    expect(getState().conn.tala).toBe("pending");
    act.morning("1");
    expect(getState().conn.tala).toBe("connected");
  });

  it("leaves a weak fit pending until withdrawn", () => {
    // Hapag Kitchen Group has claimed. Agos Water Services, used here before, has not, so it
    // cannot be sent a request at all.
    expect(hasClaimed("hapag")).toBe(true);
    expect(fit(co("hapag")).score).toBeLessThan(50);
    act.connect("hapag");
    vi.advanceTimersByTime(5000);
    act.morning("1");
    expect(getState().conn.hapag).toBe("pending");
    act.withdraw("hapag");
    expect(getState().conn.hapag).toBeUndefined();
  });

  it("puts today's Leads on the ring and pulls a new Connection inward", () => {
    const tierOf = (id: string) => networkRing().nodes.find((n) => n.company.id === id)?.tier;
    expect(networkRing().nodes.every((n) => n.tier === 3)).toBe(true);
    act.connect("maple");
    expect(networkRing().nodes.find((n) => n.company.id === "maple")?.status).toBe("pending");
    vi.advanceTimersByTime(1500);
    expect(tierOf("maple")).toBe(1);
    expect(tierOf("pack")).toBe(2);
    act.skip("palengke");
    expect(tierOf("palengke")).toBeUndefined();
  });

  it("shows at most 6 Connections and counts the rest", () => {
    ["maple", "pack", "north", "luntian", "tala", "bayan", "sari", "hapag"].forEach((id) => {
      getState().conn[id] = "connected";
    });
    const ring = networkRing();
    expect(ring.nodes.filter((n) => n.tier === 1)).toHaveLength(6);
    expect(ring.more).toBe(2);
  });

  it("selects the next open lead after one is finished", () => {
    const ids = getState().lists[1]!;
    expect(selectedLead(ids)).toBe(ids[0]);
    act.skip(ids[0]!);
    expect(selectedLead(ids)).toBe(ids[1]);
    act.pickLead(ids[3]!);
    expect(selectedLead(ids)).toBe(ids[3]);
  });
});

describe("the two-weeks-in preset", () => {
  beforeEach(() => act.demoActive());

  it("sits at #1 of 12 with an Activity Score of 123", () => {
    // The 59 points it had before, plus 64 for connecting, replying, meeting, the deal and the
    // Testimonial with Nordhavn.
    expect(rank()).toBe(1);
    expect(TOTAL).toBe(12);
    expect(score()).toBe(123);
  });

  it("points at today's leads", () => {
    const next = nextAction();
    expect(next.kind).toBe("leads");
    expect(next.rank).toBe(2);
  });

  it("produces identical results on repeated runs", () => {
    act.morning("1");
    const first = digestLine();
    act.demoActive();
    act.morning("1");
    expect(digestLine()).toBe(first);
  });
});

describe("Kalayaan Foods' people", () => {
  it("has four people with job titles and roles: two admins and two Authorized Users", () => {
    expect(getState().me.people.map((p) => [p.name, p.title, p.role])).toEqual([
      ["Ana Reyes", "Owner", "primary"],
      ["Marco Dizon", "Operations manager", "backup"],
      ["Liza Manalo", "Sales lead", "sales"],
      ["Paolo Villanueva", "Purchasing officer", "procurement"],
    ]);
    expect(primaryAdmin().name).toBe("Ana Reyes");
    expect(backupAdmin()?.name).toBe("Marco Dizon");
    expect(signedIn().name).toBe("Ana Reyes");
  });

  it("gives each person an invented email on Kalayaan's domain and a visibly fake phone", () => {
    getState().me.people.forEach((p) => {
      expect(p.email).toMatch(/^[a-z]+@kalayaanfoods\.example$/);
      expect(p.phone).toMatch(/^\+63 2 0000 \d{4}$/);
    });
  });

  it("signs ComMail, approves the agent and attends its meeting as the admins", () => {
    expect(signature()).toBe("Ana Reyes for your company");
    expect(approver()).toBe("Ana Reyes, Owner");
    expect(meetingAttendees()).toBe("Ana Reyes and Marco Dizon");
  });

  it("introduces Kalayaan in an AI draft as Ana", () => {
    newCompany();
    act.message("maple");
    prepareThread("t-maple");
    expect(getState().drafts["t-maple"]?.text).toContain("I am Ana Reyes from Kalayaan Foods Inc.");
  });

  it("records who switched the AI Assistant", () => {
    act.toggleAi();
    expect(getState().aiLog[0]?.note).toBe("Switched off by Ana Reyes");
  });
});

describe("roles and what each can do", () => {
  const row = (id: string) => peopleRows().find((r) => r.person.id === id);
  const rights = () =>
    peopleRows().map((r) => [r.person.id, r.canMakePrimary, r.canRemove] as const);

  it("labels each role and says in one plain line what it can do", () => {
    expect(peopleRows().map((r) => [r.person.name, r.role, r.line])).toEqual([
      [
        "Ana Reyes",
        "Primary admin",
        "Sends and accepts connection requests, and manages people. The only one who can remove the backup admin.",
      ],
      [
        "Marco Dizon",
        "Backup admin",
        "Sends and accepts connection requests, and manages people. Covers for the primary admin.",
      ],
      [
        "Liza Manalo",
        "Authorized user · Sales",
        "Sends connection requests to possible customers. An admin accepts requests.",
      ],
      [
        "Paolo Villanueva",
        "Authorized user · Procurement",
        "Sends connection requests to possible suppliers. An admin accepts requests.",
      ],
    ]);
    expect(row("ana")?.you).toBe(true);
    expect(row("marco")?.you).toBe(false);
  });

  it("lets the primary admin make the backup primary and remove anyone but themselves", () => {
    expect(rights()).toEqual([
      ["ana", false, false],
      ["marco", true, true],
      ["liza", false, true],
      ["paolo", false, true],
    ]);
  });

  it("swaps the two admins when the backup is made primary, and Ana's role follows", () => {
    act.makePrimary("marco");
    expect(primaryAdmin().name).toBe("Marco Dizon");
    expect(backupAdmin()?.name).toBe("Ana Reyes");
    expect(roleLabel(signedIn().role)).toBe("Backup admin");
    expect(row("ana")?.role).toBe("Backup admin");
  });

  it("makes only the backup primary", () => {
    act.makePrimary("liza");
    expect(primaryAdmin().name).toBe("Ana Reyes");
    expect(row("liza")?.role).toBe("Authorized user · Sales");
  });

  it("lets only the primary admin remove the backup admin or hand over the primary role", () => {
    act.makePrimary("marco");
    // Ana is now the backup: she can still remove an Authorized User, but she can neither remove
    // Marco, the primary, nor make herself primary again and then remove him.
    expect(rights()).toEqual([
      ["ana", false, false],
      ["marco", false, false],
      ["liza", false, true],
      ["paolo", false, true],
    ]);
    act.removePerson("marco");
    act.makePrimary("ana");
    expect(primaryAdmin().name).toBe("Marco Dizon");
  });

  it("lets no one remove themselves", () => {
    act.removePerson("ana");
    expect(signedIn().name).toBe("Ana Reyes");
    expect(getState().me.people).toHaveLength(4);
  });

  it("removes a person and keeps every Connection with the company", () => {
    act.demoActive();
    const toast = vi.fn();
    setHandlers({ toast });
    const before = connectionList();
    act.removePerson("liza");
    expect(peopleRows().map((r) => r.person.name)).toEqual([
      "Ana Reyes",
      "Marco Dizon",
      "Paolo Villanueva",
    ]);
    expect(connectionList()).toEqual(before);
    expect(toast).toHaveBeenCalledWith(
      "Liza Manalo no longer has access. All 4 connections stayed with your company.",
      undefined,
      undefined,
    );
  });

  it("leaves the agent's meeting to the primary admin once the backup is removed", () => {
    act.removePerson("marco");
    expect(backupAdmin()).toBeNull();
    expect(meetingAttendees()).toBe("Ana Reyes");
  });

  it("starts with the four people again after a fresh start", () => {
    act.makePrimary("marco");
    act.removePerson("liza");
    act.demoNew();
    expect(peopleRows().map((r) => [r.person.id, r.role])).toEqual([
      ["ana", "Primary admin"],
      ["marco", "Backup admin"],
      ["liza", "Authorized user · Sales"],
      ["paolo", "Authorized user · Procurement"],
    ]);
  });
});

describe("point limits", () => {
  it("awards the daily list points only once a day", () => {
    newCompany();
    expect(allowed("list")).toBe(true);
    expect(award("list")).toBe(true);
    expect(allowed("list")).toBe(false);
    expect(award("list")).toBe(false);
  });

  it("counts a deal only after both companies confirm, then asks for a testimonial", () => {
    act.demoActive();
    const before = score();
    act.outcome("t-pack|deal");
    expect(score()).toBe(before);
    vi.advanceTimersByTime(1600);
    expect(score()).toBe(before + 25);
    expect(getState().pendingT).toHaveLength(1);
  });
});

describe("a full demo", () => {
  it("runs the whole loop", () => {
    newCompany();
    const S = () => getState();
    act.skip("palengke");
    act.message("pack");
    const thread = S().threads.find((t) => t.co === "pack")!;
    prepareThread(thread.id);
    expect(S().drafts[thread.id]?.ai).toBe(true);
    act.send(thread.id);
    vi.advanceTimersByTime(2000);
    expect(thread.msgs.at(-1)?.from).toBe("them");
    act.outcome(`${thread.id}|met`);
    vi.advanceTimersByTime(1600);
    act.outcome(`${thread.id}|deal`);
    vi.advanceTimersByTime(1600);
    setForm("need", "pouches");
    setForm("got", "we ordered");
    act.polishT();
    act.postT();
    vi.advanceTimersByTime(2000);
    act.sharePreview("Viber");
    act.share("Viber");
    expect(S().shares.Viber).toBe(true);

    setForm("ask", "Looking for a packaging supplier in QC");
    act.polishForm("ask");
    act.postAsk();
    vi.advanceTimersByTime(4000);
    expect(S().asks[0]!.notified).toBeGreaterThan(0);
    act.respond("a1");
    setDraft(S().openThread!, "Happy to help");
    act.send(S().openThread!);

    act.polishAbout();
    act.saveAbout();
    setForm("products", "Chips");
    act.addProducts();
    setForm("project", "A project");
    act.addProject();
    act.addPhoto();
    act.makePrimary("marco");
    setForm("invite", "Partner Co");
    act.invite("Link");
    vi.advanceTimersByTime(2100);
    expect(S().invites[0]!.joined).toBe(true);
    act.toggleAi();
    act.template(`${thread.id}|Introduction`);
    expect(S().drafts[thread.id]?.ai).toBe(false);
    act.toggleAi();

    setForm("query", "packaging");
    expect(searchRows()?.length).toBeGreaterThan(0);
    setForm("query", "zzzz");
    expect(searchRows()).toEqual([]);
    setForm("query", "");
    expect(searchRows()).toBeNull();

    act.importPick();
    act.importCancel();
    act.importPick();
    act.importBuild();
    vi.advanceTimersByTime(4000);
    expect(S().cm.imported).toBe(true);
    act.viewDraft("pack");
    act.closeDraft();
    act.makeIntro();
    setForm("broadcast", "Meeting on Friday");
    act.broadcast();
    act.spike("flag");
    expect(activityView().rows).toHaveLength(EXAMPLE_COMPANIES);

    markDashSeen();
    act.morning("1");
    markDigestRead();
    expect(S().flags.digestRead).toBe(true);
    expect(unreadCount()).toBeGreaterThan(0);
    noteGroups().forEach((g) => expect(groupText(g).length).toBeGreaterThan(0));
    markNotesRead();
    expect(unreadCount()).toBe(0);
    expect(interestedCompanies().length).toBeGreaterThan(0);
    expect(monthlyTop().top).toHaveLength(10);
    expect(networkLayout().nodes).toHaveLength(POOL.length);
    S().openThread = null;
    openDefaultThread();
    expect(S().openThread).toBeTruthy();
  });

  it("runs the agent through both gates and books a meeting", () => {
    act.demoActive();
    act.agentStart();
    const A = () => getState().agent!;
    act.agentPlay();
    act.agentDecide("a|approve");
    act.agentPlay();
    act.agentDecide("b|approve");
    act.agentPlay();
    expect(A().booked).toBe(true);
    expect(agentSteps(A()).some((s) => s.who === "booked")).toBe(true);
    act.agentTab("agenda");
    act.agentRestart();
    expect(getState().agent).toBeNull();
    act.agentType("vendor");
    act.agentStart();
    act.agentPlay();
    act.agentDecide("a|decline");
    act.agentPlay();
    expect(agentSteps(A()).some((s) => s.ty === "DISCLOSURE_DECLINE")).toBe(true);
    setForm("agentNeed", "Looking for a unicorn trainer");
    act.agentRestart();
    setForm("agentNeed", "Looking for a unicorn trainer");
    act.agentStart();
    expect(A().chosen).toBeNull();
  });

  it("keeps the team dashboard in step with staff actions", () => {
    act.demoActive();
    const before = teamData();
    expect(before.rows).toHaveLength(10);
    expect(trendPoints(before).length).toBe(before.D);
    act.teamRemind("tibay");
    act.teamSpike("tala|flag");
    act.teamIntro("me");
    const queueItem = teamData().queue.find((q) => q.act === "intro");
    if (queueItem) act.teamIntro(queueItem.id);
    act.morning("14");
    expect(teamData().D).toBeGreaterThan(before.D);
    expect(getState().team.log.length).toBeGreaterThan(0);
  });

  it("applies the route rules", () => {
    expect(enterRoute("whats-next")).toBe("whats-next");
    expect(getState().claimed).toBe(false);
    expect(enterRoute("dash")).toBe("dash");
    expect(getState().claimed).toBe(true);
    expect(enterRoute("claim")).toBe("dash");
  });

  it("ranks companies by Fit Score", () => {
    newCompany();
    const scores = byFit(POOL).map((c) => fit(c).score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
});

type Kind = "search" | "viewed" | "saved" | "messaged" | "recommended" | "intro";

/** A claimed company on day 20 whose only signals are the ones given. */
function withSignals(list: [string, Kind, number, string?][]) {
  newCompany();
  const S = getState();
  S.day = 20;
  S.signals = list.map(([co, type, day, detail]) => ({ co, type, day, detail: detail ?? "" }));
}

describe("Interest Level", () => {
  it("is New after one signal", () => {
    withSignals([["sari", "viewed", 20]]);
    expect(interestLevel("sari")).toBe("New");
  });

  it("is Warm after interest on two separate days", () => {
    withSignals([
      ["sari", "viewed", 18],
      ["sari", "search", 20, "snacks"],
    ]);
    expect(interestLevel("sari")).toBe("Warm");
  });

  it("is Hot after interest on three separate days", () => {
    withSignals([
      ["sari", "viewed", 15],
      ["sari", "search", 18, "snacks"],
      ["sari", "viewed", 20],
    ]);
    expect(interestLevel("sari")).toBe("Hot");
  });

  it("counts repeats on the same day once", () => {
    withSignals(
      Array.from({ length: 10 }, (): [string, Kind, number, string] => [
        "sari",
        "search",
        20,
        "snacks",
      ]),
    );
    expect(interestLevel("sari")).toBe("New");
  });

  it("is Warm after a save", () => {
    withSignals([["sari", "saved", 20]]);
    expect(interestLevel("sari")).toBe("Warm");
  });

  it("is Hot after a message", () => {
    withSignals([["sari", "messaged", 20]]);
    expect(interestLevel("sari")).toBe("Hot");
  });

  it("ignores signals older than 14 days", () => {
    withSignals([
      ["sari", "viewed", 5],
      ["sari", "viewed", 6],
      ["sari", "messaged", 6],
      ["hapag", "viewed", 5],
      ["hapag", "viewed", 6],
      ["hapag", "viewed", 20],
    ]);
    expect(interestLevel("sari")).toBeNull();
    expect(interestLevel("hapag")).toBe("New");
  });

  it("does not treat a community manager intro as interest", () => {
    withSignals([["sari", "intro", 20]]);
    expect(interestLevel("sari")).toBeNull();
    expect(interestedCompanies()).toEqual([]);
  });

  it("lists Hot, then Warm, then New, with a one-line summary", () => {
    withSignals([
      ["sari", "viewed", 20],
      ["hapag", "viewed", 15],
      ["hapag", "viewed", 16],
      ["hapag", "viewed", 17],
      ["hapag", "viewed", 18],
      ["hapag", "saved", 18],
      ["maple", "saved", 19],
    ]);
    const rows = interestedCompanies();
    expect(rows.map((r) => [r.company.id, r.level])).toEqual([
      ["hapag", "Hot"],
      ["maple", "Warm"],
      ["sari", "New"],
    ]);
    expect(rows[0]!.summary).toBe("Viewed your profile 4 times and saved it");
    expect(rows[0]!.latest.type).toBe("saved");
  });
});

describe("Overview figures", () => {
  it("hides comparisons until there is a previous period", () => {
    newCompany();
    expect(topNumbers().map((n) => n.label)).toEqual([
      "Search appearances",
      "Recommendations",
      "Messages",
      "Introductions",
      "Profile views",
      "Profile saves",
    ]);
    expect(topNumbers().every((n) => n.change === null)).toBe(true);
    act.morning("1");
    expect(topNumbers().every((n) => n.change === null)).toBe(true);
  });

  it("highlights Messages and only Messages", () => {
    act.demoActive();
    expect(
      topNumbers()
        .filter((n) => n.star)
        .map((n) => n.label),
    ).toEqual(["Messages"]);
  });

  it("compares the last 7 days with the 7 before once two weeks have passed", () => {
    act.demoActive();
    expect(topNumbers().map((n) => [n.label, n.value, n.change, n.trend])).toEqual([
      ["Search appearances", 3, "1 more than before", "up"],
      ["Recommendations", 1, "Same as before", "same"],
      ["Messages", 3, "1 more than before", "up"],
      ["Introductions", 1, "1 more than before", "up"],
      ["Profile views", 4, "4 more than before", "up"],
      ["Profile saves", 2, "2 more than before", "up"],
    ]);
  });

  it("shows a percentage once a change is 5 or more", () => {
    withSignals([
      ...Array.from({ length: 10 }, (_, i): [string, Kind, number] => [
        "sari",
        "viewed",
        7 + (i % 2),
      ]),
      ...Array.from({ length: 4 }, (): [string, Kind, number] => ["sari", "viewed", 15]),
    ]);
    expect(topNumbers().find((n) => n.key === "viewed")).toMatchObject({
      value: 4,
      change: "60%",
      trend: "down",
    });
  });

  it("counts companies that reached each funnel step in the last 14 days", () => {
    act.demoActive();
    const funnel = interestFunnel();
    expect(funnel?.steps.map((s) => [s.label, s.count, s.ofPrevious])).toEqual([
      ["Found you in search", 13, null],
      ["Viewed your profile", 6, "46%"],
      ["Saved your profile", 5, "83%"],
      ["Messaged you", 4, "80%"],
      ["Connected", 3, "75%"],
    ]);
  });

  it("leaves out signals older than 14 days from the funnel", () => {
    withSignals([
      ["sari", "viewed", 6],
      ["maple", "viewed", 7],
      ["hapag", "search", 20, "snacks"],
    ]);
    expect(interestFunnel()?.steps[0]?.count).toBe(2);
  });

  it("shows one decimal under 10% and no percentage for a step of 0", () => {
    withSignals([
      ...POOL.slice(0, 10).map((c): [string, Kind, number, string] => [
        c.id,
        "search",
        20,
        "snacks",
      ]),
      [POOL[10]!.id, "viewed", 20],
    ]);
    const steps = interestFunnel()?.steps ?? [];
    expect(steps.map((s) => s.ofPrevious)).toEqual([null, "9.1%", null, null, null]);
  });

  it("picks the suggestion from the biggest drop", () => {
    const tipFor = (list: [string, Kind, number, string?][]) => {
      withSignals(list);
      return interestFunnel()?.suggestion;
    };
    expect(tipFor([["sari", "search", 20, "snacks"]])).toMatch(/^Most companies that find you/);
    expect(
      tipFor([
        ["sari", "viewed", 20],
        ["kainan", "viewed", 20],
      ]),
    ).toMatch(/^Companies view your profile but few save it/);
    expect(
      tipFor([
        ["sari", "saved", 20],
        ["kainan", "saved", 20],
      ]),
    ).toMatch(/^Companies save your profile but few message you/);
    expect(
      tipFor([
        ["sari", "messaged", 20],
        ["kainan", "messaged", 20],
      ]),
    ).toMatch(/^Companies message you but few connect/);
  });

  it("gives no suggestion when no step loses anyone", () => {
    withSignals([["sari", "messaged", 20]]);
    getState().conn.sari = "connected";
    expect(interestFunnel()?.steps.map((s) => s.count)).toEqual([1, 1, 1, 1, 1]);
    expect(interestFunnel()?.suggestion).toBeNull();
  });

  it("dates the chart from the claim and says when search appearances are rising", () => {
    act.demoActive();
    // Day 14 brought one search, more than the first week's daily average.
    expect(visibilityNote()).toBe(
      "Since you claimed your profile on Day 1. Search appearances are rising.",
    );
    getState().signals = getState().signals.filter((s) => s.day !== 14);
    expect(visibilityNote()).toBe("Since you claimed your profile on Day 1");
    withSignals([
      ["sari", "search", 20, "snacks"],
      ["kainan", "search", 20, "snacks"],
    ]);
    expect(visibilityNote()).toBe(
      "Since you claimed your profile on Day 1. Search appearances are rising.",
    );
  });

  it("mentions only the claim day with one day of history", () => {
    newCompany();
    getState().signals = [{ co: "sari", type: "search", detail: "snacks", day: 1 }];
    expect(visibilityNote()).toBe("Since you claimed your profile on Day 1");
  });

  it("charts search appearances and recommendations from the claim day", () => {
    act.demoActive();
    const days = visibilityByDay();
    expect(days[0]!.day).toBe(1);
    expect(days.at(-1)!.day).toBe(14);
    expect(days.find((d) => d.day === 12)).toMatchObject({ searches: 1, recommendations: 1 });
  });

  it("only shows industries with 3 or more interested companies", () => {
    withSignals([
      ["sari", "viewed", 20],
      ["maple", "viewed", 20],
      ["hapag", "viewed", 20],
      ["kainan", "viewed", 20],
    ]);
    expect(industryGroups()).toEqual([]);
    getState().signals.push({ co: "lakbay", type: "viewed", day: 20, detail: "" });
    expect(industryGroups()).toEqual([{ label: "Food service and hospitality", count: 3 }]);
  });

  it("groups searchers by what they found you as", () => {
    act.demoActive();
    expect(searcherRoles()[0]).toEqual({ label: "Supplier", count: 5 });
  });

  it("raises alerts for saves, messages, becoming Hot and intros", () => {
    act.demoActive();
    const texts = comDashAlerts().map((a) => a.text);
    expect(texts).toContain("Hapag Kitchen Group is now Hot.");
    expect(texts).toContain("Hapag Kitchen Group saved your profile.");
    expect(texts).toContain("Luntian Foods Inc. messaged you.");
    expect(texts).toContain("Your community manager introduced you to Malaya Export Traders.");
  });

  it("dates “is now Hot” by the day a company became Hot, not the window start", () => {
    withSignals([
      ["sari", "messaged", 3],
      ["sari", "viewed", 9],
      ["sari", "viewed", 10],
      ["sari", "viewed", 11],
      ["sari", "viewed", 20],
    ]);
    expect(
      comDashAlerts().find((a) => a.text === "Sari Central Wholesale is now Hot."),
    ).toBeUndefined();
    getState().signals = getState().signals.filter((s) => s.day !== 3);
    expect(comDashAlerts().find((a) => a.text === "Sari Central Wholesale is now Hot.")?.day).toBe(
      11,
    );
  });

  it("summarises Connections and profile completeness", () => {
    act.demoActive();
    expect(connectionSummary()).toEqual({ connections: 4, incoming: 1, outgoing: 1 });
    expect(profileCompleteness()).toEqual({ percent: 90, missing: ["a photo of your work"] });
  });
});

describe("the logo and Profile Strength", () => {
  beforeEach(newCompany);

  it("starts at 55% on the day of the Claim, with no logo and the logo among the missing steps", () => {
    expect(getState().me.logo).toBeUndefined();
    expect(strength()).toBe(55);
    expect(profileCompleteness().missing).toEqual([
      "your top 3 products",
      "a recent project",
      "a photo of your work",
      "your logo",
    ]);
  });

  it("adds 10 for the logo and counts it as a profile update, once", () => {
    getState().day = 3;
    const pts = getState().ledger.length;
    act.addLogo();
    expect(getState().me.logo).toBe(KALAYAAN_LOGO);
    expect(strength()).toBe(65);
    expect(getState().me.lastUpdate).toBe(3);
    expect(getState().ledger.length).toBe(pts + 1);
    expect(profileCompleteness().missing).not.toContain("your logo");
    act.addLogo();
    expect(strength()).toBe(65);
    expect(getState().ledger.length).toBe(pts + 1);
  });

  it("reads 100% once every step is done, and never more", () => {
    setForm("products", "Chips");
    act.addProducts();
    setForm("project", "A project");
    act.addProject();
    act.addPhoto();
    act.addLogo();
    expect(profileCompleteness()).toEqual({ percent: 100, missing: [] });
    setForm("project", "Another project");
    act.addProject();
    expect(strength()).toBe(100);
  });

  it("has the logo in the two-weeks-in preset", () => {
    act.demoActive();
    expect(getState().me.logo).toBe(KALAYAAN_LOGO);
  });

  it("shows another Company's logo only when its data has one", () => {
    expect(publicView(co("nordhavn")).logo).toBeUndefined();
  });
});

describe("search terms and profile gaps", () => {
  it("flags a term the profile doesn't list, and clears it when dismissed", () => {
    act.demoActive();
    expect(searchTerms().find((t) => t.term === "polvoron")).toEqual({
      term: "polvoron",
      count: 1,
      gap: true,
      added: false,
    });
    expect(searchTerms().find((t) => t.term === "snacks")?.gap).toBe(false);
    act.dismissGap("polvoron");
    expect(profileGaps()).toEqual([]);
    expect(searchTerms().find((t) => t.term === "polvoron")?.gap).toBe(false);
  });

  it("clears a gap once the term is saved to the description", () => {
    act.demoActive();
    act.addGap("polvoron");
    expect(getState().profileFocus).toBe("about");
    expect(getState().forms.about).toContain("polvoron");
    expect(profileGaps()).toHaveLength(1);
    act.saveAbout();
    expect(profileGaps()).toEqual([]);
  });

  it("marks a gap term as added once it is saved to the profile, and only then", () => {
    act.demoActive();
    const polvoron = () => searchTerms().find((t) => t.term === "polvoron");
    act.addGap("polvoron");
    expect(polvoron()).toMatchObject({ gap: true, added: false });
    act.saveAbout();
    expect(polvoron()).toMatchObject({ gap: false, added: true });
    expect(searchTerms().find((t) => t.term === "snacks")?.added).toBe(false);
  });

  it("keeps a dismissed term in the list, with no gap line", () => {
    act.demoActive();
    act.dismissGap("polvoron");
    expect(searchTerms().find((t) => t.term === "polvoron")).toMatchObject({
      gap: false,
      added: false,
    });
  });

  it("adds the term to the draft only once", () => {
    act.demoActive();
    act.addGap("polvoron");
    act.addGap("polvoron");
    expect(getState().forms.about.match(/polvoron/g)).toHaveLength(1);
    setForm("about", "");
    act.addGap("polvoron");
    expect(getState().forms.about).toBe("We also offer polvoron.");
  });

  it("uses the products field when the profile has no products yet", () => {
    withSignals([["sari", "search", 20, "dried mango"]]);
    act.addGap("dried mango");
    expect(getState().profileFocus).toBe("products");
    act.addProducts();
    expect(profileGaps()).toEqual([]);
  });
});

describe("Next action", () => {
  beforeEach(newCompany);

  it("follows the 8-step order, each with its reason", () => {
    const S = getState();
    const seen: [string, number][] = [];
    const note = () => {
      const n = nextAction();
      expect(n.reason).toMatch(/^Shown because /);
      seen.push([n.kind, n.rank]);
      return n;
    };

    const luntian = S.threads.find((t) => t.co === "luntian")!;
    prepareThread(luntian.id);
    expect(note().kind).toBe("drafts");
    delete S.drafts[luntian.id];

    expect(note().kind).toBe("leads");
    S.lists[1]!.forEach((id) => act.skip(id));

    S.conn.pack = "connected";
    expect(note().kind).toBe("ask");
    delete S.conn.pack;

    const hot = note();
    expect(hot.kind === "hot" && hot.lead.company.id).toBe("luntian");
    setDraft(luntian.id, "Thank you, we are open to it.");
    act.send(luntian.id);

    S.incoming.push({ co: "lakbay", day: 1 });
    expect(note().kind).toBe("requests");
    act.ignoreReq("lakbay");

    S.signals.unshift({ co: "sari", type: "search", detail: "polvoron", day: 1 });
    expect(note().kind).toBe("gap");
    act.dismissGap("polvoron");

    expect(note().kind).toBe("clear");
    S.day += 14;
    expect(note().kind).toBe("fresh");
    act.addPhoto();
    expect(note().kind).toBe("clear");

    expect(seen.map(([, rank]) => rank)).toEqual([1, 2, 3, 4, 5, 6, 8, 7, 8]);
  });
});

describe("a company that has just claimed with no signals", () => {
  it("gets empty results everywhere", () => {
    newCompany();
    getState().signals = [];
    expect(interestedCompanies()).toEqual([]);
    expect(visibilityByDay()).toEqual([]);
    expect(interestFunnel()).toBeNull();
    expect(comDashAlerts()).toEqual([]);
    expect(searcherRoles()).toEqual([]);
    expect(industryGroups()).toEqual([]);
    expect(searchTerms()).toEqual([]);
    expect(topNumbers().every((n) => n.value === 0 && n.change === null)).toBe(true);
  });
});

describe("the daily simulation", () => {
  it("adds saves from returning viewers and varied search terms", () => {
    newCompany();
    act.morning("14");
    for (let i = 0; i < 6; i++) act.morning("1");
    const S = getState();
    expect(S.signals.some((s) => s.type === "saved")).toBe(true);
    expect(
      new Set(S.signals.filter((s) => s.type === "search").map((s) => s.detail)).size,
    ).toBeGreaterThan(2);
  });
});

describe("Interest Signals timeline", () => {
  it("gives a Company with one signal a one-entry timeline labelled New", () => {
    withSignals([["sari", "viewed", 20]]);
    const [row] = interestedCompanies();
    expect(row?.level).toBe("New");
    expect(row?.timeline).toEqual([{ day: 20, text: "Viewed your profile", points: 3 }]);
  });

  it("shows one row per kind per day with ×N, plus a repeat row once there are 3 days", () => {
    withSignals([
      ["sari", "viewed", 15],
      ["sari", "viewed", 15],
      ["sari", "search", 18, "polvoron"],
      ["sari", "search", 18, "ube spread"],
      ["sari", "saved", 20],
    ]);
    const [row] = interestedCompanies();
    expect(row?.timeline).toEqual([
      { day: 15, text: "Viewed your profile ×2", points: 3 },
      { day: 18, text: "Found you in search ×2: polvoron, ube spread", points: 1 },
      { day: 20, text: "Saved your profile", points: 5 },
      { day: 20, text: "Repeat interest: signals on 3 separate days", points: null },
    ]);
    expect(row?.summary).toBe("Found you in search twice, viewed your profile twice and saved it");
  });

  it("adds no repeat row for interest on 2 days", () => {
    withSignals([
      ["sari", "viewed", 18],
      ["sari", "viewed", 20],
    ]);
    expect(interestedCompanies()[0]?.timeline.map((e) => e.text)).toEqual([
      "Viewed your profile",
      "Viewed your profile",
    ]);
  });
});

describe("intent points on the timeline", () => {
  it("gives a kind its points once a day, even across search terms", () => {
    withSignals([
      ["sari", "search", 20, "polvoron"],
      ["sari", "search", 20, "ube spread"],
    ]);
    expect(interestedCompanies()[0]?.timeline.map((e) => e.points)).toEqual([1]);
  });

  it("hides points on Free and shows entries that add up to the score on Growth and Pro", () => {
    act.demoActive();
    const row = (view: "free" | "growth" | "pro") =>
      interestForView(view).find((r) => r.company.id === "hapag");
    expect(row("free")?.timeline.every((e) => e.points === null)).toBe(true);
    for (const view of ["growth", "pro"] as const) {
      const entries = row(view)?.timeline ?? [];
      expect(pointsTotal(entries)).toBe(row(view)?.score);
      expect(pointsTotal(entries)).toBe(11);
    }
  });

  it("totals points past 100 while the score stops at 100", () => {
    withSignals(
      Array.from({ length: 12 }, (_, i): [string, Kind, number] => ["sari", "messaged", 20 - i]),
    );
    const row = interestForView("growth")[0];
    expect(pointsTotal(row?.timeline ?? [])).toBe(120);
    expect(row?.score).toBe(100);
  });

  it("lists the Interest Levels in filter order", () => {
    expect(INTEREST_LEVELS).toEqual(["Hot", "Warm", "New"]);
  });
});

describe("interested companies table", () => {
  it("shows Connected, then Messaged, then nothing as the row status", () => {
    act.demoActive();
    const status = (id: string) => interestForView("free").find((r) => r.company.id === id)?.status;
    expect(status("pack")).toBe("Connected");
    expect(status("maple")).toBe("Connected");
    expect(status("hapag")).toBeNull();
    act.message("hapag");
    const thread = getState().threads.find((t) => t.co === "hapag")!;
    setDraft(thread.id, "Thanks for saving our profile.");
    act.send(thread.id);
    expect(status("hapag")).toBe("Messaged");
  });

  it("folds New companies with only search appearances into light activity", () => {
    act.demoActive();
    const light = interestForView("free").filter((r) => r.light);
    expect(light.map((r) => r.company.id).sort()).toEqual(
      ["kainan", "malaya", "palengke", "paaralan", "tindahan"].sort(),
    );
    expect(light.every((r) => r.level === "New")).toBe(true);
  });

  it("dates signals by day number", () => {
    expect(dayLabel(12)).toBe("Day 12");
  });

  it("labels other-chamber rows on Pro", () => {
    act.demoActive();
    const other = interestForView("pro").find((r) => r.chamber);
    expect(companyLine(other!.company, other!.chamber)).toMatch(/ · other chamber \(.+\)$/);
  });
});

describe("intent score", () => {
  it("scores search 1, recommended 2, view 3, save 5 and message 10", () => {
    withSignals([
      ["sari", "search", 20, "snacks"],
      ["sari", "recommended", 20],
      ["sari", "viewed", 20],
      ["sari", "saved", 20],
      ["sari", "messaged", 20],
    ]);
    expect(intentScore("sari")).toBe(21);
  });

  it("counts each kind once a day", () => {
    withSignals([
      ["sari", "viewed", 19],
      ["sari", "viewed", 20],
      ["sari", "viewed", 20],
      ["sari", "viewed", 20],
    ]);
    expect(intentScore("sari")).toBe(6);
  });

  it("caps at 100", () => {
    withSignals(
      Array.from({ length: 12 }, (_, i): [string, Kind, number] => ["sari", "messaged", 20 - i]),
    );
    expect(intentScore("sari")).toBe(100);
  });
});

describe("plan views", () => {
  beforeEach(() => {
    act.demoActive();
    act.toggleLaterItem("pricing");
  });
  const ids = (rows: { company: { id: string } }[]) => rows.map((r) => r.company.id);
  const free = () => interestForView("free");

  it("opens on Free member once pricing is on, and shows everything while pricing is off", () => {
    expect(planShown()).toBe("free");
    openStop(4);
    expect(planShown()).toBeNull();
    const all = interestForView(null);
    expect(ids(all)).toEqual(ids(interestedCompanies()));
    expect(
      all.every((r) => !r.hidden && r.score === null && r.chamber === null && r.actionable),
    ).toBe(true);
    act.toggleLaterItem("pricing");
    expect(planShown()).toBe("free");
  });

  it("hides every name on Free member, with no score and no other chambers", () => {
    expect(ids(free())).toEqual(ids(interestedCompanies()));
    expect(free().every((r) => r.hidden && r.score === null && r.chamber === null)).toBe(true);
    expect(free().map((r) => r.level)).toEqual(interestedCompanies().map((r) => r.level));
    expect(PLAN_VIEWS.free).toMatchObject({ label: "Free member", rowsShown: 6, termsShown: 5 });
  });

  it("names the user's own chamber on Growth, highest score first, with other chambers hidden", () => {
    const growth = interestForView("growth");
    const own = growth.filter((r) => r.chamber === null);
    const others = growth.filter((r) => r.chamber !== null);
    expect(ids(own).sort()).toEqual(ids(free()).sort());
    expect(own.every((r) => !r.hidden && typeof r.score === "number")).toBe(true);
    const scores = own.map((r) => r.score ?? 0);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
    expect(own[0]?.company.id).toBe("nordhavn");
    expect(others.length).toBeGreaterThan(0);
    expect(others.every((r) => r.hidden && r.score !== null && !r.actionable)).toBe(true);
  });

  it("names every chamber on Pro, other chambers labelled and highest score first", () => {
    const pro = interestForView("pro");
    expect(pro.every((r) => !r.hidden)).toBe(true);
    const others = pro.filter((r) => r.chamber !== null);
    expect(others.length).toBe(3);
    expect(others.every((r) => r.chamber !== "ECCP" && !r.actionable)).toBe(true);
    const scores = others.map((r) => r.score ?? 0);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
    expect(ids(pro.filter((r) => r.chamber === null))).toEqual(
      ids(interestForView("growth").filter((r) => r.chamber === null)),
    );
  });

  it("writes each tier's plan line, with agent engagements only while the previews show", () => {
    expect(planLine("free")).toBe("Plan: Free member · inbound-only AI agent");
    expect(planLine("growth")).toBe(
      "Plan: Growth · 7 of 10 agent engagements left this month · own chamber",
    );
    expect(planLine("pro")).toBe(
      "Plan: Pro · 31 of 40 agent engagements left this month · all chambers",
    );
    act.toggleLaterItem("previews");
    expect(planLine("free")).toBe("Plan: Free member");
    expect(planLine("growth")).toBe("Plan: Growth · own chamber");
  });

  it("sends the agent only from Growth or Pro, to a named Company, while engagements last", () => {
    const toast = vi.fn();
    setHandlers({ toast });
    act.sendAgent("hapag");
    expect(getState().agentSent).toEqual([]);
    act.setView("growth");
    act.sendAgent("oc-bagwis");
    act.sendAgent("hapag");
    act.sendAgent("hapag");
    expect(getState().agentSent).toEqual(["hapag"]);
    expect(getState().agentLeft.growth).toBe(6);
    expect(toast).toHaveBeenCalledWith(
      "Your agent drafted an intro to Hapag Kitchen Group. It waits for your approval.",
      undefined,
      undefined,
    );
    getState().agentLeft.growth = 0;
    act.sendAgent("luntian");
    expect(getState().agentSent).toEqual(["hapag"]);
    act.setView("pro");
    act.sendAgent("oc-bagwis");
    expect(getState().agentLeft.pro).toBe(30);
    act.toggleLaterItem("previews");
    act.sendAgent("sari");
    expect(getState().agentSent).toEqual(["hapag", "oc-bagwis"]);
  });

  it("offers Growth from Free and Pro from Growth, mentioning the agent only while it shows", () => {
    expect(planUpsell("free")).toEqual({
      text: "13 companies showed interest in Kalayaan Foods Inc. in the last 14 days, and 4 are Hot. Upgrade to Growth to see who they are and why they’re interested, and send your AI agent to start the conversation. Your free inbound agent still replies when they contact you.",
      button: "See who’s interested",
      to: "growth",
    });
    expect(planUpsell("growth")).toEqual({
      text: "3 interested companies are in other chambers. Pro shows every chamber and gives 40 agent engagements a month.",
      button: "Compare Pro",
      to: "pro",
    });
    expect(planUpsell("pro")).toBeNull();
    act.toggleLaterItem("previews");
    expect(planUpsell("free")?.text).toBe(
      "13 companies showed interest in Kalayaan Foods Inc. in the last 14 days, and 4 are Hot. Upgrade to Growth to see who they are and why they’re interested.",
    );
    expect(planUpsell("growth")?.text).toBe(
      "3 interested companies are in other chambers. Pro shows every chamber.",
    );
  });

  it("switches tier from an upgrade button, saying what the new tier shows", () => {
    const toast = vi.fn();
    setHandlers({ toast });
    act.showPlan("growth");
    expect(getState().view).toBe("growth");
    act.showPlan("pro");
    expect(getState().view).toBe("pro");
    expect(toast.mock.calls.map((c) => c[0])).toEqual([
      "Showing the Growth view: names and Intent Scores for your own chamber.",
      "Showing the Pro view: every chamber.",
    ]);
  });

  it("gives Free member weekly alerts without names", () => {
    const weekly = weeklyAlerts();
    expect(weekly.length).toBeGreaterThan(0);
    const names = [...POOL.map((c) => c.name), "Kalayaan"];
    weekly.forEach((a) =>
      names.forEach((n) => expect([n, a.text.includes(n)]).toEqual([n, false])),
    );
    weekly.forEach((a) => expect(["This week", "Last week"]).toContain(a.week));
    expect(weekly.some((a) => /^\d+ compan(y|ies) /.test(a.text))).toBe(true);
  });

  it("shows Free member five search terms, keeping the rest and their profile gaps for Growth", () => {
    const all = searchTerms();
    const shown = termsForPlan("free");
    expect(shown.shown).toEqual(all.slice(0, 5));
    expect(shown.more).toBe(Math.max(0, all.length - 5));
    expect(shown.moreGaps).toBe(all.slice(5).filter((t) => t.gap).length);
    expect(termsForPlan("growth")).toEqual({ shown: all, more: 0, moreGaps: 0 });
    expect(termsForPlan(null)).toEqual({ shown: all, more: 0, moreGaps: 0 });
  });

  it("leaves the MVP's own figures unchanged when another view is selected", () => {
    const before = { rows: interestedCompanies(), numbers: topNumbers(), next: nextAction() };
    act.setView("pro");
    expect(getState().view).toBe("pro");
    expect(interestedCompanies()).toEqual(before.rows);
    expect(topNumbers()).toEqual(before.numbers);
    expect(nextAction()).toEqual(before.next);
    expect(profileGaps().length).toBeGreaterThan(0);
  });

  it("ignores an unknown view and resets to Free member with the simulation", () => {
    act.setView("growth");
    act.setView("enterprise");
    expect(getState().view).toBe("growth");
    act.demoActive();
    expect(getState().view).toBe("free");
    expect(getState().agentLeft).toEqual({ free: 0, growth: 7, pro: 31 });
  });

  it("gives a new Company no interest from other chambers", () => {
    newCompany();
    expect(interestForView("pro").every((r) => r.chamber === null)).toBe(true);
  });
});

describe("Connections tab", () => {
  it("accepting an invitation removes it and adds a Connection", () => {
    act.demoActive();
    expect(invitations().map((i) => i.company.id)).toEqual(["lakbay"]);
    const before = connectionSummary().connections;
    act.acceptReq("lakbay");
    expect(invitations()).toEqual([]);
    expect(connectionSummary().connections).toBe(before + 1);
    expect(connectionList().find((r) => r.company.id === "lakbay")?.status).toBe("connected");
  });

  it("ignoring an invitation removes it and says the sender won't be notified", () => {
    act.demoActive();
    const toast = vi.fn();
    setHandlers({ toast });
    const before = connectionSummary().connections;
    act.ignoreReq("lakbay");
    expect(invitations()).toEqual([]);
    expect(connectionSummary().connections).toBe(before);
    expect(toast).toHaveBeenCalledWith(
      "Request ignored. They won’t be notified.",
      undefined,
      undefined,
    );
  });

  it("lists Connections first, then requests sent", () => {
    act.demoActive();
    const rows = connectionList();
    expect(rows.map((r) => [r.company.id, r.status])).toEqual([
      ["nordhavn", "connected"],
      ["maple", "connected"],
      ["pack", "connected"],
      ["tala", "connected"],
      ["buhay", "pending"],
    ]);
  });

  it("suggests chamber members with shared Connections and buyers of what the profile sells", () => {
    act.demoActive();
    const chamber = chamberSuggestions();
    expect(chamber.length).toBeGreaterThan(0);
    expect(chamber.every((s) => getState().conn[s.company.id] !== "connected")).toBe(true);
    expect(chamber.every((s) => /mutual/i.test(s.why))).toBe(true);
    const buyers = buyerSuggestions();
    expect(buyers.length).toBeGreaterThan(0);
    expect(buyers.every((s) => s.company.wants.some((w) => getState().me.gives.includes(w)))).toBe(
      true,
    );
    const ids = chamber.map((s) => s.company.id);
    expect(buyers.some((s) => ids.includes(s.company.id))).toBe(false);
  });

  it("marks a suggestion pending after Connect", () => {
    act.demoActive();
    const first = buyerSuggestions()[0]?.company.id ?? "";
    act.connect(first);
    expect(connectionStatus(first)).toBe("pending");
    expect(buyerSuggestions().some((s) => s.company.id === first)).toBe(true);
  });

  it("starts with no Connections, invitations or items", () => {
    newCompany();
    expect(connectionList()).toEqual([]);
    expect(invitations()).toEqual([]);
    expect(connectionItems()).toEqual([]);
  });
});

function itemOf(kind: ConnectionItem["kind"]) {
  const item = connectionItems().find((i) => i.kind === kind);
  if (!item) throw new Error(`No ${kind} item`);
  return item;
}

describe("From your connections", () => {
  beforeEach(() => act.demoActive());

  it("holds only Asks, Success Wall wins and profile updates by Connections", () => {
    const kinds = () => [...new Set(connectionItems().map((i) => i.kind))].sort();
    // No Connection has a win on the wall yet: Maple Bay Grocers posts its own on Day 15.
    expect(kinds()).toEqual(["ask", "update"]);
    act.morning("1");
    expect(kinds()).toEqual(["ask", "update", "win"]);
    expect(itemOf("win")).toMatchObject({
      day: 15,
      title: "Shared a win with Tanim Farm Cooperative",
    });
    const mine = new Set(
      Object.keys(getState().conn).filter((id) => getState().conn[id] === "connected"),
    );
    expect(connectionItems().every((i) => mine.has(i.company.id))).toBe(true);
  });

  it("drops a Company's items when it isn't a Connection", () => {
    getState().conn = {};
    expect(connectionItems()).toEqual([]);
  });

  it("drafts a reply with AI that sends only on Send, then shows as answered", () => {
    const item = itemOf("ask");
    const used = getState().aiUsed[getState().day] ?? 0;
    act.startReply(item.id);
    const draft = getState().replyDrafts[item.id];
    expect(draft?.ai).toBe(true);
    if (!draft) throw new Error("No reply draft");
    expect(draft.text.length).toBeGreaterThan(20);
    expect(getState().aiUsed[getState().day]).toBe(used + 1);
    setReplyDraft(item.id, draft.text + " Edited.");
    const thread = () => getState().threads.find((t) => t.co === item.company.id);
    const sentBefore = thread()?.msgs.filter((m) => m.from === "me").length ?? 0;
    expect(connectionItems().find((i) => i.id === item.id)?.answered).toBe(false);
    act.sendReply(item.id);
    const last = thread()?.msgs.filter((m) => m.from === "me") ?? [];
    expect(last).toHaveLength(sentBefore + 1);
    expect(last.at(-1)?.text).toMatch(/Edited\.$/);
    expect(connectionItems().find((i) => i.id === item.id)?.answered).toBe(true);
    expect(getState().replyDrafts[item.id]).toBeUndefined();
  });

  it("starts with an empty reply box when AI is off, and still sends", () => {
    act.toggleAi();
    expect(getState().ai).toBe(false);
    const item = itemOf("update");
    act.startReply(item.id);
    expect(getState().replyDrafts[item.id]).toEqual({ text: "", ai: false });
    act.sendReply(item.id);
    expect(connectionItems().find((i) => i.id === item.id)?.answered).toBe(false);
    setReplyDraft(item.id, "Congratulations on the update.");
    act.sendReply(item.id);
    expect(connectionItems().find((i) => i.id === item.id)?.answered).toBe(true);
  });

  it("starts with an empty reply box when the daily AI limit is spent", () => {
    act.morning("1");
    getState().aiUsed[getState().day] = 30;
    const item = itemOf("win");
    act.startReply(item.id);
    expect(getState().replyDrafts[item.id]).toEqual({ text: "", ai: false });
  });
});

/** A value the test relies on. The test fails, naming it, when it is missing. */
function need<T>(value: T | null | undefined, what: string): T {
  if (value == null) throw new Error("Missing " + what);
  return value;
}

describe("claiming as one fact", () => {
  it("holds Kalayaan Foods' claim day as the day it claims in the flow", () => {
    expect(hasClaimed("me")).toBe(false);
    expect(claimDayOf("me")).toBeNull();
    newCompany();
    expect(hasClaimed("me")).toBe(true);
    expect(claimDayOf("me")).toBe(1);
  });

  it("answers for any day, and for today when no day is given", () => {
    act.demoActive();
    expect(claimDayOf("kainan")).toBe(4);
    expect(hasClaimed("kainan", 3)).toBe(false);
    expect(hasClaimed("kainan", 4)).toBe(true);
    expect(hasClaimed("kainan")).toBe(true);
    expect(claimDayOf("north")).toBeNull();
    expect(hasClaimed("north", 90)).toBe(false);
  });

  it("gives the chamber list, the Team Dashboard and the AI Lead Agent preview one answer", () => {
    act.demoActive();
    const reminders = teamData()
      .queue.filter((q) => q.act === "remind")
      .map((q) => q.id);
    expect(reminders.sort()).toEqual(
      POOL.filter((c) => !hasClaimed(c.id))
        .map((c) => c.id)
        .sort(),
    );
    const listed = activityView().rows.filter((m) => m.id !== "me");
    expect(listed).toHaveLength(POOL.length);
    listed.forEach((m) =>
      expect([m.id, m.status === "Not yet claimed"]).toEqual([m.id, !hasClaimed(m.id)]),
    );
    const candidates = Object.entries(AGENT_TYPES).flatMap(
      ([type, mandate]) => agentRunFor(type, mandate.need).cands,
    );
    expect(candidates.some((c) => c.status === "unclaimed")).toBe(true);
    expect(candidates.some((c) => c.status === "agent")).toBe(true);
    candidates.forEach((c) =>
      expect([c.id, c.status === "unclaimed"]).toEqual([c.id, !hasClaimed(c.id)]),
    );
  });

  it("turns a staff reminder into a claim the next morning, for that session only", () => {
    act.demoActive();
    expect(hasClaimed("agos")).toBe(false);
    act.teamRemind("agos");
    expect(hasClaimed("agos")).toBe(false);
    act.morning("1");
    expect(claimDayOf("agos")).toBe(15);
    expect(hasClaimed("agos")).toBe(true);
    expect(teamData().queue.some((q) => q.id === "agos" && q.act === "remind")).toBe(false);
    act.demoActive();
    expect(claimDayOf("agos")).toBeNull();
  });
});

/** Ids of Companies in the top list, leaving out Kalayaan Foods. */
function topIds() {
  return monthlyTop()
    .top.filter((t) => !t.me)
    .map(
      (t) =>
        need(
          POOL.find((c) => c.name === t.n),
          t.n,
        ).id,
    );
}

describe("a Company that has not claimed", () => {
  it("never acts across 30 mornings", () => {
    newCompany();
    const S = getState();
    // Reach out to Companies that have not claimed, so the rule has something to refuse.
    ["north", "kahon", "bayan", "tibay"].forEach((id) => {
      expect(hasClaimed(id)).toBe(false);
      act.connect(id);
      act.message(id);
      const thread = need(S.openThread, "open thread for " + id);
      setDraft(thread, "Hello, could we talk?");
      act.send(thread);
    });
    setForm("ask", "Looking for a packaging supplier and cold-chain freight");
    act.postAsk();
    vi.advanceTimersByTime(10_000);

    const acted = new Set<string>();
    for (let morning = 0; morning < 30; morning++) {
      act.morning("1");
      vi.advanceTimersByTime(10_000);
      const day = S.day;
      const check = (what: string, id: string, on = day) => {
        acted.add(id);
        expect([what, id, on, hasClaimed(id, on)]).toEqual([what, id, on, true]);
      };
      S.signals
        .filter((s) => s.type !== "intro")
        .forEach((s) => check("signal " + s.type, s.co, s.day));
      S.threads.forEach((t) =>
        t.msgs.filter((m) => m.from === "them").forEach((m) => check("message", t.co, m.day)),
      );
      S.incoming.forEach((r) => check("request", r.co, r.day));
      Object.keys(S.conn)
        .filter((id) => S.conn[id] === "connected")
        .forEach((id) => check("accepted request", id));
      S.asks.filter((a) => a.co !== "me").forEach((a) => check("ask", a.co, a.day ?? 1));
      S.updates.forEach((u) => check("profile update", u.co, u.day));
      topIds().forEach((id) => check("monthly top", id));
      POOL.filter((c) => !hasClaimed(c.id)).forEach((c) =>
        expect([c.id, day, pointsOf(c)]).toEqual([c.id, day, 0]),
      );
    }
    expect(acted.size).toBeGreaterThan(15);
    ["north", "kahon", "bayan", "tibay"].forEach((id) => {
      expect([id, S.conn[id]]).toEqual([id, undefined]);
      expect(S.threads.find((t) => t.co === id)?.msgs.map((m) => m.from)).toEqual(["me"]);
    });
  });

  it("cannot be sent a Connection Request, however strong the fit", () => {
    newCompany();
    act.connect("maple");
    vi.advanceTimersByTime(1500);
    expect(getState().conn.maple).toBe("connected");
    expect(fit(co("kahon")).score).toBeGreaterThanOrEqual(80);
    expect(fit(co("north")).score).toBeGreaterThanOrEqual(50);
    const toast = vi.fn();
    setHandlers({ toast });
    act.connect("kahon");
    act.connect("north");
    vi.advanceTimersByTime(5000);
    act.morning("1");
    act.morning("1");
    expect(connectionStatus("kahon")).toBeNull();
    expect(connectionStatus("north")).toBeNull();
    expect(connectionList().map((r) => r.company.id)).toEqual(["maple"]);
    expect(toast).toHaveBeenCalledWith(
      "Northline Logistics hasn’t claimed its profile yet, so it can’t accept a Connection Request.",
      undefined,
      undefined,
    );
  });

  it("sends no reply to a message", () => {
    newCompany();
    expect(co("kahon").silent).toBeUndefined();
    act.message("kahon");
    const thread = need(
      getState().threads.find((t) => t.co === "kahon"),
      "thread with Kahon",
    );
    setDraft(thread.id, "Hello, could we talk about cartons?");
    act.send(thread.id);
    vi.advanceTimersByTime(5000);
    act.morning("1");
    expect(thread.msgs.map((m) => m.from)).toEqual(["me"]);
  });

  it("is not told about an Ask and does not answer it", () => {
    newCompany();
    setForm("ask", "Looking for a packaging supplier in QC");
    act.postAsk();
    vi.advanceTimersByTime(10_000);
    act.morning("1");
    const ask = need(
      getState().asks.find((a) => a.co === "me"),
      "Kalayaan Foods' ask",
    );
    // Pacific Pack and Tala have claimed; Tibay and Kahon also offer packaging but have not.
    expect(ask.notified).toBe(2);
    expect(ask.names).toEqual(["Pacific Pack Solutions", "Tala Print and Label"]);
    expect(getState().threads.some((t) => t.co === "tibay" || t.co === "kahon")).toBe(false);
  });

  it("holds no points until its claim day", () => {
    act.demoActive();
    const kahon = co("kahon");
    getState().day = 14;
    expect(pointsOf(kahon)).toBe(0);
    getState().day = 15;
    expect(pointsOf(kahon)).toBe(kahon.pts);
    expect(kahon.pts).toBeGreaterThan(0);
  });

  it("is not ranked against, so no rival counts before it claims", () => {
    getState().day = 0;
    expect(rank()).toBe(1);
    getState().day = 1;
    expect(rank()).toBe(8);
  });

  it("is left out of Monthly Top Companies, whatever points its data holds", () => {
    act.demoActive();
    expect(topIds()).not.toContain("north");
    expect(co("north").pts).toBeGreaterThan(co("kainan").pts);
    expect(topIds()).toContain("kainan");
    expect(monthlyTop().top).toHaveLength(10);
    getState().day = 0;
    expect(topIds()).toEqual([]);
  });

  it("gets no search boost from points it does not hold", () => {
    act.demoActive();
    setForm("query", "freight");
    const rows = searchRows() ?? [];
    expect(rows.find((r) => r.source?.id === "north")?.calc).toBe("100 × 1.00");
  });
});

const EUROPEAN_IDS = EUROPEAN_MEMBERS.map((c) => c.id);
const ORIGINAL_IDS = POOL.map((c) => c.id).filter((id) => !EUROPEAN_IDS.includes(id));
const isEuropean = (id: string) => EUROPEAN_IDS.includes(id);

describe("the 100 Example Companies", () => {
  it("holds Kalayaan Foods, the 39 original companies and 60 European-style members", () => {
    expect(EUROPEAN_IDS).toHaveLength(60);
    expect(ORIGINAL_IDS).toHaveLength(39);
    expect(new Set(POOL.map((c) => c.id)).size).toBe(99);
    expect(EXAMPLE_COMPANIES).toBe(100);
    expect(co("nordhavn").name).toBe("Nordhavn Freight Forwarders");
    expect(co("maple").name).toBe("Maple Bay Grocers");
  });

  it("gives every Company an invented website on a reserved example domain", () => {
    const sites = POOL.map((c) => c.website).concat(getState().me.website);
    expect(sites).toHaveLength(100);
    sites.forEach((site) => expect(site).toMatch(/^[a-z0-9]+\.example$/));
    expect(new Set(sites).size).toBe(100);
    expect(co("nordhavn").website).toBe("nordhavn.example");
  });

  it("keeps the 60 out of what Kalayaan Foods buys and sells, apart from Nordhavn", () => {
    const seeks = ["grocery", "freight", "packaging"];
    const offers = ["snacks", "frozen", "privatelabel", "foodmfg"];
    expect(getState().me.wants).toEqual(seeks);
    expect(getState().me.gives).toEqual(offers);
    const trading = EUROPEAN_MEMBERS.filter(
      (c) => c.gives.some((t) => seeks.includes(t)) || c.wants.some((t) => offers.includes(t)),
    );
    expect(trading.map((c) => c.id)).toEqual(["nordhavn"]);
  });

  it("links each new member to at most one original, and no two originals to each other", () => {
    const pairs = EUROPEAN_EDGES.split(" ").map((p) => p.split("-"));
    const unknown = pairs.flat().filter((id) => !isEuropean(id) && !ORIGINAL_IDS.includes(id));
    expect(unknown).toEqual([]);
    expect(pairs.filter((pair) => !pair.some(isEuropean))).toEqual([]);
    const crowded = EUROPEAN_IDS.filter(
      (id) => (NEIGHBORS[id] ?? []).filter((n) => ORIGINAL_IDS.includes(n)).length > 1,
    );
    expect(crowded).toEqual([]);
    expect(EUROPEAN_IDS.filter((id) => !(NEIGHBORS[id] ?? []).length)).toEqual([]);
    expect(NEIGHBORS.nordhavn).toContain("malaya");
  });

  it("keeps the points each new member's data holds", () => {
    expect(co("nordhavn").pts).toBe(96);
    expect(co("brightlane").pts).toBe(104);
    expect(co("portside").pts).toBe(28);
    expect(EUROPEAN_IDS.every((id) => !co(id).rival)).toBe(true);
  });

  it("lets a search reach both kinds of member", () => {
    newCompany();
    const found = (query: string) => {
      setForm("query", query);
      return (searchRows() ?? []).flatMap((r) => (r.source ? [r.source.id] : []));
    };
    expect(found("wine")).toContain("vinoteca");
    expect(found("freight").some(isEuropean)).toBe(true);
    expect(found("freight").some((id) => ORIGINAL_IDS.includes(id))).toBe(true);
  });

  it("draws every Company on the network map", () => {
    newCompany();
    const map = networkLayout();
    expect(map.nodes).toHaveLength(99);
    expect(Object.keys(map.pos)).toHaveLength(100);
    expect(map.counts[1] + map.counts[2] + map.counts[3]).toBe(99);
  });

  it("keeps every mark on the network map clear of its neighbours", () => {
    /** Every mark with its centre, and the pairs of marks that touch. */
    const marks = () => {
      const { nodes, pos } = networkLayout();
      return nodes.map((n) => ({ ...n, ...need(pos[n.id], "position of " + n.id) }));
    };
    const overlaps = () => {
      const all = marks();
      return all.flatMap((a, i) =>
        all
          .slice(i + 1)
          .filter((b) => Math.hypot(a.x - b.x, a.y - b.y) < a.radius + b.radius)
          .map((b) => a.id + "/" + b.id),
      );
    };
    newCompany();
    expect(overlaps()).toEqual([]);
    act.demoActive();
    expect(overlaps()).toEqual([]);
    // The map is 700 units square, centred on Kalayaan Foods at 350, 350.
    marks().forEach((m) => {
      expect(Math.hypot(m.x - 350, m.y - 350) + m.radius).toBeLessThanOrEqual(350);
    });
  });

  it("labels the industry of every Company", () => {
    POOL.forEach((c) =>
      expect([c.id, typeof INDUSTRY[c.cat], typeof CAT[c.cat]]).toEqual([c.id, "string", "string"]),
    );
  });
});

describe("Kalayaan Foods' story with the 100 Example Companies", () => {
  it("makes Nordhavn a day-one Match, with Palengke Online and Northline completing Day 1's list", () => {
    expect(firstMatches().map((c) => c.id)).toEqual(["maple", "nordhavn", "pack"]);
    newCompany();
    expect(getState().lists[1]).toEqual(["maple", "nordhavn", "pack", "palengke", "north"]);
    expect((getState().lists[1] ?? []).map((id) => fit(co(id)).score)).toEqual([
      92, 92, 87, 87, 77,
    ]);
    expect(rank()).toBe(8);
  });

  it("gives Nordhavn a reason to meet about shipping to Europe", () => {
    expect(co("nordhavn").why).toBe(
      "ships between Manila and European ports and is looking for manufacturers ready to export.",
    );
    expect(co("nordhavn").city).toBe("Quezon City");
  });

  it("has three day-one Matches that have all claimed, and one lead that has not", () => {
    newCompany();
    const list = getState().lists[1] ?? [];
    expect(list.slice(0, 3).filter((id) => !hasClaimed(id))).toEqual([]);
    expect(list.filter((id) => !hasClaimed(id))).toEqual(["north"]);
  });

  it("never draws interest from the other 59, or lists them as leads, on any later morning", () => {
    const fromEurope = () => {
      const S = getState();
      return S.signals
        .map((s) => s.co)
        .concat(
          S.incoming.map((r) => r.co),
          Object.values(S.lists).flat(),
        )
        .filter((id) => isEuropean(id) && id !== "nordhavn");
    };
    newCompany();
    for (let i = 0; i < 30; i++) act.morning("1");
    expect(getState().signals.length).toBeGreaterThan(60);
    expect(fromEurope()).toEqual([]);
    act.demoActive();
    for (let i = 0; i < 30; i++) act.morning("1");
    expect(fromEurope()).toEqual([]);
  });

  it("keeps each later day's leads, which run out once its own trade has been shown", () => {
    newCompany();
    for (let i = 0; i < 9; i++) act.morning("1");
    const lists = getState().lists;
    // Nordhavn takes a place on Day 1, so Tala Print and Label opens Day 2 and each list after
    // it starts one Company later.
    expect(lists[2]).toEqual(["tala", "bayan", "sari", "buhay", "tindahan"]);
    expect(lists[6]).toEqual(["gabay", "tibay", "agos", "kalye", "hilaga"]);
    expect(lists[7]).toEqual(["tanim", "bigas", "kapwa", "lasa", "ginhawa"]);
    // Sulit Accounting is never a lead. Nothing links its trade to Kalayaan Foods'.
    expect(lists[8]).toEqual(["masagana", "sariwa", "dagat", "tamis"]);
    expect(lists[9]).toEqual([]);
  });
});

describe("the claim schedule", () => {
  /** How many of the Example Companies had claimed by a day. */
  const examplesClaimed = (day: number) => memberList().filter((m) => hasClaimed(m.id, day)).length;

  it("has nobody claimed before Day 1", () => {
    expect(POOL.filter((c) => hasClaimed(c.id, 0)).map((c) => c.id)).toEqual([]);
    expect(examplesClaimed(0)).toBe(0);
  });

  it("has at least eight others claimed when Kalayaan Foods claims, with everyone it meets that day", () => {
    const matches = firstMatches().map((c) => c.id);
    newCompany();
    const S = getState();
    expect(POOL.filter((c) => hasClaimed(c.id, 1)).length).toBeGreaterThanOrEqual(8);
    const heardFrom = S.signals
      .map((s) => s.co)
      .concat(S.threads.filter((t) => t.msgs.some((m) => m.from === "them")).map((t) => t.co));
    expect(heardFrom.length).toBeGreaterThan(0);
    matches.concat(heardFrom, "nordhavn").forEach((id) => {
      expect([id, hasClaimed(id, 1)]).toEqual([id, true]);
    });
  });

  it("has the eleven food suppliers Kalayaan Foods is ranked against claimed by Day 1", () => {
    const rivals = POOL.filter((c) => c.rival);
    expect(rivals).toHaveLength(11);
    expect(TOTAL).toBe(12);
    rivals.forEach((c) => expect([c.id, hasClaimed(c.id, 1)]).toEqual([c.id, true]));
  });

  it("has exactly 40 of the 100 claimed on Day 14, mixing both kinds of member", () => {
    act.demoActive();
    expect(examplesClaimed(14)).toBe(40);
    expect(hasClaimed("me", 14)).toBe(true);
    expect(EUROPEAN_IDS.filter((id) => hasClaimed(id, 14)).length).toBeGreaterThanOrEqual(15);
    expect(ORIGINAL_IDS.filter((id) => hasClaimed(id, 14)).length).toBeGreaterThanOrEqual(15);
    expect(examplesClaimed(13)).toBeLessThan(40);
  });

  it("has every Company that acts in Kalayaan Foods' two-weeks story claimed by Day 14", () => {
    act.demoActive();
    const S = getState();
    const story = new Set([
      ...S.signals.map((s) => s.co),
      ...S.threads.filter((t) => t.msgs.some((m) => m.from === "them")).map((t) => t.co),
      ...Object.keys(S.conn).filter((id) => S.conn[id] === "connected"),
      ...Object.keys(S.pendingUntil),
      ...S.incoming.map((r) => r.co),
      ...S.asks.map((a) => a.co).filter((id) => id !== "me"),
      ...S.updates.map((u) => u.co),
      ...TEAM_SPIKES.map((s) => s.id),
    ]);
    expect(story.size).toBeGreaterThanOrEqual(14);
    story.forEach((id) => expect([id, hasClaimed(id, 14)]).toEqual([id, true]));
  });

  it("has every Company with unusual points claimed from Day 1, when those points could show", () => {
    expect(TEAM_SPIKES.length).toBeGreaterThan(0);
    TEAM_SPIKES.forEach((s) => expect([s.id, hasClaimed(s.id, 1)]).toEqual([s.id, true]));
  });

  it("leaves some Companies never claiming", () => {
    const never = POOL.filter((c) => claimDayOf(c.id) === null).map((c) => c.id);
    expect(never.length).toBeGreaterThanOrEqual(30);
    expect(never).toContain("north");
    expect(never).toContain("polyglot");
  });

  it("counts the claims that followed a reminder, with no claim typed in", () => {
    act.demoActive();
    const claimRate = () => teamData().agent.find((r) => r.goal === "Profile claim rate")?.now;
    expect(claimRate()).toBe("0%");
    act.teamRemind("tibay");
    act.morning("1");
    expect(hasClaimed("tibay")).toBe(true);
    // One claim among the 58 Companies sent a claim email by Day 15: 2%, rounded.
    expect(claimRate()).toBe("2%");
  });

  it("reads 40% claimed within 14 days on the Team Dashboard", () => {
    act.demoActive();
    expect(teamData().rows[0]).toMatchObject({
      goal: "Adoption",
      now: "40%",
      target: "40%",
      ok: true,
    });
  });
});

describe("the chamber's name and its counts", () => {
  it("names the chamber from the one setting", () => {
    expect(CHAMBER).toEqual({
      shortName: "ECCP",
      fullName: "European Chamber of Commerce of the Philippines",
      senderName: "ECCP Membership",
      presenterFirstName: "Richard",
      size: 1000,
    });
    newCompany();
    expect(getState().me.chamber).toBe(CHAMBER.shortName);
    setForm("broadcast", "Our next member meeting is on Friday.");
    act.broadcast();
    expect(getState().notes[0]?.text).toBe(CHAMBER.shortName + " sent an announcement");
  });

  it("sends an announcement to the Companies that have claimed, and says how many of the chamber", () => {
    act.demoActive();
    const toast = vi.fn();
    setHandlers({ toast });
    setForm("broadcast", "Our next member meeting is on Friday.");
    act.broadcast();
    expect(chamberClaimed()).toBe(400);
    expect(toast).toHaveBeenCalledWith(
      "Sent to 400 members who have claimed.",
      undefined,
      undefined,
    );
  });

  it("refuses an announcement while no member has claimed, since it would reach nobody", () => {
    openStop(1);
    const toast = vi.fn();
    setHandlers({ toast });
    setForm("broadcast", "Our next member meeting is on Friday.");
    act.broadcast();
    expect(getState().announcements).toEqual([]);
    expect(toast).toHaveBeenCalledWith(
      "No member has claimed yet, so an announcement would reach nobody.",
      undefined,
      undefined,
    );
  });
});

describe("the Chamber Size", () => {
  const counts = (day?: number) => chamberCounts(day).map((c) => c.count);
  const total = (day?: number) => counts(day).reduce((sum, n) => sum + n, 0);
  const named = () =>
    MEMBER_STATUSES.map((status) => activityView().rows.filter((r) => r.status === status).length);

  it("is held once, with the chamber setting, beside the 100 Example Companies", () => {
    expect(CHAMBER.size).toBe(1000);
    expect(EXAMPLE_COMPANIES).toBe(100);
    expect(UNNAMED_MEMBERS).toBe(CHAMBER.size - EXAMPLE_COMPANIES);
  });

  it("adds up to 1,000 on Day 0, on Day 1 before and after the Claim, and on Day 14", () => {
    openStop(1);
    expect(total()).toBe(CHAMBER.size);
    openStop(2);
    expect(total()).toBe(CHAMBER.size);
    const before = chamberClaimed();
    newCompany();
    expect(total()).toBe(CHAMBER.size);
    expect(chamberClaimed()).toBe(before + 1);
    openStop(5);
    expect(total()).toBe(CHAMBER.size);
  });

  it("reads ten times the Example Companies on Day 14 with no session actions: 400 claimed of 1,000", () => {
    openStop(5);
    expect(counts()).toEqual([200, 160, 40, 600]);
    expect(counts()).toEqual(named().map((n) => n * 10));
    expect(chamberClaimed()).toBe(400);
    expect(chamberCounts().map((c) => c.status)).toEqual(MEMBER_STATUSES);
  });

  it("moves needs an intro by one for one Intro, since the unnamed members keep to their schedule", () => {
    openStop(5);
    setForm("introA", "lakbay");
    setForm("introB", "maple");
    act.makeIntro();
    expect(counts()).toEqual([201, 160, 39, 600]);
    expect(total()).toBe(CHAMBER.size);
  });

  it("leaves deals and wins at the named ones", () => {
    openStop(5);
    const tile = (key: string) => activityView().tiles.find((t) => t.key === key)?.value;
    expect([tile("deals"), tile("wins")]).toEqual([dealsConfirmed(14), successWall(14).length]);
    expect([tile("deals"), tile("wins")]).toEqual([3, 2]);
  });

  it("gives a status with no example members on Day 0 a count of 0 too", () => {
    openStop(1);
    expect(counts()).toEqual([0, 0, 0, 1000]);
    expect(chamberClaimed()).toBe(0);
  });

  it("lists only Example Companies in the groups, under the chamber-wide counts", () => {
    openStop(5);
    const groups = memberGroups("All");
    expect(groups.map((g) => g.count)).toEqual([200, 160, 40, 600]);
    expect(groups.map((g) => g.examples)).toEqual([20, 16, 4, 60]);
    const examples = new Set(memberList().map((m) => m.id));
    groups.forEach((g) =>
      g.members.forEach((m) => expect([m.id, examples.has(m.id)]).toEqual([m.id, true])),
    );
  });

  it("keeps a status the unnamed members hold once no example holds it, with nobody named", () => {
    openStop(5);
    const intro = (a: string) => {
      setForm("introA", a);
      setForm("introB", "maple");
      act.makeIntro();
    };
    ["lakbay", "bigas", "palengke", "medivant"].forEach(intro);
    const group = memberGroups("All").find((g) => g.status === "Needs an intro");
    expect(group).toMatchObject({ count: 36, examples: 0, members: [], more: 0 });
    expect(memberGroups("Needs an intro")).toEqual([group]);
  });

  it("gives the Team Dashboard the chamber's claimed and weekly active figures", () => {
    act.demoActive();
    const d = teamData();
    expect([d.claimed, d.of, d.target]).toEqual([400, 1000, 200]);
    expect(d.wacAt(14)).toBe(200);
    const firstLead = d.rows.find((r) => r.goal === "Immediate leads")?.now;
    expect(firstLead).toBe("90%");
  });

  it("writes every count with a thousands separator", () => {
    expect([formatCount(0), formatCount(40), formatCount(1000), formatCount(12345)]).toEqual([
      "0",
      "40",
      "1,000",
      "12,345",
    ]);
  });
});

/** The Activity View's figure for members needing an intro, and one member's status in it. */
const needIntro = () => activityView().tiles.find((t) => t.key === "needIntro")?.value;
const statusOf = (id: string) => activityView().rows.find((r) => r.id === id)?.status;

describe("the Activity View's members, grouped by status", () => {
  const counts = () => activityView().counts.map((c) => c.count);
  const withStatus = (status: string) => activityView().rows.filter((r) => r.status === status);
  const ids = (rows: { id: string }[]) => rows.map((r) => r.id);

  it("splits the chamber 200, 160, 40 and 600 on Day 14, adding up to its size", () => {
    openStop(5);
    expect(counts()).toEqual([200, 160, 40, 600]);
    expect(counts().reduce((sum, n) => sum + n, 0)).toBe(CHAMBER.size);
  });

  it("splits it 0, 0, 0 and 1,000 on Day 0, when All holds the one group of every example", () => {
    openStop(1);
    expect(counts()).toEqual([0, 0, 0, CHAMBER.size]);
    const groups = memberGroups("All");
    expect(groups.map((g) => [g.status, g.count, g.examples])).toEqual([
      ["Not yet claimed", CHAMBER.size, EXAMPLE_COMPANIES],
    ]);
    expect(groups[0]?.members).toHaveLength(GROUP_PREVIEW);
    expect(groups[0]?.more).toBe(EXAMPLE_COMPANIES - GROUP_PREVIEW);
  });

  it("groups All by status in the filters' order, each with its full count and its first six", () => {
    openStop(5);
    const groups = memberGroups("All");
    expect(GROUP_PREVIEW).toBe(6);
    expect(groups.map((g) => g.status)).toEqual(MEMBER_STATUSES);
    expect(groups.map((g) => g.count)).toEqual(counts());
    groups.forEach((g) => {
      expect([g.status, g.members.length <= GROUP_PREVIEW]).toEqual([g.status, true]);
      expect([g.status, ids(g.members)]).toEqual([
        g.status,
        ids(withStatus(g.status).slice(0, GROUP_PREVIEW)),
      ]);
      expect([g.status, g.examples]).toEqual([g.status, withStatus(g.status).length]);
      expect([g.status, g.more]).toEqual([g.status, g.examples - g.members.length]);
    });
    // Kalayaan Foods leads the active, and the member with a message waiting leads its group.
    expect(groups[0]?.members[0]?.id).toBe("me");
    expect(groups[3]?.members[0]).toMatchObject({ id: "north", waiting: true });
  });

  it("shows every member of a group of six or fewer, with nothing more to show", () => {
    openStop(5);
    const intro = memberGroups("All").find((g) => g.status === "Needs an intro");
    expect(ids(intro?.members ?? [])).toEqual(["lakbay", "bigas", "palengke", "medivant"]);
    expect(intro?.more).toBe(0);
  });

  it("gives a chosen status its whole group, and none for a status with no members", () => {
    openStop(5);
    MEMBER_STATUSES.forEach((status) => {
      const groups = memberGroups(status);
      expect([status, groups.map((g) => g.status)]).toEqual([status, [status]]);
      expect([status, ids(groups[0]?.members ?? [])]).toEqual([status, ids(withStatus(status))]);
      expect([status, groups[0]?.examples, groups[0]?.more]).toEqual([
        status,
        withStatus(status).length,
        0,
      ]);
    });
    openStop(1);
    expect(memberGroups("Active")).toEqual([]);
    expect(memberGroups("Not yet claimed")[0]?.members).toHaveLength(EXAMPLE_COMPANIES);
  });

  it("moves a member out of Needs an intro in the split and the groups when it is introduced", () => {
    openStop(5);
    setForm("introA", "lakbay");
    setForm("introB", "maple");
    act.makeIntro();
    expect(counts()).toEqual([201, 160, 39, 600]);
    expect(ids(memberGroups("Needs an intro")[0]?.members ?? [])).toEqual([
      "bigas",
      "palengke",
      "medivant",
    ]);
    const intro = memberGroups("All").find((g) => g.status === "Needs an intro");
    expect([intro?.count, intro?.examples, intro?.more]).toEqual([39, 3, 0]);
    expect(ids(memberGroups("Active")[0]?.members ?? [])).toContain("lakbay");
  });
});

describe("ECCP's Activity View", () => {
  const tiles = () => activityView().tiles.map((t) => [t.label, t.value, t.of]);
  const count = (status: string) =>
    activityView().counts.find((c) => c.status === status)?.count ?? 0;
  const send = (id: string, text: string) => {
    act.message(id);
    const thread = need(
      getState().threads.find((t) => t.co === id),
      "thread with " + id,
    );
    setDraft(thread.id, text);
    act.send(thread.id);
  };

  it("reads 400 of 1,000 claimed, 200 active, 40 needing an intro, 3 deals and 2 wins on Day 14", () => {
    openStop(5);
    expect(tiles()).toEqual([
      ["Claimed", 400, 1000],
      ["Active", 200, null],
      ["Need an intro", 40, null],
      ["Deals confirmed", 3, null],
      ["Wins posted", 2, null],
    ]);
    expect(activityView().counts).toEqual([
      { status: "Active", count: 200 },
      { status: "Quiet", count: 160 },
      { status: "Needs an intro", count: 40 },
      { status: "Not yet claimed", count: 600 },
    ]);
    expect([activityView().memberCount, activityView().exampleCount]).toEqual([1000, 100]);
    expect(MEMBER_STATUSES).toEqual(["Active", "Quiet", "Needs an intro", "Not yet claimed"]);
  });

  it("gives the full Demo's Two weeks in the same figures as Stop 5", () => {
    openStop(5);
    const stop = activityView();
    act.demoActive();
    expect(activityView()).toEqual(stop);
  });

  it("shows Kalayaan Foods and Nordhavn Freight Forwarders as Active on Day 14", () => {
    openStop(5);
    expect(statusOf("me")).toBe("Active");
    expect(statusOf("nordhavn")).toBe("Active");
    expect(activityView().rows.find((r) => r.id === "me")?.name).toBe("Kalayaan Foods Inc.");
  });

  it("lists the four members needing an intro, each claimed and with no Lead yet", () => {
    openStop(5);
    const waiting = activityView()
      .rows.filter((r) => r.status === "Needs an intro")
      .map((r) => r.id);
    expect(waiting).toEqual(["lakbay", "bigas", "palengke", "medivant"]);
    waiting.forEach((id) => expect([id, hasClaimed(id)]).toEqual([id, true]));
  });

  it("gives every example exactly one status on every day from Day 0 to Day 30, the chamber adding up to its size", () => {
    act.demoActive();
    for (let day = 0; day <= 30; day++) {
      getState().day = day;
      const view = activityView();
      expect([day, view.rows.length]).toEqual([day, EXAMPLE_COMPANIES]);
      expect([day, new Set(view.rows.map((r) => r.id)).size]).toEqual([day, EXAMPLE_COMPANIES]);
      view.rows.forEach((r) =>
        expect([day, r.id, MEMBER_STATUSES.includes(r.status)]).toEqual([day, r.id, true]),
      );
      expect([day, view.counts.map((c) => c.status)]).toEqual([day, MEMBER_STATUSES]);
      const sum = view.counts.reduce((total, c) => total + c.count, 0);
      expect([day, sum]).toEqual([day, CHAMBER.size]);
      // Beyond the named rows, each status holds a whole number of unnamed members for every
      // Example Company the schedule puts in it, and the unnamed add up to the rest of the chamber.
      const perExample = UNNAMED_MEMBERS / EXAMPLE_COMPANIES;
      const unnamed = view.counts.map(
        (c) => c.count - view.rows.filter((r) => r.status === c.status).length,
      );
      unnamed.forEach((n, i) =>
        expect([day, i, n >= 0 && n % perExample === 0]).toEqual([day, i, true]),
      );
      expect([day, unnamed.reduce((a, n) => a + n, 0)]).toEqual([day, UNNAMED_MEMBERS]);
      expect([day, view.tiles[0]?.value]).toEqual([day, chamberClaimed(day)]);
    }
  });

  it("orders the status rules: not yet claimed, then needs an intro, then active, then quiet", () => {
    openStop(5);
    // Northline Logistics never claims.
    expect(memberStatus("north")).toBe("Not yet claimed");
    // Kahon Corrugated claims on Day 15: not yet claimed on Day 14, whatever else it does.
    expect([memberStatus("kahon", 14), memberStatus("kahon", 15)]).toEqual([
      "Not yet claimed",
      "Active",
    ]);
    // Lakbay Hotels acted on Day 11, but has no Lead: needing an intro wins.
    expect(memberStatus("lakbay")).toBe("Needs an intro");
    // Nordhavn acted in the last 7 days; Tala Print and Label last acted on Day 1.
    expect(memberStatus("nordhavn")).toBe("Active");
    expect([memberStatus("tala", 7), memberStatus("tala", 8)]).toEqual(["Active", "Quiet"]);
    // A Company is Active on the day it claims.
    expect(memberStatus("keystone", 14)).toBe("Active");
  });

  it("has nobody claimed on Day 0, and every member not yet claimed", () => {
    openStop(1);
    expect(tiles().map(([, value]) => value)).toEqual([0, 0, 0, 0, 0]);
    expect(activityView().rows.every((r) => r.status === "Not yet claimed")).toBe(true);
    expect(count("Not yet claimed")).toBe(CHAMBER.size);
  });

  it("never changes a member's status for its dealings with Kalayaan Foods", () => {
    openStop(5);
    const before = activityView().rows;
    act.connect("hapag");
    vi.advanceTimersByTime(5000);
    act.connect("lindqvist");
    act.withdraw("tala");
    send("hapag", "Hello, could we supply your restaurants?");
    send("sari", "Hello, could we supply your stores?");
    const others = (rows: typeof before) => rows.filter((r) => r.id !== "me");
    expect(others(activityView().rows)).toEqual(others(before));
  });

  it("clears needing an intro with an introduction, and the Team Dashboard's queue agrees", () => {
    openStop(5);
    const queued = () =>
      teamData()
        .queue.filter((q) => q.why === "No lead yet")
        .map((q) => q.id);
    expect(queued()).toEqual(["lakbay", "bigas", "palengke", "medivant"]);
    setForm("introA", "lakbay");
    setForm("introB", "maple");
    act.makeIntro();
    expect(needIntro()).toBe(39);
    expect(statusOf("lakbay")).toBe("Active");
    expect(queued()).toEqual(["bigas", "palengke", "medivant"]);
    act.teamIntro("bigas");
    expect(needIntro()).toBe(38);
    expect(statusOf("bigas")).not.toBe("Needs an intro");
    expect(queued()).toEqual(["palengke", "medivant"]);
  });

  it("queues on the Team Dashboard each member its status says needs help, with that reason", () => {
    act.demoActive();
    const why: Partial<Record<string, string>> = {
      "Needs an intro": "No lead yet",
      Quiet: "Quiet for 7 days",
      "Not yet claimed": "Hasn’t claimed its profile",
    };
    const fromView = activityView()
      .rows.filter((r) => why[r.status])
      .map((r) => [r.id, why[r.status]]);
    const queue = teamData().queue.map((q) => [q.id, q.why]);
    // Malaya Export Traders is quiet, but was introduced on Day 12, so it is not waiting on anyone.
    expect(queue.sort()).toEqual(fromView.filter(([id]) => id !== "malaya").sort());
    expect(statusOf("malaya")).toBe("Quiet");
  });

  it("gives the Team Dashboard's weekly active figure the Active count on every day", () => {
    act.demoActive();
    const d = teamData();
    expect(d.wac).toBe(count("Active"));
    for (let day = 1; day <= 14; day++) {
      getState().day = day;
      expect([day, d.wacAt(day)]).toEqual([day, count("Active")]);
    }
  });

  it("puts a not-yet-claimed member with a message waiting first among its group, saying nothing of who", () => {
    openStop(5);
    const unclaimed = () => activityView().rows.filter((r) => r.status === "Not yet claimed");
    // Two weeks in, Kalayaan Foods' message to Northline Logistics is waiting for it to claim.
    expect(unclaimed()[0]).toEqual({
      id: "north",
      name: "Northline Logistics",
      ini: "NL",
      status: "Not yet claimed",
      waiting: true,
    });
    expect(unclaimed().filter((r) => r.waiting)).toHaveLength(1);
    send("kahon", "Hello, could we talk about shipping cartons?");
    const waiting = unclaimed().map((r) => r.waiting);
    expect(
      unclaimed()
        .slice(0, 2)
        .map((r) => r.id),
    ).toEqual(["north", "kahon"]);
    expect(waiting).toEqual(waiting.map((_, i) => i < 2));
    unclaimed().forEach((r) => {
      expect(Object.keys(r).sort()).toEqual(["id", "ini", "name", "status", "waiting"]);
      expect(JSON.stringify(r)).not.toMatch(/Kalayaan|"me"/);
    });
  });

  it("lists the members by status in the filters' order, Kalayaan Foods first among the active", () => {
    openStop(5);
    const order = activityView().rows.map((r) => MEMBER_STATUSES.indexOf(r.status));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(activityView().rows[0]?.id).toBe("me");
  });

  it("has the Monthly Top Companies of Day 14 all active", () => {
    openStop(5);
    const byName = new Map(activityView().rows.map((r) => [r.name, r.status]));
    monthlyTop().top.forEach((t) => expect([t.n, byName.get(t.n)]).toEqual([t.n, "Active"]));
  });

  it("offers an introduction only between members that have claimed, those needing one first", () => {
    openStop(5);
    const { needIntro, others } = introChoices();
    expect(needIntro.map((c) => c.id)).toEqual(["lakbay", "bigas", "palengke", "medivant"]);
    expect(others).toHaveLength(36);
    expect(others[0]).toEqual({ id: "me", name: "Kalayaan Foods Inc." });
    [...needIntro, ...others].forEach((c) =>
      expect([c.id, hasClaimed(c.id)]).toEqual([c.id, true]),
    );
    openStop(1);
    expect(introChoices()).toEqual({ needIntro: [], others: [] });
  });

  it("refuses an introduction to a member that has not claimed, or to the same member twice", () => {
    act.demoActive();
    const toast = vi.fn();
    setHandlers({ toast });
    const before = getState().intros.length;
    setForm("introA", "lakbay");
    setForm("introB", "north");
    act.makeIntro();
    setForm("introB", "lakbay");
    act.makeIntro();
    expect(getState().intros).toHaveLength(before);
    expect(toast.mock.calls.map((c) => c[0])).toEqual([
      "Choose two members that have claimed their profiles.",
      "Choose two different companies.",
    ]);
    expect(statusOf("lakbay")).toBe("Needs an intro");
  });

  it("sends the announcement to as many members as have claimed", () => {
    openStop(5);
    const toast = vi.fn();
    setHandlers({ toast });
    setForm("broadcast", "Our next member meeting is on Friday.");
    act.broadcast();
    expect(toast).toHaveBeenCalledWith(
      `Sent to ${activityView().tiles[0]?.value} members who have claimed.`,
      undefined,
      undefined,
    );
  });

  it("shows the unusual points only once the member that earned them has claimed", () => {
    openStop(1);
    expect(managerSpike()).toBeNull();
    openStop(5);
    expect(managerSpike()).toEqual({ name: "Tala Print and Label", pts: 68, state: null });
  });
});

describe("the side step from Stop 5", () => {
  beforeEach(() => openStop(5));

  it("opens the same day in the community manager's Seat, with an introduction ready", () => {
    expect([currentSeat(), onSideStep()]).toEqual(["chamber-contact", false]);
    act.sideStepOpen();
    expect([currentSeat(), onSideStep(), getState().day]).toEqual(["community-manager", true, 14]);
    const { introA, introB } = getState().forms;
    expect(introA).toBe("lakbay");
    expect(memberStatus(introB)).not.toBe("Needs an intro");
    expect(memberStatus(introB)).not.toBe("Not yet claimed");
  });

  it("sends the prepared introduction, leaving one fewer member needing one, then returns", () => {
    const toast = vi.fn();
    setHandlers({ toast });
    act.sideStepOpen();
    act.makeIntro();
    expect(toast).toHaveBeenCalledWith(
      "Introduction sent to both companies.",
      undefined,
      undefined,
    );
    act.sideStepClose();
    expect(currentSeat()).toBe("chamber-contact");
    expect(needIntro()).toBe(39);
    expect(statusOf("lakbay")).not.toBe("Needs an intro");
  });

  it("closes a draft profile opened in the side step on the way back to the read-only Seat", () => {
    act.sideStepOpen();
    act.viewDraft("maple");
    expect(getState().cm.draft).toBe("maple");
    act.sideStepClose();
    expect(getState().cm.draft).toBeNull();
    expect(currentSeat()).toBe("chamber-contact");
  });

  it("is declared on Stop 5 only, and starts closed whenever a Stop opens", () => {
    expect(PREVIEW_STOPS.filter((s) => s.sideStep).map((s) => s.number)).toEqual([5]);
    act.sideStepOpen();
    openStop(5);
    expect(onSideStep()).toBe(false);
    openStop(4);
    act.sideStepOpen();
    expect([onSideStep(), currentSeat()]).toEqual([false, "company"]);
  });
});

describe("the day-one state", () => {
  it("holds no message sent before the Claim, and nothing sent in Kalayaan Foods' name", () => {
    newCompany();
    const S = getState();
    const claimDay = need(claimDayOf("me"), "Kalayaan Foods' claim day");
    const messages = S.threads.flatMap((t) => t.msgs);
    expect(messages.filter((m) => m.from === "me")).toEqual([]);
    expect(messages.filter((m) => m.day < claimDay)).toEqual([]);
    expect(S.threads.filter((t) => t.note)).toEqual([]);
  });

  it("keeps the day-one Interest Signals and the incoming message", () => {
    newCompany();
    const S = getState();
    expect(S.signals.map((s) => [s.co, s.type])).toEqual([
      ["luntian", "messaged"],
      ["luntian", "viewed"],
      ["maple", "search"],
      ["pack", "recommended"],
    ]);
    expect(S.threads.map((t) => [t.co, t.msgs.map((m) => m.from)])).toEqual([
      ["luntian", ["them"]],
    ]);
  });
});

describe("dated wins and deals", () => {
  it("shows no win before its day, and none through Day 2", () => {
    newCompany();
    [0, 1, 2].forEach((day) => expect([day, successWall(day)]).toEqual([day, []]));
    const all = successWall(90);
    expect(all.length).toBeGreaterThanOrEqual(4);
    all.forEach((win) => {
      expect(successWall(win.day - 1)).not.toContainEqual(win);
      expect(successWall(win.day)).toContainEqual(win);
    });
  });

  it("has three confirmed deals and two wins in the chamber on Day 14", () => {
    act.demoActive();
    expect(dealsConfirmed()).toBe(3);
    expect(successWall().map((w) => [w.a, w.b, w.day])).toEqual([
      ["Kalayaan Foods Inc.", "Nordhavn Freight Forwarders", 13],
      ["Regalia Business Hotel", "Vinoteca Wine Importers", 9],
    ]);
    expect(successWall()[1]).toMatchObject({
      need: "We needed a European wine supplier for our restaurant and events.",
      got: "A reply on the Asks board turned into a twelve-month supply agreement.",
    });
    // Azur Bay Resort and Maison Blanc Linens confirmed a deal on Day 12, with no Testimonial yet.
    expect(dealsConfirmed(11)).toBe(1);
    expect(dealsConfirmed(12)).toBe(2);
    expect(successWall(12)).toHaveLength(1);
  });

  it("gives the Team Dashboard the same deals and Testimonials as the wall", () => {
    act.demoActive();
    const now = (goal: string) => teamData().rows.find((r) => r.goal === goal)?.now;
    expect(now("Results")).toBe("3");
    expect(now("Advocacy")).toMatch(/^2 \/ /);
    act.morning("7");
    expect(now("Results")).toBe(String(dealsConfirmed()));
    expect(now("Advocacy")).toMatch(new RegExp("^" + successWall().length + " / "));
    expect(dealsConfirmed()).toBeGreaterThan(3);
  });

  it("holds the three earlier wins on days after Day 14", () => {
    const later = successWall(90).filter((w) => w.day > 14);
    expect(later.map((w) => [w.a, w.b]).sort()).toEqual([
      ["Bukas Office Canteens", "Pacific Pack Solutions"],
      ["Malaya Export Traders", "Tibay Crates and Pallets"],
      ["Maple Bay Grocers", "Tanim Farm Cooperative"],
    ]);
  });

  it("has both Companies in a deal claimed by its day", () => {
    expect(CHAMBER_DEALS.length).toBeGreaterThanOrEqual(5);
    CHAMBER_DEALS.forEach((deal) => {
      [deal.a, deal.b].forEach((id) =>
        expect([id, deal.day, hasClaimed(id, deal.day)]).toEqual([id, deal.day, true]),
      );
    });
  });

  it("puts a Testimonial posted this session on the wall on the day it is posted", () => {
    act.demoActive();
    act.outcome("t-pack|deal");
    vi.advanceTimersByTime(1600);
    expect(dealsConfirmed()).toBe(4);
    setForm("need", "We needed food-grade pouches");
    setForm("got", "We placed a first order");
    act.postT();
    expect(successWall()[0]).toEqual({
      a: "Kalayaan Foods Inc.",
      b: "Pacific Pack Solutions",
      need: "We needed food-grade pouches.",
      got: "We placed a first order.",
      day: 14,
    });
    expect(successWall(13).some((w) => w.b === "Pacific Pack Solutions")).toBe(false);
  });
});

describe("two weeks in, on Day 14", () => {
  beforeEach(() => act.demoActive());

  it("lands on Day 14, with nothing dated after it or before Day 1", () => {
    const S = getState();
    expect(S.day).toBe(14);
    expect(S.digest?.day).toBe(14);
    const days = [
      ...S.ledger.map((l) => l.day),
      ...S.signals.map((x) => x.day),
      ...S.otherSignals.map((x) => x.day),
      ...S.threads.flatMap((t) => t.msgs.map((m) => m.day)),
      ...S.updates.map((u) => u.day),
      ...S.incoming.map((r) => r.day),
      ...S.announcements.map((a) => a.day),
      ...S.wall.map((w) => w.day),
      ...S.notes.map((n) => n.day),
      ...S.log.map((l) => l.day),
      ...Object.keys(S.lists).map(Number),
      S.me.lastUpdate,
    ];
    expect(Math.max(...days)).toBe(14);
    expect(Math.min(...days)).toBe(1);
  });

  it("has the Nordhavn deal confirmed by both Companies on Day 13", () => {
    const S = getState();
    const thread = need(
      S.threads.find((t) => t.co === "nordhavn"),
      "thread with Nordhavn",
    );
    expect(S.conn.nordhavn).toBe("connected");
    expect(thread.msgs[0]).toMatchObject({ from: "me", day: 1 });
    expect(thread.msgs.filter((m) => m.from === "sys").map((m) => [m.text, m.day])).toEqual([
      ["Both companies confirmed: We met.", 5],
      ["Both companies confirmed: We did business.", 13],
    ]);
    expect([thread.metDone, thread.dealDone]).toEqual([1, 1]);
    expect(S.pendingT).toEqual([]);
  });

  it("has Kalayaan Foods' Testimonial about the shipment on the Success Wall", () => {
    expect(successWall()[0]).toEqual({
      a: "Kalayaan Foods Inc.",
      b: "Nordhavn Freight Forwarders",
      need: "We needed a forwarder for our first shipment of banana chips to Europe.",
      got: "We met through a day-one match, and the shipment left Manila within two weeks.",
      day: 13,
    });
  });

  it("awards the points the rules give, within every limit", () => {
    const S = getState();
    expect(S.ledger.filter((l) => l.co === "nordhavn").map((l) => [l.day, l.key, l.pts])).toEqual([
      [13, "testimonial", 15],
      [13, "deal", 25],
      [9, "reply", 3],
      [5, "meet", 10],
      [4, "reply", 3],
      [2, "reply", 3],
      [1, "conn", 5],
    ]);
    S.ledger.forEach((l) => expect([l.key, l.pts]).toEqual([l.key, RULES[l.key].pts]));
    expect(score()).toBe(123);
    // Replay the ledger from Day 1: the rules allow each entry on the day it is dated.
    const entries = S.ledger.slice().reverse();
    S.ledger = [];
    entries.forEach((l) => {
      S.day = l.day;
      expect([l.day, l.key, l.co, allowed(l.key, l.co)]).toEqual([l.day, l.key, l.co, true]);
      S.ledger.unshift(l);
    });
  });

  it("backs each reply, meeting and deal it earned points for with a message that day", () => {
    const S = getState();
    const messages = (id: string | null) => S.threads.find((t) => t.co === id)?.msgs ?? [];
    const backed = S.ledger.map((l) => {
      const thread = messages(l.co);
      const confirmed = (text: string) =>
        thread.some((m) => m.from === "sys" && m.day === l.day && m.text.endsWith(text));
      if (l.key === "meet") return [l.day, l.key, l.co, confirmed("We met.")];
      if (l.key === "deal") return [l.day, l.key, l.co, confirmed("We did business.")];
      if (l.key !== "reply") return [l.day, l.key, l.co, true];
      // A reply earns points when it answers their message within 24 hours.
      const answered = thread.some((m, i) => {
        const before = thread[i - 1];
        return (
          m.from === "me" && m.day === l.day && before?.from === "them" && l.day - before.day <= 1
        );
      });
      return [l.day, l.key, l.co, answered];
    });
    expect(backed.filter((row) => row[3] !== true)).toEqual([]);
    expect(backed.filter((row) => row[1] === "reply")).toHaveLength(6);
  });

  it("has nobody acting before the day it claimed", () => {
    const S = getState();
    const acted: [string, string, number][] = [
      ...S.signals
        .filter((x) => x.type !== "intro")
        .map((x): [string, string, number] => ["signal", x.co, x.day]),
      ...S.threads.flatMap((t) =>
        t.msgs
          .filter((m) => m.from !== "me")
          .map((m): [string, string, number] => ["message or outcome", t.co, m.day]),
      ),
      ...S.updates.map((u): [string, string, number] => ["profile update", u.co, u.day]),
      ...S.incoming.map((r): [string, string, number] => ["request", r.co, r.day]),
      ...S.ledger.flatMap((l): [string, string, number][] =>
        l.co ? [["points with", l.co, l.day]] : [],
      ),
      ...S.asks
        .filter((a) => a.co !== "me")
        .map((a): [string, string, number] => ["ask", a.co, a.day ?? 1]),
      ...Object.keys(S.conn).map((id): [string, string, number] => [
        "connection or request",
        id,
        14,
      ]),
    ];
    expect(acted.length).toBeGreaterThan(40);
    acted.forEach(([what, id, day]) =>
      expect([what, id, day, hasClaimed(id, day)]).toEqual([what, id, day, true]),
    );
  });

  it("keeps the other interested Companies and their Interest Levels, with Nordhavn Hot", () => {
    expect(interestedCompanies().map((r) => [r.company.id, r.level, r.status])).toEqual([
      ["hapag", "Hot", null],
      ["luntian", "Hot", null],
      ["pack", "Hot", "Connected"],
      ["nordhavn", "Hot", "Connected"],
      ["maple", "Warm", "Connected"],
      ["sari", "New", null],
      ["malaya", "New", null],
      ["lakbay", "New", null],
      ["tindahan", "New", null],
      ["palengke", "New", null],
      ["kainan", "New", null],
      ["bukas", "New", null],
      ["paaralan", "New", null],
    ]);
  });

  it("writes the morning's digest from what the state holds", () => {
    const S = getState();
    const today = S.signals.filter((x) => x.day === 14);
    expect(today.filter((x) => x.type === "search").map((x) => x.co)).toEqual(["malaya"]);
    expect(today.filter((x) => x.type === "viewed").map((x) => x.co)).toEqual(["sari", "hapag"]);
    expect(S.digest).toMatchObject({
      day: 14,
      leads: 5,
      viewers: ["Sari Central Wholesale", "Hapag Kitchen Group"],
      searches: 1,
      requests: 1,
      rank: rank(),
    });
    expect(S.incoming).toEqual([{ co: "lakbay", day: 14 }]);
    expect(digestLine()).toBe("5 new leads, 2 companies viewed you, you moved up 1 place");
  });

  it("builds today's leads and the morning's Ask from the network as it stands on Day 14", () => {
    const S = getState();
    expect(S.lists[1]).toEqual(["maple", "nordhavn", "pack", "palengke", "north"]);
    expect(S.lists[14]).toEqual(["kahon", "tindahan", "biyahe", "lakbay", "selyo"]);
    expect(S.asks[0]).toMatchObject({ id: "o14", co: "nordhavn", day: 14 });
    expect(S.asks[0]?.text).toBe(
      "Looking for food manufacturers for our freight forwarding business.",
    );
  });
});

describe("what a Company may see of another", () => {
  beforeEach(newCompany);

  it("shows only the basics of a Company that has not claimed", () => {
    expect(publicView(co("north"))).toEqual({
      id: "north",
      name: "Northline Logistics",
      ini: "NL",
      ind: "Cold-chain freight",
      city: "Valenzuela City",
      website: "north.example",
      claimed: false,
    });
  });

  it("adds the description, offers and needs of a Company that has claimed", () => {
    expect(publicView(co("nordhavn"))).toEqual({
      id: "nordhavn",
      name: "Nordhavn Freight Forwarders",
      ini: "NF",
      ind: "Freight forwarding",
      city: "Quezon City",
      website: "nordhavn.example",
      claimed: true,
      description:
        "ships between Manila and European ports and is looking for manufacturers ready to export.",
      offer: ["Sea freight to Europe", "Air cargo"],
      seek: ["Food manufacturers", "Snack exporters"],
    });
    expect(matchReason(co("nordhavn"))).toBe(
      "Ships between Manila and European ports and is looking for manufacturers ready to export.",
    );
  });

  it("changes on the day the Company claims", () => {
    const kainan = co("kainan");
    act.morning("2");
    expect(getState().day).toBe(3);
    expect(publicView(kainan).claimed).toBe(false);
    expect(fitReasons(kainan)).toEqual([]);
    expect(matchReason(kainan)).toBe(
      "You offer frozen foods. Kainan Catering Co. works in catering, San Juan City.",
    );
    act.morning("1");
    expect(publicView(kainan)).toMatchObject({
      claimed: true,
      description: "needs a steady supply of frozen lumpia for events.",
      offer: ["Event catering"],
      seek: ["Frozen foods"],
    });
    expect(fitReasons(kainan).map(([label]) => label)).toEqual([
      "Seeks what you offer",
      "Also in Metro Manila",
    ]);
    expect(matchReason(kainan)).toBe("Needs a steady supply of frozen lumpia for events.");
  });

  it("keeps the Fit Score of a Company that has not claimed, with no breakdown", () => {
    expect(fit(co("north")).score).toBe(77);
    expect(fitReasons(co("north"))).toEqual([]);
    expect(fitReasons(co("maple")).map(([label]) => label)).toEqual([
      "Seeks what you offer",
      "Offers what you seek",
      "Same city",
    ]);
  });

  it("does not show the Connections of a Company that has not claimed", () => {
    act.connect("maple");
    vi.advanceTimersByTime(1500);
    expect(mutualText(co("pack"))).toContain("Maple Bay Grocers");
    expect(NEIGHBORS.north).toContain("maple");
    expect(mutualText(co("north"))).toBe("");
    expect(searchDegree(co("pack"))).toBe(" · 2nd · 1 mutual");
    expect(searchDegree(co("north"))).toBe("");
    // Matching still counts the shared Connection, in private.
    expect(fit(co("north")).score).toBe(82);
  });

  it("finds a Company that has not claimed by its name and industry, never by its draft", () => {
    const found = (query: string) => {
      setForm("query", query);
      return (searchRows() ?? []).flatMap((r) => (r.source ? [r.source.id] : []));
    };
    // Northline's draft says it delivers chilled goods, and offers "Chilled delivery".
    expect(co("north").why).toContain("chilled");
    expect(found("chilled")).not.toContain("north");
    expect(found("cold-chain")).toContain("north");
    expect(found("northline")).toEqual(["north"]);
    // Kainan Catering's draft mentions lumpia. It claims on Day 4.
    expect(found("lumpia")).not.toContain("kainan");
    act.morning("3");
    expect(found("lumpia")).toContain("kainan");
    // A Company that has claimed is found by what it offers and seeks.
    expect(found("shelf placement")).toEqual(["maple"]);
  });

  it("gives one reason from the viewer's need when the Company gives what it seeks", () => {
    expect(matchReason(co("north"))).toBe(
      "You’re looking for freight. Northline Logistics works in cold-chain freight, Valenzuela City.",
    );
    expect(matchReason(co("kahon"))).toBe(
      "You’re looking for packaging. Kahon Corrugated works in corrugated boxes, Valenzuela City.",
    );
  });

  it("starts from the viewer's offer when the Company only seeks what it offers", () => {
    expect(matchReason(co("himig"))).toBe(
      "You offer Filipino snacks. Himig Events works in event planning, Pasig City.",
    );
    expect(matchReason(co("sinag"))).toBe(
      "You offer food manufacturing. Sinag Energy Systems works in commercial solar, Pasay City.",
    );
  });

  it("gives no reason for a Company whose trade does not meet the viewer's", () => {
    expect(hasClaimed("polyglot")).toBe(false);
    expect(matchReason(co("polyglot"))).toBeNull();
    expect(matchReason(co("sulit"))).toBeNull();
  });

  it("builds that reason from the viewer's side and public basics, never the unpublished draft", () => {
    const disguise = (id: string) => ({
      ...co(id),
      why: "trains unicorns for parades.",
      offer: ["Unicorn training"],
      seek: ["Unicorn riders"],
    });
    const unclaimed = POOL.filter((c) => !hasClaimed(c.id));
    const reasons = unclaimed.flatMap((c) => {
      const reason = matchReason(c);
      expect([c.id, matchReason(disguise(c.id))]).toEqual([c.id, reason]);
      if (reason) expect(reason).not.toContain(c.why);
      return reason ? [reason] : [];
    });
    expect(reasons.length).toBeGreaterThanOrEqual(15);
    expect(publicView(disguise("north"))).toEqual(publicView(co("north")));
  });

  it("keeps an acronym in an industry as it is written", () => {
    getState().me.wants = ["hr"];
    const company = need(
      POOL.find((c) => c.ind === "Payroll and HR"),
      "the payroll Company",
    );
    expect(hasClaimed(company.id)).toBe(false);
    expect(matchReason(company)).toContain(" works in payroll and HR, ");
  });
});

describe("the people a Company may see of another", () => {
  const names = (viewer: string, owner: string) => {
    const seen = peopleSeenBy(viewer, owner);
    return seen.kind === "people" ? seen.people.map((p) => p.name) : seen.kind;
  };

  it("shows no people of a Company that isn't connected, or whose request is still pending", () => {
    newCompany();
    expect(peopleSeenBy("me", "nordhavn")).toEqual({ kind: "not-connected" });
    act.connect("tala");
    expect(getState().conn.tala).toBe("pending");
    expect(peopleSeenBy("me", "tala")).toEqual({ kind: "not-connected" });
  });

  it("shows a connected Company's people with their shown name, title and role, and no contact", () => {
    act.demoActive();
    expect(peopleSeenBy("me", "nordhavn")).toEqual({
      kind: "people",
      people: [
        {
          id: "mette",
          name: "Mette Lindholm",
          firstName: "Mette",
          title: "Managing director",
          role: "Primary admin",
          contact: null,
          ask: "open",
        },
        {
          id: "jonas",
          name: "Jonas Brandt",
          firstName: "Jonas",
          title: "Export sales manager",
          role: "Authorized user · Sales",
          contact: null,
          ask: "open",
        },
      ],
    });
    expect(names("me", "maple")).toEqual(["Carmela Lopez", "Dennis Ramos"]);
    expect(names("me", "pack")).toEqual(["Ramon Castillo", "Joy Fernandez"]);
  });

  it("shows a person who uses an alias by that alias", () => {
    act.demoActive();
    expect(names("me", "tala")).toEqual(["Rosario M."]);
  });

  it("says a connected Company with no people listed has none yet", () => {
    act.demoActive();
    act.acceptReq("lakbay");
    expect(peopleSeenBy("me", "lakbay")).toEqual({ kind: "people", people: [] });
  });

  it("keeps a Company that has not claimed to its basics, with no people", () => {
    act.demoActive();
    expect(hasClaimed("north")).toBe(false);
    expect(peopleSeenBy("me", "north")).toEqual({ kind: "basics" });
  });

  it("shows Kalayaan's people only to the Companies it is connected to", () => {
    act.demoActive();
    expect(names("nordhavn", "me")).toEqual([
      "Ana Reyes",
      "Marco Dizon",
      "Liza Manalo",
      "Paolo Villanueva",
    ]);
    // Lakbay Hotels' Connection Request is still waiting, and Hapag Kitchen Group never sent one.
    expect(peopleSeenBy("lakbay", "me")).toEqual({ kind: "not-connected" });
    expect(peopleSeenBy("hapag", "me")).toEqual({ kind: "not-connected" });
  });

  it("shows Ana by her alias, and leaves her title out once she hides it", () => {
    act.demoActive();
    const ana = () => {
      const seen = peopleSeenBy("nordhavn", "me");
      return seen.kind === "people" ? seen.people[0] : undefined;
    };
    expect(previewOfMe()).toMatchObject({
      name: "Ana Reyes",
      title: "Owner",
      role: "Primary admin",
    });
    act.chooseName("alias");
    expect(ana()).toMatchObject({ name: "Ana R.", firstName: "Ana", title: "Owner" });
    expect(previewOfMe()).toMatchObject({ name: "Ana R.", title: "Owner" });
    act.toggleTitle();
    expect(ana()).toMatchObject({ name: "Ana R.", title: null });
    expect(previewOfMe()).toMatchObject({ name: "Ana R.", title: null, contact: null });
    act.chooseName("full");
    act.toggleTitle();
    expect(ana()).toMatchObject({ name: "Ana Reyes", title: "Owner" });
  });

  it("drops a removed person from what connected Companies see", () => {
    act.demoActive();
    act.removePerson("liza");
    expect(names("nordhavn", "me")).toEqual(["Ana Reyes", "Marco Dizon", "Paolo Villanueva"]);
  });

  it("gives every person a different id, so a Contact Request names one person", () => {
    const ids = [...KALAYAAN_PEOPLE, ...Object.values(PEOPLE).flat()].map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every person outside Kalayaan an invented email on their Company's domain and a fake phone", () => {
    expect(Object.keys(PEOPLE)).toEqual(["nordhavn", "maple", "pack", "tala"]);
    Object.entries(PEOPLE).forEach(([id, people]) => {
      expect(people.length).toBeGreaterThanOrEqual(1);
      expect(people.length).toBeLessThanOrEqual(2);
      people.forEach((p) => {
        expect(p.email.endsWith("@" + co(id).website)).toBe(true);
        expect(p.phone).toMatch(/^\+63 2 0000 \d{4}$/);
      });
    });
  });
});

describe("Contact Requests", () => {
  const person = (viewer: string, owner: string, id: string) => {
    const seen = peopleSeenBy(viewer, owner);
    return seen.kind === "people" ? seen.people.find((p) => p.id === id) : undefined;
  };
  const askedByMe = () => getState().contactRequests.filter((r) => r.from === "me");
  const waitingFor = (id: string) => peopleRows().find((r) => r.person.id === id)?.waitingFrom;

  it("marks an ask as waiting, and refuses to ask the same person again", () => {
    act.demoActive();
    act.askContact("mette");
    expect(person("me", "nordhavn", "mette")).toMatchObject({ ask: "asked", contact: null });
    act.askContact("mette");
    expect(askedByMe()).toHaveLength(1);
    expect(person("me", "nordhavn", "jonas")?.ask).toBe("open");
  });

  it("asks only the people of a Company Kalayaan is connected to", () => {
    newCompany();
    act.askContact("mette");
    expect(askedByMe()).toEqual([]);
  });

  it("shares the details the next morning, with a Notification", () => {
    act.demoActive();
    act.askContact("mette");
    act.askContact("rosario");
    act.morning("1");
    expect(person("me", "nordhavn", "mette")).toMatchObject({
      ask: "shared",
      contact: { email: "mette@nordhavn.example", phone: "+63 2 0000 0011" },
    });
    const notes = getState().notes.filter((n) => n.type === "contact");
    expect(notes.map((n) => [n.co, n.text])).toEqual(
      expect.arrayContaining([
        ["nordhavn", "Mette Lindholm shared their contact details."],
        ["tala", "Rosario M. shared their contact details."],
      ]),
    );
  });

  it("brings Nordhavn's request to Ana the morning after the two connect, once", () => {
    newCompany();
    act.connect("nordhavn");
    vi.advanceTimersByTime(1500);
    expect(getState().conn.nordhavn).toBe("connected");
    expect(contactRequestsToMe().waiting).toEqual([]);
    act.morning("1");
    expect(contactRequestsToMe().waiting).toEqual([
      { from: "nordhavn", name: "Nordhavn Freight Forwarders" },
    ]);
    expect(getState().notes.find((n) => n.type === "contact-request")).toMatchObject({
      type: "contact-request",
      co: "nordhavn",
      text: "Nordhavn Freight Forwarders asked for your email and phone",
    });
    act.morning("1");
    expect(contactRequestsToMe().waiting).toHaveLength(1);
  });

  it("holds Nordhavn's request for Ana and Maple Bay's for Marco two weeks in", () => {
    act.demoActive();
    expect(contactRequestsToMe()).toEqual({
      waiting: [{ from: "nordhavn", name: "Nordhavn Freight Forwarders" }],
      sharedWith: [],
    });
    expect(waitingFor("marco")).toEqual(["Maple Bay Grocers"]);
    expect(waitingFor("ana")).toEqual([]);
    expect(waitingFor("liza")).toEqual([]);
  });

  it("notifies Ana of Nordhavn's request in the two-weeks-in preset, on the day it arrived", () => {
    act.demoActive();
    const notes = getState().notes.filter((n) => n.type === "contact-request");
    expect(notes.map((n) => [n.co, n.day, n.text])).toEqual([
      ["nordhavn", 2, "Nordhavn Freight Forwarders asked for your email and phone"],
    ]);
  });

  it("shares Ana's email and phone with Nordhavn alone", () => {
    act.demoActive();
    const toast = vi.fn();
    setHandlers({ toast });
    expect(person("nordhavn", "me", "ana")?.contact).toBeNull();
    act.shareContact("nordhavn");
    expect(person("nordhavn", "me", "ana")?.contact).toEqual({
      email: "ana@kalayaanfoods.example",
      phone: "+63 2 0000 0001",
    });
    expect(person("maple", "me", "ana")?.contact).toBeNull();
    expect(contactRequestsToMe()).toEqual({
      waiting: [],
      sharedWith: ["Nordhavn Freight Forwarders"],
    });
    expect(toast).toHaveBeenCalledWith(
      "Nordhavn Freight Forwarders can now see your email and phone.",
      undefined,
      undefined,
    );
  });

  it("declines quietly: Nordhavn isn't told and still sees no email or phone", () => {
    act.demoActive();
    const toast = vi.fn();
    setHandlers({ toast });
    act.declineContact("nordhavn");
    expect(toast).toHaveBeenCalledWith(
      "Declined. Nordhavn Freight Forwarders won’t be told.",
      undefined,
      undefined,
    );
    expect(contactRequestsToMe()).toEqual({ waiting: [], sharedWith: [] });
    expect(person("nordhavn", "me", "ana")).toMatchObject({ contact: null, ask: "asked" });
    act.morning("1");
    expect(contactRequestsToMe().waiting).toEqual([]);
  });

  it("lets only the person asked answer: an admin can't answer for a colleague", () => {
    act.demoActive();
    act.shareContact("maple");
    act.declineContact("maple");
    expect(waitingFor("marco")).toEqual(["Maple Bay Grocers"]);
    expect(person("maple", "me", "marco")?.contact).toBeNull();
  });

  it("drops a removed person's Contact Requests, and none comes back", () => {
    act.demoActive();
    act.removePerson("marco");
    expect(getState().contactRequests.some((r) => r.person === "marco")).toBe(false);
    act.morning("1");
    expect(getState().contactRequests.some((r) => r.person === "marco")).toBe(false);
  });
});

describe("contacting a Company that has not claimed", () => {
  beforeEach(newCompany);

  const send = (id: string, text: string) => {
    act.message(id);
    const thread = need(
      getState().threads.find((t) => t.co === id),
      "thread with " + id,
    );
    setDraft(thread.id, text);
    act.send(thread.id);
    return thread;
  };

  it("holds a message as waiting, with no reply across several mornings", () => {
    expect(waitingForClaim("north")).toBe(false);
    const thread = send("north", "Hello, could we talk about chilled delivery?");
    expect(waitingForClaim("north")).toBe(true);
    for (let morning = 0; morning < 5; morning++) {
      vi.advanceTimersByTime(5000);
      act.morning("1");
    }
    expect(thread.msgs.map((m) => m.from)).toEqual(["me"]);
    expect(waitingForClaim("north")).toBe(true);
    // No follow-up is suggested to a Company that cannot read the first message yet.
    expect(jobFor(thread)).toBeNull();
  });

  it("stops waiting on the day the Company claims", () => {
    send("kainan", "Hello, could we supply your events?");
    expect(waitingForClaim("kainan")).toBe(true);
    act.morning("3");
    expect(hasClaimed("kainan")).toBe(true);
    expect(waitingForClaim("kainan")).toBe(false);
  });

  it("is not waiting on a Company that has claimed and has yet to reply", () => {
    send("maple", "Hello, could we supply your stores?");
    expect(waitingForClaim("maple")).toBe(false);
    vi.advanceTimersByTime(2000);
    expect(
      getState()
        .threads.find((t) => t.co === "maple")
        ?.msgs.at(-1)?.from,
    ).toBe("them");
  });

  it("drafts the first message from the Company's public basics only", () => {
    act.message("north");
    const thread = need(
      getState().threads.find((t) => t.co === "north"),
      "thread with Northline",
    );
    prepareThread(thread.id);
    const draft = need(getState().drafts[thread.id], "AI draft");
    expect(draft.ai).toBe(true);
    expect(draft.text).toContain(
      "I saw that your company works in cold-chain freight in Valenzuela City.",
    );
    expect(draft.text).not.toContain(co("north").why);
    expect(getState().threads.find((t) => t.co === "north")?.msgs).toEqual([]);
  });
});

/* ---------- The Pilot Preview ---------- */

/** The simulation's whole state, as text, so two states can be compared exactly. */
const snapshot = () => JSON.stringify(getState());

/** The state with the Pilot Preview's own flags set aside. */
function withoutPreviewFlags() {
  const { preview: _preview, laterItems: _laterItems, ...rest } = getState();
  return rest;
}

describe("the Pilot Preview's Opening and Stops", () => {
  it("declares the Opening and six Stops with their days, titles, Seats and addresses", () => {
    expect(PREVIEW_OPENING).toMatchObject({
      number: 0,
      day: null,
      title: "A preview for ECCP",
      seat: null,
      href: "/app/preview",
    });
    expect(PREVIEW_STOPS.map((s) => [s.number, s.day, s.title, s.seat, s.href])).toEqual([
      [1, 0, "ECCP’s member list becomes profiles", "community-manager", "/app/chamber?stop=1"],
      [2, 1, "A member claims its profile", "company", "/app/claim?stop=2"],
      [3, 2, "The next morning", "company", "/app/digest?stop=3"],
      [4, 14, "The member, two weeks in", "company", "/app/dash?stop=4"],
      [5, 14, "ECCP’s view", "chamber-contact", "/app/chamber?stop=5"],
      [6, null, "What a pilot asks of ECCP", null, "/app/preview/ask?stop=6"],
    ]);
  });

  it("names the chamber in its titles from the one setting", () => {
    const named = [PREVIEW_OPENING, ...PREVIEW_STOPS].filter((s) =>
      s.title.includes(CHAMBER.shortName),
    );
    expect(named.map((s) => s.number)).toEqual([0, 1, 5, 6]);
  });

  it("gives each Seat its line", () => {
    expect(SEAT_LINES).toEqual({
      "community-manager": "You’re seeing ComLinked’s community manager, working for ECCP.",
      company: "You’re seeing Kalayaan Foods, an ECCP member.",
      "chamber-contact": "You’re seeing ECCP’s own view. It is read-only.",
    });
  });

  it("writes each Stop's line with its day, or with its title alone when it has none", () => {
    expect(PREVIEW_STOPS.map(stopLine)).toEqual([
      "Day 0 · ECCP’s member list becomes profiles",
      "Day 1 · A member claims its profile",
      "Day 2 · The next morning",
      "Day 14 · The member, two weeks in",
      "Day 14 · ECCP’s view",
      "What a pilot asks of ECCP",
    ]);
  });

  it("walks forward from the Opening through the six Stops, then starts again", () => {
    const walk = [0];
    for (let i = 0; i < 7; i++) walk.push(nextStop(walk.at(-1) ?? 0).number);
    expect(walk).toEqual([0, 1, 2, 3, 4, 5, 6, 0]);
  });

  it("walks back one Stop at a time, with Back from Stop 1 opening the Opening", () => {
    expect(PREVIEW_STOPS.map((s) => previousStop(s.number).number)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("treats a number outside the list as the Opening", () => {
    expect(previewStop(9)).toBe(PREVIEW_OPENING);
    expect(previewStop(-1)).toBe(PREVIEW_OPENING);
  });
});

describe("a Pilot Preview address", () => {
  it("names a Stop by its marker", () => {
    PREVIEW_STOPS.forEach((s) => {
      const [path = "", query = ""] = s.href.split("?");
      expect(stopForAddress(path, new URLSearchParams(query).get("stop"))).toBe(s);
    });
  });

  it("names the Opening at the Opening's own address", () => {
    expect(stopForAddress("/app/preview", null)).toBe(PREVIEW_OPENING);
  });

  it("names the Opening for a Stop that does not exist", () => {
    ["9", "0", "-1", "04", "2.5", "two", ""].forEach((marker) =>
      expect([marker, stopForAddress("/app/chamber", marker)]).toEqual([marker, PREVIEW_OPENING]),
    );
  });

  it("names no Stop when it carries no marker, so the full Demo opens", () => {
    ["/app/claim", "/app/dash", "/app/dash/signals", "/app/preview/ask"].forEach((path) =>
      expect([path, stopForAddress(path, null)]).toEqual([path, null]),
    );
  });
});

describe("the browser tab's memory of the Stop", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.sessionStorage.clear();
  });

  it("reopens the remembered Stop after a reload", () => {
    rememberStop(4);
    expect(stopAfterReload()).toBe(previewStop(4));
  });

  it("reopens nothing once the tab has left the Pilot Preview", () => {
    rememberStop(4);
    rememberStop(null);
    expect(stopAfterReload()).toBeNull();
  });

  it("reopens the Opening when the remembered Stop does not exist", () => {
    rememberStop(9);
    expect(stopAfterReload()).toBe(PREVIEW_OPENING);
  });

  it("carries on without the memory when the browser blocks it, and a reload shows the Opening", () => {
    vi.spyOn(window, "sessionStorage", "get").mockImplementation(() => {
      throw new DOMException("The tab's memory is blocked.", "SecurityError");
    });
    expect(() => rememberStop(3)).not.toThrow();
    expect(() => rememberStop(null)).not.toThrow();
    expect(stopAfterReload()).toBe(PREVIEW_OPENING);
  });
});

describe("opening a Stop", () => {
  it("opens each Stop on its day, with Kalayaan Foods claimed only from Stop 3", () => {
    const claimedFrom = 3;
    PREVIEW_STOPS.forEach((stop) => {
      openStop(stop.number);
      const S = getState();
      expect([stop.number, S.preview]).toEqual([stop.number, stop.number]);
      expect([stop.number, previewStop(S.preview ?? -1).seat]).toEqual([stop.number, stop.seat]);
      expect([stop.number, S.claimed]).toEqual([stop.number, stop.number >= claimedFrom]);
      if (stop.day !== null) expect([stop.number, S.day]).toEqual([stop.number, stop.day]);
    });
  });

  it("marks the Opening as in the Pilot Preview, with no Stop's state built", () => {
    openStop(0);
    expect(getState().preview).toBe(0);
    const opening = withoutPreviewFlags();
    act.demoNew();
    expect(opening).toEqual(withoutPreviewFlags());
  });

  it("builds the same state every time, whatever was done before", () => {
    [PREVIEW_OPENING, ...PREVIEW_STOPS].forEach((stop) => {
      act.demoNew();
      openStop(stop.number);
      const clean = snapshot();
      newCompany();
      act.connect("maple");
      act.morning("3");
      act.toggleLaterItem("pricing");
      act.setView("pro");
      openStop(stop.number === 5 ? 1 : 5);
      act.toggleLaterItem("previews");
      openStop(stop.number);
      expect([stop.number, snapshot()]).toEqual([stop.number, clean]);
    });
  });

  it("builds each state at once, with nothing left for a timer and no toast", () => {
    const toast = vi.fn();
    setHandlers({ toast });
    [PREVIEW_OPENING, ...PREVIEW_STOPS].forEach((stop) => {
      openStop(stop.number);
      const built = snapshot();
      vi.advanceTimersByTime(60_000);
      expect([stop.number, snapshot()]).toEqual([stop.number, built]);
    });
    expect(toast).not.toHaveBeenCalled();
  });

  it("builds Stop 4 from the same seed as Two weeks in, and Stops 5 and 6 see that same state", () => {
    act.demoActive();
    const twoWeeksIn = withoutPreviewFlags();
    [4, 5, 6].forEach((n) => {
      openStop(n);
      expect([n, withoutPreviewFlags()]).toEqual([n, twoWeeksIn]);
    });
  });
});

describe("Day 0, before any Claim", () => {
  beforeEach(() => openStop(1));

  it("holds no activity, no claimed Company and no points", () => {
    const S = getState();
    expect(S.day).toBe(0);
    expect(chamberClaimed()).toBe(0);
    expect(hasClaimed("me")).toBe(false);
    expect(POOL.filter((c) => hasClaimed(c.id) || pointsOf(c) > 0)).toEqual([]);
    expect(S.ledger).toEqual([]);
    expect(score()).toBe(0);
    expect(S.signals).toEqual([]);
    expect(S.otherSignals).toEqual([]);
    expect(S.threads).toEqual([]);
    expect(S.asks).toEqual([]);
    expect(S.incoming).toEqual([]);
    expect(S.updates).toEqual([]);
    expect(S.notes).toEqual([]);
    expect(S.lists).toEqual({});
    expect(S.digest).toBeNull();
    expect(successWall()).toEqual([]);
    expect(monthlyTop().top.filter((t) => !t.me)).toEqual([]);
  });

  it("has ECCP's member list already imported", () => {
    const S = getState();
    expect(S.cm).toMatchObject({ stage: "done", imported: true, built: memberList().length });
  });

  it("counts no member as claimed, active or needing an intro", () => {
    expect(activityView().tiles.map((t) => t.value)).toEqual([0, 0, 0, 0, 0]);
    expect(activityView().rows.every((m) => m.status === "Not yet claimed")).toBe(true);
  });

  it("works out every figure a screen reads without failing", () => {
    const figures = () => [
      rank(),
      score(),
      nextAction(),
      interestedCompanies(),
      topNumbers(),
      visibilityByDay(),
      visibilityNote(),
      interestFunnel(),
      comDashAlerts(),
      searcherRoles(),
      industryGroups(),
      searchTerms(),
      profileGaps(),
      profileCompleteness(),
      connectionSummary(),
      connectionList(),
      connectionItems(),
      invitations(),
      chamberSuggestions(),
      buyerSuggestions(),
      networkRing(),
      networkLayout(),
      noteGroups(),
      unreadCount(),
      monthlyTop(),
      teamData(),
      dealsConfirmed(),
      searchRows(),
      firstMatches(),
    ];
    expect(figures).not.toThrow();
  });
});

describe("Stop 3, the next morning", () => {
  beforeEach(() => openStop(3));

  it("is Day 2, the morning after Kalayaan Foods claimed on Day 1", () => {
    expect(getState().day).toBe(2);
    expect(claimDayOf("me")).toBe(1);
  });

  it("holds the Morning Digest for Day 2", () => {
    expect(getState().digest?.day).toBe(2);
    expect(digestLine()).toMatch(/^\d+ new leads, /);
  });

  it("is connected with Nordhavn and has sent it a first message, the one Two weeks in starts from", () => {
    const S = getState();
    expect(S.conn.nordhavn).toBe("connected");
    const sent = need(
      S.threads.find((t) => t.co === "nordhavn"),
      "thread with Nordhavn",
    ).msgs;
    expect(sent.map((m) => [m.from, m.day])).toEqual([["me", 1]]);
    act.demoActive();
    const twoWeeks = need(
      getState().threads.find((t) => t.co === "nordhavn"),
      "Nordhavn thread two weeks in",
    ).msgs;
    expect(sent[0]?.text).toBe(twoWeeks[0]?.text);
  });
});

describe("moving between screens", () => {
  it("never claims Kalayaan Foods inside the Pilot Preview", () => {
    [1, 2].forEach((n) => {
      openStop(n);
      ["dash", "leads", "mail", "wins", "chamber", "digest", "matches", "company"].forEach((r) =>
        enterRoute(r),
      );
      expect([n, getState().claimed]).toEqual([n, false]);
    });
  });

  it("claims Kalayaan Foods on the first screen after the claim screen in the full Demo, as before", () => {
    expect(enterRoute("claim")).toBe("claim");
    expect(getState().claimed).toBe(false);
    expect(enterRoute("dash")).toBe("dash");
    expect(getState().claimed).toBe(true);
  });
});

describe("the later items", () => {
  const AFTER_MVP = ["agent", "team", "engine"];

  it("start with pricing off and the previews on in each of the full Demo's starts", () => {
    const start = { pricing: false, previews: true };
    expect(getState().laterItems).toEqual(start);
    act.demoActive();
    expect(getState().laterItems).toEqual(start);
    openStop(4);
    act.reset();
    expect(getState().laterItems).toEqual(start);
    expect(getState().preview).toBeNull();
  });

  it("show no tier while pricing is off, the Free member view once it is switched on, and none after a reset", () => {
    act.demoActive();
    expect(planShown()).toBeNull();
    act.toggleLaterItem("pricing");
    expect(planShown()).toBe("free");
    act.reset();
    expect(planShown()).toBeNull();
  });

  it("are both off whenever the Opening or a Stop opens", () => {
    [PREVIEW_OPENING, ...PREVIEW_STOPS].forEach((stop) => {
      act.demoActive();
      openStop(stop.number);
      expect([stop.number, getState().laterItems]).toEqual([
        stop.number,
        { pricing: false, previews: false },
      ]);
    });
  });

  it("each switch on and off alone", () => {
    openStop(4);
    act.toggleLaterItem("previews");
    expect(getState().laterItems).toEqual({ pricing: false, previews: true });
    expect(laterItemShown("previews")).toBe(true);
    act.toggleLaterItem("pricing");
    act.toggleLaterItem("previews");
    expect(getState().laterItems).toEqual({ pricing: true, previews: false });
    expect(laterItemShown("pricing")).toBe(true);
    act.toggleLaterItem("not-an-item");
    act.toggleLaterItem("toString");
    expect(getState().laterItems).toEqual({ pricing: true, previews: false });
  });

  it("with the previews hidden, open the ComDash Overview at the after-MVP screens' addresses", () => {
    openStop(4);
    AFTER_MVP.forEach((r) => expect([r, enterRoute(r)]).toEqual([r, "dash"]));
    act.toggleLaterItem("previews");
    AFTER_MVP.forEach((r) => expect([r, enterRoute(r)]).toEqual([r, r]));
  });

  it("open the after-MVP screens in the full Demo, as before", () => {
    act.demoActive();
    AFTER_MVP.forEach((r) => expect([r, enterRoute(r)]).toEqual([r, r]));
  });

  it("with the previews hidden, name the ComDash Overview as the screen to show, without entering it", () => {
    openStop(2);
    expect(["agent", "team", "engine"].map(shownRoute)).toEqual(["dash", "dash", "dash"]);
    expect(["leads", "claim", "chamber"].map(shownRoute)).toEqual(["leads", "claim", "chamber"]);
    expect(getState().claimed).toBe(false);
    act.toggleLaterItem("previews");
    expect(["agent", "team", "engine"].map(shownRoute)).toEqual(["agent", "team", "engine"]);
  });

  it("with pricing hidden, keep ComDash on the Free view", () => {
    act.demoActive();
    act.toggleLaterItem("pricing");
    act.setView("pro");
    expect(getState().view).toBe("pro");
    act.toggleLaterItem("pricing");
    expect(getState().view).toBe("free");
    act.toggleLaterItem("pricing");
    act.setView("growth");
    expect(getState().view).toBe("growth");
  });
});

/* ---------- Stops 1, 2 and 6: the Member List, the claim message and the ask ---------- */

describe("the Member List", () => {
  it("names the 100 Example Companies, each as its name and website and nothing else, and counts the rest", () => {
    const list = memberList();
    expect(list).toHaveLength(100);
    expect(list).toHaveLength(EXAMPLE_COMPANIES);
    expect(UNNAMED_MEMBERS).toBe(900);
    expect(new Set(list.map((row) => row.id)).size).toBe(100);
    list.forEach((row) => expect(Object.keys(row).sort()).toEqual(["id", "name", "website"]));
    expect(list[0]).toEqual({
      id: "me",
      name: "Kalayaan Foods Inc.",
      website: "kalayaanfoods.example",
    });
    expect(list.filter((row) => !row.name || !row.website.endsWith(".example"))).toEqual([]);
  });
});

describe("the member import", () => {
  it("ends with computed counts of profiles built and claim links ready for ECCP to send", () => {
    expect(importResult()).toBe("1,000 profiles built. 1,000 claim links ready for ECCP to send.");
    expect(importResult()).toContain(`${formatCount(CHAMBER.size)} profiles built`);
    expect(importResult()).not.toMatch(/\bsent\b/i);
  });

  it("is already finished when Stop 1 opens", () => {
    openStop(1);
    expect(getState().cm).toMatchObject({ stage: "done", imported: true });
    expect(importProgress()).toEqual({ built: 1000, of: 1000, rows: 100 });
  });

  it("run again, previews the list, builds every profile in about four seconds and ends the same", () => {
    const toast = vi.fn();
    setHandlers({ toast });
    openStop(1);
    act.importPick();
    expect(getState().cm.stage).toBe("preview");
    act.importBuild();
    expect(getState().cm.stage).toBe("building");
    expect(importProgress()).toEqual({ built: 0, of: 1000, rows: 0 });
    vi.advanceTimersByTime(2000);
    expect(getState().cm.stage).toBe("building");
    expect(importProgress()).toEqual({ built: 500, of: 1000, rows: 50 });
    vi.advanceTimersByTime(2000);
    expect(getState().cm).toMatchObject({ stage: "done", imported: true });
    expect(importProgress()).toEqual({ built: 1000, of: 1000, rows: 100 });
    expect(toast).toHaveBeenCalledTimes(1);
    expect(toast.mock.calls[0]?.[0]).toBe(importResult());
  });

  it("cancelled during the preview, returns to the finished result", () => {
    openStop(1);
    act.importPick();
    act.importCancel();
    expect(getState().cm).toMatchObject({ stage: "done", imported: true });
    expect(importProgress().built).toBe(1000);
  });
});

describe("the claim message", () => {
  it("is what Stop 2 opens on, and no other Stop or start of the Demo", () => {
    openStop(2);
    expect(getState().claimMessageShown).toBe(true);
    [PREVIEW_OPENING, ...PREVIEW_STOPS]
      .filter((stop) => stop.number !== 2)
      .forEach((stop) => {
        openStop(stop.number);
        expect([stop.number, getState().claimMessageShown]).toEqual([stop.number, false]);
      });
    act.demoNew();
    expect(getState().claimMessageShown).toBe(false);
    act.demoActive();
    expect(getState().claimMessageShown).toBe(false);
  });

  it("comes from ECCP's sender to Ana Reyes of Kalayaan Foods, in the agreed wording", () => {
    openStop(2);
    expect(claimMessage()).toEqual({
      from: "ECCP Membership",
      to: "Ana Reyes, Kalayaan Foods Inc.",
      subject: "Your company profile on ComLinked is ready",
      greeting: "Dear Ana,",
      paragraphs: [
        "ECCP is piloting ComLinked, a network where member companies find leads among each other. It is free for members.",
        "A profile for Kalayaan Foods Inc. has been drafted from your website. 3 ECCP members already match what you offer.",
      ],
      assurance: "Other members see your description only after you have checked it.",
      note: "Example wording. ECCP approves the real message.",
    });
  });

  it("names the chamber, its sender, the representative and the Company from their one source", () => {
    openStop(2);
    const S = getState();
    const message = claimMessage();
    expect(message.from).toBe(CHAMBER.senderName);
    expect(message.to).toBe(`${primaryAdmin().name}, ${S.me.name}`);
    expect(message.paragraphs[0]?.startsWith(`${CHAMBER.shortName} is piloting`)).toBe(true);
    expect(message.note).toContain(`${CHAMBER.shortName} approves`);
  });

  it("counts the Matches the Claim then shows", () => {
    openStop(2);
    expect(firstMatches().map((c) => c.id)).toEqual(["maple", "nordhavn", "pack"]);
    expect(claimMessage().paragraphs[1]).toContain("3 ECCP members already match what you offer.");
  });

  it("leaves out the line about matches when fewer than three exist", () => {
    openStop(2);
    POOL.slice(2).forEach((c) => {
      getState().conn[c.id] = "connected";
    });
    expect(firstMatches()).toHaveLength(2);
    expect(claimMessage().paragraphs[1]).toBe(
      "A profile for Kalayaan Foods Inc. has been drafted from your website.",
    );
  });

  it("and the Claim work with the AI Assistant off", () => {
    openStop(2);
    act.toggleAi();
    expect(getState().ai).toBe(false);
    expect(claimMessage().paragraphs[1]).toContain("3 ECCP members already match");
    act.claimOpen();
    act.claimNext();
    act.claimConfirm("yes");
    act.claimFinish();
    expect(getState().claimed).toBe(true);
    expect(firstMatches()).toHaveLength(3);
  });

  it("opens the first claim screen from its button, and the Claim then runs as before", () => {
    openStop(2);
    act.claimOpen();
    expect(getState()).toMatchObject({ claimMessageShown: false, claimStep: 0, claimed: false });
    act.claimNext();
    act.claimConfirm("yes");
    act.claimFinish();
    expect(getState().claimed).toBe(true);
    expect(getState().preview).toBe(2);
    expect(firstMatches().map((c) => c.id)).toContain("nordhavn");
  });
});

describe("the presenter's contact", () => {
  it("is nothing when no address is set", () => {
    expect(presenterContact(undefined)).toBeNull();
  });

  it("is the presenter's first name, the address, and a link that opens a new message with the subject filled in", () => {
    expect(presenterContact("presenter@comlinked.example")).toEqual({
      firstName: CHAMBER.presenterFirstName,
      address: "presenter@comlinked.example",
      mailto: "mailto:presenter@comlinked.example?subject=ECCP%20pilot%20on%20ComLinked",
    });
  });

  it("encodes an address that carries characters a link cannot hold as they are", () => {
    expect(presenterContact("first+pilot&x@comlinked.example")?.mailto).toBe(
      "mailto:first%2Bpilot%26x@comlinked.example?subject=ECCP%20pilot%20on%20ComLinked",
    );
  });
});

describe("exploring after the last Stop", () => {
  it("starts when the viewer leaves the ask for the member's side, two weeks in", () => {
    openStop(6);
    expect(exploring()).toBe(false);
    expect(currentSeat()).toBeNull();
    expect(enterRoute("dash")).toBe("dash");
    expect(exploring()).toBe(true);
    expect(currentSeat()).toBe("company");
    expect(getState()).toMatchObject({ day: 14, claimed: true });
  });

  it("opens at the top of the screen once, so the way back is in view", () => {
    const top = vi.fn();
    setHandlers({ top });
    openStop(6);
    enterRoute("preview");
    expect(top).not.toHaveBeenCalled();
    enterRoute("dash");
    expect(top).toHaveBeenCalledTimes(1);
    enterRoute("leads");
    expect(top).toHaveBeenCalledTimes(1);
  });

  it("keeps the Pilot Preview and the hidden later items", () => {
    openStop(6);
    enterRoute("dash");
    expect(currentStop()).toBe(PREVIEW_CLOSING);
    expect([laterItemShown("pricing"), laterItemShown("previews")]).toEqual([false, false]);
    expect(enterRoute("team")).toBe("dash");
    expect(enterRoute("leads")).toBe("leads");
    expect(exploring()).toBe(true);
    expect(getState().preview).toBe(6);
  });

  it("ends when its way back opens Stop 6", () => {
    openStop(6);
    enterRoute("dash");
    const back = stopForAddress(PREVIEW_CLOSING.screen, String(PREVIEW_CLOSING.number));
    expect(back).toBe(PREVIEW_CLOSING);
    openStop(PREVIEW_CLOSING.number);
    expect(exploring()).toBe(false);
    expect(getState().preview).toBe(6);
  });

  it("does not start inside any other Stop, or in the full Demo", () => {
    PREVIEW_STOPS.filter((stop) => stop !== PREVIEW_CLOSING).forEach((stop) => {
      openStop(stop.number);
      enterRoute("leads");
      expect([stop.number, exploring()]).toEqual([stop.number, false]);
      expect([stop.number, currentSeat()]).toEqual([stop.number, stop.seat]);
    });
    act.demoActive();
    enterRoute("leads");
    expect(exploring()).toBe(false);
    expect(currentSeat()).toBe("company");
  });
});
