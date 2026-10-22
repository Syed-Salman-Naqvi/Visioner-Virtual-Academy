"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, BookOpen, CalendarDays, CheckCircle2, ClipboardList, Copy, FileText, GraduationCap, LogOut, RefreshCw, Upload, X } from "lucide-react";
import { getPortalSession, clearPortalSession } from "@/lib/auth";
import { getStudentPortalData, saveStudentPortalRecords, PortalRecords } from "@/lib/portalData";
import { getStudentAssignments, saveStudentAssignments } from "@/lib/storage";
import { Assignment } from "@/lib/types";
import { saveAssignmentSubmission } from "@/lib/portalData";
import { supabase } from "@/lib/supabase";

type Tab = "overview" | "subjects" | "assignments" | "grades" | "timetable" | "attendance";
const defaultAssignments: Assignment[] = [];

export default function StudentPortalPage() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null); const [records, setRecords] = useState<PortalRecords | null>(null); const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tab, setTab] = useState<Tab>("overview"); const [selected, setSelected] = useState<Assignment | null>(null); const [notes, setNotes] = useState(""); const [message, setMessage] = useState(""); const [refreshing, setRefreshing] = useState(false); const [selectedFile, setSelectedFile] = useState<File | null>(null); const [submitting, setSubmitting] = useState(false);

  const load = async (silent = false) => {
    const session = getPortalSession();
    if (!session || session.role !== "student" || !session.studentId) { router.replace("/login"); return; }
    if (!silent) setRefreshing(true);
    const [data, asgs] = await Promise.all([getStudentPortalData(session.studentId, session), getStudentAssignments(session.studentId, defaultAssignments)]);
    setStudent(session); setRecords(data); setAssignments(asgs); setSelected(current => current && asgs.some(a => a.id === current.id) ? asgs.find(a => a.id === current.id) || null : asgs[0] || null); setRefreshing(false);
  };

  useEffect(() => { load(); const timer = window.setInterval(() => load(true), 5000); return () => window.clearInterval(timer); }, []);
  const signOut = () => { clearPortalSession(); router.replace("/login"); };

  const chooseSubmissionFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && file.size > 20 * 1024 * 1024) { setMessage("Please choose a file smaller than 20 MB."); event.target.value = ""; return; }
    if (file && !/\.(pdf|docx|zip|png|jpe?g|webp|txt)$/i.test(file.name)) { setMessage("Allowed formats: PDF, DOCX, ZIP, images, and TXT."); event.target.value = ""; return; }
    setSelectedFile(file);
  };

  const submitAssignment = async () => {
    if (!student?.studentId || !selected || submitting) return;
    setSubmitting(true);
    let storagePath: string | null = null;
    try {
      let fileUrl: string | null = null;
      if (selectedFile) {
        const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        storagePath = `${student.studentId}/${selected.id}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from("assignment-submissions").upload(storagePath, selectedFile, { upsert: false, contentType: selectedFile.type || "application/octet-stream" });
        if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`);
        fileUrl = storagePath;
      }
      await saveAssignmentSubmission({
        assignment_id: selected.id, student_id: student.studentId, student_name: student.name || "Student",
        submission_notes: notes.trim(), file_url: fileUrl, file_name: selectedFile?.name || null, storage_path: storagePath
      });
      const updated = assignments.map(a => a.id === selected.id ? { ...a, status: "submitted", submittedAt: new Date().toISOString(), submissionNotes: notes, attachedFileName: selectedFile?.name || "" } : a);
      await saveStudentAssignments(student.studentId, updated);
      setAssignments(updated); setSelected(updated.find(a => a.id === selected.id) || null);
      setNotes(""); setSelectedFile(null); setMessage("Assignment submitted successfully.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Submission could not be saved."); }
    finally { setSubmitting(false); }
  };

  if (!student || !records) return <main className="min-h-screen bg-slate-950 text-white grid place-items-center">Loading portal...</main>;
  const results = records.results || []; const attendance = records.attendance || []; const pending = assignments.filter(a => a.status === "pending").length;
  const average = results.length ? Math.round(results.reduce((sum, r) => sum + (Number.parseFloat(String(r.score || "").replace(/[^0-9.]/g, "")) || 0), 0) / results.length) : 0;
  const attendancePct = attendance.length ? Math.round(attendance.filter(a => String(a.status).toLowerCase() === "present").length / attendance.length * 100) : 0;
  const subjects = records.subjects || [];
  const nav: [Tab,string,any][] = [["overview","Overview",Award],["subjects","Subjects",BookOpen],["assignments","Assignments",ClipboardList],["grades","Grades",Award],["timetable","Timetable",CalendarDays],["attendance","Attendance",CheckCircle2]];

  return <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100"><header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600"><GraduationCap size={20}/></span><span><b className="block text-sm">Visioner Virtual Academy</b><small className="text-[10px] text-indigo-400">STUDENT PORTAL • LIVE CLOUD DATA</small></span></Link><div className="flex items-center gap-3"><button onClick={()=>load()} className="rounded-lg bg-slate-800 p-2" title="Refresh"><RefreshCw size={14} className={refreshing?"animate-spin":""}/></button><div className="hidden text-right sm:block"><b className="block text-xs">{student.name}</b><small className="text-[10px] text-slate-500">{student.studentId}</small></div><button onClick={signOut} className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold"><LogOut size={14}/> Sign Out</button></div></div></header>
  <div className="mx-auto w-full max-w-7xl space-y-6 overflow-hidden p-4 sm:p-8"><section className="max-w-full overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 to-indigo-950/30 p-6 sm:p-8"><p className="text-xs font-bold text-indigo-300">LIVE STUDENT ACCOUNT</p><h1 className="mt-2 max-w-full break-words break-all text-2xl font-black sm:text-3xl">Welcome back, {student.name} 👋</h1><p className="mt-2 text-sm text-slate-400">All academic data below is loaded from the same Supabase records managed by the Owner Portal.</p></section>
  <nav className="flex gap-2 overflow-x-auto pb-1">{nav.map(([key,label,Icon])=><button key={key} onClick={()=>setTab(key)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold ${tab===key?"bg-indigo-600 text-white":"border border-slate-800 bg-slate-900 text-slate-400"}`}><Icon size={15}/>{label}{key==="assignments"&&pending>0?` (${pending})`:""}</button>)}</nav>
  {tab==="overview"&&<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Average Performance",`${average}%`,Award],["Pending Homework",pending,ClipboardList],["Attendance",`${attendancePct}%`,CheckCircle2],["Active Subjects",subjects.length,BookOpen]].map(([label,value,Icon]:any)=><div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><Icon className="text-indigo-400" size={18}/><p className="mt-4 text-xs text-slate-400">{label}</p><strong className="mt-1 block text-2xl">{value}</strong></div>)}</div>}
  {tab==="subjects"&&<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{subjects.length?subjects.map(s=><div key={s} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><BookOpen className="text-indigo-400" size={18}/><b className="mt-4 block">{s}</b></div>):<div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-sm text-slate-400">No subjects have been assigned yet.</div>}</div>}
  {tab==="assignments"&&<div className="grid w-full max-w-full min-w-0 gap-5 overflow-hidden lg:grid-cols-[minmax(0,1fr),minmax(0,380px)]"><div className="min-w-0 max-w-full space-y-3">{assignments.length===0?<div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-sm text-slate-400">No assignments have been published yet.</div>:assignments.map(a=><button key={a.id} onClick={()=>setSelected(a)} className={`w-full max-w-full min-w-0 select-text overflow-hidden break-words break-all rounded-2xl border p-5 text-left ${selected?.id===a.id?"border-indigo-500 bg-indigo-950/20":"border-slate-800 bg-slate-900"}`}><div className="flex min-w-0 max-w-full justify-between gap-3"><div className="min-w-0 max-w-full"><b className="block max-w-full break-words break-all whitespace-pre-wrap text-sm">{a.title}</b><p className="mt-1 max-w-full break-words break-all whitespace-pre-wrap text-xs text-slate-400">{a.course} • Due {a.dueDate||"—"}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${String(a.status).toLowerCase()==="graded"?"bg-emerald-500/10 text-emerald-300":String(a.status).toLowerCase()==="submitted"?"bg-sky-500/10 text-sky-300":"bg-amber-500/10 text-amber-300"}`}>{String(a.status).toLowerCase()==="graded"?"Graded":String(a.status).toLowerCase()==="submitted"?"Submitted":"Pending"}</span></div></button>)}</div>{selected&&<div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="max-w-full break-words break-all whitespace-pre-wrap text-lg font-bold">{selected.title}</h2><p className="mt-1 max-w-full break-words break-all whitespace-pre-wrap text-xs text-slate-400">{selected.course} • Due {selected.dueDate || "—"}</p><p className="mt-3 max-w-full select-text whitespace-pre-wrap break-words break-all text-sm leading-7 text-slate-200">{selected.instructions||"Complete the assignment and submit your work."}</p><button onClick={() => { void navigator.clipboard?.writeText(`${selected.title}\n${selected.course}\n\n${selected.instructions || "Complete the assignment and submit your work."}`); setMessage("Assignment details copied."); }} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold"><Copy size={13}/>Copy Assignment Details</button>{selected.feedback&&<div className="mt-4 rounded-xl bg-slate-950 p-3 text-xs text-emerald-300">Feedback: {selected.feedback}</div>}{String(selected.status).toLowerCase()!=="graded"&&String(selected.status).toLowerCase()!=="submitted"?<><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Submission notes" className="mt-5 min-h-28 w-full max-w-full break-words whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm outline-none" /><div className="mt-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/70 p-4"><label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-3 text-sm font-bold hover:bg-slate-700"><Upload size={16}/>Upload Attachment<input type="file" accept=".pdf,.docx,.zip,.png,.jpg,.jpeg,.webp,.txt" className="sr-only" onChange={chooseSubmissionFile}/></label><p className="mt-2 text-center text-xs text-slate-500">PDF, DOCX, ZIP, images or TXT · Max 20 MB</p>{selectedFile&&<div className="mt-3 flex min-w-0 items-center gap-3 rounded-lg bg-slate-900 p-3"><FileText size={18} className="shrink-0 text-indigo-300"/><span className="min-w-0 flex-1 break-words break-all text-xs">{selectedFile.name}</span><button type="button" onClick={()=>setSelectedFile(null)} aria-label="Remove attachment" className="shrink-0 rounded-lg p-2 text-rose-300 hover:bg-rose-950"><X size={15}/></button></div>}</div><button onClick={submitAssignment} disabled={submitting} className="mt-3 w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold disabled:opacity-60">{submitting?"Submitting…":"Submit Assignment"}</button></>:<div className="mt-5 max-w-full break-words break-all whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm text-emerald-300">Status: {selected.status}{selected.score?` • ${selected.score}`:""}{selected.attachedFileName?` • Attachment: ${selected.attachedFileName}`:""}</div>}</div>}</div>}
  {tab==="grades"&&<div className="space-y-3">{results.length?results.map(r=><div key={r.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5"><div><b>{r.course||r.subject}</b><p className="text-xs text-slate-500">{r.code||""}{r.feedback?` • ${r.feedback}`:""}</p></div><strong className="text-indigo-300">{r.score||r.grade||"-"}</strong></div>):<div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-sm text-slate-400">No results have been published yet.</div>}</div>}
  {tab==="timetable"&&<div className="grid gap-3 md:grid-cols-2">{records.schedule?.length?records.schedule.map(s=><div key={s.id||`${s.day}-${s.time}`} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><b>{s.day} • {s.time}</b><p className="mt-2 text-sm text-indigo-300">{s.subject||s.course}</p><p className="text-xs text-slate-500">{s.teacher||"Academy Faculty"}{s.room?` • ${s.room}`:""}</p></div>):<div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-sm text-slate-400">No timetable has been published yet.</div>}</div>}
  {tab==="attendance"&&<div className="space-y-3">{attendance.length?attendance.map(a=><div key={a.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5"><div><b>{a.course||a.subject}</b><p className="text-xs text-slate-500">{a.date} • {a.percentage||`${a.attended||0}/${a.totalClasses||0}`}</p></div><span className={`text-xs font-bold ${String(a.status).toLowerCase()==="present"?"text-emerald-300":"text-rose-300"}`}>{a.status}</span></div>):<div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-sm text-slate-400">No attendance records have been published yet.</div>}</div>}
  {message&&<div className="fixed bottom-5 right-5 rounded-xl border border-emerald-500/30 bg-emerald-950 px-4 py-3 text-xs text-emerald-300 shadow-xl">{message}</div>}
  </div></main>;
}
