export type TransferStage =
  | "application_submitted"
  | "docs_uploaded"
  | "university_review"
  | "visa_applied"
  | "final_approval";

export type DocumentItem = {
  id: string;
  label: string;
  category: "academic" | "personal" | "financial";
  required: boolean;
  status: "pending" | "uploaded" | "verified";
  fileName?: string;
  uploadedAt?: string;
  notes?: string;
};

export type Deadline = {
  id: string;
  label: string;
  due: string; // ISO date
  type: "application" | "visa" | "tuition" | "travel" | "custom";
};

export type TimelineEvent = {
  id: string;
  when: string; // ISO date
  description: string;
};

export type UniversityInfo = {
  id: string;
  name: string;
  country: string;
  tuitionUSD: number;
  gpaCutoff: number; // 0-10 scale assumed for ICAS
  language: "English" | "German" | "French" | "Other";
};

export type TransferProfile = {
  targetUniversityId?: string;
  stage: TransferStage;
  gpa: number; // 0-10
  creditsEarned: number;
  deadlines: Deadline[];
  documents: DocumentItem[];
  timeline: TimelineEvent[];
};

const KEY = "icas_transfer_profile";

export function loadTransferProfile(): TransferProfile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as TransferProfile;
  } catch {}
  const initial: TransferProfile = {
    stage: "application_submitted",
    gpa: 8.2,
    creditsEarned: 80,
    deadlines: [
      {
        id: "dl-visa",
        label: "Visa Submission",
        due: new Date(Date.now() + 7 * 86400000).toISOString(),
        type: "visa",
      },
      {
        id: "dl-tuition",
        label: "Tuition Fee Payment",
        due: new Date(Date.now() + 20 * 86400000).toISOString(),
        type: "tuition",
      },
    ],
    documents: [
      {
        id: "doc-sem1",
        label: "Semester 1 Transcript",
        category: "academic",
        required: true,
        status: "verified",
      },
      {
        id: "doc-sem2",
        label: "Semester 2 Transcript",
        category: "academic",
        required: true,
        status: "verified",
      },
      {
        id: "doc-sem3",
        label: "Semester 3 Transcript",
        category: "academic",
        required: true,
        status: "uploaded",
      },
      {
        id: "doc-sem4",
        label: "Semester 4 Transcript",
        category: "academic",
        required: true,
        status: "pending",
      },
      {
        id: "doc-gpa",
        label: "Consolidated GPA Sheet",
        category: "academic",
        required: true,
        status: "uploaded",
      },
      {
        id: "doc-passport",
        label: "Passport Copy",
        category: "personal",
        required: true,
        status: "verified",
      },
      {
        id: "doc-visa-form",
        label: "Visa Form",
        category: "personal",
        required: true,
        status: "pending",
      },
      {
        id: "doc-bank",
        label: "Bank Statement (6 months)",
        category: "financial",
        required: true,
        status: "pending",
      },
      {
        id: "doc-affidavit",
        label: "Affidavit of Support",
        category: "financial",
        required: false,
        status: "pending",
      },
    ],
    timeline: [
      {
        id: "t1",
        when: new Date(Date.now() - 86_400_000 * 80).toISOString(),
        description: "Application submitted",
      },
      {
        id: "t2",
        when: new Date(Date.now() - 86_400_000 * 50).toISOString(),
        description: "Passport uploaded",
      },
    ],
  };
  localStorage.setItem(KEY, JSON.stringify(initial));
  return initial;
}

export function saveTransferProfile(next: TransferProfile) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function computeProgress(p: TransferProfile): number {
  const requiredDocs = p.documents.filter((d) => d.required);
  const docScore = requiredDocs.length
    ? requiredDocs.filter((d) => d.status === "verified").length /
      requiredDocs.length
    : 0;

  const stageWeights: Record<TransferStage, number> = {
    application_submitted: 0.2,
    docs_uploaded: 0.4,
    university_review: 0.6,
    visa_applied: 0.8,
    final_approval: 1.0,
  };
  const stageScore = stageWeights[p.stage];

  const combined = (docScore * 0.6 + stageScore * 0.4) * 100;
  return Math.round(combined);
}

export const UNIVERSITIES: UniversityInfo[] = [
  {
    id: "uwisc",
    name: "University of Wisconsin–Madison",
    country: "USA",
    tuitionUSD: 41000,
    gpaCutoff: 7.8,
    language: "English",
  },
  {
    id: "umn",
    name: "University of Minnesota – Twin Cities",
    country: "USA",
    tuitionUSD: 36000,
    gpaCutoff: 7.5,
    language: "English",
  },
  {
    id: "swansea",
    name: "Swansea University",
    country: "UK",
    tuitionUSD: 29000,
    gpaCutoff: 7.2,
    language: "English",
  },
  {
    id: "utwente",
    name: "University of Twente",
    country: "Netherlands",
    tuitionUSD: 15000,
    gpaCutoff: 7.0,
    language: "English",
  },
  {
    id: "berkeley",
    name: "UC Berkeley",
    country: "USA",
    tuitionUSD: 48000,
    gpaCutoff: 9.0,
    language: "English",
  },
];

export function checkEligibility(
  gpa: number,
  credits: number,
  uni: UniversityInfo,
) {
  const meetsGpa = gpa >= uni.gpaCutoff;
  const meetsCredits = credits >= 60; // baseline
  return { meetsGpa, meetsCredits, eligible: meetsGpa && meetsCredits };
}

export function addTimeline(
  p: TransferProfile,
  description: string,
): TransferProfile {
  const e: TimelineEvent = {
    id: `e-${Date.now()}`,
    when: new Date().toISOString(),
    description,
  };
  const next = { ...p, timeline: [...p.timeline, e] };
  saveTransferProfile(next);
  return next;
}

export function updateDocument(
  p: TransferProfile,
  id: string,
  patch: Partial<DocumentItem>,
): TransferProfile {
  const nextDocs = p.documents.map((d) =>
    d.id === id ? { ...d, ...patch } : d,
  );
  const next = { ...p, documents: nextDocs };
  saveTransferProfile(next);
  return next;
}

export function nextStep(p: TransferProfile): string {
  const pendingDoc = p.documents.find(
    (d) => d.required && d.status !== "verified",
  );
  if (pendingDoc) return `Upload ${pendingDoc.label}`;
  switch (p.stage) {
    case "application_submitted":
      return "Upload required documents";
    case "docs_uploaded":
      return "Await university review";
    case "university_review":
      return "Apply for visa";
    case "visa_applied":
      return "Await final approval";
    default:
      return "All steps complete";
  }
}

export function validateFileNaming(
  fileName: string,
  item: DocumentItem,
): string | null {
  const lower = fileName.toLowerCase();
  if (!lower.endsWith(".pdf")) return "Only PDF files are accepted.";
  if (
    item.id.includes("sem") &&
    !/sem\s*\d/.test(lower) &&
    !/semester\s*\d/.test(lower)
  ) {
    return "Transcript must include the semester number in the filename.";
  }
  if (item.id === "doc-bank" && !/bank|statement/.test(lower)) {
    return "Bank statement must be clearly named as a statement PDF.";
  }
  return null;
}
