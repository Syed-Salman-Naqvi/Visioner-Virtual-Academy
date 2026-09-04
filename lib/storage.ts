import { supabase } from "./supabase";
import { AdmissionsApplication, StudentAccount, Assignment } from "./types";
import { mockApplications } from "./mockData";

function normalizeIdToken(value: string): string {
  return (value || "").trim().toUpperCase().replace(/\s+/g, "");
}

function idDigits(value: string): string {
  return normalizeIdToken(value).replace(/[^0-9]/g, "");
}

function idCore(value: string): string {
  return normalizeIdToken(value)
    .replace(/^VVA[-_]?/i, "")
    .replace(/^INTL[-_]?/i, "")
    .replace(/^APP[-_]?/i, "")
    .replace(/^STU[-_]?/i, "")
    .replace(/[^A-Z0-9]/g, "");
}

export function studentIdsMatch(input: string, stored: string): boolean {
  const raw = normalizeIdToken(input);
  const saved = normalizeIdToken(stored);
  if (!raw || !saved) return false;
  if (raw === saved) return true;

  const rawNoIntl = raw.replace("INTL-", "");
  const savedNoIntl = saved.replace("INTL-", "");
  if (rawNoIntl === saved || savedNoIntl === raw || rawNoIntl === savedNoIntl) return true;

  const rawCore = idCore(raw);
  const savedCore = idCore(saved);
  if (rawCore && rawCore === savedCore) return true;

  const rawDigits = idDigits(raw);
  const savedDigits = idDigits(saved);
  return rawDigits.length >= 5 && savedDigits.length >= 5 && rawDigits === savedDigits;
}

export function studentPasswordsMatch(input: string, stored: string): boolean {
  const raw = (input || "").trim();
  const saved = (stored || "").trim();
  if (!raw || !saved) return false;
  if (raw === saved) return true;

  const rawUpper = raw.toUpperCase();
  const savedUpper = saved.toUpperCase();
  if (rawUpper === savedUpper) return true;

  const compact = (value: string) =>
    value
      .toUpperCase()
      .replace(/^VVA[-_]?/i, "")
      .replace(/[^A-Z0-9]/g, "");

  const rawCompact = compact(raw);
  const savedCompact = compact(saved);
  return Boolean(rawCompact) && rawCompact === savedCompact;
}

function formatAccountDate(value?: string): string {
  if (!value) {
    return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime()) && (value.includes("T") || /^\d{4}-\d{2}-\d{2}/.test(value))) {
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  return value;
}

function toIsoTimestamp(value?: string): string {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function mapDbStudentAccount(item: Record<string, unknown>): StudentAccount | null {
  if (!item) return null;
  const applicationId = String(item.application_id || item.applicationId || "").trim();
  const studentId = String(item.student_id || item.studentId || applicationId).trim();
  const password = String(item.password || item.passcode || item.student_password || "").trim();
  if (!studentId && !applicationId) return null;
  return {
    applicationId: applicationId || studentId,
    studentId: studentId || applicationId,
    password,
    studentName: String(item.student_name || item.studentName || "Student"),
    studentEmail: String(item.student_email || item.studentEmail || ""),
    createdAt: formatAccountDate(String(item.created_at || item.createdAt || "")),
  };
}

function mergeAccountPair(current: StudentAccount, incoming: StudentAccount): StudentAccount {
  return {
    applicationId: incoming.applicationId || current.applicationId,
    studentId: incoming.studentId || current.studentId,
    password: incoming.password?.trim() ? incoming.password : current.password,
    studentName: incoming.studentName || current.studentName,
    studentEmail: incoming.studentEmail || current.studentEmail,
    createdAt: incoming.createdAt || current.createdAt,
  };
}

function mergeStudentAccountLists(...groups: StudentAccount[][]): StudentAccount[] {
  const byAlias = new Map<string, StudentAccount>();

  const aliasesFor = (account: StudentAccount): string[] => {
    const aliases = new Set<string>();
    const studentId = normalizeIdToken(account.studentId);
    const applicationId = normalizeIdToken(account.applicationId);
    if (studentId) aliases.add(`sid:${studentId}`);
    if (applicationId) aliases.add(`aid:${applicationId}`);
    return Array.from(aliases);
  };

  for (const group of groups) {
    for (const account of group) {
      if (!account) continue;
      const aliases = aliasesFor(account);
      let existing: StudentAccount | undefined;
      for (const alias of aliases) {
        existing = byAlias.get(alias);
        if (existing) break;
      }
      const merged = existing ? mergeAccountPair(existing, account) : account;
      for (const alias of aliasesFor(merged)) {
        byAlias.set(alias, merged);
      }
    }
  }

  const unique = new Map<string, StudentAccount>();
  for (const account of byAlias.values()) {
    const key = normalizeIdToken(account.studentId || account.applicationId);
    if (!key) continue;
    const prev = unique.get(key);
    unique.set(key, prev ? mergeAccountPair(prev, account) : account);
  }
  return Array.from(unique.values());
}

function persistLocalStudentAccounts(accounts: StudentAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vva_student_accounts", JSON.stringify(accounts));
  } catch (e) {
    console.error("LocalStorage save accounts error:", e);
  }
}

function readLocalStudentAccounts(): StudentAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("vva_student_accounts");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (e) {
    console.error("LocalStorage fetch accounts error:", e);
    return [];
  }
}

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

export async function findApplicationById(id: string): Promise<AdmissionsApplication | null> {
  const apps = await getSavedApplications();
  return apps.find((item) => item.id.toUpperCase() === id.trim().toUpperCase()) || null;
}

export async function getStudentAccounts(): Promise<StudentAccount[]> {
  const localAccounts = readLocalStudentAccounts();

  let dbAccounts: StudentAccount[] = [];
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("student_accounts")
        .select("application_id, student_id, password, student_name, student_email, created_at");

      if (error) {
        const fallback = await supabase.from("student_accounts").select("*");
        if (!fallback.error && Array.isArray(fallback.data)) {
          dbAccounts = fallback.data.map((item) => mapDbStudentAccount(item as Record<string, unknown>)).filter(Boolean) as StudentAccount[];
        } else {
          console.error("Supabase fetch accounts error:", error);
        }
      } else if (Array.isArray(data)) {
        dbAccounts = data.map((item) => mapDbStudentAccount(item as Record<string, unknown>)).filter(Boolean) as StudentAccount[];
      }
    } catch (e) {
      console.error("Supabase fetch accounts error:", e);
    }
  }

  const merged = mergeStudentAccountLists(localAccounts, dbAccounts);
  persistLocalStudentAccounts(merged);
  return merged;
}

async function upsertStudentAccountRow(row: Record<string, unknown>): Promise<boolean> {
  if (!supabase) return false;

  const dateOnly = typeof row.created_at === "string" ? String(row.created_at).slice(0, 10) : undefined;
  const attempts: Array<{ payload: Record<string, unknown>; onConflict?: string }> = [
    { payload: row, onConflict: "student_id" },
    { payload: row, onConflict: "application_id" },
    { payload: row },
    { payload: { ...row, created_at: dateOnly }, onConflict: "student_id" },
    { payload: { ...row, created_at: undefined }, onConflict: "student_id" },
    { payload: { ...row, created_at: undefined }, onConflict: "application_id" },
  ];

  for (const attempt of attempts) {
    const payload = Object.fromEntries(Object.entries(attempt.payload).filter(([, value]) => value !== undefined));
    const query = attempt.onConflict
      ? supabase.from("student_accounts").upsert(payload, { onConflict: attempt.onConflict })
      : supabase.from("student_accounts").upsert(payload);
    const { error } = await query;
    if (!error) return true;
    console.error("Supabase account upsert error:", error.message || error);
  }

  const { error: insertError } = await supabase.from("student_accounts").insert(row);
  if (!insertError) return true;
  console.error("Supabase account insert error:", insertError);
  return false;
}

export async function saveStudentAccount(account: StudentAccount): Promise<boolean> {
  if (!account) return false;

  const normalized: StudentAccount = {
    applicationId: normalizeIdToken(account.applicationId || account.studentId),
    studentId: normalizeIdToken(account.studentId || account.applicationId),
    password: (account.password || "").trim(),
    studentName: account.studentName,
    studentEmail: account.studentEmail,
    createdAt: formatAccountDate(account.createdAt),
  };

  const merged = mergeStudentAccountLists(readLocalStudentAccounts(), [normalized]);
  persistLocalStudentAccounts(merged);

  const cloudSynced = await upsertStudentAccountRow({
    application_id: normalized.applicationId,
    student_id: normalized.studentId,
    password: normalized.password,
    student_name: normalized.studentName,
    student_email: normalized.studentEmail,
    created_at: toIsoTimestamp(account.createdAt),
  });

  return cloudSynced;
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