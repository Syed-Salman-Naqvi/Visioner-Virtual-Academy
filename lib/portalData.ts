import { supabase } from "./supabase";

export interface AcademicResult {
  id: string;
  code: string;
  course: string;
  score: string;
  grade: string;
  feedback: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  course: string;
  status: "Present" | "Late" | "Absent";
}

export interface ScheduleRecord {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  time: string;
  course: string;
  topic: string;
  teacher: string;
}

export interface PortalRecords {
  results: AcademicResult[];
  attendance: AttendanceRecord[];
  schedule: ScheduleRecord[];
}

export const defaultPortalRecords: PortalRecords = {
  results: [
    { id: "res-1", code: "CS101", course: "Computer Science", score: "92%", grade: "A*", feedback: "Exceptional problem solving skills." },
    { id: "res-2", code: "MATH201", course: "Pure Mathematics", score: "88%", grade: "A", feedback: "Strong analytical thinking." },
    { id: "res-3", code: "PHY101", course: "Physics", score: "85%", grade: "A", feedback: "Great grasp of mechanics." },
  ],
  attendance: [
    { id: "att-1", date: "2026-09-01", course: "Computer Science", status: "Present" },
    { id: "att-2", date: "2026-09-02", course: "Pure Mathematics", status: "Present" },
    { id: "att-3", date: "2026-09-03", course: "Physics", status: "Present" },
  ],
  schedule: [
    { id: "sch-1", day: "Monday", time: "09:00 AM - 10:30 AM", course: "Computer Science", topic: "Data Structures & Algorithms", teacher: "Dr. Aris" },
    { id: "sch-2", day: "Tuesday", time: "11:00 AM - 12:30 PM", course: "Pure Mathematics", topic: "Calculus & Derivatives", teacher: "Prof. Sarah" },
    { id: "sch-3", day: "Wednesday", time: "01:30 PM - 03:00 PM", course: "Physics", topic: "Quantum Mechanics Intro", teacher: "Dr. K. Vance" },
  ],
};

export function getPortalRecords(): PortalRecords {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("vva_portal_records");
      return raw ? JSON.parse(raw) : defaultPortalRecords;
    } catch {
      return defaultPortalRecords;
    }
  }
  return defaultPortalRecords;
}

export function savePortalRecords(records: PortalRecords): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("vva_portal_records", JSON.stringify(records));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }
}

export async function getStudentPortalRecords(studentId: string): Promise<PortalRecords> {
  const cleanId = (studentId || "").trim().toUpperCase();

  if (supabase && cleanId) {
    try {
      const { data, error } = await supabase
        .from("portal_records")
        .select("records")
        .eq("student_id", cleanId)
        .maybeSingle();

      if (!error && data && data.records) {
        return data.records as PortalRecords;
      }
    } catch (e) {
      console.error("Supabase fetch portal records error:", e);
    }
  }

  if (typeof window !== "undefined" && cleanId) {
    try {
      const raw = localStorage.getItem(`vva_student_portal_records_${cleanId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("LocalStorage fetch portal records error:", e);
    }
  }

  return defaultPortalRecords;
}

export async function saveStudentPortalRecords(studentId: string, records: PortalRecords): Promise<void> {
  const cleanId = (studentId || "").trim().toUpperCase();
  if (!cleanId) return;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`vva_student_portal_records_${cleanId}`, JSON.stringify(records));
    } catch (e) {
      console.error("LocalStorage save portal records error:", e);
    }
  }

  if (supabase) {
    try {
      const { error } = await supabase.from("portal_records").upsert({
        student_id: cleanId,
        records: records,
        updated_at: new Date().toISOString(),
      });
      if (error) console.error("Supabase portal records upsert error:", error);
    } catch (e) {
      console.error("Supabase save portal records error:", e);
    }
  }
}

export async function migrateStudentPortalRecords(oldKey: string, newStudentId: string): Promise<void> {
  const cleanOld = (oldKey || "").trim().toUpperCase();
  const cleanNew = (newStudentId || "").trim().toUpperCase();
  if (!cleanOld || !cleanNew) return;

  const existing = await getStudentPortalRecords(cleanOld);
  await saveStudentPortalRecords(cleanNew, existing);
}