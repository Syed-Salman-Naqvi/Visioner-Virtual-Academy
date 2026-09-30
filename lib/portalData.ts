import { supabase } from './supabase';
import { getSavedApplications } from './storage';

export interface AcademicResult { id: string; subject?: string; code?: string; course?: string; score?: string; grade?: string; status?: string; feedback?: string; [key: string]: any; }
export interface AttendanceRecord { id: string; subject?: string; course?: string; date?: string; totalClasses?: number; attended?: number; percentage?: string; status?: string; [key: string]: any; }
export interface ScheduleRecord { id?: string; day?: string; time?: string; subject?: string; course?: string; teacher?: string; room?: string; [key: string]: any; }
export interface StudentInfoRecord { id: string; name: string; email: string; program: string; avatar?: string; enrolledDate?: string; status?: string; [key: string]: any; }
export interface StatsRecord { averagePerformance: string; pendingHomework: number; classAttendance: string; activeSubjectsCount: number; [key: string]: any; }
export interface PortalRecords { studentInfo: StudentInfoRecord; stats: StatsRecord; recentResults: AcademicResult[]; results: AcademicResult[]; pendingAssignments: any[]; assignments: any[]; timetable: ScheduleRecord[]; schedule: ScheduleRecord[]; attendance: AttendanceRecord[]; [key: string]: any; }

export const createDynamicStudentProfile = (studentInfo: { id: string; name: string; email: string; program?: string }): PortalRecords => ({
  studentInfo: { id: studentInfo.id, name: studentInfo.name, email: studentInfo.email, program: studentInfo.program || 'Sindh Board (Grade 11)', avatar: '/default-avatar.png', enrolledDate: new Date().toLocaleDateString(), status: 'Active' },
  stats: { averagePerformance: '0%', pendingHomework: 0, classAttendance: '0%', activeSubjectsCount: 0 },
  recentResults: [], results: [], pendingAssignments: [], assignments: [], timetable: [], schedule: [], attendance: []
});

const KEY = 'vva_portal_records_db';
function readLocal(studentId: string, fallback: PortalRecords): PortalRecords {
  if (typeof window === 'undefined') return fallback;
  try { const parsed = JSON.parse(localStorage.getItem(KEY) || '{}'); return parsed[studentId] || fallback; } catch { return fallback; }
}

// Kept synchronous for the owner dashboard's existing initial state. Cloud reads use getStudentPortalRecords().
export function getPortalRecords(studentId?: string): PortalRecords {
  const fallback = createDynamicStudentProfile({ id: studentId || 'VVA-STU', name: 'Enrolled Student', email: '' });
  return studentId ? readLocal(studentId, fallback) : fallback;
}

export async function savePortalRecords(records: any): Promise<void> {
  if (typeof window !== 'undefined') try { localStorage.setItem(KEY, JSON.stringify(records)); } catch {}
}

export async function getStudentPortalRecords(studentId: string): Promise<PortalRecords> {
  const fallback = readLocal(studentId, createDynamicStudentProfile({ id: studentId, name: 'Enrolled Student', email: '' }));
  try {
    const { data, error } = await supabase.from('student_portal_records').select('records').eq('student_id', studentId).maybeSingle();
    if (!error && data?.records) {
      const cloud = data.records as PortalRecords;
      return { ...fallback, ...cloud, studentInfo: { ...fallback.studentInfo, ...cloud.studentInfo } };
    }
  } catch {}
  return fallback;
}

export async function saveStudentPortalRecords(studentId: string, records: PortalRecords): Promise<void> {
  if (typeof window !== 'undefined') {
    try { const all = JSON.parse(localStorage.getItem(KEY) || '{}'); all[studentId] = records; localStorage.setItem(KEY, JSON.stringify(all)); } catch {}
  }
  const { error } = await supabase.from('student_portal_records').upsert({ student_id: studentId, records, updated_at: new Date().toISOString() }, { onConflict: 'student_id' });
  if (error) console.error('Cloud portal record sync error:', error);
}

export async function migrateStudentPortalRecords(studentId: string, targetStudentId?: string): Promise<PortalRecords> {
  const source = await getStudentPortalRecords(studentId);
  const target = targetStudentId || studentId;
  if (target !== studentId) await saveStudentPortalRecords(target, source);
  return source;
}

export async function getStudentPortalData(studentId: string, sessionUser?: any): Promise<PortalRecords> {
  const activeId = studentId || sessionUser?.id || sessionUser?.studentId || 'VVA-STU';
  const cloud = await getStudentPortalRecords(activeId);
  if (cloud.studentInfo.name !== 'Enrolled Student' || cloud.results.length || cloud.schedule.length || cloud.attendance.length) {
    if (sessionUser?.name) cloud.studentInfo.name = sessionUser.name;
    if (sessionUser?.email) cloud.studentInfo.email = sessionUser.email;
    return cloud;
  }
  try {
    const { data } = await supabase.from('students').select('*').or(`student_id.eq.${activeId},id.eq.${activeId},email.eq.${activeId}`).maybeSingle();
    if (data) {
      const profile = createDynamicStudentProfile({ id: data.student_id || data.id || activeId, name: data.name || data.full_name || data.student_name || sessionUser?.name || 'Student', email: data.email || sessionUser?.email || '', program: data.program || data.target_program });
      await saveStudentPortalRecords(activeId, profile); return profile;
    }
  } catch {}
  try {
    const apps = await getSavedApplications();
    const app = apps.find((x: any) => x.id === activeId || x.studentEmail === activeId);
    if (app) {
      const profile = createDynamicStudentProfile({ id: app.id, name: app.studentName, email: app.studentEmail, program: app.targetTrack });
      await saveStudentPortalRecords(activeId, profile); return profile;
    }
  } catch {}
  if (sessionUser?.name) {
    const profile = createDynamicStudentProfile({ id: activeId, name: sessionUser.name, email: sessionUser.email || '', program: sessionUser.program });
    await saveStudentPortalRecords(activeId, profile); return profile;
  }
  return cloud;
}
