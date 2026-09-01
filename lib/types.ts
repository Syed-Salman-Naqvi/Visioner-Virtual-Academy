export type AcademicTrack =
  | "all"
  | "cambridge-igcse"
  | "cambridge-a-levels"
  | "advanced-placement"
  | "stem-accelerator"
  | "middle-foundation";

export interface Course {
  id: string;
  code: string;
  title: string;
  track: "cambridge-igcse" | "cambridge-a-levels" | "advanced-placement" | "stem-accelerator" | "middle-foundation";
  trackLabel: string;
  department: "Sciences" | "Mathematics" | "Computer Science" | "Humanities" | "Languages";
  gradeLevel: string;
  weeklyHours: number;
  instructor: string;
  instructorTitle: string;
  description: string;
  syllabus: string[];
  prerequisites: string;
  examCode?: string;
  featured?: boolean;
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  department: "Sciences" | "Mathematics" | "Computer Science" | "Humanities" | "Leadership & Guidance";
  education: string;
  experienceYears: number;
  bio: string;
  specialization: string;
  availability: string;
  officeHours: string;
  avatarInitials: string;
}

export interface AdmissionsApplication {
  id: string;
  createdAt: string;
  status: "Under Review" | "Verified" | "Interview Scheduled" | "Accepted";
  studentName: string;
  studentEmail: string;
  dateOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  city: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  targetTrack: string;
  gradeLevel: string;
  timeZone: string;
  preferredCohortSlot: string;
  assignedAdvisor: string;
  documentsAttached: string[];
  statementOfPurpose?: string;
}

export interface StudentAccount {
  applicationId: string;
  studentId: string;
  password: string;
  studentName: string;
  studentEmail: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  score?: string;
  feedback?: string;
  instructions: string;
  urgency: "high" | "normal";
}

export interface ChatMessage {
  id: string;
  sender: "student" | "tutor" | "ai" | "advisor";
  senderName: string;
  text: string;
  timestamp: string;
  avatarInitials: string;
}

export interface TimetableEntry {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  baseTimeGst: string; // e.g. "09:00 - 10:15"
  subject: string;
  topic: string;
  teacher: string;
  teacherAvatar: string;
  roomCode: string;
  status: "live" | "upcoming" | "completed";
  slidesAvailable: boolean;
  recordingAvailable: boolean;
}

