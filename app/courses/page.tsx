"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Download,
  X,
  Laptop,
} from "lucide-react";
import { MOCK_COURSES } from "@/lib/mockData";
import { Course, AcademicTrack } from "@/lib/types";

export default function CoursesPage() {
  const [selectedTrack, setSelectedTrack] = useState<AcademicTrack>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesTrack = selectedTrack === "all" || course.track === selectedTrack;
    const matchesDepartment = selectedDepartment === "all" || course.department === selectedDepartment;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesDepartment && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white">
                  Visioner <span className="text-indigo-400">Academy</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  Curriculum & Course Catalog
                </span>
              </div>
            </Link> */}

              <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Visioner Virtual Academy Logo"
                className="h-30 w-auto object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-white leading-tight">
                  Visioner <span style={{color:"#E8A820"}}>Academy</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest" style={{color:"#7BA7E8"}}>
                  Global Virtual Campus
                </span>
              </div>
            </Link>



            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-bold text-white border transition-all flex items-center gap-2"
                style={{background:"rgba(27,63,160,0.5)", borderColor:"rgba(74,144,217,0.4)"}}
              >
                <Laptop className="w-4 h-4" style={{color:"#E8A820"}} />
                Student Portal
              </Link>
             <Link
               href="/admissions"
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#0D1F5C] transition-all flex items-center gap-2 shadow-lg"
                style={{background:"linear-gradient(135deg,#E8A820,#F5C842)"}}
              >
                Apply for Admission <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Accredited Global Curriculum 2026/2027</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Academic Course Catalog
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Explore globally accredited Cambridge IGCSE, Cambridge International A-Levels, Advanced Placement (AP), and STEM courses taught live by master educators.
          </p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by course name, code (e.g. 9702, AP-CALC), or instructor..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Department Filter */}
            <div className="md:col-span-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="all">All Academic Departments</option>
                <option value="Sciences">Sciences (Physics, Chem, Bio)</option>
                <option value="Mathematics">Mathematics & Mechanics</option>
                <option value="Computer Science">Computer Science & AI</option>
                <option value="Humanities">Humanities & Languages</option>
              </select>
            </div>
          </div>

          {/* Track Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-medium mr-2">Filter by Track:</span>
            {[
              { key: "all", label: "All Curricula" },
              { key: "cambridge-a-levels", label: "Cambridge A-Levels" },
              { key: "advanced-placement", label: "Advanced Placement (AP)" },
              { key: "cambridge-igcse", label: "Cambridge IGCSE" },
              { key: "stem-accelerator", label: "STEM & AI Accelerator" },
              { key: "middle-foundation", label: "Middle School" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTrack(tab.key as AcademicTrack)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedTrack === tab.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing <strong>{filteredCourses.length}</strong> available course offerings</span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTrack("all");
                setSelectedDepartment("all");
              }}
              className="text-indigo-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-slate-900/70 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between p-6 group hover:-translate-y-1 duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-indigo-300 font-mono text-xs font-semibold border border-slate-700">
                    {course.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium">
                    {course.trackLabel}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Course Metadata */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{course.instructor}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.weeklyHours}h/week</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {course.gradeLevel}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-5 mt-4 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setActiveCourseModal(course)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors border border-slate-700"
                >
                  View Syllabus & Details
                </button>
                <Link
                  href={`/admissions?track=${course.track}&course=${course.code}`}
                  className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center transition-colors shadow-sm"
                  title="Enroll Now"
                >
                  Enroll <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* COURSE DETAIL MODAL */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                  {activeCourseModal.code}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {activeCourseModal.trackLabel}
                </span>
              </div>
              <button
                onClick={() => setActiveCourseModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {activeCourseModal.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeCourseModal.description}
                </p>
              </div>

              {/* Instructor & Hours Banner */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Lead Faculty</span>
                  <span className="font-semibold text-white">{activeCourseModal.instructor}</span>
                  <span className="text-[10px] text-indigo-400 block">{activeCourseModal.instructorTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Schedule Pacing</span>
                  <span className="font-semibold text-white">{activeCourseModal.weeklyHours} Live Hours / Week</span>
                  <span className="text-[10px] text-slate-400 block">+ 1-on-1 Office Hours</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Official Exam Code</span>
                  <span className="font-semibold text-indigo-300">{activeCourseModal.examCode || "Academic Credit"}</span>
                </div>
              </div>

              {/* Syllabus Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Key Modules & Syllabus Breakdown
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {activeCourseModal.syllabus.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites */}
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold">Recommended Prerequisites: </span>
                <span className="text-slate-300">{activeCourseModal.prerequisites}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  alert(`Downloading complete syllabus PDF for ${activeCourseModal.title}...`);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Syllabus PDF
              </button>

              <Link
                href={`/admissions?track=${activeCourseModal.track}&course=${activeCourseModal.code}`}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
              >
                Proceed to Course Enrollment <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


