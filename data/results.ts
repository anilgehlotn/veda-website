/*
  Veda results. The Results section on the home page is drawn entirely from this file.

  To add a real result, copy one entry in RESULTS and change its values (see the
  field notes below). To launch before any results exist, make RESULTS an empty
  array: the section and its "Results" nav link disappear.

  Everything below is PLACEHOLDER content in [square brackets]. Replace it with real,
  checked results only, and set consentToShow to true only when the student (and a
  parent, for minors) has agreed in writing to be named and pictured.
*/

export type Exam = "10th Board" | "12th Board" | "NEET" | "JEE" | "KCET";

export const EXAMS: Exam[] = ["10th Board", "12th Board", "NEET", "JEE", "KCET"];

export type Result = {
  /** Unique and stable, e.g. "2026-neet-aarav". Used as the React key. */
  id: string;
  studentName: string;
  /** Path under /public, e.g. "/results/aarav.jpg" (square, at least 480 x 480). */
  photo?: string;
  /** Only when true are the name and photo shown. Otherwise: "A Veda student". */
  consentToShow: boolean;
  exam: Exam;
  /** The year of the exam, e.g. "2026". */
  year: string;
  /** Shown large, exactly as written: "96.4%", "AIR 1,284", "Rank 312". */
  score: string;
  /** Optional: "Science, PCMB", "Maths 100". */
  subjects?: string;
  /** Optional, at most about 30 words (three lines). */
  quote?: string;
  quoteBy?: "student" | "parent";
  /** The one result shown large at the top. If none is marked, the first entry is. */
  featured?: boolean;
};

export type Highlight = {
  /** Shown large in the accent colour, exactly as written: "[Number]", "[Rank]". */
  figure: string;
  /** One short line under the figure. */
  label: string;
};

export const RESULTS: Result[] = [
  {
    id: "placeholder-neet-1",
    studentName: "[Student name]",
    consentToShow: true,
    exam: "NEET",
    year: "[Year]",
    score: "[Rank]",
    subjects: "[Subjects]",
    quote: "[A short quote from the student about preparing at Veda, at most three lines.]",
    quoteBy: "student",
    featured: true,
  },
  {
    id: "placeholder-10th-1",
    studentName: "[Student name]",
    consentToShow: true,
    exam: "10th Board",
    year: "[Year]",
    score: "[Percentage]",
    subjects: "[Subjects]",
    quote: "[A short quote from a parent.]",
    quoteBy: "parent",
  },
  {
    id: "placeholder-12th-1",
    studentName: "[Student name]",
    consentToShow: true,
    exam: "12th Board",
    year: "[Year]",
    score: "[Percentage]",
    subjects: "[Stream]",
  },
  {
    id: "placeholder-jee-1",
    studentName: "[Student name]",
    consentToShow: true,
    exam: "JEE",
    year: "[Year]",
    score: "[Rank]",
    quote: "[A short quote from the student.]",
    quoteBy: "student",
  },
  {
    id: "placeholder-10th-2",
    studentName: "[Student name]",
    consentToShow: false,
    exam: "10th Board",
    year: "[Year]",
    score: "[Percentage]",
  },
  {
    id: "placeholder-12th-2",
    studentName: "[Student name]",
    consentToShow: true,
    exam: "12th Board",
    year: "[Year]",
    score: "[Percentage]",
    subjects: "[Stream]",
  },
];

export const HIGHLIGHTS: Highlight[] = [
  { figure: "[Number]", label: "students scored above 90% in 10th Board, [Year]" },
  { figure: "[Number]", label: "students qualified NEET, [Year]" },
  { figure: "[Rank]", label: "best JEE rank from Veda, [Year]" },
];

/** The years in the data, newest first (numeric years sort numerically). */
export function resultYears(results: Result[] = RESULTS): string[] {
  return [...new Set(results.map((r) => r.year))].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
}

export const HAS_RESULTS = RESULTS.length > 0;
