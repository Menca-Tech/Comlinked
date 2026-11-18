// Example data for the ComLinked product simulation, copied from the HTML mockup.
import { EUROPEAN_EDGES, EUROPEAN_MEMBERS } from "@/services/comlinked/european-members";
import type {
  ActivityRecord,
  Company,
  Deal,
  Member,
  MyCompany,
  PlanView,
  PlanViewRules,
  Rule,
  RuleKey,
} from "@/services/comlinked/types";

export interface AgentType {
  label: string;
  need: string;
  conf: string;
  confQ: string;
  q: string;
  backQ: string;
  a: string;
}

type RawCompany = [
  id: string,
  name: string,
  ini: string,
  ind: string,
  city: string,
  cat: string,
  why: string,
  offer: string[],
  seek: string[],
  /** The day the Company claims its profile, or null when it never does. */
  claimDay: number | null,
  /** How it uses ComLinked once it has claimed. */
  activity: ActivityRecord,
];
/** Every example company is invented, and so is its website, on a reserved example domain. */
function websiteOf(id: string) {
  return id + ".example";
}
const RAW: RawCompany[] = [
  [
    "maple",
    "Maple Bay Grocers",
    "MB",
    "Grocery retail",
    "Quezon City",
    "retail",
    "stocks Filipino snacks and is looking for new suppliers.",
    ["Grocery retail", "Shelf placement"],
    ["Filipino snacks", "Frozen foods", "Private label"],
    1,
    { firstDayLead: true, actsEvery: 2 },
  ],
  [
    "pack",
    "Pacific Pack Solutions",
    "PP",
    "Packaging",
    "Pasig City",
    "packaging",
    "makes food-grade packaging for products like yours.",
    ["Food-grade pouches", "Printed boxes"],
    ["Food manufacturers", "Exporters"],
    1,
    { firstDayLead: true, actsEvery: 3 },
  ],
  [
    "north",
    "Northline Logistics",
    "NL",
    "Cold-chain freight",
    "Valenzuela City",
    "freight",
    "delivers chilled goods across Metro Manila.",
    ["Chilled delivery", "Cold-chain freight"],
    ["Food manufacturers", "Grocers"],
    null,
    { firstDayLead: true, actsEvery: 7 },
  ],
  [
    "luntian",
    "Luntian Foods Inc.",
    "LF",
    "Organic food distribution",
    "Marikina City",
    "food",
    "distributes organic products to the retailers you want to reach.",
    ["Distribution", "Retail accounts"],
    ["Filipino snacks", "Organic lines"],
    1,
    { firstDayLead: true, actsEvery: 2 },
  ],
  [
    "tala",
    "Tala Print and Label",
    "TP",
    "Label printing",
    "Makati City",
    "packaging",
    "prints compliant food labels in small batches.",
    ["Food labels", "Short runs"],
    ["Food brands"],
    1,
    { firstDayLead: true, actsEvery: 14 },
  ],
  [
    "bayan",
    "Bayan Cold Storage",
    "BC",
    "Cold storage",
    "Navotas City",
    "freight",
    "rents frozen storage near the Manila port.",
    ["Frozen storage"],
    ["Exporters", "Frozen foods"],
    15,
    { firstDayLead: false, actsEvery: 6 },
  ],
  [
    "sari",
    "Sari Central Wholesale",
    "SC",
    "Wholesale distribution",
    "Caloocan City",
    "retail",
    "supplies 400 neighborhood stores with packaged snacks.",
    ["Wholesale", "Store delivery"],
    ["Packaged snacks"],
    2,
    { firstDayLead: true, actsEvery: 13 },
  ],
  [
    "hapag",
    "Hapag Kitchen Group",
    "HK",
    "Restaurant group",
    "Taguig City",
    "hospitality",
    "buys frozen foods for 12 restaurants.",
    ["Restaurant accounts"],
    ["Frozen foods", "Lumpia"],
    1,
    { firstDayLead: true, actsEvery: 16 },
  ],
  [
    "kainan",
    "Kainan Catering Co.",
    "KC",
    "Catering",
    "San Juan City",
    "hospitality",
    "needs a steady supply of frozen lumpia for events.",
    ["Event catering"],
    ["Frozen foods"],
    4,
    { firstDayLead: true, actsEvery: 3 },
  ],
  [
    "malaya",
    "Malaya Export Traders",
    "ME",
    "Export trading",
    "Manila",
    "export",
    "ships Filipino food products to Canada and the Gulf.",
    ["Export handling"],
    ["Shelf-stable snacks"],
    1,
    { firstDayLead: true, actsEvery: 20 },
  ],
  [
    "tibay",
    "Tibay Crates and Pallets",
    "TC",
    "Pallets and crates",
    "Meycauayan, Bulacan",
    "packaging",
    "builds export-grade pallets for food shipments.",
    ["Export pallets"],
    ["Exporters"],
    18,
    { firstDayLead: true, actsEvery: 7 },
  ],
  [
    "sinag",
    "Sinag Energy Systems",
    "SE",
    "Commercial solar",
    "Pasay City",
    "services",
    "installs rooftop solar that lowers cold-room power costs.",
    ["Rooftop solar"],
    ["Food plants"],
    null,
    { firstDayLead: true, actsEvery: 7 },
  ],
  [
    "agos",
    "Agos Water Services",
    "AW",
    "Water treatment",
    "Antipolo City",
    "services",
    "tests and treats process water for food plants.",
    ["Water testing"],
    ["Food plants"],
    null,
    { firstDayLead: true, actsEvery: 7 },
  ],
  [
    "lakbay",
    "Lakbay Hotels",
    "LH",
    "Hospitality",
    "Quezon City",
    "hospitality",
    "buys local snacks for guest rooms in 5 hotels.",
    ["Hotel accounts"],
    ["Local snacks"],
    1,
    { firstDayLead: false, actsEvery: 5 },
  ],
  [
    "buhay",
    "Buhay Pharmacy Chain",
    "BP",
    "Retail pharmacy",
    "Mandaluyong City",
    "retail",
    "adds healthy snack lines to its checkout counters.",
    ["Retail counters"],
    ["Healthy snacks"],
    8,
    { firstDayLead: true, actsEvery: 3 },
  ],
  [
    "tanim",
    "Tanim Farm Cooperative",
    "TF",
    "Farm cooperative",
    "Calamba, Laguna",
    "food",
    "grows bananas and ube for food manufacturers.",
    ["Bananas", "Ube"],
    ["Food manufacturers"],
    1,
    { firstDayLead: true, actsEvery: 4 },
  ],
  [
    "hilaga",
    "Hilaga Spice Traders",
    "HS",
    "Ingredients",
    "Manila",
    "food",
    "imports and blends spices for snack producers.",
    ["Spice blends"],
    ["Snack producers"],
    1,
    { firstDayLead: true, actsEvery: null },
  ],
  [
    "daloy",
    "Daloy Fleet Rentals",
    "DF",
    "Delivery fleet",
    "Pasig City",
    "freight",
    "rents delivery vans by the week during peak seasons.",
    ["Van rental"],
    ["Distributors"],
    null,
    { firstDayLead: true, actsEvery: 7 },
  ],
  [
    "alon",
    "Alon Digital Studio",
    "AD",
    "Marketing services",
    "Makati City",
    "services",
    "shoots product photos for food brands.",
    ["Product photos"],
    ["Food brands"],
    24,
    { firstDayLead: true, actsEvery: 5 },
  ],
  [
    "pandayan",
    "Pandayan Equipment",
    "PE",
    "Food machinery",
    "Valenzuela City",
    "services",
    "services frying and sealing lines for snack plants.",
    ["Machine servicing"],
    ["Snack plants"],
    28,
    { firstDayLead: true, actsEvery: 9 },
  ],
  [
    "bukas",
    "Bukas Office Canteens",
    "BO",
    "Workplace canteens",
    "Ortigas, Pasig City",
    "hospitality",
    "stocks snack counters in 30 offices.",
    ["Office canteens"],
    ["Packaged snacks"],
    2,
    { firstDayLead: true, actsEvery: 16 },
  ],
  [
    "bigas",
    "Bigasan Rice Mills",
    "BR",
    "Rice milling",
    "Malolos, Bulacan",
    "food",
    "mills and bags rice for grocers across Luzon.",
    ["Milled rice"],
    ["Grocery retailers", "Packaging"],
    1,
    { firstDayLead: false, actsEvery: 3 },
  ],
  [
    "kapwa",
    "Kapwa Snack Foods",
    "KS",
    "Snack manufacturing",
    "Quezon City",
    "food",
    "makes corn chips for the same store shelves you supply.",
    ["Corn chips"],
    ["Grocery retailers", "Packaging"],
    1,
    { firstDayLead: true, actsEvery: 1 },
  ],
  [
    "lasa",
    "Lasa Frozen Foods",
    "LZ",
    "Frozen food",
    "Pasig City",
    "food",
    "produces frozen siomai and could share cold-chain routes.",
    ["Frozen siomai"],
    ["Cold-chain freight", "Grocery retailers"],
    1,
    { firstDayLead: true, actsEvery: 2 },
  ],
  [
    "ginhawa",
    "Ginhawa Bakeshop Supply",
    "GB",
    "Baking ingredients",
    "Quezon City",
    "food",
    "supplies flour and fillings to neighborhood bakeries.",
    ["Baking ingredients"],
    ["Grocery retailers"],
    1,
    { firstDayLead: true, actsEvery: null },
  ],
  [
    "masagana",
    "Masagana Dairy",
    "MD",
    "Dairy",
    "San Pablo, Laguna",
    "food",
    "delivers fresh milk and cheese to Metro Manila grocers.",
    ["Fresh dairy"],
    ["Cold-chain freight", "Grocery retailers"],
    1,
    { firstDayLead: true, actsEvery: 18 },
  ],
  [
    "sariwa",
    "Sariwa Produce Trading",
    "SP",
    "Fresh produce",
    "La Trinidad, Benguet",
    "food",
    "trucks highland vegetables to Metro Manila markets.",
    ["Fresh produce"],
    ["Grocery retailers", "Cold-chain freight"],
    1,
    { firstDayLead: true, actsEvery: null },
  ],
  [
    "dagat",
    "Dagat Seafood Supply",
    "DS",
    "Seafood",
    "Navotas City",
    "food",
    "supplies frozen seafood to restaurants and hotels.",
    ["Frozen seafood"],
    ["Cold-chain freight", "Restaurants"],
    1,
    { firstDayLead: true, actsEvery: 21 },
  ],
  [
    "tamis",
    "Tamis Confectionery",
    "TM",
    "Confectionery",
    "Valenzuela City",
    "food",
    "makes pastillas and polvoron for gift shops and grocers.",
    ["Filipino sweets"],
    ["Grocery retailers", "Packaging"],
    1,
    { firstDayLead: true, actsEvery: 3 },
  ],
  [
    "palengke",
    "Palengke Online",
    "PO",
    "Online grocery",
    "Makati City",
    "retail",
    "sells pantry staples and frozen food online across Metro Manila.",
    ["Online grocery"],
    ["Filipino snacks", "Frozen foods"],
    1,
    { firstDayLead: false, actsEvery: 4 },
  ],
  [
    "paaralan",
    "Paaralan Canteen Services",
    "PC",
    "School canteens",
    "Quezon City",
    "hospitality",
    "supplies snacks to 18 school canteens.",
    ["School canteens"],
    ["Packaged snacks"],
    3,
    { firstDayLead: true, actsEvery: 14 },
  ],
  [
    "tindahan",
    "Tindahan Convenience Stores",
    "TS",
    "Convenience retail",
    "Mandaluyong City",
    "retail",
    "adds local snacks to its 60 convenience stores.",
    ["Convenience retail"],
    ["Packaged snacks"],
    5,
    { firstDayLead: true, actsEvery: 12 },
  ],
  [
    "biyahe",
    "Biyahe Couriers",
    "BY",
    "Courier delivery",
    "Pasay City",
    "freight",
    "delivers small food parcels the same day across Metro Manila.",
    ["Same-day delivery"],
    ["Food manufacturers"],
    20,
    { firstDayLead: true, actsEvery: 4 },
  ],
  [
    "kahon",
    "Kahon Corrugated",
    "KB",
    "Corrugated boxes",
    "Valenzuela City",
    "packaging",
    "makes shipping cartons sized for snack cases.",
    ["Shipping cartons"],
    ["Food manufacturers"],
    15,
    { firstDayLead: true, actsEvery: 6 },
  ],
  [
    "selyo",
    "Selyo Compliance Services",
    "SY",
    "Food compliance",
    "Quezon City",
    "services",
    "handles product registration for food makers.",
    ["Product registration"],
    ["Food manufacturers"],
    22,
    { firstDayLead: true, actsEvery: 10 },
  ],
  [
    "sulit",
    "Sulit Accounting",
    "SA",
    "Accounting",
    "Manila",
    "services",
    "keeps the books for small manufacturers.",
    ["Bookkeeping"],
    ["Small manufacturers"],
    null,
    { firstDayLead: true, actsEvery: 7 },
  ],
  [
    "himig",
    "Himig Events",
    "HE",
    "Event planning",
    "Pasig City",
    "hospitality",
    "plans corporate events that need local food gifts.",
    ["Corporate events"],
    ["Local snacks"],
    null,
    { firstDayLead: true, actsEvery: 7 },
  ],
  [
    "gabay",
    "Gabay Trade Consultants",
    "GT",
    "Export consulting",
    "Makati City",
    "export",
    "helps food brands meet export requirements.",
    ["Export advice"],
    ["Food manufacturers"],
    null,
    { firstDayLead: false, actsEvery: 7 },
  ],
  [
    "kalye",
    "Kalye Food Carts",
    "KF2",
    "Food cart franchise",
    "Cainta, Rizal",
    "hospitality",
    "runs 40 food carts that need frozen ingredients.",
    ["Food carts"],
    ["Frozen foods"],
    null,
    { firstDayLead: true, actsEvery: 7 },
  ],
];
/** The chamber's network, Kalayaan Foods aside: the original Companies, then the European-style
 * members. */
export const POOL: Member[] = RAW.map(function (r) {
  return {
    id: r[0],
    name: r[1],
    ini: r[2],
    ind: r[3],
    city: r[4],
    cat: r[5],
    why: r[6],
    offer: r[7],
    seek: r[8],
    gives: [],
    wants: [],
    rival: false,
    pts: 0,
    website: websiteOf(r[0]),
    claimDay: r[9],
    activity: r[10],
  };
});
POOL.find(function (c) {
  return c.id === "north";
})!.silent = true;

export const CAT: Record<string, string> = {
  retail: "retail",
  packaging: "packaging",
  freight: "freight",
  food: "food",
  hospitality: "hospitality",
  export: "export",
  services: "services",
  logistics: "logistics",
  industrial: "industrial",
  tech: "technology",
  professional: "professional services",
  health: "health",
  fnb: "food and drink",
  property: "property",
};
/** Industry names for ComDash's interest by industry. */
export const INDUSTRY: Record<string, string> = {
  retail: "Retail and wholesale",
  packaging: "Packaging",
  freight: "Freight and storage",
  food: "Food and agriculture",
  hospitality: "Food service and hospitality",
  export: "Export",
  services: "Business services",
  logistics: "Logistics",
  industrial: "Industry and energy",
  tech: "Technology",
  professional: "Professional services",
  health: "Health",
  fnb: "Food and drink",
  property: "Property and facilities",
};
/** Words companies search with in the daily simulation. Some aren't on the example profile. */
export const SEARCH_TERMS = [
  "banana chips",
  "frozen lumpia",
  "polvoron",
  "ube spread",
  "Filipino snacks",
  "dried mango",
  "private label",
  "coconut chips",
];
/** What each "View as" option adds. Free is the MVP and hides nothing. */
export const PLAN_VIEWS: Record<PlanView, PlanViewRules> = {
  free: {
    label: "Free member",
    intentScore: false,
    otherChambers: false,
    names: "none",
    rowsShown: 6,
    termsShown: 5,
    namedAlerts: false,
    agent: null,
    reach: null,
    opened: "Showing the Free member view: names hidden.",
  },
  growth: {
    label: "Growth",
    intentScore: true,
    otherChambers: true,
    names: "own",
    rowsShown: null,
    termsShown: null,
    namedAlerts: true,
    agent: { left: 7, max: 10 },
    reach: "own chamber",
    opened: "Showing the Growth view: names and Intent Scores for your own chamber.",
  },
  pro: {
    label: "Pro",
    intentScore: true,
    otherChambers: true,
    names: "all",
    rowsShown: null,
    termsShown: null,
    namedAlerts: true,
    agent: { left: 31, max: 40 },
    reach: "all chambers",
    opened: "Showing the Pro view: every chamber.",
  },
};
/** Companies in other chambers, whose interest only the Pro demo view shows. */
type OtherCompany = [
  id: string,
  name: string,
  ini: string,
  ind: string,
  city: string,
  cat: string,
  chamber: string,
];
export const OTHER_CHAMBER_COMPANIES: Company[] = (
  [
    [
      "oc-bagwis",
      "Bagwis Grocers",
      "BG",
      "Grocery retail",
      "Quezon City",
      "retail",
      "PCCI–Quezon City",
    ],
    [
      "oc-handaan",
      "Handaan Catering Co.",
      "HC",
      "Catering",
      "Quezon City",
      "hospitality",
      "PCCI–Quezon City",
    ],
    [
      "oc-harbour",
      "Harbourfront Filipino Market",
      "HF",
      "Grocery retail",
      "Toronto, ON",
      "retail",
      "Toronto Region Board of Trade",
    ],
  ] satisfies OtherCompany[]
).map(function ([id, name, ini, ind, city, cat, chamber]): Company {
  return {
    id,
    name,
    ini,
    ind,
    city,
    cat,
    chamber,
    why: "",
    offer: [],
    seek: [],
    gives: [],
    wants: [],
    rival: false,
    pts: 0,
    website: websiteOf(id),
    // Claimed in its own chamber, which is outside this network's claim days.
    claimDay: 1,
  };
});
/** Profile updates that Connections post, one each, in the daily simulation. */
export const PROFILE_UPDATES: Record<string, string> = {
  pack: "Added compostable stand-up pouches to its products.",
  maple: "Opened a fourth store, in Marikina.",
  tala: "Now prints nutrition labels in Filipino and English.",
  lakbay: "Added two hotels in Tagaytay.",
  sari: "Started next-day delivery to sari-sari stores in Quezon City.",
  hapag: "Opened its 13th restaurant, in Makati.",
  palengke: "Added a frozen foods aisle.",
  luntian: "Now distributes to retailers in Rizal province.",
};
/* ---------- The fixed network: what each company gives and wants, and who is connected to whom ---------- */
export const TAG: Record<string, string> = {
  maple: "grocery|snacks frozen privatelabel",
  pack: "packaging|foodmfg snacks",
  north: "freight|foodmfg grocery",
  luntian: "distribution grocery|snacks organic",
  tala: "packaging labels|foodmfg",
  bayan: "storage freight|exporters frozen",
  sari: "grocery|snacks",
  hapag: "restaurants|frozen",
  kainan: "catering|frozen",
  malaya: "export|snacks",
  tibay: "pallets packaging|exporters",
  sinag: "energy|foodmfg",
  agos: "water|foodmfg",
  lakbay: "hotels|snacks",
  buhay: "grocery|snacks",
  tanim: "produce|foodmfg",
  hilaga: "ingredients|foodmfg",
  daloy: "freight|distribution",
  alon: "marketing|foodmfg",
  pandayan: "machinery|foodmfg",
  bukas: "canteen|snacks",
  bigas: "rice|grocery packaging",
  kapwa: "snacks|grocery packaging",
  lasa: "frozen|freight grocery",
  ginhawa: "ingredients|grocery",
  masagana: "dairy|freight grocery",
  sariwa: "produce|grocery freight",
  dagat: "seafood|freight restaurants",
  tamis: "sweets|grocery packaging",
  palengke: "grocery|snacks frozen",
  paaralan: "canteen|snacks",
  tindahan: "grocery|snacks",
  biyahe: "freight|foodmfg",
  kahon: "packaging|foodmfg",
  selyo: "compliance|foodmfg",
  sulit: "accounting|manufacturers",
  himig: "events|snacks",
  gabay: "exportadvice|foodmfg",
  kalye: "foodcarts|frozen",
};
/** Plain words for what Kalayaan Foods seeks and offers, by tag. A reason to meet a Company that
 * has not claimed is told from Kalayaan Foods' side, in these words. */
export const TRADE_WORDS: Record<string, string> = {
  grocery: "grocery retailers",
  freight: "freight",
  packaging: "packaging",
  snacks: "Filipino snacks",
  frozen: "frozen foods",
  privatelabel: "private-label manufacturing",
  foodmfg: "food manufacturing",
};
export const EDGES = (
  "maple-pack maple-tanim maple-sari maple-lakbay maple-kahon maple-palengke maple-north pack-tala pack-kahon pack-tibay pack-kapwa pack-tamis pack-lasa pack-bukas north-bayan north-daloy north-biyahe north-masagana north-dagat north-lasa " +
  "luntian-palengke luntian-sari luntian-tanim luntian-sariwa tala-selyo tala-kapwa tala-alon tala-tamis bayan-malaya bayan-dagat bayan-lasa sari-tindahan sari-kapwa sari-tamis sari-daloy hapag-kainan hapag-dagat hapag-lasa hapag-sariwa hapag-himig " +
  "kainan-himig kainan-kalye kainan-ginhawa malaya-tibay malaya-gabay malaya-hilaga malaya-kapwa tibay-kahon tibay-gabay sinag-agos sinag-pandayan sinag-masagana agos-pandayan agos-tanim lakbay-himig lakbay-ginhawa lakbay-hapag buhay-tindahan buhay-palengke buhay-selyo " +
  "tanim-bigas tanim-sariwa tanim-masagana hilaga-kapwa hilaga-tamis hilaga-ginhawa daloy-biyahe daloy-kahon alon-gabay alon-himig alon-palengke alon-sulit pandayan-kapwa pandayan-lasa pandayan-tamis bukas-paaralan bukas-kalye bukas-ginhawa bigas-palengke bigas-hapag selyo-gabay selyo-sulit selyo-masagana sulit-kalye sulit-tindahan sulit-paaralan paaralan-tamis " +
  EUROPEAN_EDGES
)
  .split(" ")
  .map(function (p) {
    return p.split("-") as [string, string];
  });
export const NEIGHBORS: Record<string, string[]> = {};
EDGES.forEach(function (p) {
  (NEIGHBORS[p[0]] = NEIGHBORS[p[0]] || []).push(p[1]);
  (NEIGHBORS[p[1]] = NEIGHBORS[p[1]] || []).push(p[0]);
});
export const RIVAL_PTS: Record<string, number> = {
  kapwa: 156,
  lasa: 142,
  luntian: 128,
  tamis: 104,
  tanim: 90,
  hilaga: 78,
  bigas: 72,
  masagana: 60,
  sariwa: 44,
  dagat: 28,
  ginhawa: 12,
};
POOL.forEach(function (c, i) {
  const p = TAG[c.id]!.split("|") as [string, string];
  c.gives = p[0].split(" ");
  c.wants = p[1].split(" ");
  c.rival = c.id in RIVAL_PTS;
  c.pts = c.rival ? RIVAL_PTS[c.id]! : Math.max(6, 120 - i * 4);
});
POOL.find(function (c) {
  return c.id === "kalye";
})!.ini = "KL";
// The European-style members join after the originals, so each original keeps its place and points.
EUROPEAN_MEMBERS.forEach(function (row) {
  POOL.push({ ...row, rival: false, website: websiteOf(row.id) });
});
export const METRO =
  /Quezon City|Pasig|Valenzuela|Marikina|Makati|Navotas|Caloocan|Taguig|San Juan|Manila|Pasay|Mandaluyong/;
export const STRONG_FIT = 80,
  MODERATE_FIT = 50;
/** Companies that opted out of contact by an AI Lead Agent. Whether one has claimed is a separate
 * fact, read with hasClaimed(). */
export const AGENT_STATUS: Record<string, string> = {
  kahon: "optout",
  buhay: "optout",
  alon: "optout",
};
export const TEAM_SPIKES = [
  { id: "tala", pts: 68 },
  { id: "lakbay", pts: 54 },
];
export const AGENT_STAGES: [string, number?][] = [
  ["Mandate set-up"],
  ["Discover"],
  ["Desk score"],
  ["Engage"],
  ["Qualify"],
  ["Gate A: confidential info", 1],
  ["Final score"],
  ["Gate B: meeting", 1],
  ["Book and hand off"],
  ["Outcome and learning"],
];
export const AGENT_CATS: [string, number][] = [
  ["Need and offer fit", 25],
  ["Capacity and commercial fit", 15],
  ["Proximity and logistics", 10],
  ["Credibility and trust", 15],
  ["Intent and timing", 15],
  ["Relationship and network", 10],
  ["Agent qualification", 10],
];
export const AGENT_TYPES: Record<string, AgentType> = {
  supplier: {
    label: "Supplier",
    need: "Recyclable packaging suppliers in Metro Manila",
    conf: "a target price of ₱6 to ₱9 per piece",
    confQ: "To check we’re in range, can you share a target price per piece?",
    q: "What are you packaging, and what volume do you expect?",
    backQ: "What are your usual lead times and minimum orders?",
    a: "Usually 2 to 3 weeks, with minimum orders from 5,000 pieces.",
  },
  vendor: {
    label: "Vendor",
    need: "Cold-chain freight for deliveries across Metro Manila",
    conf: "a monthly delivery budget of ₱80,000 to ₱120,000",
    confQ: "To size this, can you share a monthly budget?",
    q: "What are you moving, and how often?",
    backQ: "Which areas do you cover, and how often?",
    a: "We cover Metro Manila on weekly routes.",
  },
  customer: {
    label: "Customer",
    need: "Grocery retailers for our banana chips and frozen lumpia",
    conf: "a monthly supply capacity of about 40,000 packs",
    confQ: "What monthly volume could you supply?",
    q: "What products are you offering?",
    backQ: "How do you bring on new suppliers?",
    a: "We review new suppliers each month and are adding local lines this quarter.",
  },
  partner: {
    label: "Partner",
    need: "An export partner with advice for Canada",
    conf: "an export target of 5,000 cases a year",
    confQ: "What export volume are you targeting?",
    q: "What kind of partnership are you looking for?",
    backQ: "What would a partnership need to look like for you?",
    a: "We would consider a referral arrangement. Commercial terms are for the principals to discuss.",
  },
};

/** The deals other Companies in the chamber confirm, each on its day, with the Testimonial the
 * first Company posted that day. The Success Wall, profiles and the Team Dashboard all read this list, so
 * adding a deal or a win is one row here. Kalayaan Foods' own deals come from its story. */
export const CHAMBER_DEALS: Deal[] = [
  {
    a: "regalia",
    b: "vinoteca",
    day: 9,
    testimonial: {
      need: "We needed a European wine supplier for our restaurant and events.",
      got: "A reply on the Asks board turned into a twelve-month supply agreement.",
    },
  },
  { a: "azurbay", b: "maisonblanc", day: 12 },
  {
    a: "maple",
    b: "tanim",
    day: 15,
    testimonial: {
      need: "We needed a steady banana chip supplier for our Quezon City stores.",
      got: "We met through a day-one match and placed a first order within two weeks.",
    },
  },
  {
    a: "bukas",
    b: "pack",
    day: 19,
    testimonial: {
      need: "We needed single-serve packaging for 30 office counters.",
      got: "A reply on the Asks board turned into a six-month supply agreement.",
    },
  },
  {
    a: "malaya",
    b: "tibay",
    day: 25,
    testimonial: {
      need: "We needed export-grade pallets on short notice.",
      got: "Our community manager made the introduction, and the shipment left on time.",
    },
  },
];
export const REPLIES = [
  "Thanks for the note. Can you send your product list and minimum order quantities?",
  "That works for us. Shall we meet on Thursday at our office?",
  "Good to meet your team. We would like to start with a trial order this month.",
  "Confirmed on our side. Looking forward to working with your company.",
];
export const TEMPLATES: Record<string, (c: Company, me: MyCompany) => string> = {
  Introduction: function (c: Company, me: MyCompany) {
    return (
      "Hello " +
      c.name +
      " team,\n\nI represent " +
      me.name +
      ". We would like to introduce our company and explore working together.\n\nWould you be open to a short call?"
    );
  },
  "Quote request": function (c: Company, me: MyCompany) {
    return (
      "Hello " +
      c.name +
      " team,\n\n" +
      me.name +
      " would like a quote for your services. Please share your pricing and lead times.\n\nThank you."
    );
  },
  Partnership: function (c: Company, me: MyCompany) {
    return (
      "Hello " +
      c.name +
      " team,\n\n" +
      me.name +
      " sees a good fit between our companies and would like to discuss a partnership.\n\nWhen would be a good time to talk?"
    );
  },
};
export const RULES: Record<RuleKey, Rule> = {
  list: { pts: 2, label: "Acted on the daily lead list", limit: "once a day" },
  profile: { pts: 5, label: "Updated the profile", limit: "twice a week" },
  reply: { pts: 3, label: "Replied within 24 hours", limit: "5 a day" },
  ask: { pts: 5, label: "Posted or answered an ask", limit: "3 a day" },
  conn: { pts: 5, label: "Connection accepted", limit: "10 a day" },
  meet: { pts: 10, label: "Meeting confirmed by both", limit: "2 a week with the same company" },
  deal: { pts: 25, label: "Deal confirmed by both", limit: "2 a month with the same company" },
  testimonial: { pts: 15, label: "Testimonial posted", limit: "one per deal" },
  invite: { pts: 10, label: "Invited company claimed", limit: "no limit" },
};
export const TAGS: Record<string, string> = {
  claim: "A2 · A3",
  matches: "L1",
  dash: "L2 · D3 · A4 · D4 · S2",
  leads: "D2",
  mail: "C2 · C3 · C4",
  asks: "L3",
  wins: "S1 · S2 · S3 · D5",
  company: "A4 · A5 · C1 · C3",
  search: "L2 · Section 4",
  digest: "D1",
  chamber: "A1 · Section 3.6 · L4",
  "whats-next": "Section 6",
  notifications: "C1 · L2",
  engine: "Simulated engine",
  agent: "AI Lead Agent preview, after the MVP",
  team: "ComLinked team preview, after the MVP",
};
export const ABOUT_DEFAULT =
  "Family-run maker of banana chips, ube spreads and frozen lumpia, with private-label manufacturing for retailers.";
export const ABOUT_POLISHED =
  "Family-run Filipino food manufacturer of banana chips, ube spreads and frozen lumpia, with private-label production for retailers.";
export const SHARE_LINK = "comlinked.example/join";
export const NEXT_UP: [string, string, string][] = [
  [
    "AI Lead Agent",
    "Finds and qualifies leads, talks to other companies’ agents and books meetings.",
    "Phase 2",
  ],
  [
    "Native iOS and Android apps",
    "Dedicated apps once the mobile web app has proven itself.",
    "Phase 2",
  ],
  ["Badges and rewards", "Recognition beyond the monthly top companies list.", "Phase 2"],
  [
    "Deal and referral pipeline",
    "Track deals and referrals beyond the outcome buttons.",
    "Phase 2",
  ],
  [
    "Private browsing and multi-company accounts",
    "View profiles privately, and manage more than one company.",
    "Phase 2",
  ],
  ["Chamber reports", "Results reports, at-risk alerts and chamber branding.", "Later"],
  ["French and other languages", "More languages as ComLinked reaches new regions.", "When needed"],
  ["SMS digest", "The morning digest by text message.", "When needed"],
  ["Events and member posts", "Event listings, a news feed and member posts.", "If chambers ask"],
];
export const APP = Object.keys(TAGS);
export const TOTAL = Object.keys(RIVAL_PTS).length + 1,
  NETWORK = POOL.length + 1,
  AI_LIMIT = 30,
  FULL_BOOST_AT = 200,
  MAX_BOOST = 0.3,
  NEW_BOOST = 0.1;
