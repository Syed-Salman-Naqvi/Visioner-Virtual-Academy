"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn, ArrowLeft } from "lucide-react";
import { getStudentAccounts } from "@/lib/storage";

export default function StudentLoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const accounts = await getStudentAccounts();
      const account = accounts.find(
        (a) =>
          a.studentId.trim().toUpperCase() === studentId.trim().toUpperCase() &&
          a.password === password
      );

      if (account) {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("vva_student_account", JSON.stringify(account));
        }
        router.push("/student");
      } else {
        setError("Invalid Student ID or Password.");
      }
    } catch {
      setError("An error occurred during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
        <Link href="/" className="mx-auto flex w-fit items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <span>
            <strong className="block text-sm text-white">Visioner Academy</strong>
            <small className="text-[10px] uppercase text-indigo-400">Student Portal</small>
          </span>
        </Link>

        <div className="mt-8 text-center">
          <h1 className="text-xl font-bold text-white">Student Sign In</h1>
          <p className="mt-2 text-xs text-slate-400">
            Enter your student credentials issued by the admissions office.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <label className="block text-xs font-semibold text-slate-300">
            Student ID
            <input
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. VVA-STU-123456"
            />
          </label>

          <label className="block text-xs font-semibold text-slate-300">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
              placeholder="Enter password"
            />
          </label>

          {error && <p role="alert" className="text-xs text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Signing in..." : "Sign in to portal"}
          </button>
        </form>

        <Link href="/" className="mt-5 flex items-center justify-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>
      </div>
    </div>
  );
}