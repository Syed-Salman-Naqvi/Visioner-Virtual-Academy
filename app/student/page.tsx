// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   GraduationCap,
//   LogOut,
//   BarChart3,
//   FileText,
//   Award,
//   CalendarDays,
//   CheckCircle2,
//   Clock,
//   Send,
//   Sparkles,
//   ChevronRight,
//   BookOpen,
//   Paperclip,
//   Check,
// } from "lucide-react";
// import { getStudentPortalRecords, PortalRecords, AcademicResult } from "@/lib/portalData";
// import { getStudentAssignments, saveStudentAssignments } from "@/lib/storage";
// import { Assignment, StudentAccount } from "@/lib/types";

// type Tab = "overview" | "assignments" | "grades" | "timetable" | "attendance";

// const defaultMockAssignments: Assignment[] = [
//   {
//     id: "asg-1",
//     title: "Pure Mathematics II - Calculus Problem Set 4",
//     course: "Mathematics (9709)",
//     courseCode: "9709",
//     dueDate: "2026-10-05",
//     status: "pending",
//     instructions: "Solve questions 1 through 12 on integration by parts and differential equations from Chapter 5.",
//     score: "100 pts",
//     urgency: "high",
//   },
//   {
//     id: "asg-2",
//     title: "Physics Lab Report - Oscillations & Simple Harmonic Motion",
//     course: "Physics (9702)",
//     courseCode: "9702",
//     dueDate: "2026-10-08",
//     status: "pending",
//     instructions: "Submit a complete 3-page lab report including uncertainty calculations, pendulum diagrams, and conclusion.",
//     score: "50 pts",
//     urgency: "normal",
//   },
//   {
//     id: "asg-3",
//     title: "Computer Science - Recursion & Binary Search Trees Essay",
//     course: "Computer Science (9618)",
//     courseCode: "9618",
//     dueDate: "2026-09-25",
//     status: "graded",
//     instructions: "Compare time complexities of BST operations vs linear arrays with Python code snippets.",
//     score: "94 / 100",
//     feedback: "Excellent analysis on tree balance factors and memory allocation!",
//     urgency: "normal",
//   },
// ];

// export default function StudentPortalPage() {
//   const [tab, setTab] = useState<Tab>("overview");
//   const [student, setStudent] = useState<StudentAccount | null>(null);
//   const [records, setRecords] = useState<PortalRecords | null>(null);
//   const [assignments, setAssignments] = useState<Assignment[]>([]);

//   const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);
//   const [submissionText, setSubmissionText] = useState("");
//   const [attachedFile, setAttachedFile] = useState<File | null>(null);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   useEffect(() => {
//     async function initStudentData() {
//       let activeStudent: StudentAccount | null = null;
//       if (typeof window !== "undefined") {
//         try {
//           const session = sessionStorage.getItem("vva_student_session");
//           if (session) activeStudent = JSON.parse(session);
//         } catch (e) {
//           console.error("Session parse error:", e);
//         }
//       }

//       if (!activeStudent) {
//         activeStudent = {
//           studentId: "VVA-STU-8842",
//           studentName: "Aiden Vance",
//           studentEmail: "aiden.vance@example.com",
//           password: "",
//           applicationId: "VVA-STU-8842",
//         };
//       }

//       setStudent(activeStudent);

//       const targetId = activeStudent.studentId || activeStudent.applicationId;
//       const recs = await getStudentPortalRecords(targetId);
//       setRecords(recs);

//       const asgs = await getStudentAssignments(targetId, defaultMockAssignments);
//       setAssignments(asgs);
//       if (asgs.length > 0) setSelectedAsg(asgs[0]);
//     }

//     initStudentData();

//     const handleStorageChange = () => initStudentData();
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleTurnInAssignment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedAsg || !student) return;

//     const updated = assignments.map((a) => {
//       if (a.id === selectedAsg.id) {
//         return {
//           ...a,
//           status: "submitted" as const,
//           submittedAt: new Date().toISOString(),
//           submissionNotes: submissionText,
//           attachedFileName: attachedFile ? attachedFile.name : undefined,
//         };
//       }
//       return a;
//     });

//     setAssignments(updated);
//     const targetId = student.studentId || student.applicationId;
//     await saveStudentAssignments(targetId, updated);

//     setSubmitSuccess(true);
//     setSubmissionText("");
//     setAttachedFile(null);
//     setTimeout(() => setSubmitSuccess(false), 4000);
//   };

//   const calculateAveragePerformance = (resultsList: AcademicResult[]) => {
//     if (!resultsList || resultsList.length === 0) return "0%";
//     let total = 0;
//     let count = 0;
//     resultsList.forEach((r) => {
//       const num = parseInt(r.score.replace(/[^0-9]/g, ""), 10);
//       if (!isNaN(num)) {
//         total += num;
//         count++;
//       }
//     });
//     if (count === 0) return "0%";
//     return `${Math.round(total / count)}%`;
//   };

//   const calculateAttendancePercentage = () => {
//     if (!records || !records.attendance || records.attendance.length === 0) return "100%";
//     const presentCount = records.attendance.filter((a) => a.status === "Present").length;
//     return `${Math.round((presentCount / records.attendance.length) * 100)}%`;
//   };

//   const pendingCount = assignments.filter((a) => a.status === "pending").length;
//   const displayResults = records?.results || [];

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
//       <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-8 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-3">
//             <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
//               <GraduationCap className="h-5 w-5 text-white" />
//             </span>
//             <span>
//               <strong className="block text-sm text-white font-bold">Visioner Virtual Academy</strong>
//               <small className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
//                 Student Portal
//               </small>
//             </span>
//           </Link>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
//               <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center font-bold text-indigo-300 uppercase">
//                 {student?.studentName?.[0] || "S"}
//               </div>
//               <div className="hidden sm:block text-left">
//                 <strong className="block text-white font-bold leading-tight">{student?.studentName || "Student"}</strong>
//                 <span className="text-[10px] text-slate-400 font-mono">ID: {student?.studentId || "VVA-STU"}</span>
//               </div>
//             </div>

//             <Link
//               href="/login"
//               className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
//             >
//               <LogOut className="h-3.5 w-3.5" /> Sign Out
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
//         <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
//           <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
//                 <Sparkles className="w-3.5 h-3.5 text-amber-400" />
//                 Live Cloud Synced • Student Academic Hub
//               </div>
//               <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
//                 Welcome back, {student?.studentName || "Student"} 👋
//               </h1>
//               <p className="text-xs sm:text-sm text-slate-300 mt-1">
//                 Your portal synchronized live with the teacher office. View grades, turn in homework assignments, and keep track of your schedule.
//               </p>
//             </div>
//           </div>
//         </div>

//         <nav className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
//           {[
//             { key: "overview", label: "Dashboard Overview", icon: BarChart3 },
//             { key: "assignments", label: "Assignments & Homework", icon: FileText, badge: pendingCount },
//             { key: "grades", label: "Grades & Results", icon: Award },
//             { key: "timetable", label: "Class Timetable", icon: CalendarDays },
//             { key: "attendance", label: "Attendance Record", icon: CheckCircle2 },
//           ].map((item) => {
//             const Icon = item.icon;
//             const active = tab === item.key;
//             return (
//               <button
//                 key={item.key}
//                 onClick={() => setTab(item.key as Tab)}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
//                   active
//                     ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
//                     : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800"
//                 }`}
//               >
//                 <Icon className="w-4 h-4" />
//                 <span>{item.label}</span>
//                 {item.badge !== undefined && item.badge > 0 && (
//                   <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-extrabold">
//                     {item.badge}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         {/* DASHBOARD OVERVIEW TAB */}
//         {tab === "overview" && (
//           <div className="space-y-8">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs font-semibold text-slate-400">Average Performance</span>
//                   <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
//                     <Award className="w-4 h-4" />
//                   </div>
//                 </div>
//                 <p className="text-2xl font-black text-white mt-3">{calculateAveragePerformance(displayResults)}</p>
//                 <p className="text-[11px] text-emerald-400 font-semibold mt-1">✓ Grade A Standard</p>
//               </div>

//               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs font-semibold text-slate-400">Pending Homework</span>
//                   <div className="w-8 h-8 rounded-xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400">
//                     <FileText className="w-4 h-4" />
//                   </div>
//                 </div>
//                 <p className="text-2xl font-black text-white mt-3">{pendingCount}</p>
//                 <p className="text-[11px] text-amber-400 font-semibold mt-1">
//                   {pendingCount > 0 ? "Requires student submission" : "All caught up!"}
//                 </p>
//               </div>

//               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs font-semibold text-slate-400">Class Attendance</span>
//                   <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
//                     <CheckCircle2 className="w-4 h-4" />
//                   </div>
//                 </div>
//                 <p className="text-2xl font-black text-white mt-3">{calculateAttendancePercentage()}</p>
//                 <p className="text-[11px] text-emerald-400 font-semibold mt-1">Excellent attendance record</p>
//               </div>

//               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs font-semibold text-slate-400">Active Subjects</span>
//                   <div className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400">
//                     <BookOpen className="w-4 h-4" />
//                   </div>
//                 </div>
//                 <p className="text-2xl font-black text-white mt-3">{displayResults.length} Courses</p>
//                 <p className="text-[11px] text-blue-400 font-semibold mt-1">Cambridge AS / A-Level Track</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Recent Subject Results (Dynamic) */}
//               <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
//                 <div className="flex items-center justify-between border-b border-slate-800 pb-3">
//                   <h3 className="text-sm font-bold text-white flex items-center gap-2">
//                     <Award className="w-4 h-4 text-indigo-400" /> Recent Subject Results
//                   </h3>
//                   <button onClick={() => setTab("grades")} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
//                     View All <ChevronRight className="w-3 h-3" />
//                   </button>
//                 </div>

//                 <div className="space-y-3">
//                   {displayResults.map((item) => (
//                     <div key={item.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
//                       <div>
//                         <strong className="block text-sm font-bold text-white">{item.course}</strong>
//                         <p className="text-xs text-slate-400 mt-0.5">Code: {item.code} • {item.feedback}</p>
//                       </div>
//                       <div className="text-right shrink-0">
//                         <strong className="block text-sm font-extrabold text-emerald-400">{item.score}</strong>
//                         <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
//                           GRADE {item.grade}
//                         </span>
//                       </div>
//                     </div>
//                   ))}

//                   {displayResults.length === 0 && (
//                     <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-950 rounded-2xl border border-slate-800">
//                       No grades published by teacher yet.
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Pending Assignments (Dynamic) */}
//               <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
//                 <div className="flex items-center justify-between border-b border-slate-800 pb-3">
//                   <h3 className="text-sm font-bold text-white flex items-center gap-2">
//                     <FileText className="w-4 h-4 text-amber-400" /> Pending Assignments
//                   </h3>
//                   <button onClick={() => setTab("assignments")} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
//                     Assignment Hub <ChevronRight className="w-3 h-3" />
//                   </button>
//                 </div>

//                 <div className="space-y-3">
//                   {assignments.map((asg) => (
//                     <div key={asg.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
//                       <div className="flex items-start justify-between gap-3">
//                         <div>
//                           <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{asg.course}</span>
//                           <strong className="block text-xs font-bold text-white mt-0.5">{asg.title}</strong>
//                         </div>
//                         <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${asg.status === "graded" ? "bg-emerald-950 text-emerald-300" : asg.status === "submitted" ? "bg-blue-950 text-blue-300" : "bg-amber-950 text-amber-300"}`}>
//                           {asg.status.toUpperCase()}
//                         </span>
//                       </div>
//                       <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
//                         <Clock className="w-3 h-3 text-amber-400" /> Due: {asg.dueDate}
//                       </p>
//                     </div>
//                   ))}

//                   {assignments.length === 0 && (
//                     <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-950 rounded-2xl border border-slate-800">
//                       No assignments found for your account.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ASSIGNMENTS & HOMEWORK TAB */}
//         {tab === "assignments" && (
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//             <div className="lg:col-span-5 space-y-3">
//               <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
//                 Assigned Homework ({assignments.length})
//               </h3>

//               <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
//                 {assignments.map((asg) => {
//                   const isSelected = selectedAsg?.id === asg.id;
//                   return (
//                     <div
//                       key={asg.id}
//                       onClick={() => setSelectedAsg(asg)}
//                       className={`p-4 rounded-2xl border cursor-pointer transition-all ${
//                         isSelected
//                           ? "bg-indigo-950/40 border-indigo-500 text-white shadow-xl"
//                           : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{asg.course}</span>
//                         <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${asg.status === "graded" ? "bg-emerald-950 text-emerald-300" : asg.status === "submitted" ? "bg-blue-950 text-blue-300" : "bg-amber-950 text-amber-300"}`}>
//                           {asg.status.toUpperCase()}
//                         </span>
//                       </div>
//                       <strong className="block text-xs font-bold text-white mt-1">{asg.title}</strong>
//                       <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
//                         <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> Due {asg.dueDate}</span>
//                         <span>{asg.score}</span>
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {assignments.length === 0 && (
//                   <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
//                     No homework assigned yet.
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="lg:col-span-7">
//               {selectedAsg ? (
//                 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
//                   <div className="border-b border-slate-800 pb-4">
//                     <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{selectedAsg.course}</span>
//                     <h2 className="text-xl font-extrabold text-white mt-1">{selectedAsg.title}</h2>
//                     <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
//                       <Clock className="w-3.5 h-3.5 text-amber-400" /> Target Deadline: {selectedAsg.dueDate} • <span className="text-indigo-300 font-semibold">{selectedAsg.score}</span>
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Teacher Instructions</h4>
//                     <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
//                       {selectedAsg.instructions}
//                     </div>
//                   </div>

//                   {selectedAsg.feedback && (
//                     <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
//                       <strong className="text-xs font-bold text-emerald-400 block">Teacher Review & Feedback:</strong>
//                       <p className="text-xs text-emerald-200">{selectedAsg.feedback}</p>
//                     </div>
//                   )}

//                   {selectedAsg.status === "submitted" ? (
//                     <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2 text-xs">
//                       <strong className="text-blue-300 font-bold flex items-center gap-2">
//                         <Check className="w-4 h-4 text-emerald-400" /> Homework Turned In Successfully!
//                       </strong>
//                       <p className="text-slate-300">Submitted on: {new Date(selectedAsg.submittedAt || "").toLocaleString()}</p>
//                       {selectedAsg.submissionNotes && <p className="text-slate-400 italic">"{selectedAsg.submissionNotes}"</p>}
//                     </div>
//                   ) : selectedAsg.status === "pending" ? (
//                     <form onSubmit={handleTurnInAssignment} className="space-y-4 pt-2">
//                       <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
//                         <Send className="w-3.5 h-3.5 text-indigo-400" /> Submit Student Homework
//                       </h4>

//                       <div>
//                         <label className="block text-xs text-slate-400 mb-1">Written Answer / Explanation</label>
//                         <textarea
//                           rows={4}
//                           value={submissionText}
//                           onChange={(e) => setSubmissionText(e.target.value)}
//                           placeholder="Type your response, links to documents, or solution explanation here..."
//                           className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs text-slate-400 mb-1">Attach Work File (PDF, DOCX, ZIP)</label>
//                         <input
//                           type="file"
//                           id="file-upload"
//                           className="hidden"
//                           onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
//                         />
//                         <label
//                           htmlFor="file-upload"
//                           className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
//                         >
//                           <Paperclip className="w-4 h-4 text-indigo-400" />
//                           {attachedFile ? attachedFile.name : "Choose Document..."}
//                         </label>
//                       </div>

//                       {submitSuccess && (
//                         <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
//                           <Check className="w-4 h-4" /> Homework submitted to teacher!
//                         </p>
//                       )}

//                       <button
//                         type="submit"
//                         className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-colors flex items-center justify-center gap-2"
//                       >
//                         <Send className="w-4 h-4" /> Turn In Assignment
//                       </button>
//                     </form>
//                   ) : null}
//                 </div>
//               ) : (
//                 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-400">
//                   Select an assignment from the list.
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* GRADES & RESULTS TAB */}
//         {tab === "grades" && (
//           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
//             <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-bold text-white">Academic Results & Grades</h3>
//                 <p className="text-xs text-slate-400 mt-0.5">Official course evaluation marks updated by the academy administration.</p>
//               </div>
//               <div className="bg-indigo-950 border border-indigo-500/30 px-4 py-2 rounded-2xl text-right">
//                 <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">Average Score</span>
//                 <strong className="text-lg font-black text-emerald-400">{calculateAveragePerformance(displayResults)}</strong>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {displayResults.map((item) => (
//                 <div key={item.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
//                   <div className="space-y-1">
//                     <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
//                       {item.code}
//                     </span>
//                     <strong className="block text-base font-bold text-white mt-1">{item.course}</strong>
//                     <p className="text-xs text-slate-400">{item.feedback}</p>
//                   </div>

//                   <div className="text-right shrink-0">
//                     <span className="text-xs text-slate-400 block font-semibold mb-0.5">Achieved Score</span>
//                     <strong className="text-xl font-black text-emerald-400">{item.score}</strong>
//                     <span className="ml-2 text-xs font-black px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
//                       {item.grade}
//                     </span>
//                   </div>
//                 </div>
//               ))}

//               {displayResults.length === 0 && (
//                 <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-950 rounded-2xl border border-slate-800">
//                   No academic grades logged yet.
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* TIMETABLE TAB */}
//         {tab === "timetable" && (
//           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
//             <div className="border-b border-slate-800 pb-4">
//               <h3 className="text-lg font-bold text-white">Class Schedule & Timetable</h3>
//               <p className="text-xs text-slate-400 mt-0.5">Live class schedule and instructor details.</p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {records?.schedule.map((item) => (
//                 <div key={item.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
//                   <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 bg-amber-950 rounded border border-amber-800/40">
//                     {item.day} • {item.time}
//                   </span>
//                   <strong className="block text-sm font-bold text-white mt-2">{item.course}</strong>
//                   <p className="text-xs text-slate-400">Topic: {item.topic}</p>
//                   <p className="text-xs text-indigo-400 font-semibold pt-1">Instructor: {item.teacher}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ATTENDANCE TAB */}
//         {tab === "attendance" && (
//           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
//             <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-bold text-white">Attendance Log</h3>
//                 <p className="text-xs text-slate-400 mt-0.5">Record of class presence and punctuality.</p>
//               </div>
//               <div className="bg-emerald-950 border border-emerald-500/30 px-4 py-2 rounded-2xl text-right">
//                 <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">Attendance Score</span>
//                 <strong className="text-lg font-black text-emerald-300">{calculateAttendancePercentage()}</strong>
//               </div>
//             </div>

//             <div className="space-y-3">
//               {records?.attendance.map((item) => (
//                 <div key={item.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
//                   <div>
//                     <strong className="block text-sm font-bold text-white">{item.course}</strong>
//                     <span className="text-xs text-slate-400">{item.date}</span>
//                   </div>
//                   <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.status === "Present" ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40" : "bg-amber-950 text-amber-300 border border-amber-800/40"}`}>
//                     {item.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStudentPortalData } from '@/lib/portalData';

export default function StudentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [portalData, setPortalData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'grades' | 'timetable' | 'attendance'>('overview');

  useEffect(() => {
    async function loadStudentSession() {
      const sessionRaw =
        localStorage.getItem('vva_user') ||
        localStorage.getItem('vva_current_user') ||
        localStorage.getItem('vva_session');

      if (!sessionRaw) {
        router.push('/login');
        return;
      }

      try {
        const user = JSON.parse(sessionRaw);
        setCurrentUser(user);

        const studentId = user.studentId || user.id || user.generatedStudentId;
        const data = await getStudentPortalData(studentId, user);

        // Ensure session user credentials always strictly override any mock names
        if (data && data.studentInfo) {
          data.studentInfo.name = user.name || user.studentName || data.studentInfo.name;
          data.studentInfo.id = studentId || data.studentInfo.id;
        }

        setPortalData(data);
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStudentSession();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('vva_user');
    localStorage.removeItem('vva_current_user');
    localStorage.removeItem('vva_session');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060813] text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400 font-medium">Syncing Student Portal...</p>
        </div>
      </div>
    );
  }

  const studentName = currentUser?.name || currentUser?.studentName || portalData?.studentInfo?.name || 'Enrolled Student';
  const displayId = currentUser?.studentId || currentUser?.id || currentUser?.generatedStudentId || portalData?.studentInfo?.id || 'VVA-STU';
  const programName = currentUser?.program || portalData?.studentInfo?.program || 'Sindh Board (Grade 11)';
  const avatarLetter = studentName ? studentName.charAt(0).toUpperCase() : 'S';

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0b0f24]/90 backdrop-blur-md px-6 py-3.5 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black shadow-indigo-500/20 shadow-lg text-lg">
            V
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Visioner Virtual Academy</h1>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">STUDENT PORTAL</p>
          </div>
        </div>

        {/* User Identity Badge & Actions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
              {avatarLetter}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-100 leading-none">{studentName}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {displayId}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-slate-800 transition-all flex items-center space-x-1.5"
          >
            <span>Sign Out</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/50 via-slate-900/80 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-8 mb-8 shadow-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2"></span>
              Live Cloud Synced • Student Academic Hub
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {studentName} 👋
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Your portal synchronized live with the teacher office. View grades, turn in homework assignments, and keep track of your schedule.
            </p>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-2 border-b border-slate-800/80 mb-8 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'assignments'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <span>Assignments & Homework</span>
            <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-amber-500/30">
              {portalData?.pendingAssignments?.length || 2}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('grades')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'grades'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Grades & Results
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'timetable'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Class Timetable
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Attendance Record
          </button>
        </div>

        {/* TAB CONTENT: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Stat 1 */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium text-slate-400">Average Performance</p>
                  <span className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-3">
                  {portalData?.stats?.averagePerformance || '88%'}
                </h3>
                <p className="text-xs font-medium text-emerald-400 mt-2 flex items-center">
                  <span className="mr-1">✓</span> Grade A Standard
                </p>
              </div>

              {/* Stat 2 */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium text-slate-400">Pending Homework</p>
                  <span className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-3">
                  {portalData?.pendingAssignments?.length || 2}
                </h3>
                <p className="text-xs font-medium text-amber-400 mt-2">Requires student submission</p>
              </div>

              {/* Stat 3 */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium text-slate-400">Class Attendance</p>
                  <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-3">
                  {portalData?.stats?.classAttendance || '100%'}
                </h3>
                <p className="text-xs font-medium text-emerald-400 mt-2">Excellent attendance record</p>
              </div>

              {/* Stat 4 */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium text-slate-400">Active Subjects</p>
                  <span className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-3">3 Courses</h3>
                <p className="text-xs font-medium text-slate-400 mt-2 truncate">{programName}</p>
              </div>
            </div>

            {/* Bottom 2-Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Column 1: Recent Subject Results */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-indigo-500/10 rounded-md text-indigo-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </span>
                    <h3 className="text-sm font-bold text-white">Recent Subject Results</h3>
                  </div>
                  <button onClick={() => setActiveTab('grades')} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {portalData?.recentResults?.map((res: any, idx: number) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex justify-between items-center hover:border-slate-700 transition-all">
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{res.subject}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 font-mono">{res.code}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-white block">{res.grade}</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 inline-block mt-1">
                          {res.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Pending Assignments */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-amber-500/10 rounded-md text-amber-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </span>
                    <h3 className="text-sm font-bold text-white">Pending Assignments</h3>
                  </div>
                  <button onClick={() => setActiveTab('assignments')} className="text-xs text-amber-400 hover:text-amber-300 font-medium">
                    Assignment Hub &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {portalData?.pendingAssignments?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex justify-between items-center hover:border-slate-700 transition-all">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase block">
                          {item.subjectCode}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100 mt-1">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Due: {item.dueDate}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Assignments */}
        {activeTab === 'assignments' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Assignments & Homework</h3>
            <div className="space-y-4">
              {portalData?.pendingAssignments?.map((item: any, idx: number) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-400">{item.subjectCode}</span>
                    <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">Submission Deadline: {item.dueDate}</p>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all self-start md:self-auto">
                    Submit Solution
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: Grades */}
        {activeTab === 'grades' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Academic Grades & Performance</h3>
            <div className="space-y-3">
              {portalData?.recentResults?.map((res: any, idx: number) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-white">{res.subject}</h4>
                    <p className="text-xs text-slate-400 mt-1">{res.code}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-white block">{res.grade}</span>
                    <span className="text-xs font-bold text-emerald-400">{res.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: Timetable */}
        {activeTab === 'timetable' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Weekly Class Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Day</th>
                    <th className="p-3">Time Slot</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Instructor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {portalData?.timetable?.map((slot: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white">{slot.day}</td>
                      <td className="p-3 text-indigo-400 font-mono">{slot.time}</td>
                      <td className="p-3 font-semibold">{slot.subject}</td>
                      <td className="p-3 text-slate-400">{slot.teacher}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Attendance */}
        {activeTab === 'attendance' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Attendance Record</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {portalData?.attendance?.map((att: any, idx: number) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-white">{att.subject}</h4>
                  <div className="mt-3 flex justify-between items-end">
                    <div>
                      <p className="text-[11px] text-slate-400">Classes Attended</p>
                      <p className="text-sm font-bold text-slate-200">{att.attended} / {att.totalClasses}</p>
                    </div>
                    <span className="text-base font-extrabold text-emerald-400">{att.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}