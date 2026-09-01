"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BarChart3,
  Clock,
  LogOut,
  Send,
} from "lucide-react";

export default function ParentPortalPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "grades" | "attendance" | "invoices" | "messages">("overview");
  const [parentMessage, setParentMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const studentData = {
    name: "Aiden Vance",
    grade: "Grade 11 (Cambridge AS-Level)",
    studentId: "VVA-STU-8842",
    attendanceRate: "98.4%",
    overallGpa: "3.95 / 4.0",
    advisor: "Ms. Rebecca Vance (Dean of Admissions & Guidance)",
  };

  const attendanceLog = [
    { date: "Today", subject: "Cambridge AS-Level Physics", time: "09:00 GST", status: "Present (On-Time)" },
    { date: "Today", subject: "Pure Mathematics P3", time: "10:45 GST", status: "Attending Live Now" },
    { date: "Yesterday", subject: "Computer Science & Python", time: "13:00 GST", status: "Present (On-Time)" },
    { date: "Aug 20", subject: "English General Paper", time: "11:00 GST", status: "Present (On-Time)" },
  ];

  const grades = [
    { course: "Cambridge AS-Level Physics", code: "PHY-9702", teacher: "Dr. Sarah Jenkins", grade: "94% (A*)", remarks: "Top score on rotational mechanics test." },
    { course: "Pure Mathematics 1 & 3", code: "MAT-9709", teacher: "Prof. Mark Thompson", grade: "91% (A*)", remarks: "Consistent excellence in integration proofs." },
    { course: "Computer Science (A-Level)", code: "CS-9618", teacher: "Eng. Alex Chen", grade: "96% (A*)", remarks: "Exceptional mastery of binary tree algorithms." },
    { course: "English General Paper", code: "ENG-8021", teacher: "Dr. Hannah Bailey", grade: "87% (A)", remarks: "Thoughtful critical analysis on global ethics." },
  ];

  const invoices = [
    { id: "INV-2026-001", term: "Term 1 Tuition (Fall 2026)", amount: "$2,400 USD", dueDate: "Paid (Aug 15, 2026)", status: "paid" },
    { id: "INV-2026-002", term: "Term 2 Tuition (Spring 2027)", amount: "$2,400 USD", dueDate: "Due Dec 15, 2026", status: "pending" },
    { id: "INV-2026-003", term: "Term 3 Tuition (Summer 2027)", amount: "$2,400 USD", dueDate: "Due Apr 15, 2027", status: "upcoming" },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMessage.trim()) return;
    setMessageSent(true);
    setParentMessage("");
    setTimeout(() => setMessageSent(false), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Visioner Academy</span>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase">Parent Portal</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-white block">Dr. Robert Vance (Parent)</span>
            <span className="text-[10px] text-slate-400">Enrolled Student: {studentData.name}</span>
          </div>
          <Link
            href="/student"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
          >
            Switch to Student View
          </Link>
          <Link
            href="/"
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Child Overview Banner */}
        <div className="bg-linear-to-r from-slate-900 via-indigo-950/70 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-extrabold text-xl flex items-center justify-center shrink-0">
              AV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{studentData.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  Enrolled & Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{studentData.grade} • ID: {studentData.studentId}</p>
              <p className="text-[11px] text-slate-400 mt-1">Advisor: {studentData.advisor}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance</span>
              <span className="text-base font-extrabold text-emerald-400">{studentData.attendanceRate}</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative GPA</span>
              <span className="text-base font-extrabold text-indigo-300">{studentData.overallGpa}</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tuition Status</span>
              <span className="text-xs font-bold text-emerald-400">Term 1 Settled</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs">
          {[
            { key: "overview", label: "Academic Summary" },
            { key: "grades", label: "Report Card & Grades" },
            { key: "attendance", label: "Live Attendance Log" },
            { key: "invoices", label: "Tuition Invoices" },
            { key: "messages", label: "Contact Teachers & Advisor" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "overview" | "grades" | "attendance" | "invoices" | "messages")}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Grades Snippet (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Current Course Performance
              </h3>
              <div className="space-y-2.5 text-xs">
                {grades.map((g, i) => (
                  <div key={i} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">{g.course}</h4>
                      <p className="text-[11px] text-slate-400">{g.teacher}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 font-bold border border-indigo-500/30">
                      {g.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance & Advisor Snippet (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Recent Class Attendance
                </h3>
                <div className="space-y-2">
                  {attendanceLog.slice(0, 3).map((log, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-medium text-white block">{log.subject}</span>
                        <span className="text-[10px] text-slate-400">{log.date} • {log.time}</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-semibold">{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Grades */}
        {activeTab === "grades" && (
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Term 1 Detailed Academic Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Course</th>
                    <th className="p-3">Instructor</th>
                    <th className="p-3">Current Grade</th>
                    <th className="p-3">Faculty Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {grades.map((g, i) => (
                    <tr key={i} className="hover:bg-slate-950/40">
                      <td className="p-3 font-semibold text-white">{g.course}</td>
                      <td className="p-3 text-slate-400">{g.teacher}</td>
                      <td className="p-3 font-bold text-emerald-400">{g.grade}</td>
                      <td className="p-3 text-slate-300">{g.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Attendance */}
        {activeTab === "attendance" && (
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Live Virtual Classroom Log</h3>
            <div className="space-y-2 text-xs">
              {attendanceLog.map((log, i) => (
                <div key={i} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">{log.subject}</h4>
                    <span className="text-slate-400 text-[11px]">{log.date} at {log.time}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Invoices */}
        {activeTab === "invoices" && (
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Tuition & Fee Statements</h3>
            <div className="space-y-3 text-xs">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400">{inv.id}</span>
                    <h4 className="font-bold text-white text-sm">{inv.term}</h4>
                    <span className="text-slate-400 text-[11px]">{inv.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold text-white">{inv.amount}</span>
                    {inv.status === "paid" ? (
                      <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold text-xs">
                        Paid in Full
                      </span>
                    ) : (
                      <button
                        onClick={() => alert(`Processing simulated payment for ${inv.id}...`)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow"
                      >
                        Pay Invoice Online
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Messages */}
        {activeTab === "messages" && (
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Direct Message Academic Advisor</h3>
            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Recipient</label>
                <select className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white">
                  <option value="advisor">Ms. Rebecca Vance (Academic Advisor)</option>
                  <option value="physics">Dr. Sarah Jenkins (Physics Instructor)</option>
                  <option value="math">Prof. Mark Thompson (Math Instructor)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Your Message or Inquiry</label>
                <textarea
                  rows={4}
                  required
                  value={parentMessage}
                  onChange={(e) => setParentMessage(e.target.value)}
                  placeholder="Inquire about Aiden's progress, exam readiness, or schedule adjustments..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send Message
              </button>

              {messageSent && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs">
                  Your message has been sent. The advisor will respond to your registered email.
                </div>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}


