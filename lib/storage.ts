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



import { supabase } from "./supabase";
import { AdmissionsApplication, StudentAccount, Assignment } from "./types";
import { mockApplications } from "./mockData";

export async function getSavedApplications(): Promise<AdmissionsApplication[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          createdAt: item.created_at || item.createdAt || "2026-09-01",
          status: item.status || "Under Review",
          studentName: item.student_name || item.studentName || "Student",
          studentEmail: item.student_email || item.studentEmail || "",
          dateOfBirth: item.date_of_birth || item.dateOfBirth || "",
          nationality: item.nationality || "",
          countryOfResidence: item.country_of_residence || item.countryOfResidence || "",
          city: item.city || "",
          parentName: item.parent_name || item.parentName || "",
          parentEmail: item.parent_email || item.parentEmail || "",
          parentPhone: item.parent_phone || item.parentPhone || "",
          targetTrack: item.target_track || item.targetTrack || "",
          gradeLevel: item.grade_level || item.gradeLevel || "",
          timeZone: item.time_zone || item.timeZone || "",
          preferredCohortSlot: item.preferred_cohort_slot || item.preferredCohortSlot || "",
          assignedAdvisor: item.assigned_advisor || item.assignedAdvisor || "Admissions Office",
          documentsAttached: Array.isArray(item.documents_attached)
            ? item.documents_attached
            : Array.isArray(item.documentsAttached)
            ? item.documentsAttached
            : [],
          statementOfPurpose: item.statement_of_purpose || item.statementOfPurpose || "",
        }));
      }
    } catch (e) {
      console.error("Supabase fetch error:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("vva_admissions_apps");
      return raw ? JSON.parse(raw) : mockApplications;
    } catch {
      return mockApplications;
    }
  }

  return mockApplications;
}

export async function saveApplication(app: AdmissionsApplication): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem("vva_admissions_apps");
      const list: AdmissionsApplication[] = existing ? JSON.parse(existing) : mockApplications;
      const next = [app, ...list.filter((i) => i.id !== app.id)];
      localStorage.setItem("vva_admissions_apps", JSON.stringify(next));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }

  if (supabase) {
    try {
      await supabase.from("applications").upsert({
        id: app.id,
        created_at: app.createdAt,
        status: app.status,
        student_name: app.studentName,
        student_email: app.studentEmail,
        date_of_birth: app.dateOfBirth,
        nationality: app.nationality,
        country_of_residence: app.countryOfResidence,
        city: app.city,
        parent_name: app.parentName,
        parent_email: app.parentEmail,
        parent_phone: app.parentPhone,
        target_track: app.targetTrack,
        grade_level: app.gradeLevel,
        time_zone: app.timeZone,
        preferred_cohort_slot: app.preferredCohortSlot,
        assigned_advisor: app.assignedAdvisor,
        documents_attached: app.documentsAttached,
        statement_of_purpose: app.statementOfPurpose,
      });
    } catch (e) {
      console.error("Supabase save error:", e);
    }
  }
}

export async function findApplicationById(id: string): Promise<AdmissionsApplication | null> {
  const apps = await getSavedApplications();
  return apps.find((item) => item.id.toUpperCase() === id.trim().toUpperCase()) || null;
}

export async function getStudentAccounts(): Promise<StudentAccount[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("student_accounts").select("*");
      if (!error && data) {
        return data.map((item: any) => ({
          applicationId: item.application_id || item.applicationId,
          studentId: item.student_id || item.studentId,
          password: item.password,
          studentName: item.student_name || item.studentName,
          studentEmail: item.student_email || item.studentEmail,
          createdAt: item.created_at || item.createdAt,
        }));
      }
    } catch (e) {
      console.error("Supabase fetch accounts error:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("vva_student_accounts");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  return [];
}

export async function saveStudentAccount(account: StudentAccount): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("vva_student_accounts");
      const list: StudentAccount[] = raw ? JSON.parse(raw) : [];
      const next = [account, ...list.filter((i) => i.applicationId !== account.applicationId)];
      localStorage.setItem("vva_student_accounts", JSON.stringify(next));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }

  if (supabase) {
    try {
      await supabase.from("student_accounts").upsert({
        application_id: account.applicationId,
        student_id: account.studentId,
        password: account.password,
        student_name: account.studentName,
        student_email: account.studentEmail,
        created_at: account.createdAt,
      });
    } catch (e) {
      console.error("Supabase account save error:", e);
    }
  }
}

export async function getStudentAssignments(
  studentId: string,
  defaultList: Assignment[]
): Promise<Assignment[]> {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(`vva_assignments_${studentId}`);
      return raw ? JSON.parse(raw) : defaultList;
    } catch {
      return defaultList;
    }
  }
  return defaultList;
}

export async function saveStudentAssignments(
  studentId: string,
  assignments: Assignment[]
): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`vva_assignments_${studentId}`, JSON.stringify(assignments));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }
}