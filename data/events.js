// Event data, written in our own words from HOSA's official 2026-2027 guidelines.
// Topic weights come straight from each event's official test plan.
// Resource "note" fields describe access, never content we haven't verified.

const ROUNDING_RULES = [
  "Round only the final answer, after every calculation step is done.",
  "When rounding, look at the digit just to the right: 5 or more rounds up, 4 or less stays.",
  "Unless a question says otherwise, round to the nearest whole number.",
  "Pediatric doses are always rounded down, to avoid an overdose.",
  "Write a zero before any decimal less than 1 (0.5, not .5).",
  "Never add a decimal point and zero after a whole number (5, not 5.0).",
];

export const events = [
  {
    slug: "medical-law-and-ethics",
    name: "Medical Law & Ethics",
    category: "Health Science",
    summary:
      "A written test on U.S. medical law, professional ethics, and bioethics, from patient consent to end-of-life decisions.",
    format: { type: "Written test", questions: 50, minutes: 60, team: "Solo" },
    tiebreaker: "An essay question, written on the back of the answer sheet. It is only judged if there is a tie.",
    calculator: null,
    newThisYear: null,
    rules: [],
    topics: [
      { name: "The basics", weight: 5, subtopics: ["Medical law, ethics, and bioethics"] },
      {
        name: "The legal environment",
        weight: 35,
        subtopics: [
          "State and federal regulations",
          "Consent",
          "The legal system",
          "Professional liability",
          "Law for health professionals",
          "Public duty",
        ],
      },
      {
        name: "The health care environment",
        weight: 35,
        subtopics: [
          "Physician-patient relationships",
          "Medical malpractice",
          "Medical records",
          "Workplace law and ethics",
          "Cultural perspective",
          "Patient confidentiality",
          "Employment practices",
        ],
      },
      {
        name: "Bioethical issues",
        weight: 25,
        subtopics: [
          "Ethical and bioethical issues in medicine",
          "Allocation of scarce resources",
          "Genetic engineering",
          "Reproductive issues",
          "End-of-life issues",
        ],
      },
    ],
    resources: [
      { title: "Medical Law, Ethics, & Bioethics for the Health Professions", author: "Carol D. Tamparo", publisher: "F.A. Davis" },
      { title: "Healthcare Law and Ethics", author: "Bonnie Fremgen", publisher: "Pearson" },
      { title: "Medical Law & Professional Ethics", author: "Lois Ritter and Donald Graham", publisher: "Goodheart-Willcox" },
    ],
    sourceUrl: "https://hosa.org/wp-content/uploads/2026/08/MLE-26-27.pdf",
    lastChecked: "2026-10-09",
  },

  {
    slug: "medical-math",
    name: "Medical Math",
    category: "Health Science",
    summary:
      "A calculation test on the math health professionals use every day: conversions, drug dosages, IV solutions, dilutions, and reading medical data.",
    format: { type: "Written test, grid-in answers", questions: 50, minutes: 90, team: "Solo" },
    tiebreaker: "An essay question, written in the space provided in the test booklet. It is only judged if there is a tie.",
    calculator: "A basic handheld calculator is provided (add, subtract, multiply, divide, square root). Personal calculators are not allowed.",
    newThisYear:
      "Math for Health Care Professionals was retired as a reference, Pharmacy Calculations was added, and the tiebreaker is now an essay.",
    rules: [
      ...ROUNDING_RULES,
      "At least half of the calculation problems involve conversions.",
      "HOSA's conversion summary sheet is the official reference, but you can't bring it or any conversion chart into the test. Memorize it.",
      "Questions use standard medical abbreviations from the DHO: Health Science textbook.",
      "Answers are gridded on the answer sheet, with the last digit in the far-right box. Only a slash (/) and a period (.) can be used besides numbers.",
    ],
    topics: [
      { name: "Mathematical essentials", weight: 5, subtopics: [] },
      { name: "Measurement and conversion problems", weight: 20, subtopics: [] },
      { name: "Drug dosages and intravenous solutions", weight: 35, subtopics: [] },
      { name: "Dilutions, solutions, and concentrations", weight: 25, subtopics: [] },
      {
        name: "Interpreting medical information",
        weight: 15,
        subtopics: ["Charts, graphs, and tables", "Basic statistics: mean, median, and mode"],
      },
    ],
    resources: [
      { title: "DHO: Health Science", author: "Simmers, Simmers-Nartker, Simmers-Kobelak, and Morris", publisher: "Cengage Learning" },
      { title: "Dosage Calculations Made Easy", author: "Gloria P. Craig", publisher: "Wolters Kluwer" },
      {
        title: "Pharmacy Calculations: An Introduction for Pharmacy Technicians",
        author: "Rewald, Lorang, and Schramm",
        publisher: "ASHP",
        note: "New this year. HOSA's guidelines include a student discount code for this book.",
      },
    ],
    sourceUrl: "https://hosa.org/wp-content/uploads/2026/09/MM-26-27-Sept-06.pdf",
    lastChecked: "2026-10-09",
  },

  {
    slug: "medical-terminology",
    name: "Medical Terminology",
    category: "Health Science",
    summary:
      "A written test on the building blocks of medical language (roots, prefixes, suffixes, and combining forms) and the terms for each body system.",
    format: { type: "Written test", questions: 50, minutes: 60, team: "Solo" },
    tiebreaker:
      "Ten fill-in-the-blank questions (two sets of five) taken with the test. Spelling must be exactly right. Sets of five are judged one at a time until the tie is broken.",
    calculator: null,
    newThisYear: "Tiebreakers were cut to ten questions.",
    rules: ["Tiebreaker answers only count if they are spelled correctly, so practice spelling terms, not just recognizing them."],
    topics: [
      {
        name: "Roots, prefixes, suffixes, and combining forms",
        weight: 45,
        subtopics: ["Word roots", "Prefixes", "Suffixes", "Combining forms"],
      },
      { name: "Overview of the body", weight: 5, subtopics: [] },
      { name: "Skeletal system", weight: 5, subtopics: [] },
      { name: "Muscular system", weight: 5, subtopics: [] },
      { name: "Respiratory system", weight: 5, subtopics: [] },
      { name: "Digestive system", weight: 5, subtopics: [] },
      { name: "Cardiovascular and lymphatic systems", weight: 5, subtopics: [] },
      { name: "Nervous system and special senses", weight: 5, subtopics: [] },
      { name: "Endocrine system", weight: 5, subtopics: [] },
      { name: "Reproductive system", weight: 5, subtopics: [] },
      { name: "Integumentary system", weight: 5, subtopics: [] },
      { name: "Urinary system", weight: 5, subtopics: [] },
    ],
    resources: [
      { title: "Medical Terminology for Health Professions", author: "Ann Ehrlich", publisher: "Cengage Learning" },
      { title: "Taber's Cyclopedic Medical Dictionary", author: "Edited by Donald Venes and Clayton L. Thomas", publisher: "F.A. Davis" },
      { title: "Introduction to Medical Terminology", author: "Stanhope and Turnbull", publisher: "Goodheart-Willcox" },
      {
        title: "Dean Vaughn's Medical Terminology by Body Systems",
        author: "Dean Vaughn",
        publisher: "Peterson's Publishing",
        note: "An online course rather than a printed book.",
      },
    ],
    sourceUrl: "https://hosa.org/wp-content/uploads/2026/08/MT-26-27.pdf",
    lastChecked: "2026-10-09",
  },

  {
    slug: "pathophysiology",
    name: "Pathophysiology",
    category: "Health Science",
    summary:
      "A written test on how diseases develop and affect the body, covering the disease process and conditions in each body system, including mental disorders.",
    format: { type: "Written test", questions: 50, minutes: 60, team: "Solo" },
    tiebreaker: "An essay question, written on the back of the answer sheet. It is only judged if there is a tie.",
    calculator: null,
    newThisYear: null,
    rules: [],
    topics: [
      { name: "Disease process and terminology", weight: 12, subtopics: ["Including cancer and neoplasms"] },
      { name: "Integumentary system", weight: 8, subtopics: [] },
      { name: "Musculoskeletal system", weight: 10, subtopics: [] },
      { name: "Circulatory and lymphatic systems", weight: 12, subtopics: [] },
      { name: "Respiratory system", weight: 8, subtopics: [] },
      { name: "Digestive system", weight: 12, subtopics: [] },
      { name: "Endocrine system", weight: 8, subtopics: [] },
      { name: "Nervous system and senses", weight: 10, subtopics: [] },
      { name: "Reproductive system", weight: 6, subtopics: [] },
      { name: "Urinary system", weight: 6, subtopics: [] },
      { name: "Mental disorders", weight: 8, subtopics: [] },
    ],
    resources: [
      {
        title: "iCEV Pathophysiology and Anatomy & Physiology courses",
        author: "iCEV",
        publisher: "Online courses",
        note: "Paid online courses. HOSA's guidelines link a special page for competitors with pricing.",
      },
      { title: "Essentials of Human Diseases and Conditions", author: "Frazier", publisher: "Elsevier" },
      { title: "Human Diseases: A Systemic Approach", author: "Zelman, Raymond, Holdaway, Dafnis, and Mulvihill", publisher: "Pearson" },
    ],
    sourceUrl: "https://hosa.org/wp-content/uploads/2026/08/Patho-26-27-FINAL-1.pdf",
    lastChecked: "2026-10-09",
  },

  {
    slug: "pharmacology",
    name: "Pharmacology",
    category: "Health Science",
    summary:
      "A written test on how drugs work: names and classes, actions and interactions, how they're given, dosage math, and adjusting for children and older adults.",
    format: { type: "Written test", questions: 50, minutes: 60, team: "Solo" },
    tiebreaker: "An essay question, written on the back of the answer sheet. It is only judged if there is a tie.",
    calculator: "A basic handheld calculator is provided (add, subtract, multiply, divide, square root). Personal calculators are not allowed.",
    newThisYear: null,
    rules: [...ROUNDING_RULES, "Safety questions can appear in any topic area, not just one."],
    topics: [
      { name: "Basic concepts in pharmacology", weight: 15, subtopics: [] },
      { name: "Ethical and legal responsibilities", weight: 10, subtopics: [] },
      { name: "Pediatric and geriatric adaptations", weight: 10, subtopics: [] },
      {
        name: "Drug names, classifications, actions, and interactions",
        weight: 30,
        subtopics: ["Drug names", "Classifications", "Actions", "Interactions"],
      },
      { name: "Drug administration", weight: 20, subtopics: [] },
      {
        name: "Drug measurement, dosage, and conversions",
        weight: 10,
        subtopics: ["Measurement", "Dosage", "Conversions"],
      },
      { name: "Technologies in pharmacology", weight: 5, subtopics: [] },
    ],
    resources: [
      { title: "The Pharmacy Technician: A Comprehensive Approach", author: "Jahangir Moini", publisher: "Cengage Learning" },
      { title: "Introductory Clinical Pharmacology", author: "Susan Ford and Sally Roach", publisher: "Wolters Kluwer" },
      {
        title: "Dean Vaughn's Pharmacology by Body System",
        author: "Dean Vaughn",
        publisher: "Online course",
        note: "An online course with a special page for HOSA competitors, linked in the official guidelines.",
      },
    ],
    sourceUrl: "https://hosa.org/wp-content/uploads/2026/08/Pharm-26-27.pdf",
    lastChecked: "2026-10-09",
  },
];

// Same for every written test above, per the 2026-2027 guidelines.
export const testDay = {
  bring: [
    "Photo ID",
    "Two #2 pencils (not mechanical) with erasers",
    "Foam earplugs if you want them (not earbuds)",
  ],
  dress: "Business attire or the official HOSA uniform. Proper dress earns bonus points.",
  timing: "At ILC there are no time-remaining announcements, so you track your own time. States may run things differently.",
};

export const categories = [
  "Health Science",
  "Health Professions",
  "Emergency Preparedness",
  "Leadership",
  "Teamwork",
  "Recognition",
];

export function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Give every topic a URL slug.
for (const e of events) {
  for (const t of e.topics) t.slug = slugify(t.name);
  const total = e.topics.reduce((s, t) => s + t.weight, 0);
  if (total !== 100) throw new Error(`${e.name}: topic weights add to ${total}, not 100`);
}

events.sort((a, b) => a.name.localeCompare(b.name));

export function getEvent(slug) {
  return events.find((e) => e.slug === slug);
}

export function getTopic(event, topicSlug) {
  return event?.topics.find((t) => t.slug === topicSlug);
}

export function paceText(format) {
  const sec = Math.round((format.minutes * 60) / format.questions);
  if (sec < 60) return `About ${sec} seconds per question`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `About ${m} min ${s} sec per question` : `About ${m} min per question`;
}
