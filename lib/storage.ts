// import { supabase } from "./supabase";
// import { AdmissionsApplication, StudentAccount, Assignment } from "./types";
// import { mockApplications } from "./mockData";

// export async function getSavedApplications(): Promise<AdmissionsApplication[]> {
//   if (typeof window === "undefined") {
//     return mockApplications;
//   }
//   try {
//     const { data, error } = await supabase
//       .from("applications")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error || !data || data.length === 0) {
//       const raw = localStorage.getItem("vva_admissions_apps");
//       return raw ? JSON.parse(raw) : mockApplications;
//     }

//     return data.map((item) => ({
//       id: item.id,
//       createdAt: item.created_at || item.createdAt || "2026-09-01",
//       status: item.status || "Under Review",
//       studentName: item.student_name || item.studentName || "Student",
//       studentEmail: item.student_email || item.studentEmail || "",
//       dateOfBirth: item.date_of_birth || item.dateOfBirth || "",
//       nationality: item.nationality || "",
//       countryOfResidence: item.country_of_residence || item.countryOfResidence || "",
//       city: item.city || "",
//       parentName: item.parent_name || item.parentName || "",
//       parentEmail: item.parent_email || item.parentEmail || "",
//       parentPhone: item.parent_phone || item.parentPhone || "",
//       targetTrack: item.target_track || item.targetTrack || "",
//       gradeLevel: item.grade_level || item.gradeLevel || "",
//       timeZone: item.time_zone || item.timeZone || "",
//       preferredCohortSlot: item.preferred_cohort_slot || item.preferredCohortSlot || "",
//       assignedAdvisor: item.assigned_advisor || item.assignedAdvisor || "Admissions Office",
//       documentsAttached: item.documents_attached || item.documentsAttached || [],
//       statementOfPurpose: item.statement_of_purpose || item.statementOfPurpose || "",
//     }));
//   } catch {
//     const raw = localStorage.getItem("vva_admissions_apps");
//     return raw ? JSON.parse(raw) : mockApplications;
//   }
// }

// export async function saveApplication(app: AdmissionsApplication): Promise<void> {
//   if (typeof window !== "undefined") {
//     try {
//       const existing = localStorage.getItem("vva_admissions_apps");
//       const list: AdmissionsApplication[] = existing ? JSON.parse(existing) : mockApplications;
//       const next = [app, ...list.filter((i) => i.id !== app.id)];
//       localStorage.setItem("vva_admissions_apps", JSON.stringify(next));
//     } catch (e) {
//       console.error("Local storage error:", e);
//     }
//   }

//   try {
//     await supabase.from("applications").upsert({
//       id: app.id,
//       created_at: app.createdAt,
//       status: app.status,
//       student_name: app.studentName,
//       student_email: app.studentEmail,
//       date_of_birth: app.dateOfBirth,
//       nationality: app.nationality,
//       country_of_residence: app.countryOfResidence,
//       city: app.city,
//       parent_name: app.parentName,
//       parent_email: app.parentEmail,
//       parent_phone: app.parentPhone,
//       target_track: app.targetTrack,
//       grade_level: app.gradeLevel,
//       time_zone: app.timeZone,
//       preferred_cohort_slot: app.preferredCohortSlot,
//       assigned_advisor: app.assignedAdvisor,
//       documents_attached: app.documentsAttached,
//       statement_of_purpose: app.statementOfPurpose,
//     });
//   } catch (e) {
//     console.error("Supabase Save Error:", e);
//   }
// }

// export async function findApplicationById(id: string): Promise<AdmissionsApplication | null> {
//   const apps = await getSavedApplications();
//   return apps.find((item) => item.id.toUpperCase() === id.trim().toUpperCase()) || null;
// }

// export async function getStudentAccounts(): Promise<StudentAccount[]> {
//   if (typeof window === "undefined") {
//     return [];
//   }
//   try {
//     const { data, error } = await supabase.from("student_accounts").select("*");
//     if (error || !data) {
//       const raw = localStorage.getItem("vva_student_accounts");
//       return raw ? JSON.parse(raw) : [];
//     }
//     return data.map((item) => ({
//       applicationId: item.application_id,
//       studentId: item.student_id,
//       password: item.password,
//       studentName: item.student_name,
//       studentEmail: item.student_email,
//       createdAt: item.created_at,
//     }));
//   } catch {
//     const raw = localStorage.getItem("vva_student_accounts");
//     return raw ? JSON.parse(raw) : [];
//   }
// }

// export async function saveStudentAccount(account: StudentAccount): Promise<void> {
//   if (typeof window !== "undefined") {
//     try {
//       const raw = localStorage.getItem("vva_student_accounts");
//       const list: StudentAccount[] = raw ? JSON.parse(raw) : [];
//       const next = [account, ...list.filter((i) => i.applicationId !== account.applicationId)];
//       localStorage.setItem("vva_student_accounts", JSON.stringify(next));
//     } catch (e) {
//       console.error("Local storage error:", e);
//     }
//   }

//   try {
//     await supabase.from("student_accounts").upsert({
//       application_id: account.applicationId,
//       student_id: account.studentId,
//       password: account.password,
//       student_name: account.studentName,
//       student_email: account.studentEmail,
//       created_at: account.createdAt,
//     });
//   } catch (e) {
//     console.error("Supabase Save Error:", e);
//   }
// }

// export async function getStudentAssignments(
//   studentId: string,
//   defaultList: Assignment[] = []
// ): Promise<Assignment[]> {
//   if (typeof window === "undefined") {
//     return defaultList;
//   }
//   try {
//     const raw = localStorage.getItem(`vva_assignments_${studentId}`);
//     return raw ? JSON.parse(raw) : defaultList;
//   } catch {
//     return defaultList;
//   }
// }

// export async function saveStudentAssignments(
//   studentId: string,
//   assignments: Assignment[]
// ): Promise<void> {
//   if (typeof window !== "undefined") {
//     try {
//       localStorage.setItem(`vva_assignments_${studentId}`, JSON.stringify(assignments));
//     } catch (e) {
//       console.error("Local storage error:", e);
//     }
//   }
// }


import { supabase } from "./supabase";
import { AdmissionsApplication, StudentAccount, Assignment } from "./types";
import { mockApplications } from "./mockData";

export async function getSavedApplications(): Promise<AdmissionsApplication[]> {
  let localApps: AdmissionsApplication[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("vva_admissions_apps");
      if (raw) localApps = JSON.parse(raw);
    } catch (e) {
      console.error("LocalStorage fetch error:", e);
    }
  }

  let dbApps: AdmissionsApplication[] = [];
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && Array.isArray(data)) {
        dbApps = data.map((item: any) => ({
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
      console.error("Supabase applications fetch error:", e);
    }
  }

  const appMap = new Map<string, AdmissionsApplication>();
  [...mockApplications, ...localApps, ...dbApps].forEach((app) => {
    if (app && app.id) appMap.set(app.id.trim().toUpperCase(), app);
  });

  return Array.from(appMap.values());
}

export async function saveApplication(app: AdmissionsApplication): Promise<void> {
  if (!app) return;

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
      const { error } = await supabase.from("applications").upsert({
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
      if (error) console.error("Supabase application save error:", error);
    } catch (e) {
      console.error("Supabase save error:", e);
    }
  }
}

export async function deleteApplication(id: string): Promise<void> {
  const cleanId = id.trim();
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem("vva_admissions_apps");
      if (existing) {
        const list: AdmissionsApplication[] = JSON.parse(existing);
        const filtered = list.filter((i) => i.id.toUpperCase() !== cleanId.toUpperCase());
        localStorage.setItem("vva_admissions_apps", JSON.stringify(filtered));
      }
    } catch (e) {
      console.error("Storage delete application error:", e);
    }
  }

  if (supabase) {
    try {
      const { error } = await supabase.from("applications").delete().eq("id", cleanId);
      if (error) console.error("Supabase delete application error:", error);
    } catch (e) {
      console.error("Supabase delete error:", e);
    }
  }
}

export async function findApplicationById(id: string): Promise<AdmissionsApplication | null> {
  const apps = await getSavedApplications();
  return apps.find((item) => item.id.toUpperCase() === id.trim().toUpperCase()) || null;
}

export async function getStudentAccounts(): Promise<StudentAccount[]> {
  let localAccounts: StudentAccount[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("vva_student_accounts");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) localAccounts = parsed;
      }
    } catch (e) {
      console.error("LocalStorage fetch accounts error:", e);
    }
  }

  let dbAccounts: StudentAccount[] = [];
  if (supabase) {
    try {
      const { data, error } = await supabase.from("student_accounts").select("*");
      if (!error && data && Array.isArray(data)) {
        dbAccounts = data.map((item: any) => ({
          applicationId: item.application_id || item.applicationId,
          studentId: item.student_id || item.studentId || item.application_id || item.applicationId,
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

  const accountMap = new Map<string, StudentAccount>();
  [...dbAccounts, ...localAccounts].forEach((acc) => {
    if (!acc) return;
    const studentKey = acc.studentId ? acc.studentId.trim().toUpperCase() : "";
    const appKey = acc.applicationId ? acc.applicationId.trim().toUpperCase() : "";

    if (studentKey) accountMap.set(studentKey, acc);
    if (appKey) accountMap.set(appKey, acc);
  });

  return Array.from(new Set(accountMap.values()));
}

export async function saveStudentAccount(account: StudentAccount): Promise<void> {
  if (!account) return;

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("vva_student_accounts");
      const list: StudentAccount[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter(
        (i) =>
          i.applicationId?.toUpperCase() !== account.applicationId?.toUpperCase() &&
          i.studentId?.toUpperCase() !== account.studentId?.toUpperCase()
      );
      const next = [account, ...filtered];
      localStorage.setItem("vva_student_accounts", JSON.stringify(next));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  }

  if (supabase) {
    try {
      const { error } = await supabase.from("student_accounts").upsert({
        application_id: account.applicationId,
        student_id: account.studentId,
        password: account.password,
        student_name: account.studentName,
        student_email: account.studentEmail,
        created_at: account.createdAt,
      });
      if (error) console.error("Supabase account upsert error:", error);
    } catch (e) {
      console.error("Supabase account save error:", e);
    }
  }
}

export async function deleteStudentAccount(studentId: string): Promise<void> {
  const cleanId = studentId.trim();
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("vva_student_accounts");
      if (raw) {
        const list: StudentAccount[] = JSON.parse(raw);
        const filtered = list.filter(
          (i) =>
            i.studentId?.toUpperCase() !== cleanId.toUpperCase() &&
            i.applicationId?.toUpperCase() !== cleanId.toUpperCase()
        );
        localStorage.setItem("vva_student_accounts", JSON.stringify(filtered));
      }
    } catch (e) {
      console.error("LocalStorage delete account error:", e);
    }
  }

  if (supabase) {
    try {
      await supabase.from("student_accounts").delete().eq("student_id", cleanId);
      await supabase.from("student_accounts").delete().eq("application_id", cleanId);
    } catch (e) {
      console.error("Supabase delete account error:", e);
    }
  }
}

export async function getStudentAssignments(studentId: string, defaultList: Assignment[]): Promise<Assignment[]> {
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

export async function saveStudentAssignments(studentId: string, assignments: Assignment[]): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`vva_assignments_${studentId}`, JSON.stringify(assignments));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }
}