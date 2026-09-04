// "use client";
// import React, { useState, useSyncExternalStore } from "react";
// import Link from "next/link";
// import { BarChart3, CalendarDays, CheckCircle2, GraduationCap, LogIn, LogOut, Save } from "lucide-react";
// import { getSavedApplications, getStudentAccounts, saveApplication, saveStudentAccount } from "@/lib/storage";
// import { AdmissionsApplication, StudentAccount } from "@/lib/types";
// import { AcademicResult, AttendanceRecord, PortalRecords, ScheduleRecord, getPortalRecords, getStudentPortalRecords, migrateStudentPortalRecords, savePortalRecords, saveStudentPortalRecords } from "@/lib/portalData";

// type Tab = "overview" | "applications" | "records";
// const OWNER_SESSION_KEY = "vva_owner_authenticated";
// const OWNER_AUTH_EVENT = "vva_owner_auth_changed";
// const getOwnerAuthSnapshot = () => typeof window !== "undefined" && window.sessionStorage.getItem(OWNER_SESSION_KEY) === "true";
// const subscribeToOwnerAuth = (onChange: () => void) => { window.addEventListener(OWNER_AUTH_EVENT, onChange); window.addEventListener("storage", onChange); return () => { window.removeEventListener(OWNER_AUTH_EVENT, onChange); window.removeEventListener("storage", onChange); }; };
// const emptyResult: AcademicResult = { id: "", code: "", course: "", score: "", grade: "", feedback: "" };
// const emptyAttendance: AttendanceRecord = { id: "", date: "", course: "", status: "Present" };
// const emptySchedule: ScheduleRecord = { id: "", day: "Monday", time: "", course: "", topic: "", teacher: "" };

// export default function OwnerDashboardPage() {
//   const authenticated = useSyncExternalStore(subscribeToOwnerAuth, getOwnerAuthSnapshot, () => false);
//   const [ownerId, setOwnerId] = useState("");
//   const [ownerPassword, setOwnerPassword] = useState("");
//   const [loginError, setLoginError] = useState("");
//   const [tab, setTab] = useState<Tab>("overview");
//   const [applications, setApplications] = useState<AdmissionsApplication[]>(() => getSavedApplications());
//   const [selectedApplication, setSelectedApplication] = useState<AdmissionsApplication | null>(null);
//   const [studentAccounts, setStudentAccounts] = useState<StudentAccount[]>(() => getStudentAccounts());
//   const [records, setRecords] = useState<PortalRecords>(() => getPortalRecords());
//   const [result, setResult] = useState<AcademicResult>(emptyResult);
//   const [attendance, setAttendance] = useState<AttendanceRecord>(emptyAttendance);
//   const [schedule, setSchedule] = useState<ScheduleRecord>(emptySchedule);
//   const [message, setMessage] = useState("");
//   const selectedAccount = selectedApplication ? studentAccounts.find((account) => account.applicationId === selectedApplication.id) : undefined;
//   const selectedRecordKey = selectedApplication ? (selectedAccount?.studentId || `application:${selectedApplication.id}`) : "";
//   const updateRecords = (next: PortalRecords) => { setRecords(next); if (selectedRecordKey) saveStudentPortalRecords(selectedRecordKey, next); else savePortalRecords(next); setMessage("Saved and visible in the student portal."); window.setTimeout(() => setMessage(""), 2500); };
//   const updateStatus = (status: AdmissionsApplication["status"]) => { if (!selectedApplication) return; const next = { ...selectedApplication, status }; saveApplication(next); setApplications((items) => items.map((item) => item.id === next.id ? next : item)); setSelectedApplication(next); };
//   const selectApplication = (application: AdmissionsApplication) => { setSelectedApplication(application); const account = studentAccounts.find((item) => item.applicationId === application.id); setRecords(account ? getStudentPortalRecords(account.studentId) : { results: [], attendance: [], schedule: [] }); setResult(emptyResult); setAttendance(emptyAttendance); setSchedule(emptySchedule); };
//   const openStudentRecords = (application: AdmissionsApplication) => { selectApplication(application); setTab("records"); };
//   const generateStudentAccount = () => {
//     if (!selectedApplication) return;
//     const account: StudentAccount = {
//       applicationId: selectedApplication.id,
//       studentId: `VVA-${selectedApplication.id.replace(/[^A-Z0-9]/gi, "").slice(-6).toUpperCase()}`,
//       password: `VVA${Math.floor(100000 + Math.random() * 900000)}`,
//       studentName: selectedApplication.studentName,
//       studentEmail: selectedApplication.studentEmail,
//       createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
//     };
//     saveStudentAccount(account);
//     migrateStudentPortalRecords(`application:${selectedApplication.id}`, account.studentId);
//     setStudentAccounts((items) => [account, ...items.filter((item) => item.applicationId !== account.applicationId)]);
//     setRecords(getStudentPortalRecords(account.studentId));
//     setTab("records");
//   };
//   const editResult = (item: AcademicResult) => setResult(item);
//   const saveResult = (event: React.FormEvent) => { event.preventDefault(); if (!result.course || !result.score) return; const item = { ...result, id: result.id || `result-${Date.now()}` }; updateRecords({ ...records, results: records.results.some((old) => old.id === item.id) ? records.results.map((old) => old.id === item.id ? item : old) : [...records.results, item] }); setResult(emptyResult); };
//   const editAttendance = (item: AttendanceRecord) => setAttendance(item);
//   const saveAttendance = (event: React.FormEvent) => { event.preventDefault(); if (!attendance.course || !attendance.date) return; const item = { ...attendance, id: attendance.id || `attendance-${Date.now()}` }; updateRecords({ ...records, attendance: records.attendance.some((old) => old.id === item.id) ? records.attendance.map((old) => old.id === item.id ? item : old) : [...records.attendance, item] }); setAttendance(emptyAttendance); };
//   const editSchedule = (item: ScheduleRecord) => setSchedule(item);
//   const saveSchedule = (event: React.FormEvent) => { event.preventDefault(); if (!schedule.course || !schedule.time) return; const item = { ...schedule, id: schedule.id || `schedule-${Date.now()}` }; updateRecords({ ...records, schedule: records.schedule.some((old) => old.id === item.id) ? records.schedule.map((old) => old.id === item.id ? item : old) : [...records.schedule, item] }); setSchedule(emptySchedule); };
//   const field = (label: string, value: string, onChange: (value: string) => void) => <label className="block text-xs text-slate-400">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white" /></label>;

//   const handleOwnerLogin = (event: React.FormEvent) => {
//     event.preventDefault();
//     if (ownerId === "Muhammad-Salman" && ownerPassword === "123123") {
//       window.sessionStorage.setItem(OWNER_SESSION_KEY, "true");
//       setLoginError("");
//       window.dispatchEvent(new Event(OWNER_AUTH_EVENT));
//       return;
//     }
//     setLoginError("The ID or password is incorrect.");
//   };

//   const signOut = () => {
//     window.sessionStorage.removeItem(OWNER_SESSION_KEY);
//     window.dispatchEvent(new Event(OWNER_AUTH_EVENT));
//     setOwnerId("");
//     setOwnerPassword("");
//   };

//   if (!authenticated) {
//     return <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100"><div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"><Link href="/" className="mx-auto flex w-fit items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600"><GraduationCap className="h-5 w-5" /></span><span><strong className="block text-sm text-white">Visioner Academy</strong><small className="text-[10px] uppercase text-indigo-400">Teacher / Owner</small></span></Link><div className="mt-8 text-center"><h1 className="text-xl font-bold text-white">Owner dashboard sign in</h1><p className="mt-2 text-xs text-slate-400">Enter your authorized academy ID and password.</p></div><form onSubmit={handleOwnerLogin} className="mt-6 space-y-4"><label className="block text-xs font-semibold text-slate-300">Owner ID<input required value={ownerId} onChange={(event) => setOwnerId(event.target.value)} autoComplete="username" className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none" placeholder="Enter owner ID" /></label><label className="block text-xs font-semibold text-slate-300">Password<input required type="password" value={ownerPassword} onChange={(event) => setOwnerPassword(event.target.value)} autoComplete="current-password" className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none" placeholder="Enter password" /></label>{loginError && <p role="alert" className="text-xs text-rose-400">{loginError}</p>}<button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500"><LogIn className="h-4 w-4" />Sign in to dashboard</button></form><Link href="/login" className="mt-5 block text-center text-xs text-indigo-400 hover:text-indigo-300">Back to portal login</Link></div></div>;
//   }

//   return <div className="min-h-screen bg-slate-950 text-slate-100"><header className="border-b border-slate-800 bg-slate-900 px-4 py-4 sm:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600"><GraduationCap className="h-5 w-5" /></span><span><strong className="block text-sm text-white">Visioner Academy</strong><small className="text-[10px] uppercase text-indigo-400">Teacher / Owner</small></span></Link><button onClick={signOut} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white"><LogOut className="h-4 w-4" />Sign out</button></div></header><main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8"><div><p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Academy operations</p><h1 className="mt-2 text-2xl font-bold text-white">Teacher control center</h1><p className="mt-1 text-sm text-slate-400">Update student results, attendance, and timetable from one place.</p></div><nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">{[{ key: "overview", label: "Overview" }, { key: "applications", label: "Applications" }, { key: "records", label: "Academic records" }].map((item) => <button key={item.key} onClick={() => setTab(item.key as Tab)} className={`rounded-lg px-4 py-2 text-xs font-semibold ${tab === item.key ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"}`}>{item.label}</button>)}</nav>
//     {message && <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-300">{message}</div>}
//     {tab === "overview" && <div className="grid gap-4 sm:grid-cols-3"><button onClick={() => setTab("records")} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left"><BarChart3 className="h-5 w-5 text-indigo-400" /><strong className="mt-3 block text-2xl text-white">{records.results.length}</strong><span className="text-xs text-slate-400">Published results</span></button><button onClick={() => setTab("records")} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left"><CheckCircle2 className="h-5 w-5 text-emerald-400" /><strong className="mt-3 block text-2xl text-white">{records.attendance.length}</strong><span className="text-xs text-slate-400">Attendance records</span></button><button onClick={() => setTab("records")} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left"><CalendarDays className="h-5 w-5 text-amber-400" /><strong className="mt-3 block text-2xl text-white">{records.schedule.length}</strong><span className="text-xs text-slate-400">Scheduled classes</span></button></div>}
//     {tab === "overview" && <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">Active student</p><h2 className="mt-1 text-base font-bold text-white">Aiden Vance</h2><p className="mt-1 text-xs text-slate-400">Student ID: VVA-STU-8842 • Cambridge AS-Level • Year 12</p></div><button onClick={() => setTab("records")} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500">Open student records</button></div></div>}
//     {tab === "applications" && <div className="grid gap-6 lg:grid-cols-[1fr_380px]"><div className="space-y-3">{applications.map((item) => <button key={item.id} onClick={() => selectApplication(item)} className={`w-full rounded-2xl border p-4 text-left ${selectedApplication?.id === item.id ? "border-indigo-500 bg-indigo-950/20" : "border-slate-800 bg-slate-900"}`}><div className="flex justify-between"><strong className="text-sm text-white">{item.studentName}</strong><span className="text-xs text-indigo-300">{item.status}</span></div><p className="mt-1 text-xs text-slate-400">{item.id} • {item.targetTrack}</p><span className="mt-3 inline-block rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white">Open student records</span></button>)}{applications.length === 0 && <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-xs text-slate-400">No applications have been submitted.</p>}</div><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">{selectedApplication ? <><h2 className="text-base font-bold text-white">{selectedApplication.studentName}</h2><p className="mt-1 text-xs text-slate-400">{selectedApplication.studentEmail}</p><label className="mt-6 block text-xs text-slate-300">Application status<select value={selectedApplication.status} onChange={(event) => updateStatus(event.target.value as AdmissionsApplication["status"])} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"><option>Under Review</option><option>Verified</option><option>Interview Scheduled</option><option>Accepted</option></select></label></> : <p className="text-xs text-slate-500">Select an application to review it.</p>}</div></div>}
//     {tab === "applications" && selectedApplication && <section className="rounded-2xl border border-indigo-500/30 bg-slate-900 p-5"><h2 className="text-base font-bold text-white">Complete application: {selectedApplication.studentName}</h2><div className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3"><p><span className="text-slate-500">Student email</span><strong className="mt-1 block break-all text-slate-200">{selectedApplication.studentEmail}</strong></p><p><span className="text-slate-500">Parent / guardian</span><strong className="mt-1 block text-slate-200">{selectedApplication.parentName}</strong></p><p><span className="text-slate-500">Parent email</span><strong className="mt-1 block break-all text-slate-200">{selectedApplication.parentEmail}</strong></p><p><span className="text-slate-500">Phone number</span><strong className="mt-1 block text-slate-200">{selectedApplication.parentPhone}</strong></p><p><span className="text-slate-500">Nationality</span><strong className="mt-1 block text-slate-200">{selectedApplication.nationality}</strong></p><p><span className="text-slate-500">Country / city</span><strong className="mt-1 block text-slate-200">{selectedApplication.countryOfResidence} • {selectedApplication.city}</strong></p><p><span className="text-slate-500">Date of birth</span><strong className="mt-1 block text-slate-200">{selectedApplication.dateOfBirth}</strong></p><p><span className="text-slate-500">Program / grade</span><strong className="mt-1 block text-slate-200">{selectedApplication.targetTrack} • {selectedApplication.gradeLevel}</strong></p><p><span className="text-slate-500">Timezone</span><strong className="mt-1 block text-slate-200">{selectedApplication.timeZone}</strong></p><p><span className="text-slate-500">Preferred cohort</span><strong className="mt-1 block text-slate-200">{selectedApplication.preferredCohortSlot}</strong></p><p className="lg:col-span-2"><span className="text-slate-500">Documents</span><strong className="mt-1 block text-slate-200">{selectedApplication.documentsAttached.length ? selectedApplication.documentsAttached.join(", ") : "No documents attached"}</strong></p></div><div className="mt-5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-indigo-200">Student portal access</p><button type="button" onClick={() => setTab("records")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white">Open student records</button></div>{selectedAccount ? <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2"><p><span className="text-slate-400">Student ID:</span> <strong className="text-white">{selectedAccount.studentId}</strong></p><p><span className="text-slate-400">Password:</span> <strong className="text-white">{selectedAccount.password}</strong></p><p className="text-[11px] text-slate-400 sm:col-span-2">Generated {selectedAccount.createdAt}. Provide these credentials to the student.</p></div> : <button onClick={generateStudentAccount} className="mt-3 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500">Generate student ID and password</button>}</div></section>}
//     {tab === "records" && <div className="space-y-8"><section><h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white"><BarChart3 className="h-4 w-4 text-indigo-400" />Results</h2><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><div className="space-y-2">{records.results.map((item) => <button key={item.id} onClick={() => editResult(item)} className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left"><span><strong className="block text-xs text-white">{item.course}</strong><small className="text-slate-400">{item.code} • {item.feedback}</small></span><span className="text-xs font-bold text-emerald-400">{item.score} ({item.grade})</span></button>)}</div><form onSubmit={saveResult} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4">{field("Course", result.course, (value) => setResult({ ...result, course: value }))}{field("Course code", result.code, (value) => setResult({ ...result, code: value }))}{field("Score", result.score, (value) => setResult({ ...result, score: value }))}{field("Grade", result.grade, (value) => setResult({ ...result, grade: value }))}{field("Feedback", result.feedback, (value) => setResult({ ...result, feedback: value }))}<button className="mt-2 flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white"><Save className="h-4 w-4" />Save result</button></form></div></section>
//     <section><h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Attendance</h2><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><div className="space-y-2">{records.attendance.map((item) => <button key={item.id} onClick={() => editAttendance(item)} className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left"><span><strong className="block text-xs text-white">{item.course}</strong><small className="text-slate-400">{item.date}</small></span><span className={`text-xs font-bold ${item.status === "Present" ? "text-emerald-400" : item.status === "Late" ? "text-amber-400" : "text-rose-400"}`}>{item.status}</span></button>)}</div><form onSubmit={saveAttendance} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4">{field("Course", attendance.course, (value) => setAttendance({ ...attendance, course: value }))}{field("Date", attendance.date, (value) => setAttendance({ ...attendance, date: value }))}<label className="block text-xs text-slate-400">Status<select value={attendance.status} onChange={(event) => setAttendance({ ...attendance, status: event.target.value as AttendanceRecord["status"] })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"><option>Present</option><option>Late</option><option>Absent</option></select></label><button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white"><Save className="h-4 w-4" />Save attendance</button></form></div></section>
//     <section><h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white"><CalendarDays className="h-4 w-4 text-amber-400" />Timetable</h2><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><div className="space-y-2">{records.schedule.map((item) => <button key={item.id} onClick={() => editSchedule(item)} className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left"><span><strong className="block text-xs text-white">{item.course}</strong><small className="text-slate-400">{item.day} • {item.time} • {item.topic}</small></span></button>)}</div><form onSubmit={saveSchedule} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4">{field("Course", schedule.course, (value) => setSchedule({ ...schedule, course: value }))}{field("Time", schedule.time, (value) => setSchedule({ ...schedule, time: value }))}{field("Topic", schedule.topic, (value) => setSchedule({ ...schedule, topic: value }))}{field("Teacher", schedule.teacher, (value) => setSchedule({ ...schedule, teacher: value }))}<label className="block text-xs text-slate-400">Day<select value={schedule.day} onChange={(event) => setSchedule({ ...schedule, day: event.target.value as ScheduleRecord["day"] })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white">{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => <option key={day}>{day}</option>)}</select></label><button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white"><Save className="h-4 w-4" />Save timetable</button></form></div></section></div>}
//   </main></div>;
// }








"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { BarChart3, CalendarDays, CheckCircle2, GraduationCap, LogIn, LogOut, Save } from "lucide-react";
import { getSavedApplications, getStudentAccounts, saveApplication, saveStudentAccount } from "@/lib/storage";
import { AdmissionsApplication, StudentAccount } from "@/lib/types";
import { AcademicResult, AttendanceRecord, PortalRecords, ScheduleRecord, getPortalRecords, getStudentPortalRecords, migrateStudentPortalRecords, savePortalRecords, saveStudentPortalRecords } from "@/lib/portalData";

type Tab = "overview" | "applications" | "records";
const OWNER_SESSION_KEY = "vva_owner_authenticated";
const OWNER_AUTH_EVENT = "vva_owner_auth_changed";
const getOwnerAuthSnapshot = () => typeof window !== "undefined" && window.sessionStorage.getItem(OWNER_SESSION_KEY) === "true";
const subscribeToOwnerAuth = (onChange: () => void) => {
  window.addEventListener(OWNER_AUTH_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(OWNER_AUTH_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};
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
  const [records, setRecords] = useState<PortalRecords>(() => getPortalRecords());
  const [result, setResult] = useState<AcademicResult>(emptyResult);
  const [attendance, setAttendance] = useState<AttendanceRecord>(emptyAttendance);
  const [schedule, setSchedule] = useState<ScheduleRecord>(emptySchedule);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const apps = await getSavedApplications();
      const accounts = await getStudentAccounts();
      setApplications(apps);
      setStudentAccounts(accounts);
    }
    loadData();
  }, [authenticated]);

  const selectedAccount = selectedApplication ? studentAccounts.find((account) => account.applicationId === selectedApplication.id) : undefined;
  const selectedRecordKey = selectedApplication ? (selectedAccount?.studentId || `application:${selectedApplication.id}`) : "";

  const updateRecords = (next: PortalRecords) => {
    setRecords(next);
    if (selectedRecordKey) saveStudentPortalRecords(selectedRecordKey, next);
    else savePortalRecords(next);
    setMessage("Saved and visible in the student portal.");
    window.setTimeout(() => setMessage(""), 2500);
  };

  const updateStatus = async (status: AdmissionsApplication["status"]) => {
    if (!selectedApplication) return;
    const next = { ...selectedApplication, status };
    await saveApplication(next);
    setApplications((items) => items.map((item) => item.id === next.id ? next : item));
    setSelectedApplication(next);
  };

  const selectApplication = (application: AdmissionsApplication) => {
    setSelectedApplication(application);
    const account = studentAccounts.find((item) => item.applicationId === application.id);
    setRecords(account ? getStudentPortalRecords(account.studentId) : { results: [], attendance: [], schedule: [] });
    setResult(emptyResult);
    setAttendance(emptyAttendance);
    setSchedule(emptySchedule);
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
    migrateStudentPortalRecords(`application:${selectedApplication.id}`, account.studentId);
    setStudentAccounts((items) => [account, ...items.filter((item) => item.applicationId !== account.applicationId && item.studentId !== account.studentId)]);
    setRecords(getStudentPortalRecords(account.studentId));
    setMessage(`Student ID & password generated! Credentials active: ${account.studentId} / ${account.password}`);
    window.setTimeout(() => setMessage(""), 4000);
    setTab("records");
  };

  const editResult = (item: AcademicResult) => setResult(item);
  const saveResult = (event: React.FormEvent) => {
    event.preventDefault();
    if (!result.course || !result.score) return;
    const item = { ...result, id: result.id || `result-${Date.now()}` };
    updateRecords({
      ...records,
      results: records.results.some((old) => old.id === item.id)
        ? records.results.map((old) => (old.id === item.id ? item : old))
        : [...records.results, item],
    });
    setResult(emptyResult);
  };

  const editAttendance = (item: AttendanceRecord) => setAttendance(item);
  const saveAttendance = (event: React.FormEvent) => {
    event.preventDefault();
    if (!attendance.course || !attendance.date) return;
    const item = { ...attendance, id: attendance.id || `attendance-${Date.now()}` };
    updateRecords({
      ...records,
      attendance: records.attendance.some((old) => old.id === item.id)
        ? records.attendance.map((old) => (old.id === item.id ? item : old))
        : [...records.attendance, item],
    });
    setAttendance(emptyAttendance);
  };

  const editSchedule = (item: ScheduleRecord) => setSchedule(item);
  const saveSchedule = (event: React.FormEvent) => {
    event.preventDefault();
    if (!schedule.course || !schedule.time) return;
    const item = { ...schedule, id: schedule.id || `schedule-${Date.now()}` };
    updateRecords({
      ...records,
      schedule: records.schedule.some((old) => old.id === item.id)
        ? records.schedule.map((old) => (old.id === item.id ? item : old))
        : [...records.schedule, item],
    });
    setSchedule(emptySchedule);
  };

  const field = (label: string, value: string, onChange: (value: string) => void) => (
    <label className="block text-xs text-slate-400">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
      />
    </label>
  );

  const handleOwnerLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (ownerId === "Muhammad-Salman" && ownerPassword === "123123") {
      window.sessionStorage.setItem(OWNER_SESSION_KEY, "true");
      setLoginError("");
      window.dispatchEvent(new Event(OWNER_AUTH_EVENT));
      return;
    }
    setLoginError("The ID or password is incorrect.");
  };

  const signOut = () => {
    window.sessionStorage.removeItem(OWNER_SESSION_KEY);
    window.dispatchEvent(new Event(OWNER_AUTH_EVENT));
    setOwnerId("");
    setOwnerPassword("");
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <Link href="/" className="mx-auto flex w-fit items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-sm text-white">Visioner Academy</strong>
              <small className="text-[10px] uppercase text-indigo-400">Teacher / Owner</small>
            </span>
          </Link>
          <div className="mt-8 text-center">
            <h1 className="text-xl font-bold text-white">Owner dashboard sign in</h1>
            <p className="mt-2 text-xs text-slate-400">Enter your authorized academy ID and password.</p>
          </div>
          <form onSubmit={handleOwnerLogin} className="mt-6 space-y-4">
            <label className="block text-xs font-semibold text-slate-300">
              Owner ID
              <input
                required
                value={ownerId}
                onChange={(event) => setOwnerId(event.target.value)}
                autoComplete="username"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Enter owner ID"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              Password
              <input
                required
                type="password"
                value={ownerPassword}
                onChange={(event) => setOwnerPassword(event.target.value)}
                autoComplete="current-password"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Enter password"
              />
            </label>
            {loginError && <p role="alert" className="text-xs text-rose-400">{loginError}</p>}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500"
            >
              <LogIn className="h-4 w-4" />
              Sign in to dashboard
            </button>
          </form>
          <Link href="/login" className="mt-5 block text-center text-xs text-indigo-400 hover:text-indigo-300">
            Back to portal login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900 px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-sm text-white">Visioner Academy</strong>
              <small className="text-[10px] uppercase text-indigo-400">Teacher / Owner</small>
            </span>
          </Link>
          <button onClick={signOut} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Academy operations</p>
          <h1 className="mt-2 text-2xl font-bold text-white">Teacher control center</h1>
          <p className="mt-1 text-sm text-slate-400">Update student results, attendance, and timetable from one place.</p>
        </div>

        <nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { key: "overview", label: "Overview" },
            { key: "applications", label: "Applications" },
            { key: "records", label: "Academic records" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as Tab)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold ${
                tab === item.key ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {message && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-300">
            {message}
          </div>
        )}

        {tab === "overview" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <button onClick={() => setTab("records")} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              <strong className="mt-3 block text-2xl text-white">{records.results.length}</strong>
              <span className="text-xs text-slate-400">Published results</span>
            </button>
            <button onClick={() => setTab("records")} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <strong className="mt-3 block text-2xl text-white">{records.attendance.length}</strong>
              <span className="text-xs text-slate-400">Attendance records</span>
            </button>
            <button onClick={() => setTab("records")} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left">
              <CalendarDays className="h-5 w-5 text-amber-400" />
              <strong className="mt-3 block text-2xl text-white">{records.schedule.length}</strong>
              <span className="text-xs text-slate-400">Scheduled classes</span>
            </button>
          </div>
        )}

        {tab === "overview" && (
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">Active student</p>
                <h2 className="mt-1 text-base font-bold text-white">Aiden Vance</h2>
                <p className="mt-1 text-xs text-slate-400">Student ID: VVA-STU-8842 • Cambridge AS-Level • Year 12</p>
              </div>
              <button onClick={() => setTab("records")} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500">
                Open student records
              </button>
            </div>
          </div>
        )}

        {tab === "applications" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-3">
              {applications.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectApplication(item)}
                  className={`w-full rounded-2xl border p-4 text-left ${
                    selectedApplication?.id === item.id ? "border-indigo-500 bg-indigo-950/20" : "border-slate-800 bg-slate-900"
                  }`}
                >
                  <div className="flex justify-between">
                    <strong className="text-sm text-white">{item.studentName}</strong>
                    <span className="text-xs text-indigo-300">{item.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{item.id} • {item.targetTrack}</p>
                  <span className="mt-3 inline-block rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white">
                    Open student records
                  </span>
                </button>
              ))}
              {applications.length === 0 && (
                <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-xs text-slate-400">
                  No applications have been submitted.
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              {selectedApplication ? (
                <>
                  <h2 className="text-base font-bold text-white">{selectedApplication.studentName}</h2>
                  <p className="mt-1 text-xs text-slate-400">{selectedApplication.studentEmail}</p>
                  <label className="mt-6 block text-xs text-slate-300">
                    Application status
                    <select
                      value={selectedApplication.status}
                      onChange={(event) => updateStatus(event.target.value as AdmissionsApplication["status"])}
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    >
                      <option>Under Review</option>
                      <option>Verified</option>
                      <option>Interview Scheduled</option>
                      <option>Accepted</option>
                    </select>
                  </label>
                </>
              ) : (
                <p className="text-xs text-slate-500">Select an application to review it.</p>
              )}
            </div>
          </div>
        )}

        {tab === "applications" && selectedApplication && (
          <section className="rounded-2xl border border-indigo-500/30 bg-slate-900 p-5">
            <h2 className="text-base font-bold text-white">Complete application: {selectedApplication.studentName}</h2>
            <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
              <p><span className="text-slate-500">Student email</span><strong className="mt-1 block break-all text-slate-200">{selectedApplication.studentEmail}</strong></p>
              <p><span className="text-slate-500">Parent / guardian</span><strong className="mt-1 block text-slate-200">{selectedApplication.parentName}</strong></p>
              <p><span className="text-slate-500">Parent email</span><strong className="mt-1 block break-all text-slate-200">{selectedApplication.parentEmail}</strong></p>
              <p><span className="text-slate-500">Phone number</span><strong className="mt-1 block text-slate-200">{selectedApplication.parentPhone}</strong></p>
              <p><span className="text-slate-500">Nationality</span><strong className="mt-1 block text-slate-200">{selectedApplication.nationality}</strong></p>
              <p><span className="text-slate-500">Country / city</span><strong className="mt-1 block text-slate-200">{selectedApplication.countryOfResidence} • {selectedApplication.city}</strong></p>
              <p><span className="text-slate-500">Date of birth</span><strong className="mt-1 block text-slate-200">{selectedApplication.dateOfBirth}</strong></p>
              <p><span className="text-slate-500">Program / grade</span><strong className="mt-1 block text-slate-200">{selectedApplication.targetTrack} • {selectedApplication.gradeLevel}</strong></p>
              <p><span className="text-slate-500">Timezone</span><strong className="mt-1 block text-slate-200">{selectedApplication.timeZone}</strong></p>
              <p><span className="text-slate-500">Preferred cohort</span><strong className="mt-1 block text-slate-200">{selectedApplication.preferredCohortSlot}</strong></p>
              <p className="lg:col-span-2"><span className="text-slate-500">Documents</span><strong className="mt-1 block text-slate-200">{selectedApplication.documentsAttached.length ? selectedApplication.documentsAttached.join(", ") : "No documents attached"}</strong></p>
            </div>
            <div className="mt-5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-indigo-200">Student portal access</p>
                <button type="button" onClick={() => setTab("records")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white">
                  Open student records
                </button>
              </div>
              {selectedAccount ? (
                <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                  <p><span className="text-slate-400">Student ID:</span> <strong className="text-white">{selectedAccount.studentId}</strong></p>
                  <p><span className="text-slate-400">Password:</span> <strong className="text-white">{selectedAccount.password}</strong></p>
                  <p className="text-[11px] text-slate-400 sm:col-span-2">Generated {selectedAccount.createdAt}. Provide these credentials to the student.</p>
                </div>
              ) : (
                <button onClick={generateStudentAccount} className="mt-3 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500">
                  Generate student ID and password
                </button>
              )}
            </div>
          </section>
        )}

        {tab === "records" && (
          <div className="space-y-8">
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                <BarChart3 className="h-4 w-4 text-indigo-400" />Results
              </h2>
              <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <div className="space-y-2">
                  {records.results.map((item) => (
                    <button key={item.id} onClick={() => editResult(item)} className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left">
                      <span>
                        <strong className="block text-xs text-white">{item.course}</strong>
                        <small className="text-slate-400">{item.code} • {item.feedback}</small>
                      </span>
                      <span className="text-xs font-bold text-emerald-400">{item.score} ({item.grade})</span>
                    </button>
                  ))}
                </div>
                <form onSubmit={saveResult} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4">
                  {field("Course", result.course, (value) => setResult({ ...result, course: value }))}
                  {field("Course code", result.code, (value) => setResult({ ...result, code: value }))}
                  {field("Score", result.score, (value) => setResult({ ...result, score: value }))}
                  {field("Grade", result.grade, (value) => setResult({ ...result, grade: value }))}
                  {field("Feedback", result.feedback, (value) => setResult({ ...result, feedback: value }))}
                  <button className="mt-2 flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white">
                    <Save className="h-4 w-4" />Save result
                  </button>
                </form>
              </div>
            </section>

            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />Attendance
              </h2>
              <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <div className="space-y-2">
                  {records.attendance.map((item) => (
                    <button key={item.id} onClick={() => editAttendance(item)} className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left">
                      <span>
                        <strong className="block text-xs text-white">{item.course}</strong>
                        <small className="text-slate-400">{item.date}</small>
                      </span>
                      <span className={`text-xs font-bold ${item.status === "Present" ? "text-emerald-400" : item.status === "Late" ? "text-amber-400" : "text-rose-400"}`}>
                        {item.status}
                      </span>
                    </button>
                  ))}
                </div>
                <form onSubmit={saveAttendance} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4">
                  {field("Course", attendance.course, (value) => setAttendance({ ...attendance, course: value }))}
                  {field("Date", attendance.date, (value) => setAttendance({ ...attendance, date: value }))}
                  <label className="block text-xs text-slate-400">
                    Status
                    <select
                      value={attendance.status}
                      onChange={(event) => setAttendance({ ...attendance, status: event.target.value as AttendanceRecord["status"] })}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    >
                      <option>Present</option>
                      <option>Late</option>
                      <option>Absent</option>
                    </select>
                  </label>
                  <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white">
                    <Save className="h-4 w-4" />Save attendance
                  </button>
                </form>
              </div>
            </section>

            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                <CalendarDays className="h-4 w-4 text-amber-400" />Timetable
              </h2>
              <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <div className="space-y-2">
                  {records.schedule.map((item) => (
                    <button key={item.id} onClick={() => editSchedule(item)} className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left">
                      <span>
                        <strong className="block text-xs text-white">{item.course}</strong>
                        <small className="text-slate-400">{item.day} • {item.time} • {item.topic}</small>
                      </span>
                    </button>
                  ))}
                </div>
                <form onSubmit={saveSchedule} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4">
                  {field("Course", schedule.course, (value) => setSchedule({ ...schedule, course: value }))}
                  {field("Time", schedule.time, (value) => setSchedule({ ...schedule, time: value }))}
                  {field("Topic", schedule.topic, (value) => setSchedule({ ...schedule, topic: value }))}
                  {field("Teacher", schedule.teacher, (value) => setSchedule({ ...schedule, teacher: value }))}
                  <label className="block text-xs text-slate-400">
                    Day
                    <select
                      value={schedule.day}
                      onChange={(event) => setSchedule({ ...schedule, day: event.target.value as ScheduleRecord["day"] })}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    >
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                        <option key={day}>{day}</option>
                      ))}
                    </select>
                  </label>
                  <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white">
                    <Save className="h-4 w-4" />Save timetable
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}