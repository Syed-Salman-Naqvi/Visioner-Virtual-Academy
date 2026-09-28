"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  LogOut,
  BarChart3,
  FileText,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  ChevronRight,
  BookOpen,
  Paperclip,
  Check,
} from "lucide-react";
import { getStudentPortalRecords, PortalRecords, AcademicResult } from "@/lib/portalData";
import { getStudentAssignments, saveStudentAssignments } from "@/lib/storage";
import { Assignment, StudentAccount } from "@/lib/types";

type Tab = "overview" | "assignments" | "grades" | "timetable" | "attendance";

const defaultMockAssignments: Assignment[] = [
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

export default function StudentPortalPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [student, setStudent] = useState<StudentAccount | null>(null);
  const [records, setRecords] = useState<PortalRecords | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function initStudentData() {
      let activeStudent: StudentAccount | null = null;
      if (typeof window !== "undefined") {
        try {
          const session = sessionStorage.getItem("vva_student_session");
          if (session) activeStudent = JSON.parse(session);
        } catch (e) {
          console.error("Session parse error:", e);
        }
      }

      if (!activeStudent) {
        activeStudent = {
          studentId: "VVA-STU-8842",
          studentName: "Aiden Vance",
          studentEmail: "aiden.vance@example.com",
          password: "",
          applicationId: "VVA-STU-8842",
        };
      }

      setStudent(activeStudent);

      const targetId = activeStudent.studentId || activeStudent.applicationId;
      const recs = await getStudentPortalRecords(targetId);
      setRecords(recs);

      const asgs = await getStudentAssignments(targetId, defaultMockAssignments);
      setAssignments(asgs);
      if (asgs.length > 0) setSelectedAsg(asgs[0]);
    }

    initStudentData();

    const handleStorageChange = () => initStudentData();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleTurnInAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsg || !student) return;

    const updated = assignments.map((a) => {
      if (a.id === selectedAsg.id) {
        return {
          ...a,
          status: "submitted" as const,
          submittedAt: new Date().toISOString(),
          submissionNotes: submissionText,
          attachedFileName: attachedFile ? attachedFile.name : undefined,
        };
      }
      return a;
    });

    setAssignments(updated);
    const targetId = student.studentId || student.applicationId;
    await saveStudentAssignments(targetId, updated);

    setSubmitSuccess(true);
    setSubmissionText("");
    setAttachedFile(null);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const calculateAveragePerformance = (resultsList: AcademicResult[]) => {
    if (!resultsList || resultsList.length === 0) return "0%";
    let total = 0;
    let count = 0;
    resultsList.forEach((r) => {
      const num = parseInt(r.score.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(num)) {
        total += num;
        count++;
      }
    });
    if (count === 0) return "0%";
    return `${Math.round(total / count)}%`;
  };

  const calculateAttendancePercentage = () => {
    if (!records || !records.attendance || records.attendance.length === 0) return "100%";
    const presentCount = records.attendance.filter((a) => a.status === "Present").length;
    return `${Math.round((presentCount / records.attendance.length) * 100)}%`;
  };

  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const displayResults = records?.results || [];

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
                Student Portal
              </small>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center font-bold text-indigo-300 uppercase">
                {student?.studentName?.[0] || "S"}
              </div>
              <div className="hidden sm:block text-left">
                <strong className="block text-white font-bold leading-tight">{student?.studentName || "Student"}</strong>
                <span className="text-[10px] text-slate-400 font-mono">ID: {student?.studentId || "VVA-STU"}</span>
              </div>
            </div>

            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Live Cloud Synced • Student Academic Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {student?.studentName || "Student"} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Your portal synchronized live with the teacher office. View grades, turn in homework assignments, and keep track of your schedule.
              </p>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { key: "overview", label: "Dashboard Overview", icon: BarChart3 },
            { key: "assignments", label: "Assignments & Homework", icon: FileText, badge: pendingCount },
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

        {/* DASHBOARD OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Average Performance</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{calculateAveragePerformance(displayResults)}</p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ Grade A Standard</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Pending Homework</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{pendingCount}</p>
                <p className="text-[11px] text-amber-400 font-semibold mt-1">
                  {pendingCount > 0 ? "Requires student submission" : "All caught up!"}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Class Attendance</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{calculateAttendancePercentage()}</p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">Excellent attendance record</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Active Subjects</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white mt-3">{displayResults.length} Courses</p>
                <p className="text-[11px] text-blue-400 font-semibold mt-1">Cambridge AS / A-Level Track</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Subject Results (Dynamic) */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-400" /> Recent Subject Results
                  </h3>
                  <button onClick={() => setTab("grades")} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {displayResults.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <strong className="block text-sm font-bold text-white">{item.course}</strong>
                        <p className="text-xs text-slate-400 mt-0.5">Code: {item.code} • {item.feedback}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <strong className="block text-sm font-extrabold text-emerald-400">{item.score}</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                          GRADE {item.grade}
                        </span>
                      </div>
                    </div>
                  ))}

                  {displayResults.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-950 rounded-2xl border border-slate-800">
                      No grades published by teacher yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Pending Assignments (Dynamic) */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" /> Pending Assignments
                  </h3>
                  <button onClick={() => setTab("assignments")} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                    Assignment Hub <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {assignments.map((asg) => (
                    <div key={asg.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{asg.course}</span>
                          <strong className="block text-xs font-bold text-white mt-0.5">{asg.title}</strong>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${asg.status === "graded" ? "bg-emerald-950 text-emerald-300" : asg.status === "submitted" ? "bg-blue-950 text-blue-300" : "bg-amber-950 text-amber-300"}`}>
                          {asg.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                        <Clock className="w-3 h-3 text-amber-400" /> Due: {asg.dueDate}
                      </p>
                    </div>
                  ))}

                  {assignments.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-950 rounded-2xl border border-slate-800">
                      No assignments found for your account.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASSIGNMENTS & HOMEWORK TAB */}
        {tab === "assignments" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Assigned Homework ({assignments.length})
              </h3>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {assignments.map((asg) => {
                  const isSelected = selectedAsg?.id === asg.id;
                  return (
                    <div
                      key={asg.id}
                      onClick={() => setSelectedAsg(asg)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-950/40 border-indigo-500 text-white shadow-xl"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{asg.course}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${asg.status === "graded" ? "bg-emerald-950 text-emerald-300" : asg.status === "submitted" ? "bg-blue-950 text-blue-300" : "bg-amber-950 text-amber-300"}`}>
                          {asg.status.toUpperCase()}
                        </span>
                      </div>
                      <strong className="block text-xs font-bold text-white mt-1">{asg.title}</strong>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> Due {asg.dueDate}</span>
                        <span>{asg.score}</span>
                      </div>
                    </div>
                  );
                })}

                {assignments.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
                    No homework assigned yet.
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7">
              {selectedAsg ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{selectedAsg.course}</span>
                    <h2 className="text-xl font-extrabold text-white mt-1">{selectedAsg.title}</h2>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Target Deadline: {selectedAsg.dueDate} • <span className="text-indigo-300 font-semibold">{selectedAsg.score}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Teacher Instructions</h4>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      {selectedAsg.instructions}
                    </div>
                  </div>

                  {selectedAsg.feedback && (
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                      <strong className="text-xs font-bold text-emerald-400 block">Teacher Review & Feedback:</strong>
                      <p className="text-xs text-emerald-200">{selectedAsg.feedback}</p>
                    </div>
                  )}

                  {selectedAsg.status === "submitted" ? (
                    <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2 text-xs">
                      <strong className="text-blue-300 font-bold flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Homework Turned In Successfully!
                      </strong>
                      <p className="text-slate-300">Submitted on: {new Date(selectedAsg.submittedAt || "").toLocaleString()}</p>
                      {selectedAsg.submissionNotes && <p className="text-slate-400 italic">"{selectedAsg.submissionNotes}"</p>}
                    </div>
                  ) : selectedAsg.status === "pending" ? (
                    <form onSubmit={handleTurnInAssignment} className="space-y-4 pt-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-indigo-400" /> Submit Student Homework
                      </h4>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Written Answer / Explanation</label>
                        <textarea
                          rows={4}
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Type your response, links to documents, or solution explanation here..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Attach Work File (PDF, DOCX, ZIP)</label>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Paperclip className="w-4 h-4 text-indigo-400" />
                          {attachedFile ? attachedFile.name : "Choose Document..."}
                        </label>
                      </div>

                      {submitSuccess && (
                        <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Homework submitted to teacher!
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" /> Turn In Assignment
                      </button>
                    </form>
                  ) : null}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-400">
                  Select an assignment from the list.
                </div>
              )}
            </div>
          </div>
        )}

        {/* GRADES & RESULTS TAB */}
        {tab === "grades" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Academic Results & Grades</h3>
                <p className="text-xs text-slate-400 mt-0.5">Official course evaluation marks updated by the academy administration.</p>
              </div>
              <div className="bg-indigo-950 border border-indigo-500/30 px-4 py-2 rounded-2xl text-right">
                <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">Average Score</span>
                <strong className="text-lg font-black text-emerald-400">{calculateAveragePerformance(displayResults)}</strong>
              </div>
            </div>

            <div className="space-y-4">
              {displayResults.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                      {item.code}
                    </span>
                    <strong className="block text-base font-bold text-white mt-1">{item.course}</strong>
                    <p className="text-xs text-slate-400">{item.feedback}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-400 block font-semibold mb-0.5">Achieved Score</span>
                    <strong className="text-xl font-black text-emerald-400">{item.score}</strong>
                    <span className="ml-2 text-xs font-black px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                      {item.grade}
                    </span>
                  </div>
                </div>
              ))}

              {displayResults.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-950 rounded-2xl border border-slate-800">
                  No academic grades logged yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TIMETABLE TAB */}
        {tab === "timetable" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Class Schedule & Timetable</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live class schedule and instructor details.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {records?.schedule.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 bg-amber-950 rounded border border-amber-800/40">
                    {item.day} • {item.time}
                  </span>
                  <strong className="block text-sm font-bold text-white mt-2">{item.course}</strong>
                  <p className="text-xs text-slate-400">Topic: {item.topic}</p>
                  <p className="text-xs text-indigo-400 font-semibold pt-1">Instructor: {item.teacher}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {tab === "attendance" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Attendance Log</h3>
                <p className="text-xs text-slate-400 mt-0.5">Record of class presence and punctuality.</p>
              </div>
              <div className="bg-emerald-950 border border-emerald-500/30 px-4 py-2 rounded-2xl text-right">
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">Attendance Score</span>
                <strong className="text-lg font-black text-emerald-300">{calculateAttendancePercentage()}</strong>
              </div>
            </div>

            <div className="space-y-3">
              {records?.attendance.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="block text-sm font-bold text-white">{item.course}</strong>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.status === "Present" ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40" : "bg-amber-950 text-amber-300 border border-amber-800/40"}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}