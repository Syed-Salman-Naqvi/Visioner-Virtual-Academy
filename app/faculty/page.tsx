"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
  X,
  Laptop,
} from "lucide-react";
import { MOCK_FACULTY } from "@/lib/mockData";
import { FacultyMember } from "@/lib/types";

export default function FacultyPage() {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingModalFaculty, setBookingModalFaculty] = useState<FacultyMember | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    parentName: "",
    email: "",
    preferredDate: "2026-09-01",
    preferredTime: "16:00 GST",
    studentGrade: "Grade 11",
    notes: "",
  });

  const filteredFaculty = MOCK_FACULTY.filter((f) => {
    const matchDept = selectedDept === "all" || f.department === selectedDept;
    const matchSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.education.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

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
                  Master Faculty & Counselors
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
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center gap-1 transition-all"
              >
                Enroll Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>World-Class Academic Faculty</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Learn from Visioner Virtual Mentors
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Our certified faculty average 14+ years of academic excellence and have helped thousands of overseas students gain admission to the world&apos;s leading colleges.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Search & Dept Filters */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search educators by name, university, or subject specialization..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="md:col-span-4">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="all">All Departments</option>
                <option value="Sciences">Physical & Biological Sciences</option>
                <option value="Mathematics">Mathematics & Mechanics</option>
                <option value="Computer Science">Computer Science & AI</option>
                <option value="Humanities">Humanities & Languages</option>
                <option value="Leadership & Guidance">University Guidance & Counseling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((member) => (
            <div
              key={member.id}
              className="bg-slate-900/70 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg shadow-md shrink-0">
                    {member.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-indigo-400 font-medium">{member.role}</p>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {member.education}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {member.bio}
                </p>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Specialization:</span>
                    <span className="font-semibold text-slate-200 text-right truncate max-w-42.5">{member.specialization}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Office Hours:</span>
                    <span className="text-indigo-300 font-medium">{member.officeHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setBookingModalFaculty(member);
                    setBookingSuccess(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book 1-on-1 Advisory Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* BOOKING MODAL */}
      {bookingModalFaculty && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-white">
                  Schedule Consultation with {bookingModalFaculty.name}
                </span>
              </div>
              <button
                onClick={() => setBookingModalFaculty(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!bookingSuccess ? (
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center shrink-0">
                    {bookingModalFaculty.avatarInitials}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{bookingModalFaculty.name}</h4>
                    <p className="text-slate-400">{bookingModalFaculty.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Parent / Student Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.parentName}
                      onChange={(e) => setBookingForm({ ...bookingForm, parentName: e.target.value })}
                      placeholder="e.g. John Vance"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="contact@domain.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.preferredDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Timeslot (GST / UTC+4) *</label>
                    <select
                      value={bookingForm.preferredTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="15:00 GST">15:00 GST (11:00 GMT)</option>
                      <option value="16:00 GST">16:00 GST (12:00 GMT)</option>
                      <option value="17:30 GST">17:30 GST (13:30 GMT)</option>
                      <option value="19:00 GST">19:00 GST (15:00 GMT)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Discussion Topics / Subject Concerns</label>
                  <textarea
                    rows={2}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="e.g. Discussing A-Level subject choices or university prerequisites..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalFaculty(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow"
                  >
                    Confirm Consultation Slot
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Consultation Confirmed!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  A Google Meet invitation has been scheduled with <strong>{bookingModalFaculty.name}</strong> for {bookingForm.preferredDate} at {bookingForm.preferredTime}.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setBookingModalFaculty(null)}
                    className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


