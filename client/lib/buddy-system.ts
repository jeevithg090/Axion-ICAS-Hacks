import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  orderBy 
} from "firebase/firestore";
import { db } from "./firebase";

export interface BuddyProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "mentor" | "mentee";
  program: string;
  year: number;
  targetCountry?: string;
  targetUniversity?: string;
  interests: string[];
  bio: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface BuddyMatch {
  id: string;
  mentorId: string;
  menteeId: string;
  status: "pending" | "accepted" | "active" | "completed";
  matchScore: number;
  createdAt: string;
  acceptedAt?: string;
}

export interface BuddyMessage {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Buddy Profile Operations
export async function createBuddyProfile(profile: Omit<BuddyProfile, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, "buddyProfiles"), {
    ...profile,
    createdAt: new Date().toISOString(),
  });
}

export async function updateBuddyProfile(profileId: string, updates: Partial<BuddyProfile>): Promise<void> {
  const docRef = doc(db, "buddyProfiles", profileId);
  await updateDoc(docRef, updates);
}

export async function getBuddyProfile(userId: string): Promise<BuddyProfile | null> {
  const q = query(collection(db, "buddyProfiles"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as BuddyProfile;
}

// Matching Algorithm
export async function findPotentialMatches(menteeProfile: BuddyProfile): Promise<BuddyProfile[]> {
  const q = query(
    collection(db, "buddyProfiles"),
    where("role", "==", "mentor"),
    where("isAvailable", "==", true),
    where("program", "==", menteeProfile.program)
  );
  
  const snapshot = await getDocs(q);
  const mentors: BuddyProfile[] = [];
  
  snapshot.forEach((doc) => {
    const mentor = { id: doc.id, ...doc.data() } as BuddyProfile;
    
    // Calculate match score based on various factors
    let score = 0;
    
    // Same target country/university
    if (mentor.targetCountry === menteeProfile.targetCountry) score += 30;
    if (mentor.targetUniversity === menteeProfile.targetUniversity) score += 40;
    
    // Common interests
    const commonInterests = mentor.interests.filter(interest => 
      menteeProfile.interests.includes(interest)
    );
    score += commonInterests.length * 10;
    
    // Year difference (prefer 1-2 years ahead)
    const yearDiff = mentor.year - menteeProfile.year;
    if (yearDiff >= 1 && yearDiff <= 2) score += 20;
    
    mentors.push({ ...mentor, matchScore: score } as any);
  });
  
  return mentors.sort((a, b) => (b as any).matchScore - (a as any).matchScore);
}

// Match Operations
export async function createBuddyMatch(mentorId: string, menteeId: string, score: number): Promise<void> {
  await addDoc(collection(db, "buddyMatches"), {
    mentorId,
    menteeId,
    status: "pending",
    matchScore: score,
    createdAt: new Date().toISOString(),
  });
}

export async function updateMatchStatus(matchId: string, status: BuddyMatch['status']): Promise<void> {
  const docRef = doc(db, "buddyMatches", matchId);
  const updates: any = { status };
  
  if (status === "accepted") {
    updates.acceptedAt = new Date().toISOString();
  }
  
  await updateDoc(docRef, updates);
}

export function subscribeToUserMatches(userId: string, callback: (matches: BuddyMatch[]) => void) {
  const q = query(
    collection(db, "buddyMatches"),
    where("menteeId", "==", userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const matches: BuddyMatch[] = [];
    snapshot.forEach((doc) => {
      matches.push({ id: doc.id, ...doc.data() } as BuddyMatch);
    });
    callback(matches);
  });
}

// Messaging Operations
export async function sendBuddyMessage(
  matchId: string, 
  senderId: string, 
  content: string
): Promise<void> {
  await addDoc(collection(db, "buddyMessages"), {
    matchId,
    senderId,
    content,
    timestamp: new Date().toISOString(),
    read: false,
  });
}

export function subscribeToMatchMessages(
  matchId: string, 
  callback: (messages: BuddyMessage[]) => void
) {
  const q = query(
    collection(db, "buddyMessages"),
    where("matchId", "==", matchId),
    orderBy("timestamp", "asc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages: BuddyMessage[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as BuddyMessage);
    });
    callback(messages);
  });
}