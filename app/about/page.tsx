"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Globe,
  ShieldCheck,
  Award,
  Building,
  ArrowRight,
  ArrowLeft,
  Compass,
  Laptop,
} from "lucide-react";

export default function AboutPage() {
  const leadership = [
    {
      name: "Dr. Arthur Pendelton",
      role: "Chancellor & Founder",
      background: "Former Dean of International Studies, Oxford University",
      bio: "Pioneering borders-free global online education with rigorous British & American standards.",
    },
    {
      name: "Ms. Rebecca Vance",
      role: "Dean of Global Admissions",
      background: "M.A. International Education Policy, Harvard",
      bio: "Dedicated to providing expat and overseas families with seamless academic continuity.",
    },
    {
      name: "Dr. Sarah Jenkins",
      role: "Head of Sciences & Curriculum",
      background: "Ph.D. High Energy Physics, University of Oxford",
      bio: "Architect of our interactive virtual science labs and Cambridge A-Level acceleration.",
    },
  ];

  const examHubs = [
    { city: "London & Cambridge", region: "United Kingdom", count: "18+ Centers" },
    { city: "Dubai & Abu Dhabi", region: "United Arab Emirates", count: "12+ Centers" },
    { city: "Singapore", region: "Southeast Asia", count: "8+ Centers" },
    { city: "Riyadh & Jeddah", region: "Saudi Arabia", count: "10+ Centers" },
    { city: "New York & Boston", region: "North America", count: "25+ Centers" },
    { city: "Munich & Frankfurt", region: "Germany", count: "6+ Centers" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
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
                  About the Academy
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

      {/* Hero */}
      <section className="bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Our Mission & Global Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Pioneering High-Achieving, Borderless Online Education
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Visioner Virtual Academy is committed to transforming education beyond geographical boundaries, providing international and overseas students with flexible, engaging, and high-quality online learning through live virtual classes, dedicated teachers, and personalised academic support.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-16">
        {/* Accreditations Banner */}
        <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">Academic Standards & Recognition</h2>
            <p className="text-xs text-slate-400">
              Our programmes follow recognised national curriculum standards, supporting students’ academic development and future educational pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">National Curriculum</h3>
                <p className="text-xs text-slate-400">
                  High-quality education aligned with recognised national academic standards, focusing on strong concepts, academic growth, and future opportunities.
                </p>
              </div>
              {/* <span className="text-[11px] font-semibold text-indigo-400 mt-4 block">Center Code #UK-9842</span> */}
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Sindh & Ziauddin Board</h3>
                <p className="text-xs text-slate-400">
                  Quality education aligned with Sindh and Ziauddin Board curriculum standards, focusing on strong concepts, academic excellence, and students’ future educational opportunities.
                </p>
              </div>
              {/* <span className="text-[11px] font-semibold text-purple-400 mt-4 block">College Board Code #8831</span> */}
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Hyderabad Board</h3>
                <p className="text-xs text-slate-400">
                  Quality education aligned with Hyderabad Board curriculum standards, focusing on strong concepts, academic excellence, and students’ future educational opportunities.
                </p>
              </div>
              {/* <span className="text-[11px] font-semibold text-emerald-400 mt-4 block">Fully Verified</span> */}
            </div>
          </div>
        </div>

        {/* Global Exam Centers Network */}
        {/* <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Building className="w-6 h-6 text-indigo-400" />
                Global Exam Center Network (140+ Countries)
              </h2>
              <p className="text-xs text-slate-400">
                Students sit for official Cambridge and AP written papers at verified examination centers near their residence.
              </p>
            </div>
            <Link
              href="/contact"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Find local center <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {examHubs.map((hub, i) => (
              <div key={i} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{hub.city}</h4>
                  <span className="text-xs text-slate-400">{hub.region}</span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-slate-950 text-indigo-300 text-xs font-mono font-semibold border border-slate-800">
                  {hub.count}
                </span>
              </div>
            ))}
          </div>
        </div> */}

        {/* Leadership Team */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">Visioner Virtual Academy Tuitions</h2>
            <p className="text-xs text-slate-400">
              Providing high-quality online tuition and academic support to students across Pakistan and around the world.
            </p>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((l, idx) => (
              <div key={idx} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-base">
                  {l.name.split(" ")[1]?.[0] || "A"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{l.name}</h3>
                  <p className="text-xs text-indigo-400 font-medium">{l.role}</p>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{l.background}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                  {l.bio}
                </p>
              </div>
            ))}
          </div> */}
        </div>
      </main>
    </div>
  );
}


