/*
  Veda results. The Results section on the home page is drawn entirely from this file.

  The numbers, names, colleges and courses below are exactly as supplied by Veda. Do not
  round or reformat them: `value` is shown as written.

  Photos live in public/results/ (see the README there). Replacing a file with the same
  name updates the site; no code change is needed.

  To add a result, copy one entry and change every field. Only entries with
  consentToShow set to true are shown. If no entries are shown, the section and its
  "Results" nav link disappear.
*/

export type Exam = "NEET" | "JEE Advanced" | "JEE Main" | "KCET" | "PESSAT";
export type ResultType = "score" | "air" | "percentile" | "rank";
export type Stream = "engineering" | "medical";

export type Result = {
  name: string;
  /** Lower-case, hyphenated; also the photo's file name. */
  slug: string;
  exam: Exam;
  resultType: ResultType;
  /** Shown exactly as written, e.g. "642", "677", "99.5", "2468". */
  value: string;
  /** Only for scores, e.g. 720 for NEET. */
  outOf?: number;
  college: string;
  course: string;
  /** Path under /public, e.g. "/results/eshanya.jpg". */
  photo: string;
  /** Only shown when true (written consent from the student and a parent). */
  consentToShow: boolean;
  year: string;
  /** Shown as a large card at the top of its tab. */
  featured?: boolean;
};

const YEAR = "[Year]";

const ALL_RESULTS: Result[] = [
  // Medical
  {
    name: "Eshanya",
    slug: "eshanya",
    exam: "NEET",
    resultType: "score",
    value: "642",
    outOf: 720,
    college: "MS Ramaiah",
    course: "MBBS",
    photo: "/results/eshanya.jpg",
    consentToShow: true,
    year: YEAR,
    featured: true,
  },
  {
    name: "Manjunath",
    slug: "manjunath",
    exam: "NEET",
    resultType: "score",
    value: "630",
    outOf: 720,
    college: "Chamarajanagar Institute of Medical Science",
    course: "MBBS",
    photo: "/results/manjunath.jpg",
    consentToShow: true,
    year: YEAR,
  },
  {
    name: "Akhil Sai",
    slug: "akhil-sai",
    exam: "NEET",
    resultType: "score",
    value: "602",
    outOf: 720,
    college: "Haveri Institute of Medical Science",
    course: "MBBS",
    photo: "/results/akhil-sai.jpg",
    consentToShow: true,
    year: YEAR,
  },
  // Engineering
  {
    name: "Olive",
    slug: "olive",
    exam: "JEE Advanced",
    resultType: "air",
    value: "677",
    college: "IIT Madras",
    course: "Engineering Physics",
    photo: "/results/olive.jpg",
    consentToShow: true,
    year: YEAR,
    featured: true,
  },
  {
    name: "Adithya V.S",
    slug: "adithya-vs",
    exam: "JEE Advanced",
    resultType: "air",
    value: "742",
    college: "IIT Kanpur",
    course: "Computer Science",
    photo: "/results/adithya-vs.jpg",
    consentToShow: true,
    year: YEAR,
    featured: true,
  },
  {
    name: "Aanchal",
    slug: "aanchal",
    exam: "JEE Main",
    resultType: "percentile",
    value: "99.5",
    college: "NIT Jamshedpur",
    course: "Electronics",
    photo: "/results/aanchal.jpg",
    consentToShow: true,
    year: YEAR,
  },
  {
    name: "Siya",
    slug: "siya",
    exam: "KCET",
    resultType: "rank",
    value: "338",
    college: "RVCE",
    course: "Computer Science",
    photo: "/results/siya.jpg",
    consentToShow: true,
    year: YEAR,
  },
  {
    name: "Rishit",
    slug: "rishit",
    exam: "PESSAT",
    resultType: "air",
    value: "140",
    college: "PES University",
    course: "Computer Science",
    photo: "/results/rishit.jpg",
    consentToShow: true,
    year: YEAR,
  },
  {
    name: "Vishal",
    slug: "vishal",
    exam: "KCET",
    resultType: "rank",
    value: "2468",
    college: "BMS College of Engineering",
    course: "Computer Science",
    photo: "/results/vishal.jpg",
    consentToShow: true,
    year: YEAR,
  },
];

/** Only results the student agreed to show. */
export const RESULTS: Result[] = ALL_RESULTS.filter((r) => r.consentToShow);

export const streamOf = (r: Result): Stream => (r.exam === "NEET" ? "medical" : "engineering");

/** Three true facts from the data above, shown large at the top of the section. */
export const HIGHLIGHTS: { title: string; detail: string }[] = [
  { title: "IIT Madras and IIT Kanpur", detail: "JEE Advanced, AIR 677 and AIR 742" },
  { title: "3 students in MBBS", detail: "NEET scores of 642, 630 and 602 out of 720" },
  { title: "99.5 percentile in JEE Main", detail: "Aanchal, NIT Jamshedpur" },
];

export const RESULTS_YEAR = YEAR;

/**
 * The order of the cards in the Results carousel (by slug). Results not listed here
 * appear after these, in the order of the list above.
 */
export const DISPLAY_ORDER = [
  "olive",
  "adithya-vs",
  "eshanya",
  "aanchal",
  "manjunath",
  "siya",
  "rishit",
  "akhil-sai",
  "vishal",
];

/** RESULTS in display order. */
export const RESULTS_IN_ORDER: Result[] = [...RESULTS].sort((a, b) => {
  const rank = (r: Result) => {
    const i = DISPLAY_ORDER.indexOf(r.slug);
    return i === -1 ? DISPLAY_ORDER.length + RESULTS.indexOf(r) : i;
  };
  return rank(a) - rank(b);
});

export const HAS_RESULTS = RESULTS.length > 0;
