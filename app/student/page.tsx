"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  FileText,
  CheckCircle2,
  CalendarDays,
  Clock,
  User,
  LogOut,
  BarChart3,
  Award,
  Upload,
  Check,
  AlertCircle,
  Sparkles,
  Send,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import {
  PortalRecords,
  getStudentPortalRecords,
} from "@/lib/portalData";
import {
  getStudentAssignments,
  saveStudentAssignments,
} from "@/lib/storage";
import { Assignment, StudentAccount } from "@/lib/types";

type Tab = "overview" | "grades" | "assignments" | "timetable" | "attendance";

const defaultAssignments: Assignment[] = [
  {
    id: "asg-1",
    title: "Pure Mathematics II - Calculus Problem Set 4",
    course: "Mathematics (9709)",
    dueDate: "2026-10-05",
    status: "Pending",
    description: "Solve questions 1 through 12 on integration by parts and differential equations from Chapter 5.",
    totalPoints: "100",
  },
  {
    id: "asg-2",
    title: "Physics Lab Report - Oscillations & Simple Harmonic Motion",
    course: "Physics (9702)",
    dueDate: "2026-10-08",
    status: "Pending",
    description: "Submit a complete 3-page lab report including uncertainty calculations, pendulum diagrams, and conclusion.",
    totalPoints: "50",
  },
  {
    id: "asg-3",
    title: "Computer Science - Recursion & Binary Search Trees Essay",
    course: "Computer Science (9618)",
    dueDate: "2026-09-25",
    status: "Graded",
    description: "Compare time complexities of BST operations vs linear arrays with Python code snippets.",
    submissionText: "Submitted implementation along with Big-O complexity graph comparison.",
    totalPoints: "100",
    earnedPoints: "94",
    feedback: "Excellent analysis on tree balance factors and memory allocation!",
  },
];

export default function StudentPortalPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [student, setStudent] = useState<StudentAccount | null>(null);
  const [studentId, setStudentId] = useState<string>("VVA-STU-8842");
  const [records, setRecords] = useState<PortalRecords>({
    results: [],
    attendance: [],
    schedule: [],
  });
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionInput, setSubmissionInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  // Load student session & portal data on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = window.sessionStorage.getItem("vva_student_authenticated");
      const rawAccount = window.sessionStorage.getItem("vva_student_account");
      const activeId = window.sessionStorage.getItem("vva_active_student_id");

      if (!isAuth && !rawAccount) {
        // Fallback to login if unauthenticated
        router.push("/login");
        return;
      }

      if (rawAccount) {
        try {
          const acc: StudentAccount = JSON.parse(rawAccount);
          setStudent(acc);
          const currentId = acc.studentId || activeId || "VVA-STU-8842";
          setStudentId(currentId);
          loadPortalRecords(currentId);
          loadAssignments(currentId);
        } catch {
          loadPortalRecords("VVA-STU-8842");
          loadAssignments("VVA-STU-8842");
        }
      } else if (activeId) {
        setStudentId(activeId);
        loadPortalRecords(activeId);
        loadAssignments(activeId);
      } else {
        loadPortalRecords("VVA-STU-8842");
        loadAssignments("VVA-STU-8842");
      }
    }
  }, [router]);

  const loadPortalRecords = (id: string) => {
    const liveData = getStudentPortalRecords(id);
    setRecords(liveData);
  };

  const loadAssignments = async (id: string) => {
    const list = await getStudentAssignments(id, defaultAssignments);
    setAssignments(list);
    if (list.length > 0) {
      setSelectedAssignment(list[0]);
    }
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("vva_student_authenticated");
      window.sessionStorage.removeItem("vva_student_account");
      window.sessionStorage.removeItem("vva_active_student_id");
      window.dispatchEvent(new Event("vva_student_auth_changed"));
    }
    router.push("/login");
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    const updated: Assignment[] = assignments.map((asg) => {
      if (asg.id === selectedAssignment.id) {
        return {
          ...asg,
          status: "Submitted",
          submissionText: submissionInput || "File uploaded: " + (fileName || "document.pdf"),
        };
      }
      return asg;
    });

    setAssignments(updated);
    setSelectedAssignment({
      ...selectedAssignment,
      status: "Submitted",
      submissionText: submissionInput || "File uploaded: " + (fileName || "document.pdf"),
    });

    await saveStudentAssignments(studentId, updated);
    setSubmitMessage("Assignment submitted successfully to your teacher!");
    setSubmissionInput("");
    setFileName("");
    setTimeout(() => setSubmitMessage(""), 3500);
  };

  // Calculations for stats
  const totalResults = records.results.length;
  const avgScore = totalResults
    ? Math.round(
        records.results.reduce((acc, r) => {
          const num = parseInt(r.score.replace(/[^0-9]/g, "")) || 85;
          return acc + num;
        }, 0) / totalResults
      )
    : 88;

  const totalAttendance = records.attendance.length;
  const presentCount = records.attendance.filter(
    (a) => a.status === "Present" || a.status === "Late"
  ).length;
  const attendancePercentage = totalAttendance
    ? Math.round((presentCount / totalAttendance) * 100)
    : 95;

  const pendingAssignments = assignments.filter((a) => a.status === "Pending").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Portal Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <strong className="block text-sm text-white font-bold tracking-wide">
                Visioner Virtual Academy
              </strong>
              <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
                Student Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                {student?.studentName ? student.studentName.charAt(0) : "S"}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none">
                  {student?.studentName || "Aiden Vance"}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  ID: {studentId}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Student Hub Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-indigo-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Academic Term 2026 • Cambridge Advanced Track
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {student?.studentName || "Aiden Vance"}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Your portal synchronized live with the teacher office. View grades, turn in homework assignments, and keep track of your schedule.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-4 text-center min-w-[110px]">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Overall Score
                </span>
                <strong className="text-2xl font-black text-emerald-400 mt-0.5 block">
                  {avgScore}%
                </strong>
              </div>
              <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-4 text-center min-w-[110px]">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Attendance
                </span>
                <strong className="text-2xl font-black text-indigo-400 mt-0.5 block">
                  {attendancePercentage}%
                </strong>
              </div>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { key: "overview", label: "Dashboard Overview", icon: BarChart3 },
            { key: "assignments", label: "Assignments & Homework", icon: FileText, badge: pendingAssignments },
            { key: "grades", label: "Grades & Results", icon: Award },
            { key: "timetable", label: "Class Timetable", icon: CalendarDays },
            { key: "attendance", label: "Attendance Record", icon: CheckCircle2 },
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
                  <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-extrabold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* TAB 1: OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-8">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                onClick={() => setTab("grades")}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Average Performance</span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{avgScore}%</p>
                <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Grade A Standard
                </p>
              </div>

              <div
                onClick={() => setTab("assignments")}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Pending Homework</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{pendingAssignments}</p>
                <p className="text-[11px] text-amber-400 font-medium mt-1">Requires student submission</p>
              </div>

              <div
                onClick={() => setTab("attendance")}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Class Attendance</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{attendancePercentage}%</p>
                <p className="text-[11px] text-emerald-400 font-medium mt-1">Excellent attendance record</p>
              </div>

              <div
                onClick={() => setTab("timetable")}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Active Subjects</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">
                  {records.results.length || 3} Courses
                </p>
                <p className="text-[11px] text-blue-400 font-medium mt-1">Cambridge AS / A-Level Track</p>
              </div>
            </div>

            {/* Two-Column Grid: Latest Results + Active Assignments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Grades */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-base font-bold text-white">Recent Subject Results</h2>
                  </div>
                  <button
                    onClick={() => setTab("grades")}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {records.results.length > 0 ? (
                    records.results.slice(0, 3).map((res) => (
                      <div
                        key={res.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                      >
                        <div>
                          <strong className="block text-sm text-white font-bold">{res.course}</strong>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Code: {res.code} • {res.feedback || "Grade published by teacher"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-extrabold text-emerald-400 block">{res.score}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 inline-block mt-1">
                            Grade {res.grade}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                      No results published yet. Check back when your teacher updates the portal!
                    </div>
                  )}
                </div>
              </div>

              {/* Action Required: Assignments */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-bold text-white">Pending Assignments</h2>
                  </div>
                  <button
                    onClick={() => setTab("assignments")}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    Assignment Hub <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {assignments.slice(0, 3).map((asg) => (
                    <div
                      key={asg.id}
                      onClick={() => {
                        setSelectedAssignment(asg);
                        setTab("assignments");
                      }}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 cursor-pointer hover:border-amber-500/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                          {asg.course}
                        </span>
                        <strong className="text-xs font-bold text-white block line-clamp-1">
                          {asg.title}
                        </strong>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> Due: {asg.dueDate}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                          asg.status === "Graded"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                            : asg.status === "Submitted"
                            ? "bg-blue-950 text-blue-300 border border-blue-800/50"
                            : "bg-amber-950 text-amber-300 border border-amber-800/50"
                        }`}
                      >
                        {asg.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ASSIGNMENTS HUB */}
        {tab === "assignments" && (
          <div className="space-y-6">
            {submitMessage && (
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{submitMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Assignment List */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Assigned Homework ({assignments.length})
                </h3>

                <div className="space-y-3">
                  {assignments.map((asg) => {
                    const isSelected = selectedAssignment?.id === asg.id;
                    return (
                      <div
                        key={asg.id}
                        onClick={() => setSelectedAssignment(asg)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-indigo-950/40 border-indigo-500 text-white shadow-xl"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                            {asg.course}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                              asg.status === "Graded"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                                : asg.status === "Submitted"
                                ? "bg-blue-950 text-blue-300 border border-blue-800/50"
                                : "bg-amber-950 text-amber-300 border border-amber-800/50"
                            }`}
                          >
                            {asg.status}
                          </span>
                        </div>

                        <strong className="block text-sm font-bold mt-2 leading-snug">
                          {asg.title}
                        </strong>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" /> Due {asg.dueDate}
                          </span>
                          <span className="font-semibold text-slate-300">
                            {asg.earnedPoints ? `${asg.earnedPoints} / ${asg.totalPoints} pts` : `${asg.totalPoints} pts`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Submission Details & Interactive Upload */}
              <div className="lg:col-span-7">
                {selectedAssignment ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          {selectedAssignment.course}
                        </span>
                        <span className="text-xs text-slate-400">
                          Total Score: <strong>{selectedAssignment.totalPoints} Points</strong>
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold text-white mt-1">
                        {selectedAssignment.title}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> Target Deadline: {selectedAssignment.dueDate}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Teacher Instructions
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedAssignment.description}
                      </p>
                    </div>

                    {/* Graded Review State */}
                    {selectedAssignment.status === "Graded" && (
                      <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Graded by Teacher
                          </span>
                          <strong className="text-sm text-emerald-300">
                            Score: {selectedAssignment.earnedPoints} / {selectedAssignment.totalPoints}
                          </strong>
                        </div>
                        {selectedAssignment.feedback && (
                          <div className="text-xs text-slate-300 pt-2 border-t border-emerald-800/40 flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span><strong>Feedback:</strong> {selectedAssignment.feedback}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submitted Review State */}
                    {selectedAssignment.status === "Submitted" && (
                      <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2">
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-blue-400" /> Work Turned In
                        </span>
                        <p className="text-xs text-slate-300">
                          {selectedAssignment.submissionText}
                        </p>
                        <p className="text-[11px] text-slate-400 pt-2 border-t border-blue-900/50">
                          Your submission is pending evaluation by the teacher.
                        </p>
                      </div>
                    )}

                    {/* Pending Submission Form */}
                    {selectedAssignment.status === "Pending" && (
                      <form onSubmit={handleSubmitAssignment} className="space-y-4 pt-4 border-t border-slate-800">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Send className="w-4 h-4 text-indigo-400" /> Submit Student Homework
                        </h4>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-semibold">
                            Written Answer / Explanation
                          </label>
                          <textarea
                            rows={3}
                            value={submissionInput}
                            onChange={(e) => setSubmissionInput(e.target.value)}
                            placeholder="Type your response, links to documents, or solution explanation here..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-semibold">
                            Attach Work File (PDF, DOCX, ZIP)
                          </label>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl cursor-pointer text-xs font-semibold text-slate-300 transition-colors">
                              <Upload className="w-4 h-4 text-indigo-400" />
                              <span>{fileName ? fileName : "Choose Document..."}</span>
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setFileName(e.target.files[0].name);
                                  }
                                }}
                              />
                            </label>
                            {fileName && (
                              <button
                                type="button"
                                onClick={() => setFileName("")}
                                className="text-xs text-rose-400 hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-colors flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" /> Turn In Assignment
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-400">
                    Select an assignment on the left to view requirements and submit.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GRADES & ACADEMIC RESULTS */}
        {tab === "grades" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-white">Academic Results & Grades</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Official course evaluation marks updated by the academy administration.
                </p>
              </div>

              <div className="px-4 py-2 bg-indigo-950/60 border border-indigo-500/30 rounded-2xl flex items-center gap-3">
                <Award className="w-5 h-5 text-indigo-400" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Average Score</span>
                  <strong className="text-sm text-emerald-400">{avgScore}% (A Standard)</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {records.results.length > 0 ? (
                records.results.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/40 font-mono">
                          {res.code}
                        </span>
                        <strong className="text-sm font-bold text-white">{res.course}</strong>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pt-1">
                        {res.feedback || "Good progress and consistency demonstrated across course work."}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Achieved Score</span>
                        <strong className="text-lg font-black text-emerald-400">{res.score}</strong>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-black text-lg">
                        {res.grade}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                  No academic results recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CLASS TIMETABLE */}
        {tab === "timetable" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Weekly Class Schedule</h2>
              <p className="text-xs text-slate-400 mt-1">
                Scheduled live lectures and virtual cohort sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((dayName) => {
                const dayClasses = records.schedule.filter((s) => s.day === dayName);
                return (
                  <div key={dayName} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <strong className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                        {dayName}
                      </strong>
                      <span className="text-[10px] text-slate-500">{dayClasses.length} Sessions</span>
                    </div>

                    <div className="space-y-2.5">
                      {dayClasses.length > 0 ? (
                        dayClasses.map((item) => (
                          <div key={item.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {item.time}
                            </span>
                            <strong className="block text-xs font-bold text-white">{item.course}</strong>
                            <p className="text-[11px] text-slate-400">
                              Topic: {item.topic} • {item.teacher || "Faculty Instructor"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-500 italic py-2">No scheduled lectures</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: ATTENDANCE LOG */}
        {tab === "attendance" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-white">Attendance Log</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Live record of lecture participation and attendance.
                </p>
              </div>

              <div className="px-4 py-2 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Attendance Rate</span>
                  <strong className="text-sm text-emerald-400">{attendancePercentage}% Present</strong>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {records.attendance.length > 0 ? (
                records.attendance.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <strong className="block text-xs font-bold text-white">{item.course}</strong>
                      <span className="text-[11px] text-slate-400">{item.date}</span>
                    </div>

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
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                  No attendance records log published yet.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}