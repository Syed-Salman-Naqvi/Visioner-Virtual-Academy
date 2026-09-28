import { supabase } from './supabase';
import { getSavedApplications } from './storage';

export interface AcademicResult {
  id: string;
  subject?: string;
  code?: string;
  course?: string;
  score?: string;
  grade?: string;
  status?: string;
  feedback?: string;
  [key: string]: any;
}

export interface AttendanceRecord {
  id: string;
  subject?: string;
  course?: string;
  date?: string;
  totalClasses?: number;
  attended?: number;
  percentage?: string;
  status?: string;
  [key: string]: any;
}

export interface ScheduleRecord {
  id?: string;
  day?: string;
  time?: string;
  subject?: string;
  course?: string;
  teacher?: string;
  room?: string;
  [key: string]: any;
}

export interface AssignmentRecord {
  id?: string;
  subjectCode?: string;
  subject?: string;
  title?: string;
  dueDate?: string;
  status?: string;
  [key: string]: any;
}

export interface StudentInfoRecord {
  id: string;
  name: string;
  email: string;
  program: string;
  avatar?: string;
  enrolledDate?: string;
  status?: string;
  [key: string]: any;
}

export interface StatsRecord {
  averagePerformance: string;
  pendingHomework: number;
  classAttendance: string;
  activeSubjectsCount: number;
  [key: string]: any;
}

export interface PortalRecords {
  studentInfo: StudentInfoRecord;
  stats: StatsRecord;
  recentResults: AcademicResult[];
  results: AcademicResult[];
  pendingAssignments: AssignmentRecord[];
  assignments: AssignmentRecord[];
  timetable: ScheduleRecord[];
  schedule: ScheduleRecord[];
  attendance: AttendanceRecord[];
  [key: string]: any;
}

export const createDynamicStudentProfile = (studentInfo: {
  id: string;
  name: string;
  email: string;
  program?: string;
}): PortalRecords => {
  const defaultResults: AcademicResult[] = [
    {
      id: '1',
      subject: 'Computer Science',
      code: 'CS101',
      course: 'Computer Science',
      score: '92',
      grade: '92%',
      status: 'GRADE A*',
      feedback: 'Exceptional problem solving skills.',
    },
    {
      id: '2',
      subject: 'Pure Mathematics',
      code: 'MATH201',
      course: 'Pure Mathematics',
      score: '88',
      grade: '88%',
      status: 'GRADE A',
      feedback: 'Strong analytical thinking.',
    },
    {
      id: '3',
      subject: 'Physics',
      code: 'PHYS101',
      course: 'Physics',
      score: '85',
      grade: '85%',
      status: 'GRADE A',
      feedback: 'Excellent conceptual grasp.',
    },
  ];

  const defaultAssignments: AssignmentRecord[] = [
    {
      id: '1',
      subjectCode: 'MATHEMATICS (9709)',
      subject: 'Mathematics',
      title: 'Pure Mathematics II - Calculus Problem Set 4',
      dueDate: '2026-10-05',
      status: 'PENDING',
    },
    {
      id: '2',
      subjectCode: 'PHYSICS (9702)',
      subject: 'Physics',
      title: 'Physics Lab Report - Oscillations & Simple Harmonic Motion',
      dueDate: '2026-10-12',
      status: 'PENDING',
    },
  ];

  const defaultSchedule: ScheduleRecord[] = [
    { id: '1', day: 'Monday', time: '09:00 AM - 10:30 AM', subject: 'Pure Mathematics', course: 'Pure Mathematics', teacher: 'Dr. Ahmed' },
    { id: '2', day: 'Tuesday', time: '11:00 AM - 12:30 PM', subject: 'Physics', course: 'Physics', teacher: 'Prof. Tariq' },
    { id: '3', day: 'Wednesday', time: '10:00 AM - 11:30 AM', subject: 'Computer Science', course: 'Computer Science', teacher: 'Engr. Salman' },
    { id: '4', day: 'Thursday', time: '01:00 PM - 02:30 PM', subject: 'Pure Mathematics', course: 'Pure Mathematics', teacher: 'Dr. Ahmed' },
    { id: '5', day: 'Friday', time: '09:30 AM - 11:00 AM', subject: 'Computer Science Lab', course: 'Computer Science Lab', teacher: 'Engr. Salman' },
  ];

  const defaultAttendance: AttendanceRecord[] = [
    { id: '1', subject: 'Computer Science', course: 'Computer Science', date: '2026-09-28', totalClasses: 24, attended: 24, percentage: '100%', status: 'Present' },
    { id: '2', subject: 'Pure Mathematics', course: 'Pure Mathematics', date: '2026-09-28', totalClasses: 20, attended: 20, percentage: '100%', status: 'Present' },
    { id: '3', subject: 'Physics', course: 'Physics', date: '2026-09-28', totalClasses: 18, attended: 18, percentage: '100%', status: 'Present' },
  ];

  return {
    studentInfo: {
      id: studentInfo.id,
      name: studentInfo.name,
      email: studentInfo.email,
      program: studentInfo.program || 'Sindh Board (Grade 11)',
      avatar: '/default-avatar.png',
      enrolledDate: new Date().toLocaleDateString(),
      status: 'Active',
    },
    stats: {
      averagePerformance: '88%',
      pendingHomework: 2,
      classAttendance: '100%',
      activeSubjectsCount: 3,
    },
    recentResults: defaultResults,
    results: defaultResults,
    pendingAssignments: defaultAssignments,
    assignments: defaultAssignments,
    timetable: defaultSchedule,
    schedule: defaultSchedule,
    attendance: defaultAttendance,
  };
};

const PORTAL_STORAGE_KEY = 'vva_portal_records_db';

export function getPortalRecords(studentId?: string, extra?: any): PortalRecords {
  const fallback = createDynamicStudentProfile({
    id: studentId || 'VVA-STU',
    name: 'Enrolled Student',
    email: '',
  });

  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const data = localStorage.getItem(PORTAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      let target: any = null;

      if (studentId && parsed[studentId]) {
        target = parsed[studentId];
      } else if (parsed.studentInfo) {
        target = parsed;
      } else if (typeof parsed === 'object') {
        const keys = Object.keys(parsed);
        if (keys.length > 0 && parsed[keys[0]]?.studentInfo) {
          target = parsed[keys[0]];
        }
      }

      if (target) {
        return {
          studentInfo: target.studentInfo || fallback.studentInfo,
          stats: target.stats || fallback.stats,
          recentResults: target.recentResults || target.results || fallback.recentResults,
          results: target.results || target.recentResults || fallback.results,
          pendingAssignments: target.pendingAssignments || target.assignments || fallback.pendingAssignments,
          assignments: target.assignments || target.pendingAssignments || fallback.assignments,
          timetable: target.timetable || target.schedule || fallback.timetable,
          schedule: target.schedule || target.timetable || fallback.schedule,
          attendance: target.attendance || fallback.attendance,
        };
      }
    }
  } catch (err) {
    console.error('Error reading portal records:', err);
  }

  return fallback;
}

export function savePortalRecords(records?: any, extra?: any): void {
  if (typeof window === 'undefined') return;
  try {
    if (records) {
      localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(records));
    }
  } catch (err) {
    console.error('Error saving portal records:', err);
  }
}

export function getStudentPortalRecords(studentId: string, extra?: any): PortalRecords {
  return getPortalRecords(studentId, extra);
}

export function saveStudentPortalRecords(studentId: string, records: PortalRecords, extra?: any): void {
  const allRecords = getPortalRecords();
  allRecords[studentId] = records;
  savePortalRecords(allRecords);
}

export function migrateStudentPortalRecords(studentId?: string, extra?: any): PortalRecords {
  return getPortalRecords(studentId, extra);
}

export async function getStudentPortalData(studentId: string, sessionUser?: any): Promise<PortalRecords> {
  const activeId = studentId || sessionUser?.id || sessionUser?.studentId || 'VVA-STU';
  const activeName = sessionUser?.name || sessionUser?.studentName;

  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(PORTAL_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed[activeId]) {
          const saved = parsed[activeId];
          if (activeName && saved.studentInfo) {
            saved.studentInfo.name = activeName;
          }
          return {
            studentInfo: saved.studentInfo || { id: activeId, name: activeName || 'Enrolled Student', email: '', program: 'Sindh Board (Grade 11)', avatar: '/default-avatar.png', enrolledDate: new Date().toLocaleDateString(), status: 'Active' },
            stats: saved.stats || { averagePerformance: '88%', pendingHomework: 2, classAttendance: '100%', activeSubjectsCount: 3 },
            recentResults: saved.recentResults || saved.results || [],
            results: saved.results || saved.recentResults || [],
            pendingAssignments: saved.pendingAssignments || saved.assignments || [],
            assignments: saved.assignments || saved.pendingAssignments || [],
            timetable: saved.timetable || saved.schedule || [],
            schedule: saved.schedule || saved.timetable || [],
            attendance: saved.attendance || [],
          };
        }
      }
    } catch (e) {
      // Continue
    }
  }

  try {
    const { data: dbStudent } = await supabase
      .from('students')
      .select('*')
      .or(`student_id.eq.${activeId},id.eq.${activeId},email.eq.${activeId}`)
      .single();

    if (dbStudent) {
      const profile = createDynamicStudentProfile({
        id: dbStudent.student_id || dbStudent.id || activeId,
        name: dbStudent.name || dbStudent.full_name || dbStudent.student_name || activeName || 'Enrolled Student',
        email: dbStudent.email || sessionUser?.email || '',
        program: dbStudent.program || dbStudent.target_program || sessionUser?.program,
      });
      saveStudentPortalRecords(activeId, profile);
      return profile;
    }
  } catch (err) {
    // Continue
  }

  try {
    const { data: dbApp } = await supabase
      .from('applications')
      .select('*')
      .or(`generated_student_id.eq.${activeId},id.eq.${activeId}`)
      .single();

    if (dbApp) {
      const profile = createDynamicStudentProfile({
        id: dbApp.generated_student_id || dbApp.id || activeId,
        name: dbApp.student_name || dbApp.name || activeName || 'Enrolled Student',
        email: dbApp.student_email || dbApp.email || '',
        program: dbApp.target_program,
      });
      saveStudentPortalRecords(activeId, profile);
      return profile;
    }
  } catch (err) {
    // Continue
  }

  try {
    const localApps = getSavedApplications();
    if (Array.isArray(localApps)) {
      const matchedApp = localApps.find(
        (app: any) =>
          app.generatedStudentId === activeId ||
          app.id === activeId ||
          app.studentEmail === activeId
      );

      if (matchedApp) {
        const profile = createDynamicStudentProfile({
          id: matchedApp.generatedStudentId || matchedApp.id,
          name: matchedApp.studentName || activeName,
          email: matchedApp.studentEmail,
          program: matchedApp.targetProgram,
        });
        saveStudentPortalRecords(activeId, profile);
        return profile;
      }
    }
  } catch (err) {
    // Continue
  }

  if (sessionUser && (sessionUser.name || sessionUser.studentName)) {
    const profile = createDynamicStudentProfile({
      id: activeId,
      name: sessionUser.name || sessionUser.studentName,
      email: sessionUser.email || '',
      program: sessionUser.program || sessionUser.targetProgram,
    });
    saveStudentPortalRecords(activeId, profile);
    return profile;
  }

  const profile = createDynamicStudentProfile({
    id: activeId,
    name: activeName || 'Enrolled Student',
    email: sessionUser?.email || '',
  });
  return profile;
}