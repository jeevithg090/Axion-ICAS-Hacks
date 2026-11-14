import { describe, expect, it } from "vitest";
import {
  calculateGPA,
  calculateProjectedGPA,
  gradeToGPA,
  recommendCourses,
  totalCredits,
  validateTransferCredits,
  type Course,
  type CourseGrade,
} from "./academic-planner";

function grade(courseId: string, gpa: number, credits: number): CourseGrade {
  return {
    courseId,
    courseCode: courseId.toUpperCase(),
    courseName: courseId,
    grade: "A",
    gpa,
    credits,
    semester: 1,
    year: 1,
  };
}

function course(id: string, overrides: Partial<Course> = {}): Course {
  return {
    id,
    code: id.toUpperCase(),
    name: id,
    credits: 4,
    prerequisites: [],
    semester: 1,
    year: 1,
    difficulty: "medium",
    category: "elective",
    description: "",
    ...overrides,
  };
}

describe("GPA calculations", () => {
  it("computes a credit-weighted GPA", () => {
    expect(calculateGPA([grade("a", 10, 4), grade("b", 7, 2)])).toBeCloseTo(9);
  });

  it("returns 0 with no grades or zero credits", () => {
    expect(calculateGPA([])).toBe(0);
    expect(calculateGPA([grade("a", 9, 0)])).toBe(0);
  });

  it("maps letter grades onto the 10-point scale", () => {
    expect(gradeToGPA("A+")).toBe(10);
    expect(gradeToGPA("B+")).toBe(8);
    expect(gradeToGPA("F")).toBe(0);
    expect(gradeToGPA("Z")).toBe(0);
  });

  it("projects GPA including planned courses", () => {
    const projected = calculateProjectedGPA(
      [grade("a", 8, 4)],
      [{ courseId: "b", expectedGrade: "A+", credits: 4 }],
    );
    expect(projected).toBeCloseTo(9);
  });

  it("sums earned credits", () => {
    expect(totalCredits([grade("a", 9, 4), grade("b", 9, 3)])).toBe(7);
    expect(totalCredits([])).toBe(0);
  });
});

describe("recommendCourses", () => {
  const catalogue = [
    course("done"),
    course("planned"),
    course("needs-prereq", { prerequisites: ["missing"] }),
    course("unlocked", { prerequisites: ["done"], difficulty: "hard" }),
    course("core-hard", { category: "core", difficulty: "hard" }),
    course("easy", { difficulty: "easy" }),
    course("other-sem", { semester: 2 }),
    course("future-year", { year: 3 }),
  ];
  const plan = {
    completedCourses: [grade("done", 9, 4)],
    plannedCourses: [
      { courseId: "planned", semester: 1, year: 1, credits: 4 } as never,
    ],
  };

  it("excludes completed, planned, locked and unavailable courses", () => {
    const ids = recommendCourses(catalogue, plan, 1, 2).map((c) => c.id);
    expect(ids).not.toContain("done");
    expect(ids).not.toContain("planned");
    expect(ids).not.toContain("needs-prereq");
    expect(ids).not.toContain("other-sem");
    expect(ids).not.toContain("future-year");
  });

  it("orders core courses first, then by difficulty", () => {
    const ids = recommendCourses(catalogue, plan, 1, 2).map((c) => c.id);
    expect(ids).toEqual(["core-hard", "easy", "unlocked"]);
  });
});

describe("validateTransferCredits", () => {
  it("accepts courses with >=3 credits and grade point >=8", async () => {
    const { valid, invalid } = await validateTransferCredits(
      [grade("ok", 8, 3), grade("low-grade", 7, 4), grade("low-credit", 9, 2)],
      "utwente",
    );
    expect(valid.map((v) => v.originalCourse)).toEqual(["OK"]);
    expect(valid[0]).toMatchObject({ university: "utwente", verified: false });
    expect(invalid.map((c) => c.courseId)).toEqual(["low-grade", "low-credit"]);
  });
});
