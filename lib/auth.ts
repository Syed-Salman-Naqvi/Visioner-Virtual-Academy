import { supabase } from "./supabase";
import { getStudentAccounts } from "./storage";
import { normalizeId, verifyPassword } from "./database";

export type PortalRole = "student" | "owner" | "parent";

export interface PortalUser {
  id: string;
  studentId?: string;
  name: string;
  email: string;
  program?: string;
  role: PortalRole;
}

const OWNER_FALLBACK = {
  id: "VVA-OWNER-01",
  name: "Academy Administrator",
  email: "admin@visioner.edu",
  role: "owner" as const,
};

export async function loginStudent(identifier: string, password: string): Promise<PortalUser | null> {
  const id = identifier.trim();
  const pass = password.trim();
  if (!id || !pass) return null;

  try {
    const { data } = await supabase
      .from("student_accounts")
      .select("application_id,student_id,password,student_name,student_email,created_at")
      .or(`student_id.eq.${id},application_id.eq.${id},student_email.eq.${id}`)
      .limit(20);

    const match = (data || []).find((account: any) => verifyPassword(pass, account.password || ""));
    if (match) {
      return {
        id: match.student_id || match.application_id,
        studentId: match.student_id || match.application_id,
        name: match.student_name || "Student",
        email: match.student_email || "",
        role: "student",
      };
    }
  } catch (error) {
    console.warn("Cloud student authentication unavailable:", error);
  }

  try {
    const accounts = await getStudentAccounts();
    const normalized = normalizeId(id);
    const match = accounts.find((account) =>
      [account.studentId, account.applicationId, account.studentEmail]
        .filter(Boolean)
        .some((value) => normalizeId(String(value)) === normalized || String(value).trim().toLowerCase() === id.toLowerCase()) &&
      verifyPassword(pass, account.password)
    );

    if (match) {
      return {
        id: match.studentId || match.applicationId,
        studentId: match.studentId || match.applicationId,
        name: match.studentName || "Student",
        email: match.studentEmail || "",
        role: "student",
      };
    }
  } catch (error) {
    console.warn("Local student authentication unavailable:", error);
  }

  return null;
}

export async function loginOwner(identifier: string, password: string): Promise<PortalUser | null> {
  const id = identifier.trim().toLowerCase();
  const pass = password.trim();
  if (!id || !pass) return null;

  // Preferred: a Supabase owner_accounts table created by the migration in this repo.
  try {
    const { data, error } = await supabase.rpc("verify_owner_login", {
      p_identifier: id,
      p_password: pass,
    });
    if (!error && data?.[0]) {
      return {
        id: data[0].id,
        name: data[0].name || "Academy Administrator",
        email: data[0].email || id,
        role: "owner",
      };
    }
  } catch (error) {
    console.warn("Cloud owner authentication unavailable:", error);
  }

  // Existing demo compatibility. Remove after the Supabase owner account is seeded.
  if ((id === "owner" || id === OWNER_FALLBACK.email) && pass === "admin123") {
    return OWNER_FALLBACK;
  }
  return null;
}

export function savePortalSession(user: PortalUser) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(user);
  localStorage.setItem("vva_user", serialized);
  localStorage.setItem("vva_current_user", serialized);
  localStorage.setItem("vva_session", serialized);
  localStorage.setItem("vva_role", user.role);
  sessionStorage.setItem("vva_session", serialized);
  sessionStorage.setItem("vva_role", user.role);
  sessionStorage.setItem("vva_owner_authenticated", user.role === "owner" ? "true" : "false");
  if (user.role === "student") sessionStorage.setItem("vva_student_session", serialized);
}

export function getPortalSession(): PortalUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("vva_user") || sessionStorage.getItem("vva_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPortalSession() {
  if (typeof window === "undefined") return;
  ["vva_user", "vva_current_user", "vva_session", "vva_role"].forEach((key) => localStorage.removeItem(key));
  ["vva_session", "vva_role", "vva_owner_authenticated", "vva_student_session"].forEach((key) => sessionStorage.removeItem(key));
}
