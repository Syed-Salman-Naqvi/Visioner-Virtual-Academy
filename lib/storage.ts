import { AdmissionsApplication, StudentAccount, Assignment, ChatMessage } from "./types";
import { supabase } from './supabase';

// ==================== ADMISSIONS APPLICATIONS ====================

export async function getSavedApplications(): Promise<AdmissionsApplication[]> {
  try {
    const { data, error } = await supabase.from('admissions').select('*');
    if (error) {
      console.error("Supabase fetch error:", error);
      return [];
    }
    return (data || []).map((row: any) => row.raw_data || row);
  } catch (e) {
    console.error("Failed to load applications", e);
    return [];
  }
}

export async function saveApplication(app: AdmissionsApplication): Promise<void> {
  try {
    const { error } = await supabase.from('admissions').upsert({
      id: app.id,
      student_name: app.studentName || app.fullName,
      email: app.email,
      phone: app.phone,
      status: app.status || 'pending',
      raw_data: app
    });
    if (error) console.error("Supabase save application error:", error);
  } catch (e) {
    console.error("Failed to save application to Supabase", e);
  }
}

export async function findApplicationById(id: string): Promise<AdmissionsApplication | undefined> {
  const apps = await getSavedApplications();
  const cleanId = id.trim().toUpperCase();
  return apps.find((a) => a.id.toUpperCase() === cleanId);
}

// ==================== STUDENT ACCOUNTS ====================

export async function getStudentAccounts(): Promise<StudentAccount[]> {
  try {
    const { data, error } = await supabase.from('student_accounts').select('*');
    if (error) {
      console.error("Supabase fetch student accounts error:", error);
      return [];
    }
    return (data || []).map((row: any) => row.raw_data || row);
  } catch {
    return [];
  }
}

export async function saveStudentAccount(account: StudentAccount): Promise<void> {
  try {
    const { error } = await supabase.from('student_accounts').upsert({
      id: account.studentId,
      student_id: account.studentId,
      password: account.password,
      application_id: account.applicationId,
      student_name: account.studentName,
      raw_data: account
    });
    if (error) console.error("Supabase save student account error:", error);
  } catch (e) {
    console.error("Failed to save student account to Supabase", e);
  }
}

export async function findStudentAccount(studentId: string, password: string): Promise<StudentAccount | undefined> {
  const accounts = await getStudentAccounts();
  return accounts.find(
    (account) =>
      account.studentId?.toLowerCase() === studentId.trim().toLowerCase() &&
      account.password === password
  );
}