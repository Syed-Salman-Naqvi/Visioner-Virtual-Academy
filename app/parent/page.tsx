"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { findApplicationById } from "@/lib/storage";
import { AdmissionsApplication } from "@/lib/types";

export default function ParentPortalPage() {
  const [searchId, setSearchId] = useState("");
  const [application, setApplication] = useState<AdmissionsApplication | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await findApplicationById(searchId);
      setApplication(res);
    } catch {
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Visioner Academy</h1>
            <p className="text-[10px] text-indigo-400 uppercase font-semibold">Parent Portal</p>
          </div>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Parent Application Lookup</h1>
          <p className="text-xs text-slate-400">
            Enter your Application ID to track admissions status and records.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              required
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Application ID (e.g. VVA-INTL-123456)"
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "Lookup Application"}
            </button>
          </form>

          {searched && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              {application ? (
                <div className="bg-slate-950 p-6 rounded-xl border border-indigo-500/40 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400">{application.id}</span>
                      <h2 className="text-lg font-bold text-white">{application.studentName}</h2>
                      <p className="text-xs text-slate-400">{application.targetTrack} • {application.gradeLevel}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-bold text-xs">
                      {application.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Parent / Guardian</span>
                      <span className="text-white font-medium">{application.parentName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Assigned Advisor</span>
                      <span className="text-white font-medium">{application.assignedAdvisor}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Location</span>
                      <span className="text-white font-medium">{application.city}, {application.countryOfResidence}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                  No application record found for &ldquo;{searchId}&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}