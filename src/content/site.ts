/**
 * BASE Overclocked: single source of truth for site content.
 *
 * Update facts here, not in components. Anything marked TODO is intentionally
 * empty: the site hides or disables the related UI until a real value exists,
 * so nothing fake is ever shown.
 */

export const site = {
  /** Short brand name used in the wordmark and design. */
  name: "Overclocked",
  /** Official team name; use whenever formally identifying the team. */
  legalName: "BASE Overclocked",
  school: "Beaverton Academy of Science & Engineering",
  schoolShort: "BASE",
  domain: "overclockedscioly.org",
  url: "https://overclockedscioly.org",
  division: "Division C",
  location: "Beaverton, Oregon",
  established: 2025,
  season: "2026–27",
  title: "BASE Overclocked | Science Olympiad",
  description:
    "BASE Overclocked is the Science Olympiad team at Beaverton Academy of Science & Engineering (BASE) in Beaverton, Oregon.",
  /** Other names people search for; used in structured data, not hidden copy. */
  alternateNames: ["Overclocked", "Overclocked Science Olympiad", "BASE Science Olympiad", "BASE Science Olympiad team"],
};

/** Section anchors used by the header, the divider-tab index, and the footer. */
export const navigation = [
  { id: "about", label: "About" },
  { id: "results", label: "Results" },
  { id: "events", label: "Events" },
  { id: "support", label: "Support" },
] as const;

/** Tabs in the sticky divider index (a superset of the header links). */
export const dividerTabs = [
  { id: "about", label: "About" },
  { id: "results", label: "Results" },
  { id: "events", label: "Events" },
  { id: "team", label: "Team" },
  { id: "support", label: "Support" },
  { id: "matching", label: "Matching" },
  { id: "contact", label: "Contact" },
] as const;

export const snapshot = [
  { value: "6", suffix: "th", label: "Oregon State 2026", note: "Overall placement" },
  { value: "4", suffix: "", label: "State medals", note: "2026 Oregon State" },
  { value: "23", suffix: "", label: "Science Olympiad events", note: "Division C" },
  { value: "15", suffix: "", label: "Competitors", note: "Full team roster" },
] as const;

export type Placement = {
  place: 1 | 2 | 3 | 4 | 5 | 6;
  event: string;
  category: string;
};

export const results = {
  tournament: "2026 Oregon State",
  overall: 6,
  placements: [
    { place: 2, event: "Bungee Drop", category: "Engineering" },
    { place: 2, event: "Helicopter", category: "Engineering" },
    { place: 3, event: "Boomilever", category: "Engineering" },
    { place: 3, event: "Robot Tour", category: "Engineering" },
  ] satisfies Placement[],
};

/**
 * Event categories. `events` lists individual event names shown under each
 * category; leave empty until the current season's list is confirmed.
 */
export const eventCategories: { name: string; description: string; note?: string; events: string[] }[] = [
  {
    name: "Engineering",
    description: "Devices built, tuned, and tested against the clock: towers, vehicles, flyers, and drop systems.",
    note: "4 state medals · 2026 Oregon State",
    events: [] as string[], // TODO: add current-season event names
  },
  {
    name: "Life Science",
    description: "Anatomy, genetics, ecology, and disease: written exams and lab stations on living systems.",
    events: [] as string[],
  },
  {
    name: "Physical Science",
    description: "Chemistry, physics, and materials, tested on paper and at the lab bench.",
    events: [] as string[],
  },
  {
    name: "Earth & Space Science",
    description: "Geology, astronomy, and planetary systems, read from real data, maps, and samples.",
    events: [] as string[],
  },
  {
    name: "Inquiry & Research",
    description: "Experimental design, cryptography, and technical communication under time pressure.",
    events: [] as string[],
  },
  {
    name: "Technology",
    description: "Circuits, code, and computer-aided design, from schematic to working build.",
    events: [] as string[],
  },
];

export const support = {
  suggestedDonation: 250,
  fiscalSponsor: "The Hack Foundation",
  donateUrl: "https://hcb.hackclub.com/donations/start/base-overclocked-science-olympiad-team",
  /** Search terms donors use in employer matching portals. */
  matchingSearchNames: ["The Hack Foundation", "BASE Overclocked"],
  uses: [
    "Tournament registration",
    "Engineering materials",
    "Laboratory supplies",
    "Team equipment",
    "Competition expenses",
  ],
};

export type Sponsor = { name: string; logo?: string; url?: string };

/** TODO: add real supporters only. Logos go in /public/sponsors/. */
export const sponsors: Sponsor[] = [];

export type Member = { name: string; role?: string; events?: string[]; photo?: string };

/** TODO: add members only with their permission. Photos go in /public/team/. */
export const members: Member[] = [];

/** Photography slots. Set a path under /public to replace the drawn cover. */
export const photos = {
  hero: "" as string, // TODO: e.g. "/photos/team-2026.jpg"
  heroAlt: "" as string,
  team: "" as string, // TODO: e.g. "/photos/team-bench.jpg"
  teamAlt: "" as string,
};

/** Empty values are hidden everywhere. */
export const contact = {
  email: "team@overclockedscioly.org",
};

export const social: { label: string; href: string }[] = [
  // TODO: e.g. { label: "Instagram", href: "https://instagram.com/..." }
];
