import { supabase } from "./supabase";

export interface StudentAccount {
  id?: string;
  applicationId: string;
  studentId: string;
  password: string;
  studentName: string;
  studentEmail: string;
  createdAt: string;
  lastSyncedAt?: string;
}

/**
 * CLOUD-FIRST: Always fetches from Supabase as primary source
 * Falls back to localStorage only if Supabase is unavailable
 */
export async function getStudentAccountsFromCloud(): Promise<StudentAccount[]> {
  if (!supabase) {
    console.warn("Supabase not configured - using local storage only");
    return readLocalStudentAccounts();
  }

  try {
    const { data, error } = await supabase
      .from("student_accounts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return readLocalStudentAccounts();
    }

    if (!Array.isArray(data)) {
      return readLocalStudentAccounts();
    }

    const accounts = data
      .map((item: any) => ({
        id: item.id,
        applicationId: String(item.application_id || item.applicationId || "").trim(),
        studentId: String(item.student_id || item.studentId || "").trim(),
        password: String(item.password || "").trim(),
        studentName: String(item.student_name || item.studentName || "Student"),
        studentEmail: String(item.student_email || item.studentEmail || ""),
        createdAt: item.created_at || item.createdAt || new Date().toISOString(),
        lastSyncedAt: new Date().toISOString(),
      }))
      .filter((acc) => acc.studentId || acc.applicationId);

    persistLocalStudentAccounts(accounts);
    return accounts;
  } catch (e) {
    console.error("Error fetching from Supabase:", e);
    return readLocalStudentAccounts();
  }
}

/**
 * Save student account to BOTH cloud and local storage
 */
export async function saveStudentAccountToCloud(
  account: StudentAccount
): Promise<{ success: boolean; accountId?: string }> {
  if (!account.studentId && !account.applicationId) {
    return { success: false };
  }

  const normalizedAccount: StudentAccount = {
    id: account.id,
    applicationId: normalizeId(account.applicationId),
    studentId: normalizeId(account.studentId),
    password: (account.password || "").trim(),
    studentName: account.studentName || "Student",
    studentEmail: account.studentEmail || "",
    createdAt: account.createdAt || new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
  };

  persistLocalStudentAccounts([normalizedAccount]);

  if (!supabase) {
    return { success: false };
  }

  try {
    const { data, error } = await supabase
      .from("student_accounts")
      .upsert(
        {
          id: normalizedAccount.id,
          application_id: normalizedAccount.applicationId,
          student_id: normalizedAccount.studentId,
          password: normalizedAccount.password,
          student_name: normalizedAccount.studentName,
          student_email: normalizedAccount.studentEmail,
          created_at: normalizedAccount.createdAt,
          last_synced_at: normalizedAccount.lastSyncedAt,
        },
        { onConflict: "student_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase upsert error:", error);
      return retryWithAlternativeConflict(normalizedAccount);
    }

    return { success: true, accountId: data?.id };
  } catch (e) {
    console.error("Error saving to Supabase:", e);
    return { success: false };
  }
}

/**
 * Retry with different conflict resolution strategy
 */
async function retryWithAlternativeConflict(
  account: StudentAccount
): Promise<{ success: boolean; accountId?: string }> {
  if (!supabase) return { success: false };

  try {
    const { data, error } = await supabase
      .from("student_accounts")
      .upsert(
        {
          application_id: account.applicationId,
          student_id: account.studentId,
          password: account.password,
          student_name: account.studentName,
          student_email: account.studentEmail,
          created_at: account.createdAt,
          last_synced_at: account.lastSyncedAt,
        },
        { onConflict: "application_id" }
      )
      .select()
      .single();

    if (!error && data) return { success: true, accountId: data.id };

    const { data: insertData, error: insertError } = await supabase
      .from("student_accounts")
      .insert({
        application_id: account.applicationId,
        student_id: account.studentId,
        password: account.password,
        student_name: account.studentName,
        student_email: account.studentEmail,
        created_at: account.createdAt,
        last_synced_at: new Date().toISOString(),
      })
      .select()
      .single();

    return { success: !insertError, accountId: insertData?.id };
  } catch (e) {
    console.error("Retry error:", e);
    return { success: false };
  }
}

/**
 * Find account by student ID or application ID
 */
export async function findStudentAccount(
  searchId: string
): Promise<StudentAccount | null> {
  const normalized = normalizeId(searchId);
  if (!normalized) return null;

  const allAccounts = await getStudentAccountsFromCloud();

  return (
    allAccounts.find(
      (acc) =>
        normalizeId(acc.studentId) === normalized ||
        normalizeId(acc.applicationId) === normalized
    ) || null
  );
}

/**
 * Utility: Normalize IDs for consistent matching
 */
export function normalizeId(value: string): string {
  return (value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[-_]/g, "");
}

/**
 * Utility: Verify password (case-insensitive)
 */
export function verifyPassword(
  inputPassword: string,
  storedPassword: string
): boolean {
  if (!inputPassword || !storedPassword) return false;
  const trimmedInput = (inputPassword || "").trim();
  const trimmedStored = (storedPassword || "").trim();

  if (trimmedInput === trimmedStored) return true;

  if (trimmedInput.toUpperCase() === trimmedStored.toUpperCase()) return true;

  const cleanInput = trimmedInput.replace(/^VVA[-_]?/i, "");
  const cleanStored = trimmedStored.replace(/^VVA[-_]?/i, "");

  return cleanInput === cleanStored;
}

/**
 * Local storage helpers
 */
function persistLocalStudentAccounts(accounts: StudentAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vva_student_accounts_cache", JSON.stringify(accounts));
    localStorage.setItem("vva_cache_updated_at", new Date().toISOString());
  } catch (e) {
    console.error("LocalStorage error:", e);
  }
}

function readLocalStudentAccounts(): StudentAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("vva_student_accounts_cache");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("LocalStorage error:", e);
    return [];
  }
}

/**
 * Force sync cloud data to local
 */
export async function forceSyncCloudToLocal(): Promise<StudentAccount[]> {
  const cloudAccounts = await getStudentAccountsFromCloud();
  persistLocalStudentAccounts(cloudAccounts);
  return cloudAccounts;
}
