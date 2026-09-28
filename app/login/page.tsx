"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ShieldCheck,
  Users,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { getStudentAccounts } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const accounts = await getStudentAccounts();
      const match = accounts.find(
        (acc) =>
          (acc.studentId.toLowerCase() === studentId.trim().toLowerCase() ||
            acc.applicationId.toLowerCase() === studentId.trim().toLowerCase()) &&
          acc.password === password
      );

      if (match) {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("vva_student_account", JSON.stringify(match));
        }
        router.push("/student");
      } else {
        setError("Invalid Student ID/Application ID or password.");
      }
    } catch {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header with Direct Navigation Buttons */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Visioner Virtual Academy</h1>
            <p className="text-[10px] text-indigo-400 uppercase font-semibold tracking-wider">
              Portal Network
            </p>
          </div>
        </Link>

        {/* Quick Access Portal Switcher */}
        <div className="flex items-center gap-2">
          <Link
            href="/parent"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Parent Portal</span>
          </Link>

          <Link
            href="/owner"
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-all border border-indigo-500/40"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 hover:text-white" />
            <span>Owner Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Login Form Section */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Student Portal Login</h2>
            <p className="text-xs text-slate-400">
              Enter your credentials to access your academic dashboard and assignments.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {error && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Student ID or Application ID
                </label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. VVA-2026-8912 or VVA-INTL-123456"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Sign In to Student Portal"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <p className="text-[11px] text-slate-400 text-center">
                Need to check admissions application status?{" "}
                <Link href="/parent" className="text-indigo-400 hover:underline font-semibold">
                  Parent Lookup
                </Link>
              </p>
            </div>
          </div>

          {/* Dedicated Academy Administration Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Academy Administrator?</h3>
                <p className="text-[10px] text-slate-400">Access executive controls & approvals</p>
              </div>
            </div>
            <Link
              href="/owner"
              className="px-3.5 py-2 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-all border border-slate-700"
            >
              Owner Portal
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-[10px] text-slate-500 border-t border-slate-900">
        <Link href="/" className="hover:text-slate-400 transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to Main Website
        </Link>
      </footer>
    </div>
  );
}