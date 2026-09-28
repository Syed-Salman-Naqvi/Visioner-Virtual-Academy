import { supabase } from './supabase';
import { getStoredApplications } from './storage';

export const createDynamicStudentProfile = (studentInfo: {
  id: string;
  name: string;
  email: string;
  program?: string;
}) => {
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

export async function getStudentPortalData(studentId: string, sessionUser?: any) {
  if (!studentId && !sessionUser) return null;

  const activeId = studentId || sessionUser?.id || sessionUser?.studentId;
  const activeName = sessionUser?.name || sessionUser?.studentName;

  // 1. Query Supabase 'students' table
  try {
    const { data: dbStudent } = await supabase
      .from('students')
      .select('*')
      .or(`student_id.eq.${activeId},id.eq.${activeId},email.eq.${activeId}`)
      .single();

    if (dbStudent) {
      return createDynamicStudentProfile({
        id: dbStudent.student_id || dbStudent.id || activeId,
        name: dbStudent.name || dbStudent.full_name || dbStudent.student_name || activeName || 'Enrolled Student',
        email: dbStudent.email || sessionUser?.email || '',
        program: dbStudent.program || dbStudent.target_program || sessionUser?.program,
      });
    }
  } catch (err) {
    // Continue to next check
  }

  // 2. Query Supabase 'applications' table
  try {
    const { data: dbApp } = await supabase
      .from('applications')
      .select('*')
      .or(`generated_student_id.eq.${activeId},id.eq.${activeId}`)
      .single();

    if (dbApp) {
      return createDynamicStudentProfile({
        id: dbApp.generated_student_id || dbApp.id || activeId,
        name: dbApp.student_name || dbApp.name || activeName || 'Enrolled Student',
        email: dbApp.student_email || dbApp.email || '',
        program: dbApp.target_program,
      });
    }
  } catch (err) {
    // Continue to next check
  }

  // 3. Query LocalStorage applications
  const localApps = getStoredApplications();
  const matchedApp = localApps.find(
    (app: any) =>
      app.generatedStudentId === activeId ||
      app.id === activeId ||
      app.studentEmail === activeId
  );

  if (matchedApp) {
    return createDynamicStudentProfile({
      id: matchedApp.generatedStudentId || matchedApp.id,
      name: matchedApp.studentName || activeName,
      email: matchedApp.studentEmail,
      program: matchedApp.targetProgram,
    });
  }

  // 4. Session user profile fallback
  if (sessionUser && (sessionUser.name || sessionUser.studentName)) {
    return createDynamicStudentProfile({
      id: activeId,
      name: sessionUser.name || sessionUser.studentName,
      email: sessionUser.email || '',
      program: sessionUser.program || sessionUser.targetProgram,
    });
  }

  // 5. General fallback using student ID alone
  return createDynamicStudentProfile({
    id: activeId || 'VVA-STU-ACTIVE',
    name: activeName || 'Enrolled Student',
    email: sessionUser?.email || '',
  });
}