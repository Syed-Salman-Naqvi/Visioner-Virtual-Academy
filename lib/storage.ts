// import { AdmissionsApplication, Assignment, ChatMessage, StudentAccount } from "./types";
// import { supabase } from './supabase';

// const APPS_STORAGE_KEY = "vva_admissions_applications";
// const ASSIGNMENTS_STORAGE_KEY = "vva_student_assignments";
// const CHAT_STORAGE_KEY = "vva_tutor_chat_history";
// const STUDENT_ACCOUNTS_STORAGE_KEY = "vva_student_accounts";

// export function getSavedApplications(): AdmissionsApplication[] {
//   if (typeof window === "undefined") return [];
//   try {
//     const raw = localStorage.getItem(APPS_STORAGE_KEY);
//     if (!raw) return [];
//     return JSON.parse(raw);
//   } catch (e) {
//     console.error("Failed to load applications from localStorage", e);
//     return [];
//   }
// }

// export function saveApplication(app: AdmissionsApplication): void {
//   if (typeof window === "undefined") return;
//   try {
//     const existing = getSavedApplications();
//     const updated = [app, ...existing.filter((a) => a.id !== app.id)];
//     localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(updated));
//   } catch (e) {
//     console.error("Failed to save application", e);
//   }
// }

// export function findApplicationById(id: string): AdmissionsApplication | undefined {
//   const apps = getSavedApplications();
//   const cleanId = id.trim().toUpperCase();
//   return apps.find((a) => a.id.toUpperCase() === cleanId);
// }

// export function getStudentAccounts(): StudentAccount[] {
//   if (typeof window === "undefined") return [];
//   try {
//     const raw = localStorage.getItem(STUDENT_ACCOUNTS_STORAGE_KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// }

// export function saveStudentAccount(account: StudentAccount): void {
//   if (typeof window === "undefined") return;
//   const updated = [account, ...getStudentAccounts().filter((item) => item.applicationId !== account.applicationId && item.studentId !== account.studentId)];
//   localStorage.setItem(STUDENT_ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
// }

// export function findStudentAccount(studentId: string, password: string): StudentAccount | undefined {
//   return getStudentAccounts().find((account) => account.studentId.toLowerCase() === studentId.trim().toLowerCase() && account.password === password);
// }

// export function getSavedAssignments(defaultList: Assignment[]): Assignment[] {
//   if (typeof window === "undefined") return defaultList;
//   try {
//     const raw = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
//     if (!raw) return defaultList;
//     return JSON.parse(raw);
//   } catch {
//     return defaultList;
//   }
// }

// export function updateAssignmentStatus(id: string, newStatus: "pending" | "submitted" | "graded"): Assignment[] {
//   if (typeof window === "undefined") return [];
//   try {
//     const raw = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
//     const list: Assignment[] = raw ? JSON.parse(raw) : [];
//     const updated = list.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
//     localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(updated));
//     return updated;
//   } catch {
//     return [];
//   }
// }

// export function getStudentAssignments(studentId: string, defaultList: Assignment[]): Assignment[] {
//   if (typeof window === "undefined") return defaultList;
//   try {
//     const raw = localStorage.getItem(`${ASSIGNMENTS_STORAGE_KEY}_${studentId}`);
//     return raw ? JSON.parse(raw) : defaultList;
//   } catch {
//     return defaultList;
//   }
// }

// export function saveStudentAssignments(studentId: string, assignments: Assignment[]): void {
//   if (typeof window === "undefined") return;
//   localStorage.setItem(`${ASSIGNMENTS_STORAGE_KEY}_${studentId}`, JSON.stringify(assignments));
// }

// export function getSavedChat(): ChatMessage[] {
//   if (typeof window === "undefined") return [];
//   try {
//     const raw = localStorage.getItem(CHAT_STORAGE_KEY);
//     if (!raw) return [];
//     return JSON.parse(raw);
//   } catch {
//     return [];
//   }
// }

// export function appendChatMessage(msg: ChatMessage): void {
//   if (typeof window === "undefined") return;
//   try {
//     const existing = getSavedChat();
//     localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([...existing, msg]));
//   } catch (e) {
//     console.error(e);
//   }
// }

import { AdmissionsApplication, Assignment, ChatMessage, StudentAccount } from "./types";
import { supabase } from './supabase';

// ==================== ADMISSIONS APPLICATIONS ====================

export async function getSavedApplications(): Promise<AdmissionsApplication[]> {
  try {
    const { data, error } = await supabase.from('admissions').select('*');
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error("Failed to load applications from Supabase", e);
    return [];
  }
}

export async function saveApplication(app: AdmissionsApplication): Promise<void> {
  try {
    const { error } = await supabase.from('admissions').upsert(app);
    if (error) throw error;
  } catch (e) {
    console.error("Failed to save application to Supabase", e);
  }
}

export async function findApplicationById(id: string): Promise<AdmissionsApplication | undefined> {
  try {
    const apps = await getSavedApplications();
    const cleanId = id.trim().toUpperCase();
    return apps.find((a) => a.id.toUpperCase() === cleanId);
  } catch (e) {
    console.error("Failed to find application", e);
    return undefined;
  }
}

// ==================== STUDENT ACCOUNTS ====================

export async function getStudentAccounts(): Promise<StudentAccount[]> {
  try {
    const { data, error } = await supabase.from('student_accounts').select('*');
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function saveStudentAccount(account: StudentAccount): Promise<void> {
  try {
    const { error } = await supabase.from('student_accounts').upsert(account);
    if (error) throw error;
  } catch (e) {
    console.error("Failed to save student account", e);
  }
}

export async function findStudentAccount(studentId: string, password: string): Promise<StudentAccount | undefined> {
  try {
    const accounts = await getStudentAccounts();
    return accounts.find((account) => account.studentId.toLowerCase() === studentId.trim().toLowerCase() && account.password === password);
  } catch {
    return undefined;
  }
}

// ==================== ASSIGNMENTS ====================

export async function getSavedAssignments(defaultList: Assignment[]): Promise<Assignment[]> {
  try {
    const { data, error } = await supabase.from('assignments').select('*');
    if (error || !data || data.length === 0) return defaultList;
    return data;
  } catch {
    return defaultList;
  }
}

export async function updateAssignmentStatus(id: string, newStatus: "pending" | "submitted" | "graded"): Promise<Assignment[]> {
  try {
    const { error } = await supabase.from('assignments').update({ status: newStatus }).eq('id', id);
    if (error) throw error;
    return await getSavedAssignments([]);
  } catch {
    return [];
  }
}

export async function getStudentAssignments(studentId: string, defaultList: Assignment[]): Promise<Assignment[]> {
  try {
    const { data, error } = await supabase.from('assignments').select('*').eq('studentId', studentId);
    if (error || !data || data.length === 0) return defaultList;
    return data;
  } catch {
    return defaultList;
  }
}

export async function saveStudentAssignments(studentId: string, assignments: Assignment[]): Promise<void> {
  try {
    const { error } = await supabase.from('assignments').upsert(assignments);
    if (error) throw error;
  } catch (e) {
    console.error("Failed to save assignments", e);
  }
}

// ==================== TUTOR CHAT ====================

export async function getSavedChat(): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase.from('chat_history').select('*');
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function appendChatMessage(msg: ChatMessage): Promise<void> {
  try {
    const { error } = await supabase.from('chat_history').insert([msg]);
    if (error) throw error;
  } catch (e) {
    console.error("Failed to save chat message", e);
  }
}
