/*
  Course content for the program cards and the /programs/[slug] pages.
  Anything in [square brackets] is a placeholder for Veda to confirm or fill in.
  Syllabus units are a broad overview of the main units, not a chapter list.
*/

export type Tone = "paper" | "tan" | "sand" | "dark" | "mid" | "accent";

export type Course = {
  slug: string;
  kind: "board" | "exam";
  /** Large mark on the card and page: "8" or "JEE". */
  mark: string;
  /** Devanagari numeral for grade programs. */
  deva?: string;
  title: string;
  kicker: string;
  tone: Tone;
  /** One line for the card. */
  tagline: string;
  /** Revealed on card hover. */
  detail: string;
  /** Page intro under the title. */
  summary: string;
  overview: { who: string; covers: string };
  subjects: string[];
  syllabus: { subject: string; units: string[] }[];
  exam?: {
    name: string;
    rows: [string, string][];
    source: string;
  };
  faqs: { q: string; a: string }[];
};

export const BATCH_DETAILS: [string, string][] = [
  ["Board", "[CBSE / State board]"],
  ["Timings", "[Batch timings]"],
  ["Duration", "[Duration]"],
  ["Batch size", "[Batch size]"],
  ["Fees", "[Fee]"],
];

export const SYLLABUS_NOTE = "[Confirm syllabus for your board]";

export const WEEK_STEPS = [
  { title: "Classes", body: "Teachers cover the week's topics in class." },
  { title: "Weekly test", body: "Every student writes a test on what was taught." },
  { title: "AI evaluates it", body: "AI checks each student's test, answer by answer." },
  { title: "Weak topics found", body: "It shows the topics each student is weak in." },
  { title: "Teachers focus on them", body: "Next week's classes go back to those topics." },
];

export const EXAM_PREP = (exam: string) => [
  {
    title: "Mock tests in the real pattern",
    body: `Tests set with the same kind of questions, timing and marking as ${exam}.`,
  },
  {
    title: "Exam-pattern practice",
    body: `Regular practice with ${exam}-style questions, so the format feels familiar on exam day.`,
  },
  {
    title: "Chapter-wise tracking with AI",
    body: "AI tracks every test chapter by chapter, so teachers know exactly which chapters need more work.",
  },
  {
    title: "Alongside the boards",
    body: "Built for 11th and 12th students, so board and entrance preparation move forward together.",
  },
];

const commonFaqs = (course: string): { q: string; a: string }[] => [
  {
    q: "How does the weekly test work?",
    a: "Every week your child writes a test on what was taught. AI evaluates it and finds the topics your child is weak in, and teachers focus on those topics in the next week's classes.",
  },
  {
    q: "How will I know my child reached class?",
    a: "Veda uses biometric attendance. You get a WhatsApp message when your child checks in at the institute and another when they check out.",
  },
  {
    q: "What is in the weekly report?",
    a: "The attendance percentage for the week, the weekly test report, and the topics covered that week.",
  },
  {
    q: `What are the fees and timings for ${course}?`,
    a: "Fees: [Fee]. Batch timings: [Batch timings]. Call [Phone number] for the current batches.",
  },
  {
    q: "Can my child attend a class before joining?",
    a: "Yes. Book a free demo class and your child can attend a real Veda class before you decide.",
  },
];

const board8to10Subjects = ["Maths", "Science", "[Other subjects, if any]"];
const pcmb = ["Physics", "Chemistry", "Maths", "Biology"];

export const COURSES: Course[] = [
  {
    slug: "8th",
    kind: "board",
    mark: "8",
    deva: "८",
    title: "8th Standard",
    kicker: "School board",
    tone: "paper",
    tagline: "Strong basics before the board years.",
    detail: "Maths and Science",
    summary:
      "For students in 8th Standard. We build strong basics in Maths and Science, so 9th and 10th feel easier.",
    overview: {
      who: "Students in 8th Standard who want to understand their subjects properly, not just finish homework. It suits students who find Maths or Science difficult, and students who are ready to go further.",
      covers:
        "The full 8th Standard syllabus for Maths and Science, taught topic by topic, with a weekly test that shows exactly where your child needs more practice.",
    },
    subjects: board8to10Subjects,
    syllabus: [
      {
        subject: "Maths",
        units: [
          "Rational numbers",
          "Exponents, squares and cubes",
          "Algebraic expressions and identities",
          "Linear equations in one variable",
          "Quadrilaterals and geometry",
          "Mensuration",
          "Comparing quantities and proportion",
          "Data handling and graphs",
        ],
      },
      {
        subject: "Science",
        units: [
          "Cells and microorganisms",
          "Reproduction and adolescence",
          "Materials: metals, non-metals and fibres",
          "Combustion and flame",
          "Force, friction and pressure",
          "Sound and light",
          "Chemical effects of electric current",
        ],
      },
      { subject: "[Other subjects, if any]", units: ["[Main units]"] },
    ],
    faqs: [
      {
        q: "My child is only in 8th. Why start coaching now?",
        a: "8th Standard lays the base for the board years. Gaps in basics here show up later in 9th and 10th, and the weekly test helps find and fix them early.",
      },
      ...commonFaqs("8th Standard"),
    ],
  },
  {
    slug: "9th",
    kind: "board",
    mark: "9",
    deva: "९",
    title: "9th Standard",
    kicker: "School board",
    tone: "tan",
    tagline: "The full syllabus, and the ground for 10th.",
    detail: "Maths and Science",
    summary:
      "For students in 9th Standard. We cover the full syllabus and prepare the ground for the 10th board year.",
    overview: {
      who: "Students in 9th Standard. Much of what is taught in 9th comes back in 10th, so this year matters more than it seems.",
      covers:
        "The complete 9th Standard syllabus for Maths and Science, with extra attention to the topics that continue into 10th Standard.",
    },
    subjects: board8to10Subjects,
    syllabus: [
      {
        subject: "Maths",
        units: [
          "Number systems",
          "Polynomials",
          "Coordinate geometry",
          "Linear equations in two variables",
          "Lines, angles and triangles",
          "Quadrilaterals and circles",
          "Surface areas and volumes",
          "Statistics",
        ],
      },
      {
        subject: "Science",
        units: [
          "Matter and its nature",
          "Atoms and molecules",
          "Structure of the atom",
          "The cell and tissues",
          "Motion, force and laws of motion",
          "Gravitation",
          "Work and energy",
          "Sound",
        ],
      },
      { subject: "[Other subjects, if any]", units: ["[Main units]"] },
    ],
    faqs: [
      {
        q: "Does 9th Standard really matter if the board exam is in 10th?",
        a: "Yes. Many 10th Standard chapters build directly on 9th. Understanding them well in 9th makes the board year much lighter.",
      },
      ...commonFaqs("9th Standard"),
    ],
  },
  {
    slug: "10th",
    kind: "board",
    mark: "10",
    deva: "१०",
    title: "10th Standard",
    kicker: "Board exam year",
    tone: "dark",
    tagline: "Board exam year, with past papers and revision.",
    detail: "Maths and Science",
    summary:
      "For students in 10th Standard. Complete board exam preparation, with past papers, revision and a weekly test to find weak topics early.",
    overview: {
      who: "Students writing their 10th Standard board exam, whether they want to move from average to good marks or from good to excellent.",
      covers:
        "The full 10th Standard syllabus, past board papers, and planned revision before the exam, with the weekly test showing which topics still need work.",
    },
    subjects: board8to10Subjects,
    syllabus: [
      {
        subject: "Maths",
        units: [
          "Real numbers and polynomials",
          "Pair of linear equations",
          "Quadratic equations",
          "Arithmetic progressions",
          "Triangles and coordinate geometry",
          "Trigonometry and its applications",
          "Circles, areas and volumes",
          "Statistics and probability",
        ],
      },
      {
        subject: "Science",
        units: [
          "Chemical reactions",
          "Acids, bases and salts",
          "Metals, non-metals and carbon compounds",
          "Life processes",
          "Control, coordination and reproduction",
          "Heredity",
          "Light and the human eye",
          "Electricity and magnetic effects",
        ],
      },
      { subject: "[Other subjects, if any]", units: ["[Main units]"] },
    ],
    faqs: [
      {
        q: "Do you practise past board papers?",
        a: "Yes. Past board papers and revision are part of the 10th Standard program, alongside the weekly test.",
      },
      ...commonFaqs("10th Standard"),
    ],
  },
  {
    slug: "11th",
    kind: "board",
    mark: "11",
    deva: "११",
    title: "11th Standard",
    kicker: "PCM or PCB",
    tone: "sand",
    tagline: "Strong concepts in PCM or PCB.",
    detail: "Physics, Chemistry, Maths, Biology",
    summary:
      "For students in 11th Standard with PCM or PCB. Strong concepts for the boards, and the base for JEE, NEET and KCET.",
    overview: {
      who: "Students in 11th Standard (1st PUC) who have chosen PCM or PCB, including students planning to write JEE, NEET or KCET later.",
      covers:
        "The 11th Standard syllabus in Physics, Chemistry, Maths and Biology, taught for real understanding, because most entrance exam questions come from these concepts.",
    },
    subjects: pcmb,
    syllabus: [
      {
        subject: "Physics",
        units: [
          "Units and measurement",
          "Motion in a straight line and in a plane",
          "Laws of motion",
          "Work, energy and power",
          "Rotational motion and gravitation",
          "Properties of solids and fluids",
          "Thermodynamics and kinetic theory",
          "Oscillations and waves",
        ],
      },
      {
        subject: "Chemistry",
        units: [
          "Basic concepts of chemistry",
          "Structure of the atom",
          "Periodic classification",
          "Chemical bonding",
          "Thermodynamics and equilibrium",
          "Redox reactions",
          "Organic chemistry basics",
          "Hydrocarbons",
        ],
      },
      {
        subject: "Maths",
        units: [
          "Sets, relations and functions",
          "Trigonometric functions",
          "Complex numbers",
          "Permutations, combinations and binomial theorem",
          "Sequences and series",
          "Straight lines and conic sections",
          "Limits and derivatives",
          "Statistics and probability",
        ],
      },
      {
        subject: "Biology",
        units: [
          "Diversity of living organisms",
          "Structural organisation in plants and animals",
          "Cell structure and function",
          "Plant physiology",
          "Human physiology",
        ],
      },
    ],
    faqs: [
      {
        q: "Can my child take both Maths and Biology?",
        a: "[Confirm whether Veda offers PCMB batches.]",
      },
      {
        q: "Does this help with JEE, NEET or KCET?",
        a: "Yes. 11th Standard concepts are the base for all three exams. Students preparing for them can also join the JEE, NEET or KCET program alongside.",
      },
      ...commonFaqs("11th Standard"),
    ],
  },
  {
    slug: "12th",
    kind: "board",
    mark: "12",
    deva: "१२",
    title: "12th Standard",
    kicker: "PCM or PCB",
    tone: "mid",
    tagline: "Boards and competitive exams, together.",
    detail: "Physics, Chemistry, Maths, Biology",
    summary:
      "For students in 12th Standard with PCM or PCB. Board exam preparation alongside readiness for JEE, NEET and KCET.",
    overview: {
      who: "Students in 12th Standard (2nd PUC) with PCM or PCB, who need strong board marks and are also preparing for entrance exams.",
      covers:
        "The full 12th Standard syllabus, board exam preparation and revision, planned so that it also supports entrance exam preparation.",
    },
    subjects: pcmb,
    syllabus: [
      {
        subject: "Physics",
        units: [
          "Electrostatics",
          "Current electricity",
          "Magnetism and electromagnetic induction",
          "Alternating current and EM waves",
          "Ray and wave optics",
          "Dual nature, atoms and nuclei",
          "Semiconductor electronics",
        ],
      },
      {
        subject: "Chemistry",
        units: [
          "Solutions",
          "Electrochemistry",
          "Chemical kinetics",
          "d- and f-block elements",
          "Coordination compounds",
          "Haloalkanes and haloarenes",
          "Alcohols, phenols, aldehydes and ketones",
          "Amines and biomolecules",
        ],
      },
      {
        subject: "Maths",
        units: [
          "Relations, functions and inverse trigonometry",
          "Matrices and determinants",
          "Continuity and differentiability",
          "Applications of derivatives",
          "Integrals and their applications",
          "Differential equations",
          "Vectors and 3D geometry",
          "Linear programming and probability",
        ],
      },
      {
        subject: "Biology",
        units: [
          "Reproduction",
          "Genetics and evolution",
          "Biology and human welfare",
          "Biotechnology",
          "Ecology",
        ],
      },
    ],
    faqs: [
      {
        q: "How do you balance board exams and entrance exams?",
        a: "The board syllabus comes first, taught in a way that also builds entrance exam skills. Students writing JEE, NEET or KCET can join that program alongside.",
      },
      ...commonFaqs("12th Standard"),
    ],
  },
  {
    slug: "jee",
    kind: "exam",
    mark: "JEE",
    title: "JEE",
    kicker: "Engineering entrance",
    tone: "accent",
    tagline: "For engineering. Physics, Chemistry, Maths.",
    detail: "For 11th and 12th students",
    summary:
      "JEE preparation for 11th and 12th students, alongside their board preparation. Mock tests, exam-pattern practice and AI tracking of weak chapters.",
    overview: {
      who: "Students in 11th and 12th Standard with PCM who want to get into engineering colleges through JEE.",
      covers:
        "Physics, Chemistry and Maths at the depth JEE needs, with regular practice in the JEE question format and chapter-wise tracking of every test.",
    },
    subjects: ["Physics", "Chemistry", "Maths"],
    syllabus: [
      {
        subject: "Physics",
        units: [
          "Mechanics",
          "Heat and thermodynamics",
          "Oscillations and waves",
          "Electrostatics and current electricity",
          "Magnetism and EMI",
          "Optics",
          "Modern physics",
        ],
      },
      {
        subject: "Chemistry",
        units: [
          "Physical chemistry",
          "Inorganic chemistry",
          "Organic chemistry",
        ],
      },
      {
        subject: "Maths",
        units: [
          "Algebra",
          "Trigonometry",
          "Coordinate geometry",
          "Calculus",
          "Vectors and 3D geometry",
          "Statistics and probability",
        ],
      },
    ],
    exam: {
      name: "JEE Main",
      rows: [
        ["Conducted by", "National Testing Agency (NTA)"],
        ["Mode", "Computer-based test"],
        ["Subjects", "Physics, Chemistry, Maths"],
        ["Questions", "Multiple-choice and numerical-answer questions in each subject"],
        ["Duration", "3 hours"],
        ["Marking", "Marks for each correct answer, with negative marking for wrong answers"],
        ["Next step", "Top JEE Main candidates can write JEE Advanced for the IITs"],
      ],
      source: "[Confirm the latest pattern on the official NTA website before publishing]",
    },
    faqs: [
      {
        q: "Is this for JEE Main or JEE Advanced?",
        a: "[Confirm: JEE Main only, or JEE Main and JEE Advanced.]",
      },
      {
        q: "Can my child prepare for JEE and the boards together?",
        a: "Yes. The JEE program is for 11th and 12th students and runs alongside their board preparation.",
      },
      ...commonFaqs("JEE"),
    ],
  },
  {
    slug: "neet",
    kind: "exam",
    mark: "NEET",
    title: "NEET",
    kicker: "Medical entrance",
    tone: "tan",
    tagline: "For medical. Physics, Chemistry, Biology.",
    detail: "For 11th and 12th students",
    summary:
      "NEET preparation for 11th and 12th students, alongside their board preparation. Mock tests, exam-pattern practice and AI tracking of weak chapters.",
    overview: {
      who: "Students in 11th and 12th Standard with PCB who want to study medicine through NEET.",
      covers:
        "Physics, Chemistry and Biology at NEET level, with extra depth in Biology, regular NEET-pattern practice, and chapter-wise tracking of every test.",
    },
    subjects: ["Physics", "Chemistry", "Biology"],
    syllabus: [
      {
        subject: "Physics",
        units: [
          "Mechanics",
          "Heat and thermodynamics",
          "Oscillations and waves",
          "Electricity and magnetism",
          "Optics",
          "Modern physics",
        ],
      },
      {
        subject: "Chemistry",
        units: ["Physical chemistry", "Inorganic chemistry", "Organic chemistry"],
      },
      {
        subject: "Biology",
        units: [
          "Diversity in the living world",
          "Cell structure and function",
          "Plant physiology",
          "Human physiology",
          "Reproduction",
          "Genetics and evolution",
          "Biotechnology",
          "Ecology",
        ],
      },
    ],
    exam: {
      name: "NEET (UG)",
      rows: [
        ["Conducted by", "National Testing Agency (NTA)"],
        ["Mode", "Pen and paper (OMR sheet)"],
        ["Subjects", "Physics, Chemistry, Biology (Botany and Zoology)"],
        ["Questions", "Multiple-choice questions, with Biology carrying the most marks"],
        ["Duration", "3 hours"],
        ["Marking", "Marks for each correct answer, with negative marking for wrong answers"],
      ],
      source: "[Confirm the latest pattern on the official NTA website before publishing]",
    },
    faqs: [
      {
        q: "Why is Biology given more time?",
        a: "Biology carries the most marks in NEET, so it gets extra attention in classes and tests.",
      },
      {
        q: "Can my child prepare for NEET and the boards together?",
        a: "Yes. The NEET program is for 11th and 12th students and runs alongside their board preparation.",
      },
      ...commonFaqs("NEET"),
    ],
  },
  {
    slug: "kcet",
    kind: "exam",
    mark: "KCET",
    title: "KCET",
    kicker: "Karnataka CET",
    tone: "dark",
    tagline: "Karnataka CET. Physics, Chemistry, Maths or Biology.",
    detail: "For 11th and 12th students",
    summary:
      "KCET preparation for 11th and 12th students in Karnataka, alongside their PUC board preparation. Mock tests, exam-pattern practice and AI tracking of weak chapters.",
    overview: {
      who: "1st and 2nd PUC students in Karnataka who want admission through the Karnataka Common Entrance Test.",
      covers:
        "Physics, Chemistry, and Maths or Biology from the PUC syllabus, with practice in the KCET format and chapter-wise tracking of every test.",
    },
    subjects: ["Physics", "Chemistry", "Maths or Biology"],
    syllabus: [
      {
        subject: "Physics",
        units: ["1st PUC Physics", "2nd PUC Physics"],
      },
      {
        subject: "Chemistry",
        units: ["1st PUC Chemistry", "2nd PUC Chemistry"],
      },
      {
        subject: "Maths",
        units: ["1st PUC Maths", "2nd PUC Maths"],
      },
      {
        subject: "Biology",
        units: ["1st PUC Biology", "2nd PUC Biology"],
      },
    ],
    exam: {
      name: "KCET",
      rows: [
        ["Conducted by", "Karnataka Examinations Authority (KEA)"],
        ["Mode", "Pen and paper (OMR sheet)"],
        ["Subjects", "Physics, Chemistry, Maths, Biology (separate papers)"],
        ["Syllabus", "1st and 2nd PUC (Karnataka state board)"],
        ["Questions", "Multiple-choice questions in each paper"],
        ["Marking", "One mark for each correct answer"],
      ],
      source: "[Confirm the latest pattern on the official KEA website before publishing]",
    },
    faqs: [
      {
        q: "Is KCET only for engineering?",
        a: "No. KCET is used for admission to several professional courses in Karnataka. Which papers your child writes depends on the course they want.",
      },
      {
        q: "Can my child prepare for KCET and PUC exams together?",
        a: "Yes. KCET is based on the PUC syllabus, so preparing for both together works well.",
      },
      ...commonFaqs("KCET"),
    ],
  },
];

export const getCourse = (slug: string) => COURSES.find((c) => c.slug === slug);
