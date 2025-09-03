import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "./firebase";

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  prerequisites: string[];
  semester: number;
  year: number;
  difficulty: "easy" | "medium" | "hard";
  category: "core" | "elective" | "lab";
  description: string;
  instructor?: string;
}

export interface AcademicPlan {
  userId: string;
  currentSemester: number;
  currentYear: number;
  program: string;
  targetGPA: number;
  selectedCourses: string[];
  completedCourses: CourseGrade[];
  plannedCourses: PlannedCourse[];
  transferCredits: TransferCredit[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseGrade {
  courseId: string;
  courseCode: string;
  courseName: string;
  grade: string;
  gpa: number;
  credits: number;
  semester: number;
  year: number;
}

export interface PlannedCourse {
  courseId: string;
  semester: number;
  year: number;
  priority: "high" | "medium" | "low";
  reason?: string;
}

export interface TransferCredit {
  originalCourse: string;
  transferredCourse: string;
  credits: number;
  university: string;
  verified: boolean;
}

export interface GPAScenario {
  name: string;
  courses: { courseId: string; expectedGrade: string }[];
  projectedGPA: number;
}

// Academic Plan Operations
export async function createAcademicPlan(plan: Omit<AcademicPlan, 'createdAt' | 'updatedAt'>): Promise<void> {
  await setDoc(doc(db, "academicPlans", plan.userId), {
    ...plan,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function getAcademicPlan(userId: string): Promise<AcademicPlan | null> {
  const docRef = doc(db, "academicPlans", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as AcademicPlan : null;
}

export async function updateAcademicPlan(userId: string, updates: Partial<AcademicPlan>): Promise<void> {
  const docRef = doc(db, "academicPlans", userId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

// Course Operations
export async function getAllCourses(): Promise<Course[]> {
  const snapshot = await getDocs(collection(db, "courses"));
  const courses: Course[] = [];
  
  snapshot.forEach((doc) => {
    courses.push({ id: doc.id, ...doc.data() } as Course);
  });
  
  return courses.sort((a, b) => a.code.localeCompare(b.code));
}

export async function getCoursesByProgram(program: string): Promise<Course[]> {
  const q = query(collection(db, "courses"), where("program", "==", program));
  const snapshot = await getDocs(q);
  const courses: Course[] = [];
  
  snapshot.forEach((doc) => {
    courses.push({ id: doc.id, ...doc.data() } as Course);
  });
  
  return courses;
}

// GPA Calculator
export function calculateGPA(grades: CourseGrade[]): number {
  if (grades.length === 0) return 0;
  
  const totalPoints = grades.reduce((sum, grade) => sum + (grade.gpa * grade.credits), 0);
  const totalCredits = grades.reduce((sum, grade) => sum + grade.credits, 0);
  
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

export function gradeToGPA(grade: string): number {
  const gradeMap: Record<string, number> = {
    'A+': 10, 'A': 9, 'A-': 8.5,
    'B+': 8, 'B': 7, 'B-': 6.5,
    'C+': 6, 'C': 5, 'C-': 4.5,
    'D': 4, 'F': 0
  };
  return gradeMap[grade] || 0;
}

export function calculateProjectedGPA(
  currentGrades: CourseGrade[],
  plannedCourses: { courseId: string; expectedGrade: string; credits: number }[]
): number {
  const allGrades = [
    ...currentGrades,
    ...plannedCourses.map(pc => ({
      courseId: pc.courseId,
      courseCode: '',
      courseName: '',
      grade: pc.expectedGrade,
      gpa: gradeToGPA(pc.expectedGrade),
      credits: pc.credits,
      semester: 0,
      year: 0,
    }))
  ];
  
  return calculateGPA(allGrades);
}

// Course Recommendation Algorithm
export async function getRecommendedCourses(
  userId: string,
  currentPlan: AcademicPlan,
  targetSemester: number,
  targetYear: number
): Promise<Course[]> {
  const allCourses = await getCoursesByProgram(currentPlan.program);
  const completedCourseIds = currentPlan.completedCourses.map(c => c.courseId);
  const plannedCourseIds = currentPlan.plannedCourses.map(c => c.courseId);
  
  const availableCourses = allCourses.filter(course => {
    // Not already completed or planned
    if (completedCourseIds.includes(course.id) || plannedCourseIds.includes(course.id)) {
      return false;
    }
    
    // Check prerequisites
    const hasPrerequisites = course.prerequisites.every(prereq => 
      completedCourseIds.includes(prereq)
    );
    
    // Check if course is offered in target semester/year
    const isOffered = course.semester === targetSemester && course.year <= targetYear;
    
    return hasPrerequisites && isOffered;
  });
  
  // Sort by priority: core courses first, then by difficulty
  return availableCourses.sort((a, b) => {
    if (a.category === "core" && b.category !== "core") return -1;
    if (b.category === "core" && a.category !== "core") return 1;
    
    const difficultyOrder = { "easy": 1, "medium": 2, "hard": 3 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });
}

// Credit Transfer Validation
export async function validateTransferCredits(
  courses: CourseGrade[],
  targetUniversityId: string
): Promise<{ valid: TransferCredit[]; invalid: CourseGrade[] }> {
  // This would typically call an external API or use a mapping table
  // For now, we'll use a simple validation based on course codes and credits
  
  const valid: TransferCredit[] = [];
  const invalid: CourseGrade[] = [];
  
  courses.forEach(course => {
    // Simple validation: courses with 3+ credits and grade B+ or above typically transfer
    if (course.credits >= 3 && course.gpa >= 8) {
      valid.push({
        originalCourse: course.courseCode,
        transferredCourse: course.courseCode, // In reality, this would be mapped
        credits: course.credits,
        university: targetUniversityId,
        verified: false, // Would need manual verification
      });
    } else {
      invalid.push(course);
    }
  });
  
  return { valid, invalid };
}