"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, BookOpen, CalendarDays, CheckCircle2, FileText, LogOut, GraduationCap } from "lucide-react";
import { getPortalSession, clearPortalSession } from "@/lib/auth";
import { getStudentPortalData, saveStudentPortalRecords, PortalRecords } from "@/lib/portalData";
import { getStudentAssignments, saveStudentAssignments } from "@/lib/storage";
import { Assignment } from "@/lib/types";

const defaultAssignments: Assignment[] = [];
type Tab = "overview" | "assignments" | "grades" | "timetable" | "attendance";

export default function StudentPortalPage() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [records, setRecords] = useState<PortalRecords | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const session = getPortalSession();
      if (!session || session.role !== "student" || !session.studentId) {
        router.replace("/login");
        return;
      }
      const data = await getStudentPortalData(session.studentId, session);
      const asgs = await getStudentAssignments(session.studentId, defaultAssignments);
      if (cancelled) return;
      setStudent(session);
      setRecords(data);
      setAssignments(asgs);
      setSelected(asgs[0] || null);
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  const signOut = () => { clearPortalSession(); router.replace("/login"); };

  const submitAssignment = async () => {
    if (!student?.studentId || !selected) return;
    const updated = assignments.map((a) => a.id === selected.id ? {
      ...a, status: "submitted", submittedAt: new Date().toISOString(), submissionNotes: notes
    } : a);
    setAssignments(updated);
    setSelected(updated.find((a) => a.id === selected.id) || null);
    await saveStudentAssignments(student.studentId, updated);
    setNotes("");
    setMessage("Assignment submitted successfully.");
  };

  if (!student || !records) return <main className="min-h-screen bg-slate-950 text-white grid place-items-center">Loading portal...</main>;

  const results = records.results || [];
  const attendance = records.attendance || [];
  const pending = assignments.filter((a) => a.status === "pending").length;
  const average = results.length ? Math.round(results.reduce((sum, r) => sum + (Number.parseFloat(String(r.score || "").replace(/[^0-9.]/g, "")) || 0), 0) / results.length) : 0;
  const attendancePct = attendance.length ? Math.round(attendance.filter((a) => String(a.status).toLowerCase() === "present").length / attendance.length * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600"><GraduationCap size={20}/></span><span><b className="block text-sm">Visioner Virtual Academy</b><small className="text-[10px] text-indigo-400">STUDENT PORTAL</small></span></Link>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><b className="block text-xs">{student.name}</b><small className="text-[10px] text-slate-500">{student.studentId}</small></div><button onClick={signOut} className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold"><LogOut size={14}/> Sign Out</button></div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-7 p-4 sm:p-8">
        <section className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 to-indigo-950/30 p-6 sm:p-8"><p className="text-xs font-bold text-indigo-300">LIVE STUDENT ACCOUNT</p><h1 className="mt-2 text-2xl font-black sm:text-3xl">Welcome back, {student.name} 👋</h1><p className="mt-2 text-sm text-slate-400">Your academic portal is connected to your account and synchronized data.</p></section>

        <nav className="flex gap-2 overflow-x-auto pb-1">{([['overview','Overview',Award],['assignments','Assignments',FileText],['grades','Grades',Award],['timetable','Timetable',CalendarDays],['attendance','Attendance',CheckCircle2]] as const).map(([key,label,Icon]) => <button key={key} onClick={() => setTab(key)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold ${tab === key ? 'bg-indigo-600 text-white' : 'border border-slate-800 bg-slate-900 text-slate-400'}`}><Icon size={15}/>{label}{key === 'assignments' && pending > 0 ? ` (${pending})` : ''}</button>)}</nav>

        {tab === "overview" && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Average Performance",`${average}%`,Award],["Pending Homework",String(pending),FileText],["Attendance",`${attendancePct}%`,CheckCircle2],["Active Subjects",String(records.stats?.activeSubjectsCount ?? results.length),BookOpen]].map(([label,value,Icon]: any) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><Icon className="text-indigo-400" size={18}/><p className="mt-4 text-xs text-slate-400">{label}</p><strong className="mt-1 block text-2xl">{value}</strong></div>)}</div>}

        {tab === "assignments" && <div className="grid gap-5 lg:grid-cols-[1fr_380px]"> <div className="space-y-3">{assignments.length === 0 ? <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-sm text-slate-400">No assignments have been published yet.</div> : assignments.map((a) => <button key={a.id} onClick={() => setSelected(a)} className={`w-full rounded-2xl border p-5 text-left ${selected?.id === a.id ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800 bg-slate-900'}`}><div className="flex justify-between gap-4"><div><b className="text-sm">{a.title}</b><p className="mt-1 text-xs text-slate-400">{a.course} • Due {a.dueDate}</p></div><span className="text-[10px] font-bold uppercase text-indigo-300">{a.status}</span></div></button>)}</div>{selected && <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-bold">{selected.title}</h2><p className="mt-3 text-xs leading-6 text-slate-400">{selected.instructions || "Complete the assignment and submit your work."}</p>{selected.status === 'pending' ? <><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Submission notes" className="mt-5 min-h-28 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs outline-none"/><button onClick={submitAssignment} className="mt-3 w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold">Submit Assignment</button></> : <div className="mt-5 rounded-xl bg-slate-950 p-4 text-xs text-emerald-300">Status: {selected.status}{selected.score ? ` • ${selected.score}` : ''}</div>}</div>}</div>}

        {tab === "grades" && <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">{results.map((r) => <div key={r.id} className="flex items-center justify-between border-b border-slate-800 p-5 last:border-0"><div><b className="text-sm">{r.course || r.subject}</b><p className="text-xs text-slate-500">{r.code || ''}</p></div><strong className="text-indigo-300">{r.score || r.grade || '-'}</strong></div>)}</div>}
        {tab === "timetable" && <div className="grid gap-3 md:grid-cols-2">{(records.schedule || []).map((s) => <div key={s.id || `${s.day}-${s.time}`} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><b>{s.day} • {s.time}</b><p className="mt-2 text-sm text-indigo-300">{s.subject || s.course}</p><p className="text-xs text-slate-500">{s.teacher || 'Academy Faculty'}</p></div>)}</div>}
        {tab === "attendance" && <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">{attendance.map((a) => <div key={a.id} className="flex items-center justify-between border-b border-slate-800 p-5 last:border-0"><div><b className="text-sm">{a.course || a.subject}</b><p className="text-xs text-slate-500">{a.date}</p></div><span className="text-xs font-bold text-emerald-300">{a.status}</span></div>)}</div>}
        {message && <div className="fixed bottom-5 right-5 rounded-xl border border-emerald-500/30 bg-emerald-950 px-4 py-3 text-xs text-emerald-300 shadow-xl">{message}</div>}
      </div>
    </main>
  );
}
