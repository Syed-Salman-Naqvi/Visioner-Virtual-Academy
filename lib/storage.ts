import { AdmissionsApplication, Assignment, ChatMessage, StudentAccount } from "./types";

const APPS_STORAGE_KEY = "vva_admissions_applications";
const ASSIGNMENTS_STORAGE_KEY = "vva_student_assignments";
const CHAT_STORAGE_KEY = "vva_tutor_chat_history";
const STUDENT_ACCOUNTS_STORAGE_KEY = "vva_student_accounts";

export function getSavedApplications(): AdmissionsApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(APPS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load applications from localStorage", e);
    return [];
  }
}

export function saveApplication(app: AdmissionsApplication): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedApplications();
    const updated = [app, ...existing.filter((a) => a.id !== app.id)];
    localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save application", e);
  }
}

export function findApplicationById(id: string): AdmissionsApplication | undefined {
  const apps = getSavedApplications();
  const cleanId = id.trim().toUpperCase();
  return apps.find((a) => a.id.toUpperCase() === cleanId);
}

export function getStudentAccounts(): StudentAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STUDENT_ACCOUNTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStudentAccount(account: StudentAccount): void {
  if (typeof window === "undefined") return;
  const updated = [account, ...getStudentAccounts().filter((item) => item.applicationId !== account.applicationId && item.studentId !== account.studentId)];
  localStorage.setItem(STUDENT_ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
}

export function findStudentAccount(studentId: string, password: string): StudentAccount | undefined {
  return getStudentAccounts().find((account) => account.studentId.toLowerCase() === studentId.trim().toLowerCase() && account.password === password);
}

export function getSavedAssignments(defaultList: Assignment[]): Assignment[] {
  if (typeof window === "undefined") return defaultList;
  try {
    const raw = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (!raw) return defaultList;
    return JSON.parse(raw);
  } catch {
    return defaultList;
  }
}

export function updateAssignmentStatus(id: string, newStatus: "pending" | "submitted" | "graded"): Assignment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    const list: Assignment[] = raw ? JSON.parse(raw) : [];
    const updated = list.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function getStudentAssignments(studentId: string, defaultList: Assignment[]): Assignment[] {
  if (typeof window === "undefined") return defaultList;
  try {
    const raw = localStorage.getItem(`${ASSIGNMENTS_STORAGE_KEY}_${studentId}`);
    return raw ? JSON.parse(raw) : defaultList;
  } catch {
    return defaultList;
  }
}

export function saveStudentAssignments(studentId: string, assignments: Assignment[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${ASSIGNMENTS_STORAGE_KEY}_${studentId}`, JSON.stringify(assignments));
}

export function getSavedChat(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function appendChatMessage(msg: ChatMessage): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedChat();
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([...existing, msg]));
  } catch (e) {
    console.error(e);
  }
}

