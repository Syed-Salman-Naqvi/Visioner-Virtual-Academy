"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  LogIn,
  LogOut,
  Save,
  Trash2,
  Plus,
  Search,
  FileText,
  Award,
  Users,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
  Edit3,
  Globe,
  MapPin,
  Calendar,
  Mail,
  Phone,
  User,
  BookOpen,
  File,
  Paperclip,
} from "lucide-react";
import {
  getSavedApplications,
  getStudentAccounts,
  saveApplication,
  deleteApplication,
  saveStudentAccount,
  deleteStudentAccount,
  getStudentAssignments,
  saveStudentAssignments,
} from "@/lib/storage";
import { AdmissionsApplication, StudentAccount, Assignment } from "@/lib/types";
import {
  AcademicResult,
  AttendanceRecord,
  PortalRecords,
  ScheduleRecord,
  getPortalRecords,
  getStudentPortalRecords,
  migrateStudentPortalRecords,
  savePortalRecords,
  saveStudentPortalRecords,
} from "@/lib/portalData";

type Tab = "overview" | "applications" | "assignments" | "records";

const OWNER_SESSION_KEY = "vva_owner_authenticated";
const OWNER_AUTH_EVENT = "vva_owner_auth_changed";

const getOwnerAuthSnapshot = () =>
  typeof window !== "undefined" && window.sessionStorage.getItem(OWNER_SESSION_KEY) === "true";

const subscribeToOwnerAuth = (onChange: () => void) => {
  window.addEventListener(OWNER_AUTH_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(OWNER_AUTH_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

const defaultTeacherAssignments: Assignment[] = [
  {
    id: "asg-1",
    title: "Pure Mathematics II - Calculus Problem Set 4",
    course: "Mathematics (9709)",
    courseCode: "9709",
    dueDate: "2026-10-05",
    status: "pending",
    instructions: "Solve questions 1 through 12 on integration by parts and differential equations from Chapter 5.",
    score: "100 pts",
    urgency: "high",
  },
  {
    id: "asg-2",
    title: "Physics Lab Report - Oscillations & Simple Harmonic Motion",
    course: "Physics (9702)",
    courseCode: "9702",
    dueDate: "2026-10-08",
    status: "pending",
    instructions: "Submit a complete 3-page lab report including uncertainty calculations, pendulum diagrams, and conclusion.",
    score: "50 pts",
    urgency: "normal",
  },
  {
    id: "asg-3",
    title: "Computer Science - Recursion & Binary Search Trees Essay",
    course: "Computer Science (9618)",
    courseCode: "9618",
    dueDate: "2026-09-25",
    status: "graded",
    instructions: "Compare time complexities of BST operations vs linear arrays with Python code snippets.",
    score: "94 / 100",
    feedback: "Excellent analysis on tree balance factors and memory allocation!",
    urgency: "normal",
  },
];

const emptyResult: AcademicResult = { id: "", code: "", course: "", score: "", grade: "", feedback: "" };
const emptyAttendance: AttendanceRecord = { id: "", date: "", course: "", status: "Present" };
const emptySchedule: ScheduleRecord = { id: "", day: "Monday", time: "", course: "", topic: "", teacher: "" };

export default function OwnerDashboardPage() {
  const authenticated = useSyncExternalStore(subscribeToOwnerAuth, getOwnerAuthSnapshot, () => false);

  const [ownerId, setOwnerId] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");

  const [applications, setApplications] = useState<AdmissionsApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<AdmissionsApplication | null>(null);
  const [studentAccounts, setStudentAccounts] = useState<StudentAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [deleteConfirmApp, setDeleteConfirmApp] = useState<AdmissionsApplication | null>(null);

  const [targetStudentId, setTargetStudentId] = useState<string>("VVA-STU-8842");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newAsgTitle, setNewAsgTitle] = useState("");
  const [newAsgCourse, setNewAsgCourse] = useState("");
  const [newAsgCode, setNewAsgCode] = useState("");
  const [newAsgDueDate, setNewAsgDueDate] = useState("");
  const [newAsgScore, setNewAsgScore] = useState("100 pts");
  const [newAsgUrgency, setNewAsgUrgency] = useState<"high" | "normal">("normal");
  const [newAsgInstructions, setNewAsgInstructions] = useState("");

  const [gradingAssignment, setGradingAssignment] = useState<Assignment | null>(null);
  const [gradeScoreInput, setGradeScoreInput] = useState("");
  const [gradeFeedbackInput, setGradeFeedbackInput] = useState("");

  const [records, setRecords] = useState<PortalRecords>(() => getPortalRecords());
  
  // States for Editing Academic Results, Attendance, and Schedule
  const [result, setResult] = useState<AcademicResult>(emptyResult);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);

  const [attendance, setAttendance] = useState<AttendanceRecord>(emptyAttendance);
  const [editingAttendanceId, setEditingAttendanceId] = useState<string | null>(null);

  const [schedule, setSchedule] = useState<ScheduleRecord>(emptySchedule);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const apps = await getSavedApplications();
      const accounts = await getStudentAccounts();
      setApplications(apps);
      setStudentAccounts(accounts);
      if (apps.length > 0 && !selectedApplication) {
        setSelectedApplication(apps[0]);
        const account = accounts.find((a) => a.applicationId === apps[0].id || a.studentId === apps[0].id);
        const recs = await getStudentPortalRecords(account ? account.studentId : apps[0].id);
        setRecords(recs);
      }
      loadAssignmentsForStudent("VVA-STU-8842");
    }
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  const loadAssignmentsForStudent = async (sId: string) => {
    const list = await getStudentAssignments(sId, defaultTeacherAssignments);
    setAssignments(list);
  };

  const handleSelectStudentForAssignments = (sId: string) => {
    setTargetStudentId(sId);
    loadAssignmentsForStudent(sId);
  };

  const updateRecords = async (next: PortalRecords) => {
    setRecords(next);
    const selectedAccount = selectedApplication
      ? studentAccounts.find((a) => a.applicationId === selectedApplication.id || a.studentId === selectedApplication.id)
      : undefined;
    const selectedRecordKey = selectedApplication ? (selectedAccount?.studentId || selectedApplication.id) : "VVA-STU-8842";

    if (selectedRecordKey) {
      await saveStudentPortalRecords(selectedRecordKey, next);
    } else {
      savePortalRecords(next);
    }
    notifyMessage("Academic records saved & synchronized with student portal.");
  };

  const notifyMessage = (msg: string) => {
    setMessage(msg);
    window.setTimeout(() => setMessage(""), 3500);
  };

  const updateStatus = async (status: AdmissionsApplication["status"]) => {
    if (!selectedApplication) return;
    const next = { ...selectedApplication, status };
    await saveApplication(next);
    setApplications((items) => items.map((item) => (item.id === next.id ? next : item)));
    setSelectedApplication(next);
    notifyMessage(`Application status updated to "${status}".`);
  };

  const selectApplication = async (application: AdmissionsApplication) => {
    setSelectedApplication(application);
    const account = studentAccounts.find((item) => item.applicationId === application.id || item.studentId === application.id);
    const targetId = account ? account.studentId : application.id;
    const recs = await getStudentPortalRecords(targetId);
    setRecords(recs);
    setResult(emptyResult);
    setEditingResultId(null);
    setAttendance(emptyAttendance);
    setEditingAttendanceId(null);
    setSchedule(emptySchedule);
    setEditingScheduleId(null);
  };

  const handleDeleteApplication = async (app: AdmissionsApplication) => {
    await deleteApplication(app.id);
    const associatedAccount = studentAccounts.find((a) => a.applicationId === app.id || a.studentId === app.id);
    if (associatedAccount) {
      await deleteStudentAccount(associatedAccount.studentId);
    }

    setApplications((prev) => prev.filter((item) => item.id !== app.id));
    setStudentAccounts((prev) => prev.filter((a) => a.applicationId !== app.id && a.studentId !== app.id));

    if (selectedApplication?.id === app.id) {
      const remaining = applications.filter((i) => i.id !== app.id);
      if (remaining.length > 0) {
        setSelectedApplication(remaining[0]);
      } else {
        setSelectedApplication(null);
      }
    }

    setDeleteConfirmApp(null);
    notifyMessage(`Enrollment record "${app.studentName}" deleted successfully.`);
  };

  const generateStudentAccount = async () => {
    if (!selectedApplication) return;
    const appId = selectedApplication.id.trim();
    const newPassword = `VVA${Math.floor(100000 + Math.random() * 900000)}`;
    const account: StudentAccount = {
      applicationId: appId,
      studentId: appId,
      password: newPassword,
      studentName: selectedApplication.studentName,
      studentEmail: selectedApplication.studentEmail,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    await saveStudentAccount(account);
    await migrateStudentPortalRecords(selectedApplication.id, account.studentId);
    setStudentAccounts((items) => [account, ...items.filter((item) => item.applicationId !== account.applicationId && item.studentId !== account.studentId)]);
    const updatedRecords = await getStudentPortalRecords(account.studentId);
    setRecords(updatedRecords);
    notifyMessage(`Account Generated! Active across all devices: ${account.studentId} / ${account.password}`);
    setTab("records");
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle || !newAsgCourse) return;

    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      title: newAsgTitle,
      course: newAsgCourse,
      courseCode: newAsgCode || "VVA-101",
      dueDate: newAsgDueDate || "2026-10-15",
      status: "pending",
      instructions: newAsgInstructions || "Complete exercise problems.",
      score: newAsgScore || "100 pts",
      urgency: newAsgUrgency,
    };

    const nextList = [newAssignment, ...assignments];
    setAssignments(nextList);
    await saveStudentAssignments(targetStudentId, nextList);

    setNewAsgTitle("");
    setNewAsgCourse("");
    setNewAsgCode("");
    setNewAsgDueDate("");
    setNewAsgInstructions("");
    notifyMessage(`New assignment published to student ${targetStudentId}!`);
  };

  const handleDeleteAssignment = async (asgId: string) => {
    const nextList = assignments.filter((a) => a.id !== asgId);
    setAssignments(nextList);
    await saveStudentAssignments(targetStudentId, nextList);
    notifyMessage("Assignment removed from student portal.");
  };

  const handleGradeAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAssignment) return;

    const nextList = assignments.map((a) => {
      if (a.id === gradingAssignment.id) {
        return {
          ...a,
          status: "graded" as const,
          score: gradeScoreInput || a.score,
          feedback: gradeFeedbackInput || "Good effort on this assignment.",
        };
      }
      return a;
    });

    setAssignments(nextList);
    await saveStudentAssignments(targetStudentId, nextList);
    setGradingAssignment(null);
    setGradeScoreInput("");
    setGradeFeedbackInput("");
    notifyMessage("Grade and feedback published to student portal.");
  };

  // Academic Results Handlers (Save, Edit, Delete)
  const saveResult = (event: React.FormEvent) => {
    event.preventDefault();
    if (!result.course || !result.score) return;

    if (editingResultId) {
      const updatedResults = records.results.map((item) =>
        item.id === editingResultId ? { ...result, id: editingResultId } : item
      );
      updateRecords({ ...records, results: updatedResults });
      setEditingResultId(null);
    } else {
      const newItem = { ...result, id: `result-${Date.now()}` };
      updateRecords({ ...records, results: [...records.results, newItem] });
    }
    setResult(emptyResult);
  };

  const handleEditResult = (item: AcademicResult) => {
    setResult(item);
    setEditingResultId(item.id);
  };

  const handleDeleteResult = (id: string) => {
    const updatedResults = records.results.filter((item) => item.id !== id);
    updateRecords({ ...records, results: updatedResults });
    if (editingResultId === id) {
      setResult(emptyResult);
      setEditingResultId(null);
    }
  };

  // Attendance Handlers (Save, Edit, Delete)
  const saveAttendance = (event: React.FormEvent) => {
    event.preventDefault();
    if (!attendance.course || !attendance.date) return;

    if (editingAttendanceId) {
      const updatedAttendance = records.attendance.map((item) =>
        item.id === editingAttendanceId ? { ...attendance, id: editingAttendanceId } : item
      );
      updateRecords({ ...records, attendance: updatedAttendance });
      setEditingAttendanceId(null);
    } else {
      const newItem = { ...attendance, id: `attendance-${Date.now()}` };
      updateRecords({ ...records, attendance: [...records.attendance, newItem] });
    }
    setAttendance(emptyAttendance);
  };

  const handleEditAttendance = (item: AttendanceRecord) => {
    setAttendance(item);
    setEditingAttendanceId(item.id);
  };

  const handleDeleteAttendance = (id: string) => {
    const updatedAttendance = records.attendance.filter((item) => item.id !== id);
    updateRecords({ ...records, attendance: updatedAttendance });
    if (editingAttendanceId === id) {
      setAttendance(emptyAttendance);
      setEditingAttendanceId(null);
    }
  };

  // Schedule Handlers (Save, Edit, Delete)
  const saveSchedule = (event: React.FormEvent) => {
    event.preventDefault();
    if (!schedule.course || !schedule.time) return;

    if (editingScheduleId) {
      const updatedSchedule = records.schedule.map((item) =>
        item.id === editingScheduleId ? { ...schedule, id: editingScheduleId } : item
      );
      updateRecords({ ...records, schedule: updatedSchedule });
      setEditingScheduleId(null);
    } else {
      const newItem = { ...schedule, id: `schedule-${Date.now()}` };
      updateRecords({ ...records, schedule: [...records.schedule, newItem] });
    }
    setSchedule(emptySchedule);
  };

  const handleEditSchedule = (item: ScheduleRecord) => {
    setSchedule(item);
    setEditingScheduleId(item.id);
  };

  const handleDeleteSchedule = (id: string) => {
    const updatedSchedule = records.schedule.filter((item) => item.id !== id);
    updateRecords({ ...records, schedule: updatedSchedule });
    if (editingScheduleId === id) {
      setSchedule(emptySchedule);
      setEditingScheduleId(null);
    }
  };

  const handleOwnerLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (ownerId === "Muhammad-Salman" && ownerPassword === "123123") {
      window.sessionStorage.setItem(OWNER_SESSION_KEY, "true");
      setLoginError("");
      window.dispatchEvent(new Event(OWNER_AUTH_EVENT));
      return;
    }
    setLoginError("Invalid Owner ID or password.");
  };

  const signOut = () => {
    window.sessionStorage.removeItem(OWNER_SESSION_KEY);
    window.dispatchEvent(new Event(OWNER_AUTH_EVENT));
    setOwnerId("");
    setOwnerPassword("");
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.targetTrack.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100 font-sans">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl space-y-6">
          <Link href="/" className="mx-auto flex w-fit items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
              <GraduationCap className="h-6 w-6 text-white" />
            </span>
            <span>
              <strong className="block text-base text-white font-bold">Visioner Academy</strong>
              <small className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
                Teacher & Owner Portal
              </small>
            </span>
          </Link>

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-extrabold text-white">Owner Control Sign In</h1>
            <p className="text-xs text-slate-400">Enter authorized academy administrator credentials.</p>
          </div>

          <form onSubmit={handleOwnerLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Owner ID
              </label>
              <input
                required
                value={ownerId}
                onChange={(event) => setOwnerId(event.target.value)}
                autoComplete="username"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Muhammad-Salman"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <input
                required
                type="password"
                value={ownerPassword}
                onChange={(event) => setOwnerPassword(event.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {loginError && <p role="alert" className="text-xs text-rose-400 font-semibold">{loginError}</p>}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
            >
              <LogIn className="h-4 w-4" /> Sign In to Dashboard
            </button>
          </form>

          <Link href="/login" className="block text-center text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
            ← Switch to Student Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
              <GraduationCap className="h-5 w-5 text-white" />
            </span>
            <span>
              <strong className="block text-sm text-white font-bold">Visioner Virtual Academy</strong>
              <small className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
                Teacher / Owner Control Center
              </small>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-semibold">Authorized Admin Mode</span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-bold transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Live Cloud Sync Active • Supabase Database
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Academy Control Dashboard 🎓
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Manage student enrollments, issue student IDs & passwords, assign homework, and publish academic marks synced directly with student portals.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center min-w-[110px]">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Applications
                </span>
                <strong className="text-2xl font-black text-indigo-400 mt-0.5 block">
                  {applications.length}
                </strong>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center min-w-[110px]">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Student Accounts
                </span>
                <strong className="text-2xl font-black text-emerald-400 mt-0.5 block">
                  {studentAccounts.length}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { key: "overview", label: "Overview", icon: BarChart3 },
            { key: "applications", label: "Applications & Enrollment", icon: Users, badge: applications.length },
            { key: "assignments", label: "Assignments Manager", icon: FileText },
            { key: "records", label: "Academic Records & Timetable", icon: Award },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key as Tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-indigo-500 text-white font-extrabold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {message && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 px-5 py-3 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                onClick={() => setTab("applications")}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Total Enrollment Apps</span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{applications.length}</p>
                <p className="text-[11px] text-indigo-400 font-medium mt-1 flex items-center gap-1">
                  Manage & issue credentials <ChevronRight className="w-3 h-3" />
                </p>
              </div>

              <div
                onClick={() => setTab("assignments")}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Assigned Homework</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{assignments.length}</p>
                <p className="text-[11px] text-amber-400 font-medium mt-1 flex items-center gap-1">
                  Publish new tasks <ChevronRight className="w-3 h-3" />
                </p>
              </div>

              <div
                onClick={() => setTab("records")}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Published Results</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{records.results.length}</p>
                <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                  Update marks & grades <ChevronRight className="w-3 h-3" />
                </p>
              </div>

              <div
                onClick={() => setTab("records")}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Scheduled Classes</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{records.schedule.length}</p>
                <p className="text-[11px] text-blue-400 font-medium mt-1 flex items-center gap-1">
                  Edit timetable <ChevronRight className="w-3 h-3" />
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-indigo-500/30 bg-slate-900/90 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Active Selected Student Profile
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedApplication ? selectedApplication.studentName : "Aiden Vance"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    ID: {selectedApplication ? selectedApplication.id : "VVA-STU-8842"} • Program: {selectedApplication ? selectedApplication.targetTrack : "Cambridge AS-Level"}
                  </p>
                </div>

                <button
                  onClick={() => setTab("records")}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-colors"
                >
                  Manage Academic Records
                </button>
              </div>
            </div>
          </div>
        )}

        {/* APPLICATIONS & ENROLLMENT TAB */}
        {tab === "applications" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student name, email, or ID..."
                  className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 shrink-0 font-semibold">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Applications</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Verified">Verified</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Accepted">Accepted</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Applications List */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Enrolled Applications ({filteredApplications.length})
                </h3>

                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                  {filteredApplications.map((item) => {
                    const isSelected = selectedApplication?.id === item.id;
                    const account = studentAccounts.find(
                      (a) => a.applicationId === item.id || a.studentId === item.id
                    );
                    return (
                      <div
                        key={item.id}
                        onClick={() => selectApplication(item)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-indigo-950/40 border-indigo-500 text-white shadow-xl"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-bold text-white">{item.studentName}</strong>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                            {item.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-1">{item.id} • {item.targetTrack}</p>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px]">
                          <span className="text-slate-400">{item.studentEmail}</span>
                          {account ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Credentials Active
                            </span>
                          ) : (
                            <span className="text-amber-400 font-semibold">No ID Generated</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {filteredApplications.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
                      No applications match your search query.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Complete Application Details */}
              <div className="lg:col-span-7">
                {selectedApplication ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
                      <div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
                          APPLICATION ID: {selectedApplication.id}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                          {selectedApplication.studentName}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" /> Applied on {selectedApplication.createdAt}
                        </p>
                      </div>

                      <button
                        onClick={() => setDeleteConfirmApp(selectedApplication)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-bold transition-colors shrink-0 shadow-lg shadow-rose-950/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Application
                      </button>
                    </div>

                    {/* Section 1: Personal & Demographics */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4" /> Personal & Demographics
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block font-semibold flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-indigo-400" /> Student Email
                          </span>
                          <strong className="text-white mt-1 block break-all text-xs font-mono">{selectedApplication.studentEmail}</strong>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date of Birth
                          </span>
                          <strong className="text-white mt-1 block">{selectedApplication.dateOfBirth || "N/A"}</strong>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block font-semibold flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-indigo-400" /> Nationality
                          </span>
                          <strong className="text-white mt-1 block">{selectedApplication.nationality || "N/A"}</strong>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block font-semibold flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Location (City & Country)
                          </span>
                          <strong className="text-white mt-1 block">
                            {selectedApplication.city ? `${selectedApplication.city}, ${selectedApplication.countryOfResidence}` : selectedApplication.countryOfResidence || "N/A"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Parent / Guardian Details */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4" /> Parent / Guardian Information
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block font-semibold">Guardian Name</span>
                          <strong className="text-white mt-1 block">{selectedApplication.parentName || "N/A"}</strong>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block font-semibold flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" /> Guardian Email
                          </span>
                          <strong className="text-white mt-1 block break-all font-mono">{selectedApplication.parentEmail || "N/A"}</strong>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block font-semibold flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" /> Phone Number
                          </span>
                          <strong className="text-white mt-1 block font-mono">{selectedApplication.parentPhone || "N/A"}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Academic Program & Slot Selections */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Academic Track & Class Preferences
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block font-semibold">Target Academic Program</span>
                          <strong className="text-emerald-400 mt-1 block font-bold">{selectedApplication.targetTrack} ({selectedApplication.gradeLevel})</strong>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" /> Class Time Slot
                          </span>
                          <strong className="text-amber-300 mt-1 block font-bold">{selectedApplication.preferredCohortSlot || "Morning Cohort (09:00 - 13:00 GMT)"}</strong>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block font-semibold">Time Zone</span>
                          <strong className="text-white mt-1 block font-mono">{selectedApplication.timeZone || "UTC+05:00 (Pakistan Standard Time)"}</strong>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 block font-semibold">Assigned Admissions Advisor</span>
                          <strong className="text-white mt-1 block">{selectedApplication.assignedAdvisor || "Admissions Office"}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Attached Documents */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                        <Paperclip className="w-4 h-4" /> Uploaded Student Documents
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.documentsAttached && selectedApplication.documentsAttached.length > 0 ? (
                          selectedApplication.documentsAttached.map((docName, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200">
                              <FileText className="w-4 h-4 text-indigo-400" />
                              <span className="font-semibold">{docName}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500 italic w-full">
                            No documents attached during registration.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 5: Statement of Purpose */}
                    {selectedApplication.statementOfPurpose && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          Statement of Purpose / Student Notes
                        </h4>
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                          "{selectedApplication.statementOfPurpose}"
                        </div>
                      </div>
                    )}

                    {/* Section 6: Status & Credentials Management */}
                    <div className="space-y-3 pt-4 border-t border-slate-800">
                      <label className="block text-xs font-semibold text-slate-300">
                        Update Application Status
                        <select
                          value={selectedApplication.status}
                          onChange={(e) => updateStatus(e.target.value as AdmissionsApplication["status"])}
                          className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Verified">Verified</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Accepted">Accepted</option>
                        </select>
                      </label>
                    </div>

                    <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        Student Portal Access & Credentials
                      </h4>

                      {studentAccounts.find((a) => a.applicationId === selectedApplication.id || a.studentId === selectedApplication.id) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <span className="text-slate-400 block">Active Student ID:</span>
                            <strong className="text-emerald-400 font-mono text-sm">
                              {studentAccounts.find((a) => a.applicationId === selectedApplication.id || a.studentId === selectedApplication.id)?.studentId}
                            </strong>
                          </div>
                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <span className="text-slate-400 block">Active Password:</span>
                            <strong className="text-emerald-400 font-mono text-sm">
                              {studentAccounts.find((a) => a.applicationId === selectedApplication.id || a.studentId === selectedApplication.id)?.password}
                            </strong>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs text-slate-300">
                            Generate a unique Student ID and Password for this applicant. This credential will sync to Supabase so the student can sign in from any laptop.
                          </p>
                          <button
                            onClick={generateStudentAccount}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-colors"
                          >
                            Generate Student Credentials
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-400">
                    Select an application from the list to manage.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ASSIGNMENTS MANAGER TAB */}
        {tab === "assignments" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-indigo-400" /> Create & Assign Homework
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Publishes directly to the student portal.
                  </p>
                </div>

                <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Target Student ID</label>
                    <select
                      value={targetStudentId}
                      onChange={(e) => handleSelectStudentForAssignments(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                    >
                      <option value="VVA-STU-8842">VVA-STU-8842 (Aiden Vance)</option>
                      {studentAccounts.map((acc) => (
                        <option key={acc.studentId} value={acc.studentId}>
                          {acc.studentId} ({acc.studentName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Assignment Title</label>
                    <input
                      required
                      type="text"
                      value={newAsgTitle}
                      onChange={(e) => setNewAsgTitle(e.target.value)}
                      placeholder="e.g. Calculus Problem Set 5"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Course Name</label>
                      <input
                        required
                        type="text"
                        value={newAsgCourse}
                        onChange={(e) => setNewAsgCourse(e.target.value)}
                        placeholder="Mathematics"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Course Code</label>
                      <input
                        type="text"
                        value={newAsgCode}
                        onChange={(e) => setNewAsgCode(e.target.value)}
                        placeholder="9709"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Due Date</label>
                      <input
                        type="date"
                        value={newAsgDueDate}
                        onChange={(e) => setNewAsgDueDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Priority Urgency</label>
                      <select
                        value={newAsgUrgency}
                        onChange={(e) => setNewAsgUrgency(e.target.value as "high" | "normal")}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Max Score / Weight</label>
                    <input
                      type="text"
                      value={newAsgScore}
                      onChange={(e) => setNewAsgScore(e.target.value)}
                      placeholder="100 pts"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Instructions & Guidelines</label>
                    <textarea
                      rows={3}
                      value={newAsgInstructions}
                      onChange={(e) => setNewAsgInstructions(e.target.value)}
                      placeholder="Type details for students..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    <Plus className="w-4 h-4" /> Publish Assignment
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Assigned Homework for <span className="font-mono text-indigo-400">{targetStudentId}</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">{assignments.length} Total</span>
                </div>

                <div className="space-y-3">
                  {assignments.map((asg) => (
                    <div
                      key={asg.id}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                            {asg.course} ({asg.courseCode})
                          </span>
                          <strong className="block text-sm font-bold text-white mt-0.5">{asg.title}</strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${
                              asg.status === "graded"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                                : asg.status === "submitted"
                                ? "bg-blue-950 text-blue-300 border border-blue-800/50"
                                : "bg-amber-950 text-amber-300 border border-amber-800/50"
                            }`}
                          >
                            {asg.status}
                          </span>

                          <button
                            onClick={() => handleDeleteAssignment(asg.id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800/40 transition-colors"
                            title="Delete Assignment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                        {asg.instructions}
                      </p>

                      <div className="flex items-center justify-between pt-2 text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" /> Due {asg.dueDate}
                        </span>

                        <button
                          onClick={() => {
                            setGradingAssignment(asg);
                            setGradeScoreInput(asg.score || "90 / 100");
                            setGradeFeedbackInput(asg.feedback || "");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/50 font-bold text-[11px] flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3 h-3" /> Grade / Review
                        </button>
                      </div>
                    </div>
                  ))}

                  {assignments.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
                      No assignments published for this student yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACADEMIC RECORDS & TIMETABLE TAB */}
        {tab === "records" && (
          <div className="space-y-8">
            {/* Section 1: Academic Results & Grades (With Edit & Delete) */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" /> Academic Results & Grades
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-3">
                  {records.results.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1">
                        <strong className="block text-sm font-bold text-white">{item.course}</strong>
                        <p className="text-xs text-slate-400">
                          Code: <span className="font-mono text-indigo-400">{item.code}</span> • {item.feedback || "Grade published"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-extrabold text-emerald-400">{item.score} ({item.grade})</span>
                        
                        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                          <button
                            onClick={() => handleEditResult(item)}
                            className="p-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/50 transition-colors"
                            title="Edit Grade"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteResult(item.id)}
                            className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 border border-rose-800/50 transition-colors"
                            title="Delete Grade"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {records.results.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800 italic">
                      No academic results saved yet.
                    </div>
                  )}
                </div>

                <form onSubmit={saveResult} className="lg:col-span-5 space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      {editingResultId ? "Edit Subject Grade" : "Add New Subject Grade"}
                    </span>
                    {editingResultId && (
                      <button
                        type="button"
                        onClick={() => {
                          setResult(emptyResult);
                          setEditingResultId(null);
                        }}
                        className="text-slate-400 hover:text-white text-[10px]"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Course Name</label>
                    <input
                      required
                      value={result.course}
                      onChange={(e) => setResult({ ...result, course: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Computer Science"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Course Code</label>
                    <input
                      value={result.code}
                      onChange={(e) => setResult({ ...result, code: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                      placeholder="e.g. CS101"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Score (%)</label>
                      <input
                        required
                        value={result.score}
                        onChange={(e) => setResult({ ...result, score: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. 92%"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Grade Letter</label>
                      <input
                        required
                        value={result.grade}
                        onChange={(e) => setResult({ ...result, grade: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. A*"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Teacher Feedback Comment</label>
                    <input
                      value={result.feedback}
                      onChange={(e) => setResult({ ...result, feedback: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Exceptional problem solving skills"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30 mt-2"
                  >
                    <Save className="h-4 w-4" /> {editingResultId ? "Update Academic Result" : "Save Academic Result"}
                  </button>
                </form>
              </div>
            </section>

            {/* Section 2: Attendance Log (With Edit & Delete) */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Attendance Log
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-3">
                  {records.attendance.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <strong className="block text-xs font-bold text-white">{item.course}</strong>
                        <span className="text-[11px] text-slate-400">{item.date}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            item.status === "Present"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                              : item.status === "Late"
                              ? "bg-amber-950 text-amber-300 border border-amber-800/50"
                              : "bg-rose-950 text-rose-300 border border-rose-800/50"
                          }`}
                        >
                          {item.status}
                        </span>

                        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                          <button
                            onClick={() => handleEditAttendance(item)}
                            className="p-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/50 transition-colors"
                            title="Edit Attendance"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAttendance(item.id)}
                            className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 border border-rose-800/50 transition-colors"
                            title="Delete Attendance"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {records.attendance.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800 italic">
                      No attendance entries logged yet.
                    </div>
                  )}
                </div>

                <form onSubmit={saveAttendance} className="lg:col-span-5 space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      {editingAttendanceId ? "Edit Attendance Entry" : "Log Attendance"}
                    </span>
                    {editingAttendanceId && (
                      <button
                        type="button"
                        onClick={() => {
                          setAttendance(emptyAttendance);
                          setEditingAttendanceId(null);
                        }}
                        className="text-slate-400 hover:text-white text-[10px]"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Course Name</label>
                    <input
                      required
                      value={attendance.course}
                      onChange={(e) => setAttendance({ ...attendance, course: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Pure Mathematics"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Date</label>
                    <input
                      required
                      type="date"
                      value={attendance.date}
                      onChange={(e) => setAttendance({ ...attendance, date: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Attendance Status</label>
                    <select
                      value={attendance.status}
                      onChange={(e) => setAttendance({ ...attendance, status: e.target.value as AttendanceRecord["status"] })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Present">Present</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30 mt-2"
                  >
                    <Save className="h-4 w-4" /> {editingAttendanceId ? "Update Attendance Log" : "Save Attendance Log"}
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Delete Application Modal */}
      {deleteConfirmApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-950 border border-rose-800/60 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Enrollment Record?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">{deleteConfirmApp.studentName}</strong> ({deleteConfirmApp.id})? This will delete their enrollment application and student credentials from both local storage and the Supabase cloud database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmApp(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteApplication(deleteConfirmApp)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-rose-600/30"
              >
                <Trash2 className="w-4 h-4" /> Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Homework Grading Modal */}
      {gradingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" /> Grade Student Homework
              </h3>
              <button onClick={() => setGradingAssignment(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradeAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Score / Points Earned</label>
                <input
                  type="text"
                  value={gradeScoreInput}
                  onChange={(e) => setGradeScoreInput(e.target.value)}
                  placeholder="e.g. 95 / 100"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Teacher Feedback Comment</label>
                <textarea
                  rows={4}
                  value={gradeFeedbackInput}
                  onChange={(e) => setGradeFeedbackInput(e.target.value)}
                  placeholder="Type feedback for the student..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingAssignment(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Publish Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}