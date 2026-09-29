/*
  Parents' questions. The FAQ section on the home page and its search-engine data
  (FAQPage JSON-LD) are both built from this file.

  Answers in [square brackets] are placeholders. While an answer still contains a
  [placeholder], it shows on the page as written but is left out of the JSON-LD, so
  search engines never see an unfinished answer. Keep answers to about three short
  sentences, in plain language.
*/

export type Faq = {
  /** Unique and stable, used for ids and links. */
  id: string;
  question: string;
  answer: string;
};

export type FaqTopic = {
  id: string;
  title: string;
  questions: Faq[];
};

export const FAQ_TOPICS: FaqTopic[] = [
  {
    id: "classes",
    title: "Classes and batches",
    questions: [
      {
        id: "grades-and-exams",
        question: "Which grades and exams do you teach?",
        answer: "We teach Grades 8, 9, 10, 11 and 12, for board exams and for NEET, JEE and KCET.",
      },
      { id: "board", question: "Which board do you follow?", answer: "[Board]" },
      { id: "batch-size", question: "How many students are in a batch?", answer: "[Batch size]" },
      { id: "timings", question: "What are the batch timings?", answer: "[Batch timings]" },
      { id: "missed-class", question: "What happens if my child misses a class?", answer: "[Missed class policy]" },
    ],
  },
  {
    id: "tests",
    title: "Weekly tests and AI",
    questions: [
      { id: "test-day", question: "When are the weekly tests?", answer: "[Test day and time]" },
      {
        id: "ai-checking",
        question: "How does the AI checking work?",
        answer:
          "Every week your child writes a test. AI checks it and finds the topics your child is weak in. Next week, teachers focus classes on exactly those topics.",
      },
      {
        id: "ai-teachers",
        question: "Does AI replace the teachers?",
        answer:
          "No. AI checks the tests. Teachers do the teaching, and they use the results to focus on what each student needs.",
      },
    ],
  },
  {
    id: "updates",
    title: "Updates for parents",
    questions: [
      {
        id: "check-in",
        question: "How will I know my child reached Veda?",
        answer:
          "We use biometric attendance. You get a WhatsApp message when your child checks in at Veda, and another when they check out.",
      },
      {
        id: "weekly-report",
        question: "What is in the weekly report?",
        answer:
          "Every week you get your child's attendance percentage, their weekly test report and the topics covered that week.",
      },
      { id: "meet-teachers", question: "Can I meet the teachers?", answer: "[Parent-teacher meeting details]" },
    ],
  },
  {
    id: "fees",
    title: "Fees and admission",
    questions: [
      { id: "fees", question: "What are the fees?", answer: "[Fee details]" },
      { id: "demo-free", question: "Is the demo class free?", answer: "Yes, the first demo class is free." },
      { id: "join", question: "How do I join?", answer: "[Admission steps]" },
      { id: "mid-year", question: "Can my child join in the middle of the year?", answer: "[Mid-year joining policy]" },
    ],
  },
];

/** True while an answer still holds a [placeholder]. */
export const isPlaceholder = (answer: string) => /\[[^\]]+\]/.test(answer);

/** schema.org FAQPage for the home page, with finished answers only. */
export function faqJsonLd() {
  const done = FAQ_TOPICS.flatMap((t) => t.questions).filter((q) => !isPlaceholder(q.answer));
  if (done.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: done.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}
