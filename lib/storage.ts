import { supabase } from "./supabase";
import { AdmissionsApplication, StudentAccount, Assignment } from "./types";
import { mockApplications } from "./mockData";

export async function getSavedApplications(): Promise<AdmissionsApplication[]> {
  let localApps: AdmissionsApplication[] = [];
  if (typeof window !== "undefined") {
    try { const raw = localStorage.getItem("vva_admissions_apps"); if (raw) localApps = JSON.parse(raw); } catch {}
  }
  let dbApps: AdmissionsApplication[] = [];
  try {
    const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    if (data) dbApps = data.map((item: any) => ({
      id: item.id, createdAt: item.created_at || item.createdAt || new Date().toISOString(), status: item.status || "Under Review",
      studentName: item.student_name || item.studentName || "Student", studentEmail: item.student_email || item.studentEmail || "",
      dateOfBirth: item.date_of_birth || item.dateOfBirth || "", nationality: item.nationality || "", countryOfResidence: item.country_of_residence || "",
      city: item.city || "", parentName: item.parent_name || "", parentEmail: item.parent_email || "", parentPhone: item.parent_phone || "",
      targetTrack: item.target_track || "", gradeLevel: item.grade_level || "", timeZone: item.time_zone || "",
      preferredCohortSlot: item.preferred_cohort_slot || "", assignedAdvisor: item.assigned_advisor || "Admissions Office",
      documentsAttached: Array.isArray(item.documents_attached) ? item.documents_attached : [], statementOfPurpose: item.statement_of_purpose || ""
    }));
  } catch (error) { console.error("Cloud applications read error:", error); }
  const map = new Map<string, AdmissionsApplication>();
  [...mockApplications, ...localApps, ...dbApps].forEach((app) => app?.id && map.set(app.id.trim().toUpperCase(), app));
  return [...map.values()];
}

export async function saveApplication(app: AdmissionsApplication): Promise<void> {
  if (!app) return;
  if (typeof window !== "undefined") {
    try { const old = localStorage.getItem("vva_admissions_apps"); const list = old ? JSON.parse(old) : mockApplications; localStorage.setItem("vva_admissions_apps", JSON.stringify([app, ...list.filter((i: any) => i.id !== app.id)])); } catch {}
  }
  const { error } = await supabase.from("applications").upsert({ id: app.id, created_at: app.createdAt, status: app.status, student_name: app.studentName, student_email: app.studentEmail, date_of_birth: app.dateOfBirth,
    nationality: app.nationality, country_of_residence: app.countryOfResidence, city: app.city, parent_name: app.parentName, parent_email: app.parentEmail, parent_phone: app.parentPhone,
    target_track: app.targetTrack, grade_level: app.gradeLevel, time_zone: app.timeZone, preferred_cohort_slot: app.preferredCohortSlot, assigned_advisor: app.assignedAdvisor,
    documents_attached: app.documentsAttached, statement_of_purpose: app.statementOfPurpose });
  if (error) console.error("Supabase application save error:", error);
}

export async function deleteApplication(id: string): Promise<void> {
  const cleanId = id.trim();
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("vva_admissions_apps");
      if (raw) localStorage.setItem("vva_admissions_apps", JSON.stringify(JSON.parse(raw).filter((i: any) => i.id?.toUpperCase() !== cleanId.toUpperCase())));
    } catch {}
  }
  const { error } = await supabase.from("applications").delete().eq("id", cleanId);
  if (error) console.error("Supabase application delete error:", error);
}

export async function findApplicationById(id: string): Promise<AdmissionsApplication | null> { return (await getSavedApplications()).find((x) => x.id.toUpperCase() === id.trim().toUpperCase()) || null; }

export async function getStudentAccounts(): Promise<StudentAccount[]> {
  let local: StudentAccount[] = [];
  if (typeof window !== "undefined") try { const raw = localStorage.getItem("vva_student_accounts"); if (raw) local = JSON.parse(raw); } catch {}
  let cloud: StudentAccount[] = [];
  try {
    const { data } = await supabase.from("student_accounts").select("*");
    cloud = (data || []).map((x: any) => ({ applicationId: x.application_id || x.applicationId, studentId: x.student_id || x.studentId || x.application_id, password: x.password || "", studentName: x.student_name || x.studentName || "Student", studentEmail: x.student_email || x.studentEmail || "", createdAt: x.created_at || x.createdAt || "" }));
  } catch (error) { console.error("Cloud student accounts read error:", error); }
  const map = new Map<string, StudentAccount>();
  [...local, ...cloud].forEach((x) => { if (x?.studentId) map.set(x.studentId.toUpperCase(), x); });
  return [...map.values()];
}

export async function saveStudentAccount(account: StudentAccount): Promise<void> {
  if (typeof window !== "undefined") try { const raw = localStorage.getItem("vva_student_accounts"); const list: StudentAccount[] = raw ? JSON.parse(raw) : []; localStorage.setItem("vva_student_accounts", JSON.stringify([account, ...list.filter((x) => x.studentId?.toUpperCase() !== account.studentId?.toUpperCase())])); } catch {}
  const { error } = await supabase.from("student_accounts").upsert({ application_id: account.applicationId, student_id: account.studentId, password: account.password, student_name: account.studentName, student_email: account.studentEmail, created_at: account.createdAt }, { onConflict: "student_id" });
  if (error) console.error("Supabase account save error:", error);
}

export async function deleteStudentAccount(studentId: string): Promise<void> {
  const id = studentId.trim();
  if (typeof window !== "undefined") try { const raw = localStorage.getItem("vva_student_accounts"); if (raw) localStorage.setItem("vva_student_accounts", JSON.stringify(JSON.parse(raw).filter((x: any) => x.studentId?.toUpperCase() !== id.toUpperCase() && x.applicationId?.toUpperCase() !== id.toUpperCase()))); } catch {}
  const { error } = await supabase.from("student_accounts").delete().eq("student_id", id);
  if (error) console.error("Supabase account delete error:", error);
}

export async function deleteStudentAssignments(studentId: string): Promise<void> {
  const id = studentId.trim();
  if (!id) return;
  if (typeof window !== "undefined") localStorage.removeItem(`vva_assignments_${id}`);
  const { error } = await supabase.from("assignments").delete().eq("student_id", id);
  if (error) console.error("Supabase assignment cleanup error:", error);
}

export async function getStudentAssignments(studentId: string, defaultList: Assignment[] = []): Promise<Assignment[]> {
  const id = studentId.trim();
  if (!id) return defaultList;
  let local: Assignment[] = [];
  if (typeof window !== "undefined") {
    try { const raw = localStorage.getItem(`vva_assignments_${id}`); if (raw) local = JSON.parse(raw); } catch {}
  }

  try {
    const { data, error } = await supabase.from("assignments").select("*").eq("student_id", id).order("created_at", { ascending: true });
    if (!error && data?.length) {
      return data.map((row: any) => ({
        id: String(row.id), title: row.title || row.assignment?.title || "Untitled assignment", course: row.course || row.subject || row.assignment?.course || "",
        courseCode: row.course_code || row.subject_code || row.assignment?.courseCode || "", dueDate: row.due_date || row.assignment?.dueDate || "",
        status: row.status || row.assignment?.status || "pending", instructions: row.instructions || row.description || row.assignment?.instructions || "",
        score: row.score || row.assignment?.score, feedback: row.feedback || row.assignment?.feedback, urgency: row.urgency || row.assignment?.urgency || "normal",
        submittedAt: row.submitted_at || row.assignment?.submittedAt, submissionNotes: row.submission_notes || row.assignment?.submissionNotes,
      } as Assignment));
    }
    if (!error && (!data || data.length === 0) && local.length) { await saveStudentAssignments(id, local); return local; }
    if (error) console.error("Cloud assignments read error:", error);
  } catch (error) { console.error("Cloud assignments read exception:", error); }
  return local.length ? local : defaultList;
}

export async function saveStudentAssignments(studentId: string, assignments: Assignment[]): Promise<void> {
  const id = studentId.trim();
  if (!id) return;
  if (typeof window !== "undefined") try { localStorage.setItem(`vva_assignments_${id}`, JSON.stringify(assignments)); } catch {}
  try {
    const { error: deleteError } = await supabase.from("assignments").delete().eq("student_id", id);
    if (deleteError) { console.error("Cloud assignments delete/sync error:", deleteError); return; }
    if (assignments.length) {
      const rows = assignments.map((assignment) => ({ id: assignment.id, student_id: id, title: assignment.title, subject: assignment.course, course: assignment.course,
        subject_code: assignment.courseCode || null, course_code: assignment.courseCode || null, due_date: assignment.dueDate || null, status: assignment.status || "pending",
        instructions: assignment.instructions || null, score: assignment.score || null, feedback: assignment.feedback || null, urgency: assignment.urgency || "normal",
        submitted_at: assignment.submittedAt || null, submission_notes: assignment.submissionNotes || null, assignment, updated_at: new Date().toISOString() }));
      const { error: insertError } = await supabase.from("assignments").insert(rows);
      if (insertError) console.error("Cloud assignments insert/sync error:", insertError);
    }
  } catch (error) { console.error("Cloud assignments sync exception:", error); }
}
