import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkEligibility,
  computeProgress,
  nextStep,
  UNIVERSITIES,
  updateDocument,
  validateFileNaming,
  type DocumentItem,
  type TransferProfile,
} from "./transfer";

function doc(id: string, overrides: Partial<DocumentItem> = {}): DocumentItem {
  return {
    id,
    label: id,
    category: "academic",
    required: true,
    status: "pending",
    ...overrides,
  };
}

function profile(overrides: Partial<TransferProfile> = {}): TransferProfile {
  return {
    stage: "application_submitted",
    gpa: 8,
    creditsEarned: 64,
    deadlines: [],
    documents: [],
    timeline: [],
    ...overrides,
  };
}

beforeEach(() => {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  });
});

describe("computeProgress", () => {
  it("weights verified required documents (60%) and stage (40%)", () => {
    const p = profile({
      stage: "university_review",
      documents: [
        doc("a", { status: "verified" }),
        doc("b", { status: "uploaded" }),
        doc("optional", { required: false, status: "pending" }),
      ],
    });
    // docs 1/2 * 0.6 + stage 0.6 * 0.4 = 0.54
    expect(computeProgress(p)).toBe(54);
  });

  it("reaches 100 when everything is verified and approved", () => {
    const p = profile({
      stage: "final_approval",
      documents: [doc("a", { status: "verified" })],
    });
    expect(computeProgress(p)).toBe(100);
  });
});

describe("checkEligibility", () => {
  const uni = UNIVERSITIES.find((u) => u.id === "uwisc")!;

  it("requires both the GPA cutoff and 60 credits", () => {
    expect(checkEligibility(8, 60, uni)).toEqual({
      meetsGpa: true,
      meetsCredits: true,
      eligible: true,
    });
    expect(checkEligibility(7, 60, uni).eligible).toBe(false);
    expect(checkEligibility(9, 59, uni).eligible).toBe(false);
  });
});

describe("nextStep", () => {
  it("asks for the first unverified required document", () => {
    const p = profile({ documents: [doc("x", { label: "Passport" })] });
    expect(nextStep(p)).toBe("Upload Passport");
  });

  it("follows the stage once documents are verified", () => {
    const docs = [doc("x", { status: "verified" })];
    expect(
      nextStep(profile({ documents: docs, stage: "university_review" })),
    ).toBe("Apply for visa");
    expect(
      nextStep(profile({ documents: docs, stage: "final_approval" })),
    ).toBe("All steps complete");
  });
});

describe("validateFileNaming", () => {
  it("only accepts PDFs", () => {
    expect(validateFileNaming("scan.jpg", doc("doc-passport"))).toMatch(/PDF/);
  });

  it("requires a semester number for transcripts", () => {
    expect(validateFileNaming("transcript.pdf", doc("doc-sem1"))).toMatch(
      /semester/,
    );
    expect(
      validateFileNaming("Transcript_Sem 1.pdf", doc("doc-sem1")),
    ).toBeNull();
    expect(validateFileNaming("semester2.pdf", doc("doc-sem2"))).toBeNull();
  });

  it("requires bank statements to be named as such", () => {
    expect(validateFileNaming("funds.pdf", doc("doc-bank"))).toMatch(
      /statement/,
    );
    expect(
      validateFileNaming("bank_statement.pdf", doc("doc-bank")),
    ).toBeNull();
  });
});

describe("updateDocument", () => {
  it("patches one document immutably and persists the profile", () => {
    const original = profile({ documents: [doc("a"), doc("b")] });
    const next = updateDocument(original, "b", {
      status: "uploaded",
      fileName: "b.pdf",
    });
    expect(next.documents[1]).toMatchObject({
      status: "uploaded",
      fileName: "b.pdf",
    });
    expect(original.documents[1].status).toBe("pending");
    expect(JSON.parse(localStorage.getItem("icas_transfer_profile")!)).toEqual(
      next,
    );
  });
});
