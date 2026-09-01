"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Globe,
  Video,
  Clock,
  Award,
  Users,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Play,
  Compass,
  Laptop,
  BarChart3,
  Star,
  Menu,
  X,
  PhoneCall,
  Mail,
  Building,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"larkana" | "sindh" | "sukkur">("larkana");

  return (
    <div className="min-h-screen flex flex-col text-slate-100" style={{background:"#0D1F5C"}}>
      {/* Top Global Alert Banner */}
      <div className="text-xs sm:text-sm font-semibold py-2 px-4 text-center text-[#0D1F5C] flex items-center justify-center gap-2" style={{background:"linear-gradient(90deg,#E8A820,#F5C842,#E8A820)"}}>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D1F5C] opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D1F5C]"></span>
        </span>
        <span>
          <strong>Admissions Open 2026/2027:</strong> Flexible Timezone Scheduling Available for Overseas & Expat Students Worldwide.
        </span>
        <Link
          href="/admissions"
          className="underline underline-offset-2 hover:text-indigo-200 transition-colors font-semibold ml-1 inline-flex items-center gap-0.5"
        >
          Apply Now <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-[#1B3FA0]/40" style={{background:"rgba(13,31,92,0.95)"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#B8CFF5]">
              <Link href="/courses" className="hover:text-white transition-colors hover:text-[#E8A820]">
                Courses
              </Link>
              <Link href="/faculty" className="hover:text-white transition-colors hover:text-[#E8A820]">
                Faculty
              </Link>
              {/* <Link href="/tuition" className="hover:text-white transition-colors hover:text-[#E8A820]">
                Tuition & Aid
              </Link> */}
              <Link href="/about" className="hover:text-white transition-colors hover:text-[#E8A820]">
                About Academy
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors hover:text-[#E8A820]">
                Contact
              </Link>
              <Link href="/admissions" className="hover:text-white transition-colors hover:text-[#E8A820]">
                Admissions
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-bold text-white border transition-all flex items-center gap-2"
                style={{background:"rgba(27,63,160,0.5)", borderColor:"rgba(74,144,217,0.4)"}}
              >
                <Laptop className="w-4 h-4" style={{color:"#E8A820"}} />
                Sign In
              </Link>
              <Link
                href="/admissions"
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#0D1F5C] transition-all flex items-center gap-2 shadow-lg"
                style={{background:"linear-gradient(135deg,#E8A820,#F5C842)"}}
              >
                Enroll Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white border border-[#1B3FA0]/60"
              style={{background:"rgba(27,63,160,0.4)"}}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1B3FA0]/40 px-4 pt-3 pb-6 space-y-2" style={{background:"rgba(13,31,92,0.98)"}}>
            {[
              {href:"/courses", label:"Academic Courses"},
              {href:"/faculty", label:"Faculty Directory"},
              {href:"/tuition", label:"Tuition Calculator"},
              {href:"/about", label:"About Academy"},
              {href:"/contact", label:"Global Helpdesk"},
              {href:"/admissions", label:"Admissions Portal"},
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-[#B8CFF5] hover:text-white hover:bg-[#1B3FA0]/40 transition-all"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#1B3FA0]/30 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-center rounded-xl text-sm font-bold text-white border border-[#4A90D9]/40"
                style={{background:"rgba(27,63,160,0.5)"}}
              >
                Sign In
              </Link>
              <Link
                href="/admissions"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-center rounded-xl text-sm font-bold"
                style={{background:"linear-gradient(135deg,#E8A820,#F5C842)", color:"#0D1F5C"}}
              >
                Enroll Now
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-162.5 h-162.5 rounded-full blur-3xl pointer-events-none -z-10" style={{background:"rgba(27,63,160,0.25)"}} />
        <div className="absolute top-1/3 right-10 w-100 h-100 rounded-full blur-3xl pointer-events-none -z-10" style={{background:"rgba(74,144,217,0.12)"}} />
        <div className="absolute -bottom-10 left-10 w-87.5 h-87.5 rounded-full blur-3xl pointer-events-none -z-10" style={{background:"rgba(232,168,32,0.08)"}} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border" style={{background:"rgba(27,63,160,0.3)", borderColor:"rgba(74,144,217,0.4)", color:"#7BA7E8"}}>
                <Sparkles className="w-4 h-4" style={{color:"#E8A820"}} />
                <span>School programs for Larkana, Sindh &amp; Ziauddin Boards</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                World-Class Education,{" "}
                <span style={{background:"linear-gradient(135deg,#4A90D9,#E8A820)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text"}}>
                  Borderless Future.
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed" style={{color:"#B8CFF5"}}>
                Visioner Virtual Academy provides interactive live virtual classrooms,{" "}
                tailored timezone scheduling, and globally accredited curriculum for overseas,{" "}
                expat, and ambitious students worldwide.
              </p>

              {/* Call to actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/admissions"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 group transition-all shadow-xl"
                  style={{background:"linear-gradient(135deg,#E8A820,#F5C842)", color:"#0D1F5C"}}
                >
                  <span>Start Enrollment Application</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust Micro-Bullets */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm" style={{color:"#7BA7E8"}}>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" style={{color:"#E8A820"}} />
                  <span>Live 1-on-1 &amp; Small Classes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" style={{color:"#E8A820"}} />
                  <span>Recorded lectures</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Sessions</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Academic Pathway */}
            <div className="lg:col-span-5 relative">
              <div className="overflow-hidden rounded-2xl border border-indigo-500/40 bg-slate-950 shadow-2xl shadow-indigo-950/70">
                <div className="relative h-56 overflow-hidden bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/35 to-slate-900/10" />
                  <div className="relative z-10 flex h-full flex-col justify-between p-5">
                    <span className="w-fit rounded-full border border-white/20 bg-slate-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">Choose your board</span>
                    <div><p className="text-xs text-indigo-200">Explore by goal</p><h2 className="mt-1 text-2xl font-extrabold text-white">Build a future that travels.</h2></div>
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
                    {[{ key: "larkana", label: "Larkana" }, { key: "sindh", label: "Sindh" }, { key: "ziauddin", label: "Ziauddin" }].map((item) => <button key={item.key} onClick={() => setActivePreviewTab(item.key as "larkana" | "sindh" | "sukkur")} className={`rounded-lg py-2 font-semibold ${activePreviewTab === item.key ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>{item.label}</button>)}
                  </div>
                  <div className="min-h-28"><p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{activePreviewTab === "larkana" ? "Larkana Board" : activePreviewTab === "sindh" ? "Sindh Board" : "Ziauddin Board"}</p><h3 className="mt-2 text-lg font-bold text-white">{activePreviewTab === "larkana" ? "Larkana Board program" : activePreviewTab === "sindh" ? "Sindh Board program" : "Ziauddin Board program"}</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">{activePreviewTab === "larkana" ? "Follow your local board syllabus with clear lessons, regular assessment, and teacher guidance." : activePreviewTab === "sindh" ? "Study the Sindh Board curriculum with structured subject support and progress tracking." : "Prepare for Ziauddin Board examinations through focused teaching, practice, and feedback."}</p></div>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-4"><span className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Personalized study plan</span><Link href="/admissions" className="flex items-center gap-1 text-xs font-bold text-indigo-300 hover:text-white">Get Admission <ArrowRight className="h-3.5 w-3.5" /></Link></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS & CREDENTIALS BANNER */}
      <section className="border-y border-slate-800 bg-slate-950/60 py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                99%
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-400">Academic Improvement</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                100%
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-400">Parent Satisfaction</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                100%
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-400">Certified Expert Faculty</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                12:1
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-400">Average Student-Teacher Ratio</p>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM PATHWAYS */}
      <section id="pathways" className="py-20 bg-slate-900/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Local Board Programs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Choose Your Board Program
            </h2>
            <p className="text-slate-300 text-base">
              Students can choose the board program that matches their school pathway and examination goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Larkana Board */}
            <div className="bg-slate-950/70 rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/40 transition-all group hover:-translate-y-1 duration-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Larkana Board</h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                A structured program following the Larkana Board syllabus across core school subjects.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Board-aligned subject lessons</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Regular tests and revision</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Progress records for families</span>
                </li>
              </ul>
              <Link
                href="/admissions?track=larkana-board"
                className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1"
              >
                Learn more & apply <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Sindh Board */}
            <div className="bg-slate-950/70 rounded-2xl p-6 border border-slate-800 hover:border-purple-500/40 transition-all group hover:-translate-y-1 duration-200">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sindh Board</h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                A focused online school program built around the Sindh Board curriculum and examination pattern.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Complete board syllabus support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Teacher feedback and practice</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Clear attendance and results</span>
                </li>
              </ul>
              <Link
                href="/admissions?track=sindh-board"
                className="text-xs font-semibold text-purple-400 group-hover:text-purple-300 flex items-center gap-1"
              >
                Learn more & apply <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Sukkur Board */}
            <div className="bg-slate-950/70 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all group hover:-translate-y-1 duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ziauddin Board</h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                A practical board-aligned learning plan for students preparing through the Ziauddin Board.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Subject-wise preparation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Assignments and revision plans</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Individual progress monitoring</span>
                </li>
              </ul>
              <Link
                href="/admissions?track=sukkur-board"
                className="text-xs font-semibold text-blue-400 group-hover:text-blue-300 flex items-center gap-1"
              >
                Learn more & apply <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES GRID - 6 PILLARS */}
      <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why Choose Visioner Academy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Engineered for Overseas & Modern Learners
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Combining cutting-edge digital learning platforms with passionate master educators to deliver an unmatched educational experience anywhere in the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/80 rounded-2xl p-7 border border-slate-800 hover:border-indigo-500/50 transition-all relative group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2.5">Live Interactive Seminars</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Not boring pre-recorded videos. Experience live interactive lectures with breakout discussions, real-time quizzes, and collaborative digital labs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/80 rounded-2xl p-7 border border-slate-800 hover:border-purple-500/50 transition-all relative group">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2.5">Global Timezone Flexibility</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We operate multiple cohort schedules across EMEA, APAC, and the Americas. Never attend classes at 2:00 AM again.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/80 rounded-2xl p-7 border border-slate-800 hover:border-blue-500/50 transition-all relative group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2.5">1-on-1 Academic Mentors</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Each student is paired with a dedicated academic advisor for weekly check-ins, study pacing, and tailored university portfolio guidance.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/80 rounded-2xl p-7 border border-slate-800 hover:border-emerald-500/50 transition-all relative group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2.5">Fully Accredited Transcripts</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Official transcripts and diplomas recognized globally by UCAS, Common App, and universities worldwide.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/80 rounded-2xl p-7 border border-slate-800 hover:border-amber-500/50 transition-all relative group">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2.5">Real-Time Parent Portal</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Parents get transparent live dashboards tracking attendance, quiz scores, assignment deadlines, and tutor feedback remarks.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/80 rounded-2xl p-7 border border-slate-800 hover:border-pink-500/50 transition-all relative group">
              <div className="w-12 h-12 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center mb-5 group-hover:bg-pink-600 group-hover:text-white transition-all">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2.5">Global Student Community</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Join Model UN, competitive coding clubs, virtual science fairs, and connect with peers across 45+ international hubs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS FROM OVERSEAS FAMILIES */}
      <section id="testimonials" className="py-20 bg-slate-900/50 relative border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-white">Trusted by International Families</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Hear from students and parents thriving in our global virtual community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  &ldquo;Relocating frequently made traditional schooling difficult. Visioner Academy provided uninterrupted board-aligned learning with exceptional teacher support.&rdquo;
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-sm">
                  TA
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Tariq Al-Mansoor</h4>
                  <p className="text-xs text-slate-400">Parent • UAE (Grade 11)</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  &ldquo;We are very satisfied with the learning experience at Visioner Virtual Academy. The teachers are supportive, interactive, and explain concepts clearly. Our child has become more confident and engaged in studies since joining the academy.&rdquo;
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300 text-sm">
                  RK
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Rabia Khan</h4>
                  <p className="text-xs text-slate-400">Parent • Qatar (Class 6)</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  &ldquo;Visioner Virtual Academy has provided an excellent online learning environment. The teachers are knowledgeable and attentive, and the interactive classes help our child understand difficult concepts easily. We are happy with the academic progress and overall experience.&rdquo;
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-sm">
                  SL
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Ejaz Ahmed</h4>
                  <p className="text-xs text-slate-400">Parent • Bahrain (Grade 9)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-linear-to-r from-indigo-950 via-slate-900 to-purple-950 border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Begin Your International Learning Journey Today
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Applications for overseas and expat students are processed year-round. Complete the quick enrollment application to connect with an admissions counselor.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/admissions"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Submit Enrollment Form</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <span>Open Student Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Academy Branding */}
            <div className="lg:col-span-2 space-y-4">
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
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Helping students succeed through Larkana Board, Sindh Board, and Ziauddin Board programs with flexible learning and dedicated teachers.
              </p>
              <div className="flex items-center gap-3 text-slate-400 text-xs pt-2">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  Pakistan
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Academic Programs</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/admissions?track=larkana-board" className="hover:text-indigo-400 transition-colors">Larkana Board</Link></li>
                <li><Link href="/admissions?track=sindh-board" className="hover:text-indigo-400 transition-colors">Sindh Board</Link></li>
                <li><Link href="/admissions?track=sukkur-board" className="hover:text-indigo-400 transition-colors">Ziauddin Board</Link></li>
                <li><Link href="/courses?track=middle-foundation" className="hover:text-indigo-400 transition-colors">Middle & Foundation Years</Link></li>
                <li><Link href="/faculty" className="hover:text-indigo-400 transition-colors">Faculty Directory</Link></li>
              </ul>
            </div>

            {/* Student & Admissions */}  
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Portals & Support</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/admissions" className="hover:text-indigo-400 transition-colors">Admissions Portal</Link></li>
                <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Student Dashboard</Link></li>
                {/* <li><Link href="/parent" className="hover:text-indigo-400 transition-colors">Parent Portal</Link></li> */}
                {/* <li><Link href="/tuition" className="hover:text-indigo-400 transition-colors">Tuition & Scholarships</Link></li> */}
                <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About the Academy</Link></li>
              </ul>
            </div>

            {/* Contact & Help */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Admissions Desk</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2 text-slate-400">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <Link href="/contact" className="hover:text-indigo-300 transition-colors">visionervirtualacademy@gmail.com</Link>
                </div>
                <div className="flex items-start gap-2 text-slate-400">
                  <PhoneCall className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>+923173349556</span>
                </div>
                <div className="flex items-start gap-2 text-slate-400">
                  <Building className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Global Registrar Services, Mon–Sat</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Visioner Virtual Academy. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-400">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400">Terms of Enrollment</a>
              <a href="#" className="hover:text-slate-400">Accreditation Details</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

