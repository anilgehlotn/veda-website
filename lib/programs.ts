// Program content. Anything in [square brackets] is a placeholder for Veda to fill in.

export type ProgramDetail = { label: string; value: string };

export type SchoolProgram = {
  id: string;
  grade: string;
  title: string;
  stream: string;
  focus: string;
  subjects: string;
};

export const PROGRAM_DETAILS: ProgramDetail[] = [
  { label: "Board", value: "[CBSE / State board]" },
  { label: "Batch timings", value: "[Batch timings]" },
  { label: "Duration", value: "[Duration]" },
  { label: "Fees", value: "[Fee]" },
];

export const SCHOOL_PROGRAMS: SchoolProgram[] = [
  {
    id: "grade-8",
    grade: "8",
    title: "8th Standard",
    stream: "Board syllabus",
    focus: "Building strong basics before the board years.",
    subjects: "Maths and Science, plus [other subjects, if any]",
  },
  {
    id: "grade-9",
    grade: "9",
    title: "9th Standard",
    stream: "Board syllabus",
    focus: "Covering the full syllabus and preparing the ground for 10th.",
    subjects: "Maths and Science, plus [other subjects, if any]",
  },
  {
    id: "grade-10",
    grade: "10",
    title: "10th Standard",
    stream: "Board exam year",
    focus: "Board exam preparation, with past papers and revision.",
    subjects: "Maths and Science, plus [other subjects, if any]",
  },
  {
    id: "grade-11",
    grade: "11",
    title: "11th Standard",
    stream: "PCM or PCB",
    focus: "Strong concepts for the boards, and the base for competitive exams.",
    subjects: "Physics, Chemistry, Maths, Biology",
  },
  {
    id: "grade-12",
    grade: "12",
    title: "12th Standard",
    stream: "PCM or PCB",
    focus: "Board exam preparation alongside competitive exam readiness.",
    subjects: "Physics, Chemistry, Maths, Biology",
  },
];

export const EXAMS = [
  { name: "JEE", purpose: "For engineering", subjects: "Physics, Chemistry, Maths" },
  { name: "NEET", purpose: "For medical", subjects: "Physics, Chemistry, Biology" },
  { name: "KCET", purpose: "Karnataka CET", subjects: "Physics, Chemistry, Maths or Biology" },
];

export const WEEKLY_LOOP = [
  { title: "The weekly test", body: "Every student writes a test each week." },
  { title: "AI checks it", body: "AI evaluates each student's test." },
  { title: "Weak topics found", body: "It shows the topics each student is weak in." },
  { title: "Teachers focus on them", body: "Next week's classes focus on those topics." },
];
