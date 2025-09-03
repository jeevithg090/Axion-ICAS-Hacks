import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "./firebase";

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  category: "research" | "development" | "robotics";
  skillsRequired: string[];
  skillsOffered: string[];
  maxMembers: number;
  currentMembers: string[];
  creatorId: string;
  creatorName: string;
  status: "open" | "in_progress" | "completed";
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  mentorId?: string;
  mentorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  message: string;
  skills: string[];
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  authorId: string;
  authorName: string;
  content: string;
  type: "milestone" | "discussion" | "resource" | "announcement";
  timestamp: string;
}

// Project Operations
export async function createResearchProject(project: Omit<ResearchProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
  await addDoc(collection(db, "researchProjects"), {
    ...project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function updateResearchProject(projectId: string, updates: Partial<ResearchProject>): Promise<void> {
  const docRef = doc(db, "researchProjects", projectId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export function subscribeToResearchProjects(callback: (projects: ResearchProject[]) => void) {
  const q = query(
    collection(db, "researchProjects"),
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const projects: ResearchProject[] = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as ResearchProject);
    });
    callback(projects);
  });
}

export function subscribeToUserProjects(userId: string, callback: (projects: ResearchProject[]) => void) {
  const q = query(
    collection(db, "researchProjects"),
    where("currentMembers", "array-contains", userId),
    orderBy("updatedAt", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const projects: ResearchProject[] = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as ResearchProject);
    });
    callback(projects);
  });
}

// Application Operations
export async function applyToProject(
  projectId: string,
  applicantId: string,
  applicantName: string,
  applicantEmail: string,
  message: string,
  skills: string[]
): Promise<void> {
  await addDoc(collection(db, "projectApplications"), {
    projectId,
    applicantId,
    applicantName,
    applicantEmail,
    message,
    skills,
    status: "pending",
    appliedAt: new Date().toISOString(),
  });
}

export async function updateApplicationStatus(
  applicationId: string, 
  status: ProjectApplication['status']
): Promise<void> {
  const docRef = doc(db, "projectApplications", applicationId);
  await updateDoc(docRef, { status });
  
  // If accepted, add user to project members
  if (status === "accepted") {
    const appDoc = await getDocs(query(
      collection(db, "projectApplications"),
      where("__name__", "==", applicationId)
    ));
    
    if (!appDoc.empty) {
      const app = appDoc.docs[0].data() as ProjectApplication;
      const projectRef = doc(db, "researchProjects", app.projectId);
      await updateDoc(projectRef, {
        currentMembers: arrayUnion(app.applicantId),
        updatedAt: new Date().toISOString(),
      });
    }
  }
}

export function subscribeToProjectApplications(
  projectId: string, 
  callback: (applications: ProjectApplication[]) => void
) {
  const q = query(
    collection(db, "projectApplications"),
    where("projectId", "==", projectId),
    orderBy("appliedAt", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const applications: ProjectApplication[] = [];
    snapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() } as ProjectApplication);
    });
    callback(applications);
  });
}

// Project Updates Operations
export async function addProjectUpdate(update: Omit<ProjectUpdate, 'id'>): Promise<void> {
  await addDoc(collection(db, "projectUpdates"), {
    ...update,
    timestamp: new Date().toISOString(),
  });
}

export function subscribeToProjectUpdates(
  projectId: string, 
  callback: (updates: ProjectUpdate[]) => void
) {
  const q = query(
    collection(db, "projectUpdates"),
    where("projectId", "==", projectId),
    orderBy("timestamp", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const updates: ProjectUpdate[] = [];
    snapshot.forEach((doc) => {
      updates.push({ id: doc.id, ...doc.data() } as ProjectUpdate);
    });
    callback(updates);
  });
}

// AI-powered project recommendations
export async function getProjectRecommendations(
  userId: string,
  userSkills: string[],
  userInterests: string[]
): Promise<ResearchProject[]> {
  const q = query(
    collection(db, "researchProjects"),
    where("status", "==", "open")
  );
  
  const snapshot = await getDocs(q);
  const projects: ResearchProject[] = [];
  
  snapshot.forEach((doc) => {
    const project = { id: doc.id, ...doc.data() } as ResearchProject;
    
    // Skip if user is already a member
    if (project.currentMembers.includes(userId)) return;
    
    // Calculate relevance score
    let score = 0;
    
    // Skill matching
    const skillMatches = project.skillsRequired.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    score += skillMatches.length * 20;
    
    // Interest/tag matching
    const interestMatches = project.tags.filter(tag =>
      userInterests.some(interest =>
        interest.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(interest.toLowerCase())
      )
    );
    score += interestMatches.length * 15;
    
    // Category preference (could be based on user's past projects)
    if (userInterests.includes(project.category)) score += 10;
    
    projects.push({ ...project, relevanceScore: score } as any);
  });
  
  return projects
    .filter(p => (p as any).relevanceScore > 0)
    .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore)
    .slice(0, 10);
}