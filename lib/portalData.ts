import { supabase } from './supabase';
import { getSavedApplications } from './storage';

// Interfaces required by app/owner/page.tsx and app/student/page.tsx
export interface AcademicResult {
  id: string;
  subject: string;
  code: string;
  grade: string;
  status: string;
}

export interface AttendanceRecord {
  subject: string;
  totalClasses: number;
  attended: number;
  percentage: string;
}

export interface ScheduleRecord {
  day: string;
  time: string;
  subject: string;
  teacher: string;
}

export interface AssignmentRecord {
  id: string;
  subjectCode: string;
  title: string;
  dueDate: string;
  status: string;
}

export interface StudentInfoRecord {
  id: string;
  name: string;
  email: string;
  program: string;
  avatar?: string;
  enrolledDate?: string;
  status?: string;
}

export interface StatsRecord {
  averagePerformance: string;
  pendingHomework: number;
  classAttendance: string;
  activeSubjectsCount: number;
}

export interface PortalRecords {
  studentInfo: StudentInfoRecord;
  stats: StatsRecord;
  recentResults: AcademicResult[];
  pendingAssignments: AssignmentRecord[];
  timetable: ScheduleRecord[];
  attendance: AttendanceRecord[];
}

// Dynamic Profile Generator (Uses student's real name, email, program, ID)
export const createDynamicStudentProfile = (studentInfo: {
  id: string;
  name: string;
  email: string;
  program?: string;
}): PortalRecords => {
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
    recentResults: [
      {
        id: '1',
        subject: 'Computer Science',
        code: 'CS101 - Exceptional problem solving skills.',
        grade: '92%',
        status: 'GRADE A*',
      },
      {
        id: '2',
        subject: 'Pure Mathematics',
        code: 'MATH201 - Strong analytical thinking.',
        grade: '88%',
        status: 'GRADE A',
      },
      {
        id: '3',
        subject: 'Physics',
        code: 'PHYS101 - Excellent conceptual grasp.',
        grade: '85%',
        status: 'GRADE A',
      },
    ],
    pendingAssignments: [
      {
        id: '1',
        subjectCode: 'MATHEMATICS (9709)',
        title: 'Pure Mathematics II - Calculus Problem Set 4',
        dueDate: '2026-10-05',
        status: 'PENDING',
      },
      {
        id: '2',
        subjectCode: 'PHYSICS (9702)',
        title: 'Physics Lab Report - Oscillations & Simple Harmonic Motion',
        dueDate: '2026-10-12',
        status: 'PENDING',
      },
    ],
    timetable: [
      { day: 'Monday', time: '09:00 AM - 10:30 AM', subject: 'Pure Mathematics', teacher: 'Dr. Ahmed' },
      { day: 'Tuesday', time: '11:00 AM - 12:30 PM', subject: 'Physics', teacher: 'Prof. Tariq' },
      { day: 'Wednesday', time: '10:00 AM - 11:30 AM', subject: 'Computer Science', teacher: 'Engr. Salman' },
      { day: 'Thursday', time: '01:00 PM - 02:30 PM', subject: 'Pure Mathematics', teacher: 'Dr. Ahmed' },
      { day: 'Friday', time: '09:30 AM - 11:00 AM', subject: 'Computer Science Lab', teacher: 'Engr. Salman' },
    ],
    attendance: [
      { subject: 'Computer Science', totalClasses: 24, attended: 24, percentage: '100%' },
      { subject: 'Pure Mathematics', totalClasses: 20, attended: 20, percentage: '100%' },
      { subject: 'Physics', totalClasses: 18, attended: 18, percentage: '100%' },
    ],
  };
};

// Functions required by app/owner/page.tsx
const PORTAL_STORAGE_KEY = 'vva_portal_records_db';

export function getPortalRecords(): Record<string, PortalRecords> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(PORTAL_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Error reading portal records:', err);
    return {};
  }
}

export function savePortalRecords(records: Record<string, PortalRecords>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving portal records:', err);
  }
}

export function getStudentPortalRecords(studentId: string): PortalRecords | null {
  const allRecords = getPortalRecords();
  return allRecords[studentId] || null;
}

export function saveStudentPortalRecords(studentId: string, records: PortalRecords): void {
  const allRecords = getPortalRecords();
  allRecords[studentId] = records;
  savePortalRecords(allRecords);
}

export function migrateStudentPortalRecords(studentId?: string): Record<string, PortalRecords> {
  const allRecords = getPortalRecords();
  if (studentId && !allRecords[studentId]) {
    allRecords[studentId] = createDynamicStudentProfile({
      id: studentId,
      name: 'Enrolled Student',
      email: '',
    });
    savePortalRecords(allRecords);
  }
  return allRecords;
}

// Main loader used by app/student/page.tsx
export async function getStudentPortalData(studentId: string, sessionUser?: any): Promise<PortalRecords | null> {
  if (!studentId && !sessionUser) return null;

  const activeId = studentId || sessionUser?.id || sessionUser?.studentId;
  const activeName = sessionUser?.name || sessionUser?.studentName;

  // 1. Check local saved portal records (e.g. owner portal edits)
  const savedRecord = getStudentPortalRecords(activeId);
  if (savedRecord) {
    if (activeName && savedRecord.studentInfo) {
      savedRecord.studentInfo.name = activeName;
    }
    return savedRecord;
  }

  // 2. Query Supabase 'students' table
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

  // 3. Query Supabase 'applications' table
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

  // 4. Query LocalStorage applications via getSavedApplications
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

  // 5. Active session user profile fallback
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

  // 6. Fallback using student ID
  const profile = createDynamicStudentProfile({
    id: activeId || 'VVA-STU-ACTIVE',
    name: activeName || 'Enrolled Student',
    email: sessionUser?.email || '',
  });
  return profile;
}