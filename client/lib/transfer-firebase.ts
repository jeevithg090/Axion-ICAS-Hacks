import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  getDocs
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { db, storage } from "./firebase";

export type TransferStage = 
  | "application_submitted"
  | "docs_uploaded" 
  | "university_review"
  | "visa_applied"
  | "final_approval";

export interface DocumentItem {
  id: string;
  label: string;
  category: "academic" | "personal" | "financial";
  required: boolean;
  status: "pending" | "uploaded" | "verified";
  fileName?: string;
  fileUrl?: string;
  uploadedAt?: string;
  notes?: string;
}

export interface Deadline {
  id: string;
  label: string;
  due: string;
  type: "application" | "visa" | "tuition" | "travel" | "custom";
  completed?: boolean;
}

export interface TimelineEvent {
  id: string;
  when: string;
  description: string;
  type: "milestone" | "document" | "deadline" | "note";
}

export interface UniversityInfo {
  id: string;
  name: string;
  country: string;
  tuitionUSD: number;
  gpaCutoff: number;
  language: string;
  description?: string;
  requirements?: string[];
}

export interface TransferProfile {
  userId: string;
  targetUniversityId?: string;
  stage: TransferStage;
  gpa: number;
  creditsEarned: number;
  program: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransferDocument {
  id: string;
  userId: string;
  documentId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  status: "pending" | "uploaded" | "verified" | "rejected";
  notes?: string;
}

// Transfer Profile Operations
export async function createTransferProfile(userId: string, data: Partial<TransferProfile>): Promise<void> {
  const profile: TransferProfile = {
    userId,
    stage: "application_submitted",
    gpa: 0,
    creditsEarned: 0,
    program: "",
    year: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
  
  await setDoc(doc(db, "transferProfiles", userId), profile);
}

export async function getTransferProfile(userId: string): Promise<TransferProfile | null> {
  const docRef = doc(db, "transferProfiles", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as TransferProfile : null;
}

export async function updateTransferProfile(userId: string, updates: Partial<TransferProfile>): Promise<void> {
  const docRef = doc(db, "transferProfiles", userId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

// Document Operations
export async function uploadTransferDocument(
  userId: string, 
  documentId: string, 
  file: File
): Promise<string> {
  const fileName = `${documentId}_${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `transfers/${userId}/${fileName}`);
  
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  const docData: Omit<TransferDocument, 'id'> = {
    userId,
    documentId,
    fileName: file.name,
    fileUrl: downloadURL,
    uploadedAt: new Date().toISOString(),
    status: "uploaded",
  };
  
  await addDoc(collection(db, "transferDocuments"), docData);
  return downloadURL;
}

export function subscribeToTransferDocuments(
  userId: string, 
  callback: (docs: TransferDocument[]) => void
) {
  const q = query(
    collection(db, "transferDocuments"),
    where("userId", "==", userId),
    orderBy("uploadedAt", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const docs: TransferDocument[] = [];
    snapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() } as TransferDocument);
    });
    callback(docs);
  });
}

// Deadline Operations
export async function addDeadline(userId: string, deadline: Omit<Deadline, 'id'>): Promise<void> {
  await addDoc(collection(db, "transferDeadlines"), {
    ...deadline,
    userId,
    createdAt: new Date().toISOString(),
  });
}

export function subscribeToDeadlines(userId: string, callback: (deadlines: Deadline[]) => void) {
  const q = query(
    collection(db, "transferDeadlines"),
    where("userId", "==", userId),
    orderBy("due", "asc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const deadlines: Deadline[] = [];
    snapshot.forEach((doc) => {
      deadlines.push({ id: doc.id, ...doc.data() } as Deadline);
    });
    callback(deadlines);
  });
}

export async function updateDeadline(deadlineId: string, updates: Partial<Deadline>): Promise<void> {
  const docRef = doc(db, "transferDeadlines", deadlineId);
  await updateDoc(docRef, updates);
}

// Timeline Operations
export async function addTimelineEvent(userId: string, event: Omit<TimelineEvent, 'id'>): Promise<void> {
  await addDoc(collection(db, "transferTimeline"), {
    ...event,
    userId,
  });
}

export function subscribeToTimeline(userId: string, callback: (events: TimelineEvent[]) => void) {
  const q = query(
    collection(db, "transferTimeline"),
    where("userId", "==", userId),
    orderBy("when", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const events: TimelineEvent[] = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as TimelineEvent);
    });
    callback(events);
  });
}

// University Operations
export const UNIVERSITIES: UniversityInfo[] = [
  {
    id: "uwisc",
    name: "University of Wisconsin–Madison",
    country: "USA",
    tuitionUSD: 41000,
    gpaCutoff: 7.8,
    language: "English",
    description: "Top-tier research university with strong engineering programs",
    requirements: ["TOEFL 100+", "GPA 7.8+", "SOP", "LORs"]
  },
  {
    id: "umn",
    name: "University of Minnesota – Twin Cities",
    country: "USA", 
    tuitionUSD: 36000,
    gpaCutoff: 7.5,
    language: "English",
    description: "Large public research university with diverse programs",
    requirements: ["TOEFL 95+", "GPA 7.5+", "SOP", "LORs"]
  },
  {
    id: "utwente",
    name: "University of Twente",
    country: "Netherlands",
    tuitionUSD: 15000,
    gpaCutoff: 7.0,
    language: "English",
    description: "Technical university known for innovation and entrepreneurship",
    requirements: ["IELTS 6.5+", "GPA 7.0+", "Motivation Letter"]
  },
  {
    id: "berkeley",
    name: "UC Berkeley",
    country: "USA",
    tuitionUSD: 48000,
    gpaCutoff: 9.0,
    language: "English",
    description: "World-renowned public research university",
    requirements: ["TOEFL 110+", "GPA 9.0+", "SOP", "LORs", "Portfolio"]
  },
];

export function checkEligibility(gpa: number, credits: number, uni: UniversityInfo) {
  const meetsGpa = gpa >= uni.gpaCutoff;
  const meetsCredits = credits >= 60;
  return { meetsGpa, meetsCredits, eligible: meetsGpa && meetsCredits };
}

export function calculateProgress(
  profile: TransferProfile,
  documents: TransferDocument[],
  deadlines: Deadline[]
): number {
  const stageWeights: Record<TransferStage, number> = {
    application_submitted: 20,
    docs_uploaded: 40,
    university_review: 60,
    visa_applied: 80,
    final_approval: 100,
  };
  
  const stageProgress = stageWeights[profile.stage];
  
  // Document completion bonus
  const requiredDocs = 8; // Assume 8 required documents
  const uploadedDocs = documents.filter(d => d.status !== "pending").length;
  const docBonus = Math.min(20, (uploadedDocs / requiredDocs) * 20);
  
  // Deadline completion bonus
  const completedDeadlines = deadlines.filter(d => d.completed).length;
  const deadlineBonus = deadlines.length > 0 ? (completedDeadlines / deadlines.length) * 10 : 0;
  
  return Math.min(100, stageProgress + docBonus + deadlineBonus);
}