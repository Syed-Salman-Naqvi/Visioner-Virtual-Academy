"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Laptop,
} from "lucide-react";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "United Arab Emirates",
    inquiryType: "admissions",
    message: "",
    callbackRequested: false,
    callbackDate: "2026-09-02",
    callbackTimezone: "GST (Dubai)",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(id);
    setFormSubmitted(true);
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
                  Global Helpdesk & Contact
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
      <section className="bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>24/7 Global International Concierge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Connect with Our Admissions Desk
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Have questions regarding curriculum transfer, timezone mapping, or official exam centers? Our international advisors are ready to assist.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 p-6 sm:p-8 rounded-2xl border border-slate-800">
            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="border-b border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-white">Send an International Inquiry</h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    We typically respond within 2-4 hours across all global timezones.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@domain.com"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+971 50 123 4567"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Inquiry Category *</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    >
                      <option value="admissions">Overseas Admissions & Enrollment</option>
                      <option value="curriculum">Cambridge / AP Subject Selection</option>
                      <option value="exam-centers">Exam Center Registration in My Country</option>
                      <option value="tuition-aid">Tuition, Payment Plans & Scholarships</option>
                      <option value="other">General Inquiries & Partnerships</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Message or Questions *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your student's current grade, school system, and any specific questions..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Optional Callback Scheduler Checkbox */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.callbackRequested}
                      onChange={(e) => setFormData({ ...formData, callbackRequested: e.target.checked })}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600"
                    />
                    <span className="text-white font-medium">Request a live video callback with an admissions advisor</span>
                  </label>

                  {formData.callbackRequested && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                      <div>
                        <label className="block text-slate-400 text-[11px] mb-1">Preferred Callback Date</label>
                        <input
                          type="date"
                          value={formData.callbackDate}
                          onChange={(e) => setFormData({ ...formData, callbackDate: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-[11px] mb-1">Your Local Timezone</label>
                        <input
                          type="text"
                          value={formData.callbackTimezone}
                          onChange={(e) => setFormData({ ...formData, callbackTimezone: e.target.value })}
                          placeholder="e.g. GST (Dubai) or GMT (London)"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" /> Send Message to Admissions
                </button>
              </form>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Inquiry Received!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you, <strong>{formData.name}</strong>. An admissions advisor has been assigned to ticket <strong>#{ticketId}</strong> and will contact you at {formData.email}.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Submit Another Inquiry
                  </button>
                  <Link
                    href="/admissions"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                  >
                    Go to Application
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Channels */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <h3 className="text-base font-bold text-white">Direct Communication Channels</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Admissions Registry</span>
                    <a href="mailto:visionervirtualacademy@gmail.com" className="text-indigo-300 hover:underline">
                      visionervirtualacademy@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">International WhatsApp Helpline</span>
                    <span className="text-slate-300">+923173349556</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Operating Hours</span>
                    <span className="text-slate-400">Continuous Support Across World</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Hubs */}
            {/* <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h3 className="text-base font-bold text-white">Global Administrative Hubs</h3>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-white block">London Office</strong>
                  <span className="text-[11px] text-slate-400">100 Oxford St, London</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-white block">Dubai Hub</strong>
                  <span className="text-[11px] text-slate-400">DIFC Gate Precinct 4</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-white block">Singapore Desk</strong>
                  <span className="text-[11px] text-slate-400">Marina Bay Financial Ctr</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-white block">New York Center</strong>
                  <span className="text-[11px] text-slate-400">Rockefeller Plaza</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}


