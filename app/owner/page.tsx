// "use client";

// import React, { useState, useEffect, useSyncExternalStore } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { BarChart3, CalendarDays, CheckCircle2, GraduationCap, LogIn, LogOut, Save, Wifi, WifiOff, Loader2 } from "lucide-react";
// import { getSavedApplications, getStudentAccounts, saveApplication, saveStudentAccount } from "@/lib/storage";
// import { AdmissionsApplication, StudentAccount } from "@/lib/types";
// import { AcademicResult, AttendanceRecord, PortalRecords, ScheduleRecord, getPortalRecords, getStudentPortalRecords, migrateStudentPortalRecords, savePortalRecords, saveStudentPortalRecords } from "@/lib/portalData";
// import { supabase } from "@/lib/supabase";

// type Tab = "overview" | "applications" | "records";
// type DbStatus = "checking" | "connected" | "disconnected";

// const OWNER_SESSION_KEY = "vva_owner_authenticated";
// const OWNER_AUTH_EVENT = "vva_owner_auth_changed";
// const getOwnerAuthSnapshot = () => typeof window !== "undefined" && window.sessionStorage.getItem(OWNER_SESSION_KEY) === "true";
// const subscribeToOwnerAuth = (onChange: () => void) => {
//   window.addEventListener(OWNER_AUTH_EVENT, onChange);
//   window.addEventListener("storage", onChange);
//   return () => {
//     window.removeEventListener(OWNER_AUTH_EVENT, onChange);
//     window.removeEventListener("storage", onChange);
//   };
// };
// const emptyResult: AcademicResult = { id: "", code: "", course: "", score: "", grade: "", feedback: "" };
// const emptyAttendance: AttendanceRecord = { id: "", date: "", course: "", status: "Present" };
// const emptySchedule: ScheduleRecord = { id: "", day: "Monday", time: "", course: "", topic: "", teacher: "" };

// export default function OwnerDashboardPage() {
//   const router = useRouter();
//   const authenticated = useSyncExternalStore(subscribeToOwnerAuth, getOwnerAuthSnapshot, () => false);
//   const [ownerId, setOwnerId] = useState("");
//   const [ownerPassword, setOwnerPassword] = useState("");
//   const [loginError, setLoginError] = useState("");
//   const [tab, setTab] = useState<Tab>("overview");
//   const [applications, setApplications] = useState<AdmissionsApplication[]>([]);
//   const [selectedApplication, setSelectedApplication] = useState<AdmissionsApplication | null>(null);
//   const [studentAccounts, setStudentAccounts] = useState<StudentAccount[]>([]);
//   const [records, setRecords] = useState<PortalRecords>(() => getPortalRecords());
//   const [result, setResult] = useState<AcademicResult>(emptyResult);
//   const [attendance, setAttendance] = useState<AttendanceRecord>(emptyAttendance);
//   const [schedule, setSchedule] = useState<ScheduleRecord>(emptySchedule);
//   const [message, setMessage] = useState("");
//   const [dbStatus, setDbStatus] = useState<DbStatus>("checking");


//   useEffect(() => {
//   async function loadData() {
//     const apps = await getSavedApplications();
//     setApplications(apps);
//     const accounts = await getStudentAccounts();
//     setStudentAccounts(accounts);
//   }
//   loadData();
// }, []);


//   useEffect(() => {
//     async function checkConnection() {
//       if (!supabase) {
//         setDbStatus("disconnected");
//         return;
//       }
//       try {
//         const { error } = await supabase.from("student_accounts").select("application_id").limit(1);
//         if (error) {
//           console.error("Supabase connection check error:", error);
//           setDbStatus("disconnected");
//         } else {
//           setDbStatus("connected");
//         }
//       } catch {
//         setDbStatus("disconnected");
//       }
//     }

//     async function loadData() {
//       await checkConnection();
//       const apps = await getSavedApplications();
//       const accounts = await getStudentAccounts();
//       setApplications(apps);
//       setStudentAccounts(accounts);
//     }

//     if (authenticated) {
//       loadData();
//     }
//   }, [authenticated]);

//   const selectedAccount = selectedApplication
//     ? studentAccounts.find((account) => account.applicationId === selectedApplication.id || account.studentId === selectedApplication.id)
//     : undefined;
//   const selectedRecordKey = selectedApplication ? (selectedAccount?.studentId || selectedApplication.id) : "";

//   const updateRecords = async (next: PortalRecords) => {
//     setRecords(next);
//     if (selectedRecordKey) {
//       await saveStudentPortalRecords(selectedRecordKey, next);
//     } else {
//       savePortalRecords(next);
//     }
//     setMessage("Saved and synced to student portal.");
//     window.setTimeout(() => setMessage(""), 2500);
//   };

  



//   const updateStatus = async (status: AdmissionsApplication["status"]) => {
//     if (!selectedApplication) return;
//     const next = { ...selectedApplication, status };
//     await saveApplication(next);
//     setApplications((items) => items.map((item) => item.id === next.id ? next : item));
//     setSelectedApplication(next);
//   };

//   const selectApplication = async (application: AdmissionsApplication) => {
//     setSelectedApplication(application);
//     const account = studentAccounts.find((item) => item.applicationId === application.id || item.studentId === application.id);
//     const targetId = account ? account.studentId : application.id;
//     const recs = await getStudentPortalRecords(targetId);
//     setRecords(recs);
//     setResult(emptyResult);
//     setAttendance(emptyAttendance);
//     setSchedule(emptySchedule);
//   };

//   const generateStudentAccount = async () => {
//     if (!selectedApplication) return;
    
//     const existingAccount = studentAccounts.find((item) => item.applicationId === selectedApplication.id);
//     if (existingAccount) {
//       setMessage("Account already exists for this application.");
//       window.setTimeout(() => setMessage(""), 3000);
//       return;
//     }
    
//     const appId = selectedApplication.id.trim();
//     const newPassword = `VVA${Math.floor(100000 + Math.random() * 900000)}`;
//     const account: StudentAccount = {
//       applicationId: appId,
//       studentId: appId,
//       password: newPassword,
//       studentName: selectedApplication.studentName,
//       studentEmail: selectedApplication.studentEmail,
//       createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
//     };

//     await saveStudentAccount(account);
//     await migrateStudentPortalRecords(selectedApplication.id, account.studentId);
    
//     setStudentAccounts((items) => [
//       account,
//       ...items.filter((item) => item.applicationId !== account.applicationId && item.studentId !== account.studentId),
//     ]);

//     const updatedRecords = await getStudentPortalRecords(account.studentId);
//     setRecords(updatedRecords);
//     setMessage(`Account Generated! Credentials active: ${account.studentId} / ${account.password}`);
//     window.setTimeout(() => setMessage(""), 5000);
//     setTab("records");
//     setMessage(`Account created! Student ID: ${account.studentId} | Password: ${account.password}`);
//     window.setTimeout(() => setMessage(""), 10000);
//   };

//   const editResult = (item: AcademicResult) => setResult(item);
//   const saveResult = (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!result.course || !result.score) return;
//     const item = { ...result, id: result.id || `result-${Date.now()}` };
//     updateRecords({
//       ...records,
//       results: records.results.some((old) => old.id === item.id)
//         ? records.results.map((old) => (old.id === item.id ? item : old))
//         : [...records.results, item],
//     });
//     setResult(emptyResult);
//   };

//   const editAttendance = (item: AttendanceRecord) => setAttendance(item);
//   const saveAttendance = (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!attendance.course || !attendance.date) return;
//     const item = { ...attendance, id: attendance.id || `attendance-${Date.now()}` };
//     updateRecords({
//       ...records,
//       attendance: records.attendance.some((old) => old.id === item.id)
//         ? records.attendance.map((old) => (old.id === item.id ? item : old))
//         : [...records.attendance, item],
//     });
//     setAttendance(emptyAttendance);
//   };

//   const editSchedule = (item: ScheduleRecord) => setSchedule(item);
//   const saveSchedule = (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!schedule.course || !schedule.time) return;
//     const item = { ...schedule, id: schedule.id || `schedule-${Date.now()}` };
//     updateRecords({
//       ...records,
//       schedule: records.schedule.some((old) => old.id === item.id)
//         ? records.schedule.map((old) => (old.id === item.id ? item : old))
//         : [...records.schedule, item],
//     });
//     setSchedule(emptySchedule);
//   };

//   const field = (label: string, value: string, onChange: (value: string) => void) => (
//     <label className="block text-xs text-slate-400">
//       {label}
//       <input
//         value={value}
//         onChange={(event) => onChange(event.target.value)}
//         className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
//       />
//     </label>
//   );

//   const handleOwnerLogin = async (event: React.FormEvent) => {
//   event.preventDefault();
//   if (ownerId.trim() === "Muhammad-Salman" && ownerPassword.trim() === "123123") {
//     window.sessionStorage.setItem(OWNER_SESSION_KEY, "true");
//     setLoginError("");
//     window.dispatchEvent(new Event(OWNER_AUTH_EVENT));

//     const apps = await getSavedApplications();
//     const accounts = await getStudentAccounts();
//     setApplications(apps);
//     setStudentAccounts(accounts);
//     return;
//   }
//   setLoginError("The ID or password is incorrect.");
// };

//   const signOut = () => {
//     window.sessionStorage.removeItem(OWNER_SESSION_KEY);
//     window.dispatchEvent(new Event(OWNER_AUTH_EVENT));
//     setOwnerId("");
//     setOwnerPassword("");
//     setLoginError("");
//     setSelectedApplication(null);
//     router.push("/login");
//   };

//   if (!authenticated) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
//         <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
//           <Link href="/" className="mx-auto flex w-fit items-center gap-3">
//             <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
//               <GraduationCap className="h-5 w-5" />
//             </span>
//             <span>
//               <strong className="block text-sm text-white">Visioner Academy</strong>
//               <small className="text-[10px] uppercase text-indigo-400">Teacher / Owner</small>
//             </span>
//           </Link>
//           <div className="mt-8 text-center">
//             <h1 className="text-xl font-bold text-white">Owner dashboard sign in</h1>
//             <p className="mt-2 text-xs text-slate-400">Enter your authorized academy ID and password.</p>
//           </div>
//           <form onSubmit={handleOwnerLogin} className="mt-6 space-y-4">
//             <label className="block text-xs font-semibold text-slate-300">
//               Owner ID
//               <input
//                 required
//                 value={ownerId}
//                 onChange={(event) => setOwnerId(event.target.value)}
//                 autoComplete="username"
//                 className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
//                 placeholder="Enter owner ID"
//               />
//             </label>
//             <label className="block text-xs font-semibold text-slate-300">
//               Password
//               <input
//                 required
//                 type="password"
//                 value={ownerPassword}
//                 onChange={(event) => setOwnerPassword(event.target.value)}
//                 autoComplete="current-password"
//                 className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
//                 placeholder="Enter password"
//               />
//             </label>
//             {loginError && <p role="alert" className="text-xs text-rose-400">{loginError}</p>}
//             <button
//               type="submit"
//               className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500"
//             >
//               <LogIn className="h-4 w-4" />
//               Sign in to dashboard
//             </button>
//           </form>
//           <Link href="/login" className="mt-5 block text-center text-xs text-indigo-400 hover:text-indigo-300">
//             Back to portal login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100">
//       <header className="border-b border-slate-800 bg-slate-900 px-4 py-4 sm:px-8">
//         <div className="mx-auto flex max-w-7xl items-center justify-between">
//           <Link href="/" className="flex items-center gap-3">
//             <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
//               <GraduationCap className="h-5 w-5" />
//             </span>
//             <span>
//               <strong className="block text-sm text-white">Visioner Academy</strong>
//               <small className="text-[10px] uppercase text-indigo-400">Teacher / Owner</small>
//             </span>
//           </Link>
//           <button onClick={signOut} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white">
//             <LogOut className="h-4 w-4" />
//             Sign out
//           </button>
//         </div>
//       </header>

//       <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Academy operations</p>
//             <h1 className="mt-2 text-2xl font-bold text-white">Teacher control center</h1>
//             <p className="mt-1 text-sm text-slate-400">Update student results, attendance, and timetable from one place.</p>
//           </div>

//           <div className="flex items-center gap-2 self-start sm:self-auto">
//             {dbStatus === "checking" && (
//               <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
//                 <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
//                 Checking Supabase...
//               </span>
//             )}
//             {dbStatus === "connected" && (
//               <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300">
//                 <Wifi className="h-3.5 w-3.5 text-emerald-400" />
//                 Cloud Synced (Supabase Active)
//               </span>
//             )}
//             {dbStatus === "disconnected" && (
//               <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-950/40 px-3 py-1 text-xs font-semibold text-rose-300" title="Missing Supabase Env Variables or SQL Table Policy Error">
//                 <WifiOff className="h-3.5 w-3.5 text-rose-400" />
//                 LocalStorage Only (Cloud Offline)
//               </span>
//             )}
//           </div>
//         </div>

//         <nav className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
//           {[
//             { key: "overview", label: "Overview" },
//             { key: "applications", label: "Applications" },
//             { key: "records", label: "Academic records" },
//           ].map((item) => (
//             <button
//               key={item.key}
//               onClick={() => setTab(item.key as Tab)}
//               className={`rounded-lg px-4 py-2 text-xs font-semibold ${
//                 tab === item.key ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
//               }`}
//             >
//               {item.label}
//             </button>
//           ))}
//         </nav>

//         {message && (
//           <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-300">
//             {message}
//           </div>
//         )}

//         {tab === "overview" && (
//           <div className="grid gap-4 sm:grid-cols-3">
//             <button onClick={() => setTab("records")} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left">
//               <BarChart3 className="h-5 w-5 text-indigo-400" />
//               <strong className="mt-3 block text-2xl text-white">{records.results.length}</strong>
//               <span className="text-xs text-slate-400">Published results</span>
//             </button>
//             <button onClick={() => setTab("records")} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left">
//               <CheckCircle2 className="h-5 w-5 text-emerald-400" />
//               <strong className="mt-3 block text-2xl text-white">{records.attendance.length}</strong>
//               <span className="text-xs text-slate-400">Attendance records</span>
//             </button>
//             <button onClick={() => setTab("records")} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left">
//               <CalendarDays className="h-5 w-5 text-amber-400" />
//               <strong className="mt-3 block text-2xl text-white">{records.schedule.length}</strong>
//               <span className="text-xs text-slate-400">Scheduled classes</span>
//             </button>
//           </div>
//         )}

//         {tab === "applications" && (
//           <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
//             <div className="space-y-3">
//               {applications.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => selectApplication(item)}
//                   className={`w-full rounded-2xl border p-4 text-left ${
//                     selectedApplication?.id === item.id ? "border-indigo-500 bg-indigo-950/20" : "border-slate-800 bg-slate-900"
//                   }`}
//                 >
//                   <div className="flex justify-between">
//                     <strong className="text-sm text-white">{item.studentName}</strong>
//                     <span className="text-xs text-indigo-300">{item.status}</span>
//                   </div>
//                   <p className="mt-1 text-xs text-slate-400">{item.id} • {item.targetTrack}</p>
//                   <span className="mt-3 inline-block rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white">
//                     Open student records
//                   </span>
//                 </button>
//               ))}
//               {applications.length === 0 && (
//                 <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-xs text-slate-400">
//                   No applications have been submitted.
//                 </p>
//               )}
//             </div>
//             <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//               {selectedApplication ? (
//                 <>
//                   <h2 className="text-base font-bold text-white">{selectedApplication.studentName}</h2>
//                   <p className="mt-1 text-xs text-slate-400">{selectedApplication.studentEmail}</p>
//                   <label className="mt-6 block text-xs text-slate-300">
//                     Application status
//                     <select
//                       value={selectedApplication.status}
//                       onChange={(event) => updateStatus(event.target.value as AdmissionsApplication["status"])}
//                       className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
//                     >
//                       <option>Under Review</option>
//                       <option>Verified</option>
//                       <option>Interview Scheduled</option>
//                       <option>Accepted</option>
//                     </select>
//                   </label>
//                 </>
//               ) : (
//                 <p className="text-xs text-slate-500">Select an application to review it.</p>
//               )}
//             </div>
//           </div>
//         )}

//         {tab === "applications" && selectedApplication && (
//           <section className="rounded-2xl border border-indigo-500/30 bg-slate-900 p-5">
//             <h2 className="text-base font-bold text-white">Complete application: {selectedApplication.studentName}</h2>
//             <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
//               <p><span className="text-slate-500">Student email</span><strong className="mt-1 block break-all text-slate-200">{selectedApplication.studentEmail}</strong></p>
//               <p><span className="text-slate-500">Parent / guardian</span><strong className="mt-1 block text-slate-200">{selectedApplication.parentName}</strong></p>
//               <p><span className="text-slate-500">Parent email</span><strong className="mt-1 block break-all text-slate-200">{selectedApplication.parentEmail}</strong></p>
//               <p><span className="text-slate-500">Phone number</span><strong className="mt-1 block text-slate-200">{selectedApplication.parentPhone}</strong></p>
//               <p><span className="text-slate-500">Nationality</span><strong className="mt-1 block text-slate-200">{selectedApplication.nationality}</strong></p>
//               <p><span className="text-slate-500">Country / city</span><strong className="mt-1 block text-slate-200">{selectedApplication.countryOfResidence} • {selectedApplication.city}</strong></p>
//               <p><span className="text-slate-500">Date of birth</span><strong className="mt-1 block text-slate-200">{selectedApplication.dateOfBirth}</strong></p>
//               <p><span className="text-slate-500">Program / grade</span><strong className="mt-1 block text-slate-200">{selectedApplication.targetTrack} • {selectedApplication.gradeLevel}</strong></p>
//               <p><span className="text-slate-500">Timezone</span><strong className="mt-1 block text-slate-200">{selectedApplication.timeZone}</strong></p>
//               <p><span className="text-slate-500">Preferred cohort</span><strong className="mt-1 block text-slate-200">{selectedApplication.preferredCohortSlot}</strong></p>
//               <p className="lg:col-span-2"><span className="text-slate-500">Documents</span><strong className="mt-1 block text-slate-200">{selectedApplication.documentsAttached.length ? selectedApplication.documentsAttached.join(", ") : "No documents attached"}</strong></p>
//             </div>
//             <div className="mt-5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
//               <div className="flex items-center justify-between gap-3">
//                 <p className="text-xs font-semibold text-indigo-200">Student portal access</p>
//                 <button type="button" onClick={() => setTab("records")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white">
//                   Open student records
//                 </button>
//               </div>
//               {selectedAccount ? (
//                 <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
//                   <p><span className="text-slate-400">Student ID:</span> <strong className="text-white">{selectedAccount.studentId}</strong></p>
//                   <p><span className="text-slate-400">Password:</span> <strong className="text-white">{selectedAccount.password}</strong></p>
//                   <p className="text-[11px] text-slate-400 sm:col-span-2">Generated {selectedAccount.createdAt}. Provide these credentials to the student.</p>
//                 </div>
//               ) : (
//                 <button onClick={generateStudentAccount} className="mt-3 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500">
//                   Generate student ID and password
//                 </button>
//               )}
//             </div>
//           </section>
//         )}

//         {tab === "records" && (
//           <div className="space-y-8">
//             <section>
//               <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
//                 <BarChart3 className="h-4 w-4 text-indigo-400" />Results
//               </h2>
//               <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
//                 <div className="space-y-2">
//                   {records.results.map((item) => (
//                     <button key={item.id} onClick={() => editResult(item)} className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left">
//                       <span>
//                         <strong className="block text-xs text-white">{item.course}</strong>
//                         <small className="text-slate-400">{item.code} • {item.feedback}</small>
//                       </span>
//                       <span className="text-xs font-bold text-emerald-400">{item.score} ({item.grade})</span>
//                     </button>
//                   ))}
//                 </div>
//                 <form onSubmit={saveResult} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4">
//                   {field("Course", result.course, (value) => setResult({ ...result, course: value }))}
//                   {field("Course code", result.code, (value) => setResult({ ...result, code: value }))}
//                   {field("Score", result.score, (value) => setResult({ ...result, score: value }))}
//                   {field("Grade", result.grade, (value) => setResult({ ...result, grade: value }))}
//                   {field("Feedback", result.feedback, (value) => setResult({ ...result, feedback: value }))}
//                   <button className="mt-2 flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white">
//                     <Save className="h-4 w-4" />Save result
//                   </button>
//                 </form>
//               </div>
//             </section>

//             <section>
//               <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
//                 <CheckCircle2 className="h-4 w-4 text-emerald-400" />Attendance
//               </h2>
//               <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
//                 <div className="space-y-2">
//                   {records.attendance.map((item) => (
//                     <button key={item.id} onClick={() => editAttendance(item)} className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left">
//                       <span>
//                         <strong className="block text-xs text-white">{item.course}</strong>
//                         <small className="text-slate-400">{item.date}</small>
//                       </span>
//                       <span className={`text-xs font-bold ${item.status === "Present" ? "text-emerald-400" : item.status === "Late" ? "text-amber-400" : "text-rose-400"}`}>
//                         {item.status}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//                 <form onSubmit={saveAttendance} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4">
//                   {field("Course", attendance.course, (value) => setAttendance({ ...attendance, course: value }))}
//                   {field("Date", attendance.date, (value) => setAttendance({ ...attendance, date: value }))}
//                   <label className="block text-xs text-slate-400">
//                     Status
//                     <select
//                       value={attendance.status}
//                       onChange={(event) => setAttendance({ ...attendance, status: event.target.value as AttendanceRecord["status"] })}
//                       className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
//                     >
//                       <option>Present</option>
//                       <option>Late</option>
//                       <option>Absent</option>
//                     </select>
//                   </label>
//                   <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white">
//                     <Save className="h-4 w-4" />Save attendance
//                   </button>
//                 </form>
//               </div>
//             </section>

//             <section>
//               <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
//                 <CalendarDays className="h-4 w-4 text-amber-400" />Timetable
//               </h2>
//               <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
//                 <div className="space-y-2">
//                   {records.schedule.map((item) => (
//                     <button key={item.id} onClick={() => editSchedule(item)} className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left">
//                       <span>
//                         <strong className="block text-xs text-white">{item.course}</strong>
//                         <small className="text-slate-400">{item.day} • {item.time} • {item.topic}</small>
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//                 <form onSubmit={saveSchedule} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4">
//                   {field("Course", schedule.course, (value) => setSchedule({ ...schedule, course: value }))}
//                   {field("Time", schedule.time, (value) => setSchedule({ ...schedule, time: value }))}
//                   {field("Topic", schedule.topic, (value) => setSchedule({ ...schedule, topic: value }))}
//                   {field("Teacher", schedule.teacher, (value) => setSchedule({ ...schedule, teacher: value }))}
//                   <label className="block text-xs text-slate-400">
//                     Day
//                     <select
//                       value={schedule.day}
//                       onChange={(event) => setSchedule({ ...schedule, day: event.target.value as ScheduleRecord["day"] })}
//                       className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
//                     >
//                       {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
//                         <option key={day}>{day}</option>
//                       ))}
//                     </select>
//                   </label>
//                   <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white">
//                     <Save className="h-4 w-4" />Save timetable
//                   </button>
//                 </form>
//               </div>
//             </section>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


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
      if (apps.length > 0 && !selectedApplication) {
        setSelectedApplication(apps[0]);
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
    notifyMessage("Academic records saved and synced with student portal.");
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
    setAttendance(emptyAttendance);
    setSchedule(emptySchedule);
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
      setSelectedApplication(remaining.length > 0 ? remaining[0] : null);
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
                    Active Student Profile
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedApplication ? selectedApplication.studentName : "Aiden Vance"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    ID: {selectedApplication ? selectedApplication.id : "VVA-STU-8842"} • Track: {selectedApplication ? selectedApplication.targetTrack : "Cambridge AS-Level"}
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
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Enrolled Applications ({filteredApplications.length})
                </h3>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
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

              <div className="lg:col-span-7">
                {selectedApplication ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
                      <div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          Application ID: {selectedApplication.id}
                        </span>
                        <h2 className="text-xl font-extrabold text-white mt-1">
                          {selectedApplication.studentName}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Applied on {selectedApplication.createdAt}
                        </p>
                      </div>

                      <button
                        onClick={() => setDeleteConfirmApp(selectedApplication)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-bold transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Application
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block font-semibold">Student Email</span>
                        <strong className="text-white mt-0.5 block break-all">{selectedApplication.studentEmail}</strong>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block font-semibold">Parent / Guardian</span>
                        <strong className="text-white mt-0.5 block">{selectedApplication.parentName} ({selectedApplication.parentPhone})</strong>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block font-semibold">Academic Program</span>
                        <strong className="text-white mt-0.5 block">{selectedApplication.targetTrack} • {selectedApplication.gradeLevel}</strong>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block font-semibold">Location / Nationality</span>
                        <strong className="text-white mt-0.5 block">{selectedApplication.city}, {selectedApplication.countryOfResidence} ({selectedApplication.nationality})</strong>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Update Application Status
                        <select
                          value={selectedApplication.status}
                          onChange={(e) => updateStatus(e.target.value as AdmissionsApplication["status"])}
                          className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
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

        {tab === "records" && (
          <div className="space-y-8">
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" /> Academic Results & Grades
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-2">
                  {records.results.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-left">
                      <div>
                        <strong className="block text-xs text-white">{item.course}</strong>
                        <small className="text-slate-400">{item.code} • {item.feedback}</small>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{item.score} ({item.grade})</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={saveResult} className="lg:col-span-5 space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Course Name</label>
                    <input value={result.course} onChange={(e) => setResult({ ...result, course: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="Computer Science" />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Course Code</label>
                    <input value={result.code} onChange={(e) => setResult({ ...result, code: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="CS101" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Score</label>
                      <input value={result.score} onChange={(e) => setResult({ ...result, score: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="92%" />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Grade</label>
                      <input value={result.grade} onChange={(e) => setResult({ ...result, grade: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="A*" />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Feedback</label>
                    <input value={result.feedback} onChange={(e) => setResult({ ...result, feedback: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" placeholder="Great work!" />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-500 mt-2">
                    <Save className="h-4 w-4" /> Save Academic Result
                  </button>
                </form>
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Attendance Log
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-2">
                  {records.attendance.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-left">
                      <div>
                        <strong className="block text-xs text-white">{item.course}</strong>
                        <small className="text-slate-400">{item.date}</small>
                      </div>
                      <span className={`text-xs font-bold ${item.status === "Present" ? "text-emerald-400" : item.status === "Late" ? "text-amber-400" : "text-rose-400"}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={saveAttendance} className="lg:col-span-5 space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Course Name</label>
                    <input value={attendance.course} onChange={(e) => setAttendance({ ...attendance, course: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Date</label>
                    <input type="date" value={attendance.date} onChange={(e) => setAttendance({ ...attendance, date: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Status</label>
                    <select value={attendance.status} onChange={(e) => setAttendance({ ...attendance, status: e.target.value as AttendanceRecord["status"] })} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white">
                      <option value="Present">Present</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-500 mt-2">
                    <Save className="h-4 w-4" /> Save Attendance Log
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
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

      {/* Grading Review Modal */}
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