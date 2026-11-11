import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  act,
  agentSteps,
  comDashAlerts,
  connectionSummary,
  industryGroups,
  interestFunnel,
  interestLevel,
  interestedCompanies,
  profileCompleteness,
  profileGaps,
  searchTerms,
  searcherRoles,
  topNumbers,
  visibilityByDay,
  allowed,
  award,
  byFit,
  co,
  degreeLabel,
  digestLine,
  enterRoute,
  firstMatches,
  fit,
  getState,
  groupText,
  markDashSeen,
  markDigestRead,
  markNotesRead,
  members,
  monthlyTop,
  mutualText,
  nextAction,
  networkLayout,
  networkRing,
  noteGroups,
  openDefaultThread,
  POOL,
  prepareThread,
  rank,
  score,
  searchRows,
  selectedLead,
  setDraft,
  setForm,
  teamData,
  TOTAL,
  trendPoints,
  unreadCount,
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
    expect(firstMatches().map((c) => c.id)).toEqual(["maple", "pack", "palengke"]);
    newCompany();
    const ids = getState().lists[1]!.slice(0, 3);
    expect(ids).toEqual(["maple", "pack", "palengke"]);
    expect(ids.map((id) => fit(co(id)).score)).toEqual([92, 87, 87]);
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
    expect(fit(co("agos")).score).toBeLessThan(50);
    act.connect("agos");
    vi.advanceTimersByTime(5000);
    act.morning("1");
    expect(getState().conn.agos).toBe("pending");
    act.withdraw("agos");
    expect(getState().conn.agos).toBeUndefined();
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

  it("sits at #4 of 12 with an Activity Score of 59", () => {
    expect(rank()).toBe(4);
    expect(TOTAL).toBe(12);
    expect(score()).toBe(59);
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
    act.swapRep();
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
    expect(members().length).toBe(12);

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
      "Profile views",
      "Profile saves",
      "Messages",
      "Recommendations",
      "Connections",
    ]);
    expect(topNumbers().every((n) => n.change === null)).toBe(true);
    act.morning("1");
    expect(topNumbers().every((n) => n.change === null)).toBe(true);
  });

  it("compares the last 7 days with the 7 before once two weeks have passed", () => {
    act.demoActive();
    const byLabel = Object.fromEntries(topNumbers().map((n) => [n.label, n]));
    expect(byLabel["Search appearances"]).toMatchObject({
      value: 3,
      change: "50% more than last week",
      trend: "up",
    });
    expect(byLabel["Profile views"]).toMatchObject({ value: 4, change: "4 more than last week" });
    expect(byLabel["Recommendations"]).toMatchObject({
      value: 1,
      change: "Same as last week",
      trend: "same",
    });
    expect(byLabel["Connections"]).toMatchObject({ value: 3 });
  });

  it("counts companies that reached each funnel step or a later one", () => {
    act.demoActive();
    const funnel = interestFunnel();
    expect(funnel?.steps.map((s) => [s.label, s.count, s.ofPrevious])).toEqual([
      ["Found you", 12, null],
      ["Viewed your profile", 5, 42],
      ["Saved your profile", 4, 80],
      ["Messaged you", 3, 75],
      ["Connected", 2, 67],
    ]);
    expect(funnel?.suggestion).toMatch(/\.$/);
  });

  it("charts search appearances and recommendations from the claim day", () => {
    act.demoActive();
    const days = visibilityByDay();
    expect(days[0]!.day).toBe(1);
    expect(days.at(-1)!.day).toBe(15);
    expect(days.find((d) => d.day === 13)).toMatchObject({ searches: 1, recommendations: 1 });
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
    expect(connectionSummary()).toEqual({ connections: 3, incoming: 1, outgoing: 2 });
    expect(profileCompleteness()).toEqual({ percent: 90, missing: ["a photo of your work"] });
  });
});

describe("search terms and profile gaps", () => {
  it("flags a term the profile doesn't list, and clears it when dismissed", () => {
    act.demoActive();
    expect(searchTerms().find((t) => t.term === "polvoron")).toEqual({
      term: "polvoron",
      count: 1,
      gap: true,
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
    expect(
      topNumbers()
        .slice(0, 5)
        .every((n) => n.value === 0 && n.change === null),
    ).toBe(true);
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
