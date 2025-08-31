import app from "./firebase";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  addDoc,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export type Syllabus = { s1: string; s2: string; s3: string };
export type Course = {
  id: string;
  code: string;
  name: string;
  syllabus: Syllabus;
  notesHtml?: string;
};
export type Upload = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: number;
  docId?: string;
};

const db = getFirestore(app);
const storage = getStorage(app);

export function userIdFromEmail(email: string) {
  return email.toLowerCase().replace(/[^a-z0-9._-]/g, "_");
}

function courseCol(userId: string) {
  return collection(db, "studyCentres", userId, "courses");
}

function courseDoc(userId: string, courseId: string) {
  return doc(db, "studyCentres", userId, "courses", courseId);
}

function uploadsCol(userId: string, courseId: string) {
  return collection(db, "studyCentres", userId, "courses", courseId, "uploads");
}

export async function ensureInit(userId: string) {
  const snap = await getDocs(courseCol(userId));
  if (snap.empty) {
    const defaults = Array.from({ length: 6 }).map((_, i) => ({
      id: `c${i + 1}`,
      code: `C${i + 1}`,
      name: `Course ${i + 1}`,
      syllabus: { s1: "", s2: "", s3: "" },
      notesHtml: "",
    }));
    await Promise.all(defaults.map((c) => setDoc(courseDoc(userId, c.id), c)));
  }
}

export function subscribeCourses(
  userId: string,
  cb: (courses: Course[]) => void,
) {
  const q = query(courseCol(userId));
  return onSnapshot(q, (snap) => {
    const list: Course[] = [];
    snap.forEach((d) => list.push(d.data() as Course));
    // Keep stable order by id (c1..c6)
    list.sort((a, b) => a.id.localeCompare(b.id));
    cb(list);
  });
}

export async function updateCourseMeta(
  userId: string,
  courseId: string,
  data: Partial<Pick<Course, "code" | "name">>,
) {
  await updateDoc(courseDoc(userId, courseId), data as any);
}

export async function saveSyllabus(
  userId: string,
  courseId: string,
  syllabus: Syllabus,
) {
  await updateDoc(courseDoc(userId, courseId), { syllabus } as any);
}

export async function saveNotes(
  userId: string,
  courseId: string,
  notesHtml: string,
) {
  await updateDoc(courseDoc(userId, courseId), { notesHtml } as any);
}

export function subscribeUploads(
  userId: string,
  courseId: string,
  cb: (items: Upload[]) => void,
) {
  const q = query(uploadsCol(userId, courseId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const list: Upload[] = [];
    snap.forEach((d) => list.push(d.data() as Upload));
    cb(list);
  });
}

export async function uploadNote(userId: string, courseId: string, file: File) {
  const path = `studyCentre/${userId}/${courseId}/${Date.now()}_${file.name}`;
  const sref = ref(storage, path);
  await uploadBytes(sref, file, { contentType: file.type });
  const url = await getDownloadURL(sref);
  const dref = await addDoc(uploadsCol(userId, courseId), {
    id: path,
    name: file.name,
    url,
    type: file.type || inferTypeFromName(file.name),
    size: file.size,
    createdAt: Date.now(),
  } satisfies Upload as any);
  await updateDoc(dref, { docId: dref.id } as any);
  return url;
}

export async function deleteUpload(
  userId: string,
  courseId: string,
  uploadId: string,
) {
  try {
    const sref = ref(storage, uploadId);
    await deleteObject(sref);
  } catch {}
  // We stored uploads as auto-id docs; need to find the doc with id field == uploadId and delete it
  const snap = await getDocs(uploadsCol(userId, courseId));
  const target = snap.docs.find((d) => (d.data() as Upload).id === uploadId);
  if (target) await deleteDoc(target.ref);
}

function inferTypeFromName(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (!ext) return "application/octet-stream";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext))
    return `image/${ext === "jpg" ? "jpeg" : ext}`;
  if (ext === "pdf") return "application/pdf";
  if (["ppt", "pptx"].includes(ext)) return "application/vnd.ms-powerpoint";
  if (["doc", "docx"].includes(ext)) return "application/msword";
  if (["xls", "xlsx"].includes(ext)) return "application/vnd.ms-excel";
  return "application/octet-stream";
}
