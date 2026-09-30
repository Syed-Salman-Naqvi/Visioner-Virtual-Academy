import { supabase } from './supabase';
import { getSavedApplications } from './storage';

export interface AcademicResult { id: string; subject?: string; code?: string; course?: string; score?: string; grade?: string; status?: string; feedback?: string; [key: string]: any; }
export interface AttendanceRecord { id: string; subject?: string; course?: string; date?: string; totalClasses?: number; attended?: number; percentage?: string; status?: string; [key: string]: any; }
export interface ScheduleRecord { id?: string; day?: string; time?: string; subject?: string; course?: string; teacher?: string; room?: string; [key: string]: any; }
export interface StudentInfoRecord { id: string; name: string; email: string; program: string; avatar?: string; enrolledDate?: string; status?: string; [key: string]: any; }
export interface StatsRecord { averagePerformance: string; pendingHomework: number; classAttendance: string; activeSubjectsCount: number; [key: string]: any; }
export interface PortalRecords { studentInfo: StudentInfoRecord; stats: StatsRecord; recentResults: AcademicResult[]; results: AcademicResult[]; pendingAssignments: any[]; assignments: any[]; timetable: ScheduleRecord[]; schedule: ScheduleRecord[]; attendance: AttendanceRecord[]; subjects?: string[]; [key: string]: any; }

export const createDynamicStudentProfile = (studentInfo: { id: string; name: string; email: string; program?: string }): PortalRecords => ({
  studentInfo: { id: studentInfo.id, name: studentInfo.name, email: studentInfo.email, program: studentInfo.program || 'Sindh Board (Grade 11)', avatar: '/default-avatar.png', enrolledDate: new Date().toLocaleDateString(), status: 'Active' },
  stats: { averagePerformance: '0%', pendingHomework: 0, classAttendance: '0%', activeSubjectsCount: 0 },
  recentResults: [], results: [], pendingAssignments: [], assignments: [], timetable: [], schedule: [], attendance: [], subjects: []
});

const KEY = 'vva_portal_records_db';
function readLocal(studentId: string, fallback: PortalRecords): PortalRecords {
  if (typeof window === 'undefined') return fallback;
  try { const parsed = JSON.parse(localStorage.getItem(KEY) || '{}'); return parsed[studentId] || fallback; } catch { return fallback; }
}

export function getPortalRecords(studentId?: string): PortalRecords {
  const fallback = createDynamicStudentProfile({ id: studentId || 'VVA-STU', name: 'Enrolled Student', email: '' });
  return studentId ? readLocal(studentId, fallback) : fallback;
}

export async function savePortalRecords(records: any): Promise<void> {
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(KEY, JSON.stringify(records)); } catch {}
  }
}

function mergePortalRecords(base: PortalRecords, cloud: Partial<PortalRecords>): PortalRecords {
  return {
    ...base, ...cloud,
    studentInfo: { ...base.studentInfo, ...(cloud.studentInfo || {}) }, stats: { ...base.stats, ...(cloud.stats || {}) },
    results: Array.isArray(cloud.results) ? cloud.results : base.results,
    recentResults: Array.isArray(cloud.recentResults) ? cloud.recentResults : (Array.isArray(cloud.results) ? cloud.results : base.recentResults),
    assignments: Array.isArray(cloud.assignments) ? cloud.assignments : base.assignments,
    pendingAssignments: Array.isArray(cloud.pendingAssignments) ? cloud.pendingAssignments : (Array.isArray(cloud.assignments) ? cloud.assignments : base.pendingAssignments),
    schedule: Array.isArray(cloud.schedule) ? cloud.schedule : (Array.isArray(cloud.timetable) ? cloud.timetable : base.schedule),
    timetable: Array.isArray(cloud.timetable) ? cloud.timetable : (Array.isArray(cloud.schedule) ? cloud.schedule : base.timetable),
    attendance: Array.isArray(cloud.attendance) ? cloud.attendance : base.attendance,
    subjects: Array.isArray(cloud.subjects) ? cloud.subjects : base.subjects,
  };
}

export async function getStudentPortalRecords(studentId: string): Promise<PortalRecords> {
  const fallback = readLocal(studentId, createDynamicStudentProfile({ id: studentId, name: 'Enrolled Student', email: '' }));
  try {
    const { data, error } = await supabase.from('portal_records').select('records').eq('student_id', studentId).maybeSingle();
    if (!error && data?.records) return mergePortalRecords(fallback, data.records as PortalRecords);
    if (!error && !data && hasMeaningfulPortalData(fallback)) { await saveStudentPortalRecords(studentId, fallback); return fallback; }
    if (error) console.error('Cloud portal_records read error:', error);
  } catch (error) { console.error('Cloud portal_records read exception:', error); }
  return fallback;
}

function hasMeaningfulPortalData(records: PortalRecords): boolean {
  return Boolean(records.results?.length || records.attendance?.length || records.schedule?.length || records.assignments?.length || records.studentInfo?.name !== 'Enrolled Student');
}

export async function saveStudentPortalRecords(studentId: string, records: PortalRecords): Promise<void> {
  const cleanId = studentId.trim();
  if (!cleanId) return;
  if (typeof window !== 'undefined') {
    try { const all = JSON.parse(localStorage.getItem(KEY) || '{}'); all[cleanId] = records; localStorage.setItem(KEY, JSON.stringify(all)); } catch {}
  }
  const { error } = await supabase.from('portal_records').upsert({ student_id: cleanId, records, updated_at: new Date().toISOString() }, { onConflict: 'student_id' });
  if (error) console.error('Cloud portal_records sync error:', error);
}

export async function deleteStudentPortalRecords(studentId: string): Promise<void> {
  const cleanId = studentId.trim();
  if (!cleanId) return;
  if (typeof window !== 'undefined') {
    try {
      const all = JSON.parse(localStorage.getItem(KEY) || '{}');
      delete all[cleanId];
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch {}
  }
  const { error } = await supabase.from('portal_records').delete().eq('student_id', cleanId);
  if (error) console.error('Supabase portal record cleanup error:', error);
}

export async function migrateStudentPortalRecords(studentId: string, targetStudentId?: string): Promise<PortalRecords> {
  const source = await getStudentPortalRecords(studentId);
  const target = (targetStudentId || studentId).trim();
  if (target && target !== studentId) await saveStudentPortalRecords(target, source);
  return source;
}

export async function getStudentPortalData(studentId: string, sessionUser?: any): Promise<PortalRecords> {
  const activeId = studentId || sessionUser?.id || sessionUser?.studentId || 'VVA-STU';
  const cloud = await getStudentPortalRecords(activeId);
  if (sessionUser?.name && cloud.studentInfo.name === 'Enrolled Student') cloud.studentInfo.name = sessionUser.name;
  if (sessionUser?.email && !cloud.studentInfo.email) cloud.studentInfo.email = sessionUser.email;
  if (cloud.studentInfo.name !== 'Enrolled Student' || cloud.results.length || cloud.schedule.length || cloud.attendance.length || cloud.assignments.length) return cloud;
  try {
    const { data } = await supabase.from('students').select('*').or(`student_id.eq.${activeId},id.eq.${activeId},email.eq.${activeId}`).maybeSingle();
    if (data) {
      const profile = createDynamicStudentProfile({ id: data.student_id || data.id || activeId, name: data.name || data.full_name || data.student_name || sessionUser?.name || 'Student', email: data.email || sessionUser?.email || '', program: data.program || data.target_program });
      await saveStudentPortalRecords(activeId, profile); return profile;
    }
  } catch (error) { console.warn('Student profile lookup skipped:', error); }
  try {
    const apps = await getSavedApplications();
    const app = apps.find((x: any) => x.id === activeId || x.studentEmail === activeId);
    if (app) {
      const profile = createDynamicStudentProfile({ id: app.id, name: app.studentName, email: app.studentEmail, program: app.targetTrack });
      await saveStudentPortalRecords(activeId, profile); return profile;
    }
  } catch (error) { console.warn('Application lookup skipped:', error); }
  return cloud;
}
