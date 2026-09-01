export interface AcademicResult {
  id: string;
  course: string;
  code: string;
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

export const DEFAULT_PORTAL_RECORDS: PortalRecords = {
  results: [
    { id: "result-phy", code: "PHY-9702", course: "Cambridge AS-Level Physics", score: "94%", grade: "A*", feedback: "Excellent rotational mechanics work." },
    { id: "result-mat", code: "MAT-9709", course: "Pure Mathematics 1 & 3", score: "91%", grade: "A*", feedback: "Consistent accuracy in integration proofs." },
    { id: "result-cs", code: "CS-9618", course: "Computer Science A-Level", score: "96%", grade: "A*", feedback: "Strong algorithmic problem solving." },
    { id: "result-eng", code: "ENG-8021", course: "English General Paper", score: "87%", grade: "A", feedback: "Thoughtful critical analysis." },
  ],
  attendance: [
    { id: "attendance-1", date: "Aug 23, 2026", course: "Cambridge AS-Level Physics", status: "Present" },
    { id: "attendance-2", date: "Aug 23, 2026", course: "Pure Mathematics P1 & P3", status: "Present" },
    { id: "attendance-3", date: "Aug 22, 2026", course: "Computer Science A-Level", status: "Present" },
    { id: "attendance-4", date: "Aug 20, 2026", course: "English General Paper", status: "Present" },
    { id: "attendance-5", date: "Aug 19, 2026", course: "Advanced Chemistry", status: "Late" },
  ],
  schedule: [
    { id: "schedule-1", day: "Monday", time: "09:00 - 10:15 GST", course: "Cambridge AS Physics", topic: "Rotational dynamics and torque", teacher: "Dr. Sarah Jenkins" },
    { id: "schedule-2", day: "Monday", time: "10:45 - 12:00 GST", course: "Pure Mathematics P1 & P3", topic: "Integration by substitution", teacher: "Prof. Mark Thompson" },
    { id: "schedule-3", day: "Monday", time: "13:00 - 14:15 GST", course: "Computer Science A-Level", topic: "Binary trees and graph traversal", teacher: "Eng. Alex Chen" },
    { id: "schedule-4", day: "Tuesday", time: "09:00 - 10:15 GST", course: "Advanced Chemistry", topic: "Thermodynamics and reaction kinetics", teacher: "Dr. Alistair Ross" },
    { id: "schedule-5", day: "Tuesday", time: "10:45 - 12:00 GST", course: "Cambridge AS Physics", topic: "Electric fields and capacitance", teacher: "Dr. Sarah Jenkins" },
    { id: "schedule-6", day: "Wednesday", time: "09:00 - 10:30 GST", course: "Pure Mathematics Mechanics", topic: "Friction on inclined planes", teacher: "Prof. Mark Thompson" },
    { id: "schedule-7", day: "Wednesday", time: "11:00 - 12:30 GST", course: "Computer Science Lab", topic: "SQL database normalization", teacher: "Eng. Alex Chen" },
    { id: "schedule-8", day: "Thursday", time: "09:30 - 11:00 GST", course: "Cambridge AS Physics Lab", topic: "Diffraction and interference", teacher: "Dr. Sarah Jenkins" },
    { id: "schedule-9", day: "Friday", time: "09:00 - 10:15 GST", course: "Pure Mathematics Workshop", topic: "Past paper practice", teacher: "Prof. Mark Thompson" },
  ],
};

const PORTAL_RECORDS_KEY = "vva_portal_records";
const STUDENT_RECORDS_KEY = "vva_student_portal_records";
const PORTAL_RECORDS_EVENT = "vva_portal_records_changed";
let cachedRawRecords: string | null = null;
let cachedRecords: PortalRecords = DEFAULT_PORTAL_RECORDS;
const EMPTY_STUDENT_RECORDS: PortalRecords = { results: [], attendance: [], schedule: [] };
const studentRecordsCache = new Map<string, { raw: string | null; records: PortalRecords }>();

export function getPortalRecords(): PortalRecords {
  if (typeof window === "undefined") return DEFAULT_PORTAL_RECORDS;
  try {
    const saved = window.localStorage.getItem(PORTAL_RECORDS_KEY);
    if (saved === cachedRawRecords) return cachedRecords;
    cachedRawRecords = saved;
    cachedRecords = saved ? JSON.parse(saved) as PortalRecords : DEFAULT_PORTAL_RECORDS;
    return cachedRecords;
  } catch {
    cachedRawRecords = null;
    cachedRecords = DEFAULT_PORTAL_RECORDS;
    return cachedRecords;
  }
}

export function savePortalRecords(records: PortalRecords): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(records);
  cachedRawRecords = serialized;
  cachedRecords = records;
  window.localStorage.setItem(PORTAL_RECORDS_KEY, serialized);
  window.dispatchEvent(new Event(PORTAL_RECORDS_EVENT));
}

export function subscribeToPortalRecords(onChange: () => void): () => void {
  window.addEventListener(PORTAL_RECORDS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PORTAL_RECORDS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getStudentPortalRecords(studentId: string): PortalRecords {
  if (typeof window === "undefined") return EMPTY_STUDENT_RECORDS;
  try {
    const raw = window.localStorage.getItem(STUDENT_RECORDS_KEY);
    const cached = studentRecordsCache.get(studentId);
    if (cached?.raw === raw) return cached.records;
    const allRecords = raw ? JSON.parse(raw) as Record<string, PortalRecords> : {};
    const records = allRecords[studentId] || EMPTY_STUDENT_RECORDS;
    studentRecordsCache.set(studentId, { raw, records });
    return records;
  } catch {
    return EMPTY_STUDENT_RECORDS;
  }
}

export function saveStudentPortalRecords(studentId: string, records: PortalRecords): void {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(STUDENT_RECORDS_KEY);
  const allRecords = raw ? JSON.parse(raw) as Record<string, PortalRecords> : {};
  allRecords[studentId] = records;
  window.localStorage.setItem(STUDENT_RECORDS_KEY, JSON.stringify(allRecords));
  studentRecordsCache.set(studentId, { raw: JSON.stringify(allRecords), records });
  window.dispatchEvent(new Event(PORTAL_RECORDS_EVENT));
}

export function migrateStudentPortalRecords(fromKey: string, toKey: string): PortalRecords {
  const records = getStudentPortalRecords(fromKey);
  saveStudentPortalRecords(toKey, records);
  return records;
}