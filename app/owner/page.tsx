"use client";

import { FormEvent, useEffect, useState } from "react";
import { Award, BookOpen, CalendarDays, CheckCircle2, ClipboardList, GraduationCap, LogOut, Plus, Save, Trash2, Users } from "lucide-react";
import { clearPortalSession, getPortalSession, loginOwner, savePortalSession, PortalUser } from "@/lib/auth";
import { getSavedApplications, getStudentAccounts, getStudentAssignments, saveStudentAccount, saveStudentAssignments } from "@/lib/storage";
import { AdmissionsApplication, Assignment, StudentAccount } from "@/lib/types";
import { AcademicResult, AttendanceRecord, PortalRecords, ScheduleRecord, getStudentPortalRecords, saveStudentPortalRecords } from "@/lib/portalData";

type Tab = "overview" | "students" | "assignments" | "academic" | "timetable" | "attendance";

const inputClass = "w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500";
const emptyResult: AcademicResult = { id: "", course: "", code: "", score: "", grade: "", feedback: "" };
const emptyAttendance: AttendanceRecord = { id: "", date: "", course: "", status: "Present", totalClasses: 1, attended: 1 };
const emptySchedule: ScheduleRecord = { id: "", day: "Monday", time: "", subject: "", course: "", teacher: "", room: "" };
const emptyAssignment: Assignment = { id: "", title: "", course: "", courseCode: "", dueDate: "", status: "pending", instructions: "", score: "100 pts", urgency: "normal" };

export default function OwnerPage() {
  const [checkedSession, setCheckedSession] = useState(false);
  const [owner, setOwner] = useState<PortalUser | null>(null);
  const [ownerId, setOwnerId] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [message, setMessage] = useState("");
  const [applications, setApplications] = useState<AdmissionsApplication[]>([]);
  const [accounts, setAccounts] = useState<StudentAccount[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [records, setRecords] = useState<PortalRecords | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignment, setAssignment] = useState<Assignment>(emptyAssignment);
  const [result, setResult] = useState<AcademicResult>(emptyResult);
  const [editingResult, setEditingResult] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord>(emptyAttendance);
  const [editingAttendance, setEditingAttendance] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleRecord>(emptySchedule);
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  useEffect(() => {
    const session = getPortalSession();
    if (session?.role === "owner") setOwner(session);
    setCheckedSession(true);
  }, []);

  useEffect(() => {
    if (!owner) return;
    let cancelled = false;
    const load = async () => {
      const [apps, accts] = await Promise.all([getSavedApplications(), getStudentAccounts()]);
      if (cancelled) return;
      setApplications(apps);
      setAccounts(accts);
      const firstId = selectedId || accts[0]?.studentId || apps[0]?.id || "";
      if (firstId) await loadStudent(firstId, true);
    };
    void load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner]);

  useEffect(() => {
    if (!owner || !selectedId) return;
    const timer = window.setInterval(() => { void loadStudent(selectedId, false); }, 5000);
    return () => window.clearInterval(timer);
  }, [owner, selectedId]);

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3000);
  };

  async function loadStudent(id: string, select = true) {
    if (!id) return;
    if (select) setSelectedId(id);
    const [portal, studentAssignments] = await Promise.all([getStudentPortalRecords(id), getStudentAssignments(id, [])]);
    setRecords(portal);
    setAssignments(studentAssignments);
  }

  async function handleOwnerLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    const user = await loginOwner(ownerId, ownerPassword);
    if (!user) {
      setLoginError("Invalid owner username/email or password.");
      return;
    }
    savePortalSession(user);
    setOwner(user);
  }

  function signOut() {
    clearPortalSession();
    setOwner(null);
    setSelectedId("");
    setRecords(null);
    setAssignments([]);
  }

  async function generateStudentAccount(application: AdmissionsApplication) {
    const existing = accounts.find((account) => account.applicationId === application.id || account.studentId === application.id);
    const account: StudentAccount = existing || {
      applicationId: application.id,
      studentId: application.id,
      password: `VVA${Math.floor(100000 + Math.random() * 900000)}`,
      studentName: application.studentName,
      studentEmail: application.studentEmail,
      createdAt: new Date().toISOString(),
    };
    await saveStudentAccount(account);
    setAccounts(await getStudentAccounts());
    await loadStudent(account.studentId, true);
    notify(`Student account ready: ${account.studentId}`);
  }

  async function saveRecords(next: PortalRecords) {
    if (!selectedId) return;
    const clean: PortalRecords = {
      ...next,
      stats: {
        ...next.stats,
        averagePerformance: `${calculateAverage(next.results)}%`,
        classAttendance: `${calculateAttendance(next.attendance)}%`,
        pendingHomework: assignments.filter((item) => item.status === "pending").length,
        activeSubjectsCount: (next.subjects || []).length,
      },
      assignments,
      pendingAssignments: assignments.filter((item) => item.status === "pending"),
    };
    setRecords(clean);
    await saveStudentPortalRecords(selectedId, clean);
    notify("Saved to Supabase. Student portal updated globally.");
  }

  async function submitAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId || !assignment.title.trim() || !assignment.course.trim()) return;
    const item: Assignment = {
      ...assignment,
      id: assignment.id || `asg-${Date.now()}`,
      title: assignment.title.trim(),
      course: assignment.course.trim(),
      status: assignment.status || "pending",
    };
    const next = assignment.id ? assignments.map((current) => current.id === assignment.id ? item : current) : [item, ...assignments];
    setAssignments(next);
    await saveStudentAssignments(selectedId, next);
    if (records) await saveRecords({ ...records, assignments: next });
    setAssignment({ ...emptyAssignment });
    notify(assignment.id ? "Assignment updated globally." : "Assignment published globally.");
  }

  async function deleteAssignment(id: string) {
    if (!selectedId) return;
    const next = assignments.filter((item) => item.id !== id);
    setAssignments(next);
    await saveStudentAssignments(selectedId, next);
    if (records) await saveRecords({ ...records, assignments: next });
    notify("Assignment removed globally.");
  }

  async function gradeAssignment(item: Assignment) {
    const score = window.prompt("Enter score", item.score || "");
    if (score === null) return;
    const feedback = window.prompt("Feedback", item.feedback || "") ?? "";
    const next = assignments.map((current) => current.id === item.id ? { ...current, score, feedback, status: "graded" } : current);
    setAssignments(next);
    await saveStudentAssignments(selectedId, next);
    notify("Assignment grade published globally.");
  }

  async function saveResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!records || !result.course || !result.score) return;
    const item: AcademicResult = { ...result, id: editingResult || `result-${Date.now()}` };
    const next = editingResult ? records.results.map((current) => current.id === editingResult ? item : current) : [...records.results, item];
    await saveRecords({ ...records, results: next, recentResults: next.slice(-5).reverse() });
    setResult({ ...emptyResult });
    setEditingResult(null);
  }

  async function deleteResult(id: string) {
    if (!records) return;
    await saveRecords({ ...records, results: records.results.filter((item) => item.id !== id) });
  }

  async function saveAttendance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!records || !attendance.course || !attendance.date) return;
    const total = Math.max(1, Number(attendance.totalClasses || 1));
    const attended = Math.max(0, Number(attendance.attended ?? 0));
    const item: AttendanceRecord = {
      ...attendance,
      id: editingAttendance || `attendance-${Date.now()}`,
      totalClasses: total,
      attended,
      percentage: `${Math.min(100, Math.round((attended / total) * 100))}%`,
    };
    const next = editingAttendance ? records.attendance.map((current) => current.id === editingAttendance ? item : current) : [...records.attendance, item];
    await saveRecords({ ...records, attendance: next });
    setAttendance({ ...emptyAttendance });
    setEditingAttendance(null);
  }

  async function deleteAttendance(id: string) {
    if (!records) return;
    await saveRecords({ ...records, attendance: records.attendance.filter((item) => item.id !== id) });
  }

  async function saveSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!records || !schedule.subject || !schedule.time) return;
    const item: ScheduleRecord = { ...schedule, id: editingSchedule || `schedule-${Date.now()}`, course: schedule.course || schedule.subject };
    const next = editingSchedule ? records.schedule.map((current) => current.id === editingSchedule ? item : current) : [...records.schedule, item];
    await saveRecords({ ...records, schedule: next, timetable: next });
    setSchedule({ ...emptySchedule });
    setEditingSchedule(null);
  }

  async function deleteSchedule(id: string) {
    if (!records) return;
    const next = records.schedule.filter((item) => String(item.id) !== id);
    await saveRecords({ ...records, schedule: next, timetable: next });
  }

  async function addSubject() {
    if (!records) return;
    const name = subjectName.trim();
    if (!name) return;
    const value = subjectCode.trim() ? `${name} (${subjectCode.trim()})` : name;
    if ((records.subjects || []).includes(value)) return;
    await saveRecords({ ...records, subjects: [...(records.subjects || []), value] });
    setSubjectName("");
    setSubjectCode("");
  }

  async function deleteSubject(value: string) {
    if (!records) return;
    await saveRecords({ ...records, subjects: (records.subjects || []).filter((subject) => subject !== value) });
  }

  const selectedAccount = accounts.find((account) => account.studentId === selectedId);
  const selectedApplication = applications.find((application) => application.id === selectedId || application.id === selectedAccount?.applicationId);
  const subjects = records?.subjects || [];
  const average = records ? calculateAverage(records.results) : 0;
  const attendancePercentage = records ? calculateAttendance(records.attendance) : 0;

  if (!checkedSession) return <main className="min-h-screen bg-slate-950" />;

  if (!owner) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 p-4 text-white">
        <form onSubmit={handleOwnerLogin} className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600"><GraduationCap /></div>
            <h1 className="mt-4 text-2xl font-black">Visioner Owner Portal</h1>
            <p className="mt-1 text-xs text-slate-400">Manage every student record globally</p>
          </div>
          {loginError && <div className="mb-4 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-300">{loginError}</div>}
          <input className={`${inputClass} mb-3`} value={ownerId} onChange={(event) => setOwnerId(event.target.value)} placeholder="Owner username or email" required />
          <input className={`${inputClass} mb-4`} type="password" value={ownerPassword} onChange={(event) => setOwnerPassword(event.target.value)} placeholder="Password" required />
          <button className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold">Sign In</button>
          <p className="mt-4 text-center text-[11px] text-slate-500">Demo owner: owner / admin123</p>
        </form>
      </main>
    );
  }

  const tabs: Array<[Tab, string, typeof Award]> = [
    ["overview", "Overview", Award],
    ["students", "Students", Users],
    ["assignments", "Assignments", ClipboardList],
    ["academic", "Subjects & Results", BookOpen],
    ["timetable", "Timetable", CalendarDays],
    ["attendance", "Attendance", CheckCircle2],
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600"><GraduationCap size={20} /></div>
            <div><b className="block text-sm">Visioner Virtual Academy</b><span className="text-[10px] text-indigo-400">OWNER PORTAL • GLOBAL DATA</span></div>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold"><LogOut size={14} /> Sign Out</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-7">
        <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between">
          <div><p className="text-[11px] text-slate-500">ACTIVE STUDENT</p><b>{selectedAccount?.studentName || selectedApplication?.studentName || "No student selected"}</b><p className="text-xs text-slate-500">{selectedId || "Select a student from the list"}</p></div>
          <select value={selectedId} onChange={(event) => { const id = event.target.value; setSelectedId(id); if (id) void loadStudent(id, false); }} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm md:w-96">
            <option value="">Select student</option>
            {accounts.map((account) => <option key={account.studentId} value={account.studentId}>{account.studentName} • {account.studentId}</option>)}
            {applications.filter((application) => !accounts.some((account) => account.applicationId === application.id)).map((application) => <option key={application.id} value={application.id}>{application.studentName} • no account</option>)}
          </select>
        </section>

        <nav className="mb-6 flex gap-2 overflow-x-auto">
          {tabs.map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold ${tab === key ? "bg-indigo-600 text-white" : "border border-slate-800 bg-slate-900 text-slate-400"}`}><Icon size={15} />{label}</button>
          ))}
        </nav>

        {!selectedId && <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-sm text-slate-400">Select a student to manage their academic portal.</div>}
        {selectedId && !records && <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-sm text-slate-400">Loading student data...</div>}

        {records && tab === "overview" && <Overview average={average} attendance={attendancePercentage} assignments={assignments} subjects={subjects} />}
        {records && tab === "students" && <StudentsTab applications={applications} accounts={accounts} onGenerate={generateStudentAccount} onOpen={(id) => { setSelectedId(id); void loadStudent(id, false); }} />}
        {records && tab === "assignments" && <AssignmentsTab assignment={assignment} assignments={assignments} onChange={setAssignment} onSubmit={submitAssignment} onEdit={setAssignment} onGrade={gradeAssignment} onDelete={deleteAssignment} />}
        {records && tab === "academic" && <AcademicTab records={records} subjects={subjects} subjectName={subjectName} subjectCode={subjectCode} result={result} editingResult={editingResult} onSubjectName={setSubjectName} onSubjectCode={setSubjectCode} onAddSubject={addSubject} onDeleteSubject={deleteSubject} onResult={setResult} onSubmitResult={saveResult} onEditResult={(item) => { setResult(item); setEditingResult(item.id); }} onDeleteResult={deleteResult} />}
        {records && tab === "timetable" && <TimetableTab records={records} schedule={schedule} editingSchedule={editingSchedule} onSchedule={setSchedule} onSubmit={saveSchedule} onEdit={(item) => { setSchedule(item); setEditingSchedule(String(item.id)); }} onDelete={deleteSchedule} />}
        {records && tab === "attendance" && <AttendanceTab records={records} attendance={attendance} editingAttendance={editingAttendance} onAttendance={setAttendance} onSubmit={saveAttendance} onEdit={(item) => { setAttendance(item); setEditingAttendance(item.id); }} onDelete={deleteAttendance} />}
      </div>

      {message && <div className="fixed bottom-5 right-5 rounded-xl border border-emerald-500/30 bg-emerald-950 px-4 py-3 text-xs text-emerald-300 shadow-xl">{message}</div>}
    </main>
  );
}

function calculateAverage(results: AcademicResult[]) {
  if (!results.length) return 0;
  const values = results.map((result) => Number.parseFloat(String(result.score || "").replace(/[^0-9.]/g, "")) || 0);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function calculateAttendance(records: AttendanceRecord[]) {
  if (!records.length) return 0;
  const total = records.reduce((sum, item) => sum + Number(item.totalClasses || 1), 0);
  const attended = records.reduce((sum, item) => sum + Number(item.attended || 0), 0);
  return total ? Math.round((attended / total) * 100) : 0;
}

function Overview({ average, attendance, assignments, subjects }: { average: number; attendance: number; assignments: Assignment[]; subjects: string[] }) {
  const cards = [["Average Result", `${average}%`, Award], ["Pending Assignments", assignments.filter((item) => item.status === "pending").length, ClipboardList], ["Attendance", `${attendance}%`, CheckCircle2], ["Active Subjects", subjects.length, BookOpen]] as const;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><Icon size={18} className="text-indigo-400" /><p className="mt-4 text-xs text-slate-500">{label}</p><b className="mt-1 block text-2xl">{value}</b></div>)}</div>;
}

function StudentsTab({ applications, accounts, onGenerate, onOpen }: { applications: AdmissionsApplication[]; accounts: StudentAccount[]; onGenerate: (application: AdmissionsApplication) => void; onOpen: (id: string) => void }) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-bold">Student accounts</h2><div className="mt-4 grid gap-3">{applications.map((application) => { const account = accounts.find((item) => item.applicationId === application.id || item.studentId === application.id); return <div key={application.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 md:flex-row md:items-center md:justify-between"><div><b>{application.studentName}</b><p className="text-xs text-slate-500">{application.studentEmail} • {application.id}</p></div>{account ? <button onClick={() => onOpen(account.studentId)} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold">Open Portal Data</button> : <button onClick={() => void onGenerate(application)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold">Generate Account</button>}</div>; })}</div></div>;
}

function AssignmentsTab({ assignment, assignments, onChange, onSubmit, onEdit, onGrade, onDelete }: { assignment: Assignment; assignments: Assignment[]; onChange: (value: Assignment) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onEdit: (value: Assignment) => void; onGrade: (value: Assignment) => void; onDelete: (id: string) => void }) {
  return <div className="grid gap-5 lg:grid-cols-[380px,1fr]"><form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-bold">{assignment.id ? "Edit" : "Create"} assignment</h2><input className={inputClass} value={assignment.title} onChange={(e) => onChange({ ...assignment, title: e.target.value })} placeholder="Assignment title" required /><input className={inputClass} value={assignment.course} onChange={(e) => onChange({ ...assignment, course: e.target.value })} placeholder="Subject / course" required /><input className={inputClass} value={assignment.courseCode || ""} onChange={(e) => onChange({ ...assignment, courseCode: e.target.value })} placeholder="Subject code" /><input className={inputClass} type="date" value={assignment.dueDate} onChange={(e) => onChange({ ...assignment, dueDate: e.target.value })} /><input className={inputClass} value={assignment.score || ""} onChange={(e) => onChange({ ...assignment, score: e.target.value })} placeholder="Marks e.g. 100 pts" /><select className={inputClass} value={assignment.urgency || "normal"} onChange={(e) => onChange({ ...assignment, urgency: e.target.value })}><option value="normal">Normal</option><option value="high">High priority</option></select><textarea className={`${inputClass} min-h-28`} value={assignment.instructions || ""} onChange={(e) => onChange({ ...assignment, instructions: e.target.value })} placeholder="Instructions" /><button className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold"><Save size={14} className="mr-1 inline" />{assignment.id ? "Update" : "Publish"}</button></form><div className="space-y-3">{assignments.map((item) => <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex justify-between gap-3"><div><b>{item.title}</b><p className="mt-1 text-xs text-slate-500">{item.course} • Due {item.dueDate || "—"}</p></div><span className="text-[10px] uppercase text-indigo-300">{item.status}</span></div>{item.instructions && <p className="mt-3 text-xs text-slate-400">{item.instructions}</p>}{item.score && <p className="mt-2 text-xs text-emerald-300">Score: {item.score}{item.feedback ? ` • ${item.feedback}` : ""}</p>}{item.submissionNotes && <p className="mt-2 text-xs text-slate-500">Submission: {item.submissionNotes}</p>}<div className="mt-4 flex flex-wrap gap-2"><button onClick={() => onEdit(item)} className="rounded-lg bg-slate-800 px-3 py-2 text-xs">Edit</button><button onClick={() => void onGrade(item)} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs">Grade</button><button onClick={() => void onDelete(item.id)} className="rounded-lg bg-rose-600/80 px-3 py-2 text-xs">Delete</button></div></div>)}{!assignments.length && <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-sm text-slate-500">No assignments published for this student.</div>}</div></div>;
}

function AcademicTab({ records, subjects, subjectName, subjectCode, result, editingResult, onSubjectName, onSubjectCode, onAddSubject, onDeleteSubject, onResult, onSubmitResult, onEditResult, onDeleteResult }: { records: PortalRecords; subjects: string[]; subjectName: string; subjectCode: string; result: AcademicResult; editingResult: string | null; onSubjectName: (value: string) => void; onSubjectCode: (value: string) => void; onAddSubject: () => void; onDeleteSubject: (value: string) => void; onResult: (value: AcademicResult) => void; onSubmitResult: (event: FormEvent<HTMLFormElement>) => void; onEditResult: (value: AcademicResult) => void; onDeleteResult: (id: string) => void }) {
  return <div className="space-y-5"><section className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-bold">Subjects</h2><div className="mt-3 flex flex-col gap-2 md:flex-row"><input className={inputClass} value={subjectName} onChange={(e) => onSubjectName(e.target.value)} placeholder="Subject name" /><input className={inputClass} value={subjectCode} onChange={(e) => onSubjectCode(e.target.value)} placeholder="Code" /><button type="button" onClick={onAddSubject} className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold"><Plus size={14} className="mr-1 inline" />Add</button></div><div className="mt-4 flex flex-wrap gap-2">{subjects.map((subject) => <span key={subject} className="flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-xs">{subject}<button type="button" onClick={() => void onDeleteSubject(subject)}><Trash2 size={12} /></button></span>)}</div></section><div className="grid gap-5 lg:grid-cols-[380px,1fr]"><form onSubmit={onSubmitResult} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-bold">{editingResult ? "Edit" : "Add"} result</h2><input className={inputClass} value={result.course || ""} onChange={(e) => onResult({ ...result, course: e.target.value, subject: e.target.value })} placeholder="Subject" required /><input className={inputClass} value={result.code || ""} onChange={(e) => onResult({ ...result, code: e.target.value })} placeholder="Subject code" /><input className={inputClass} value={result.score || ""} onChange={(e) => onResult({ ...result, score: e.target.value })} placeholder="Score e.g. 94 / 100" required /><input className={inputClass} value={result.grade || ""} onChange={(e) => onResult({ ...result, grade: e.target.value })} placeholder="Grade e.g. A" /><textarea className={inputClass} value={result.feedback || ""} onChange={(e) => onResult({ ...result, feedback: e.target.value })} placeholder="Feedback" /><button className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold"><Save size={14} className="mr-1 inline" />{editingResult ? "Update result" : "Publish result"}</button></form><div className="space-y-3">{records.results.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4"><div><b>{item.course || item.subject}</b><p className="text-xs text-slate-500">{item.code || ""}{item.feedback ? ` • ${item.feedback}` : ""}</p></div><div className="flex items-center gap-2"><strong className="text-indigo-300">{item.score || item.grade}</strong><button type="button" onClick={() => onEditResult(item)} className="rounded-lg bg-slate-800 p-2"><Save size={13} /></button><button type="button" onClick={() => void onDeleteResult(item.id)} className="rounded-lg bg-rose-600/80 p-2"><Trash2 size={13} /></button></div></div>)}{!records.results.length && <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-sm text-slate-500">No results published yet.</div>}</div></div></div>;
}

function TimetableTab({ records, schedule, editingSchedule, onSchedule, onSubmit, onEdit, onDelete }: { records: PortalRecords; schedule: ScheduleRecord; editingSchedule: string | null; onSchedule: (value: ScheduleRecord) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onEdit: (value: ScheduleRecord) => void; onDelete: (id: string) => void }) {
  return <div className="grid gap-5 lg:grid-cols-[380px,1fr]"><form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-bold">{editingSchedule ? "Edit" : "Add"} timetable class</h2><select className={inputClass} value={schedule.day || "Monday"} onChange={(e) => onSchedule({ ...schedule, day: e.target.value })}>{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => <option key={day}>{day}</option>)}</select><input className={inputClass} value={schedule.time || ""} onChange={(e) => onSchedule({ ...schedule, time: e.target.value })} placeholder="09:00 AM - 10:30 AM" required /><input className={inputClass} value={schedule.subject || ""} onChange={(e) => onSchedule({ ...schedule, subject: e.target.value })} placeholder="Subject" required /><input className={inputClass} value={schedule.teacher || ""} onChange={(e) => onSchedule({ ...schedule, teacher: e.target.value })} placeholder="Teacher" /><input className={inputClass} value={schedule.room || ""} onChange={(e) => onSchedule({ ...schedule, room: e.target.value })} placeholder="Room / online link" /><button className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold"><Save size={14} className="mr-1 inline" />{editingSchedule ? "Update" : "Publish"}</button></form><div className="space-y-3">{records.schedule.map((item) => <div key={String(item.id)} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4"><div><b>{item.day} • {item.time}</b><p className="mt-1 text-xs text-indigo-300">{item.subject || item.course}</p><p className="text-xs text-slate-500">{item.teacher || "Faculty"}{item.room ? ` • ${item.room}` : ""}</p></div><div className="flex gap-2"><button type="button" onClick={() => onEdit(item)} className="rounded-lg bg-slate-800 px-3 py-2 text-xs">Edit</button><button type="button" onClick={() => void onDelete(String(item.id))} className="rounded-lg bg-rose-600/80 px-3 py-2 text-xs">Delete</button></div></div>)}{!records.schedule.length && <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-sm text-slate-500">No timetable classes published yet.</div>}</div></div>;
}

function AttendanceTab({ records, attendance, editingAttendance, onAttendance, onSubmit, onEdit, onDelete }: { records: PortalRecords; attendance: AttendanceRecord; editingAttendance: string | null; onAttendance: (value: AttendanceRecord) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onEdit: (value: AttendanceRecord) => void; onDelete: (id: string) => void }) {
  return <div className="grid gap-5 lg:grid-cols-[380px,1fr]"><form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-bold">{editingAttendance ? "Edit" : "Add"} attendance</h2><input className={inputClass} type="date" value={attendance.date || ""} onChange={(e) => onAttendance({ ...attendance, date: e.target.value })} required /><input className={inputClass} value={attendance.course || ""} onChange={(e) => onAttendance({ ...attendance, course: e.target.value, subject: e.target.value })} placeholder="Subject" required /><select className={inputClass} value={attendance.status || "Present"} onChange={(e) => onAttendance({ ...attendance, status: e.target.value })}><option>Present</option><option>Absent</option><option>Late</option><option>Leave</option></select><div className="grid grid-cols-2 gap-2"><input className={inputClass} type="number" min="1" value={attendance.totalClasses ?? 1} onChange={(e) => onAttendance({ ...attendance, totalClasses: Number(e.target.value) })} placeholder="Total classes" /><input className={inputClass} type="number" min="0" value={attendance.attended ?? 0} onChange={(e) => onAttendance({ ...attendance, attended: Number(e.target.value) })} placeholder="Attended" /></div><button className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold"><Save size={14} className="mr-1 inline" />{editingAttendance ? "Update" : "Save"}</button></form><div className="space-y-3">{records.attendance.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4"><div><b>{item.course || item.subject}</b><p className="text-xs text-slate-500">{item.date} • {item.percentage || `${item.attended || 0}/${item.totalClasses || 0}`}</p></div><div className="flex items-center gap-2"><span className="text-xs text-emerald-300">{item.status}</span><button type="button" onClick={() => onEdit(item)} className="rounded-lg bg-slate-800 p-2"><Save size={13} /></button><button type="button" onClick={() => void onDelete(item.id)} className="rounded-lg bg-rose-600/80 p-2"><Trash2 size={13} /></button></div></div>)}{!records.attendance.length && <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-sm text-slate-500">No attendance records published yet.</div>}</div></div>;
}
