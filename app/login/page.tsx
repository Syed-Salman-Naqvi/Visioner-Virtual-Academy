"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn, Lock, User, ArrowLeft, AlertCircle } from "lucide-react";
import {
  getStudentAccountsFromCloud,
  normalizeId,
  verifyPassword,
  findStudentAccount,
} from "@/lib/database";

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "online" | "offline">("checking");

  // Check Supabase connection on mount
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        await getStudentAccountsFromCloud();
        setConnectionStatus("online");
      } catch {
        setConnectionStatus("offline");
      }
    };
    checkConnection();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const rawInputId = studentId.trim();
      const rawInputPassword = password.trim();

      if (!rawInputId || !rawInputPassword) {
        setError("Please enter both Student ID and Password.");
        setLoading(false);
        return;
      }

      // CLOUD-FIRST: Always fetch from Supabase
      const account = await findStudentAccount(rawInputId);

      if (!account) {
        setError("Student ID not found. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Verify password
      if (!verifyPassword(rawInputPassword, account.password)) {
        setError("Invalid password. Please try again.");
        setLoading(false);
        return;
      }

      // Login successful - store in session
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("vva_student_authenticated", "true");
        window.sessionStorage.setItem("vva_active_student_id", account.studentId);
        window.sessionStorage.setItem("vva_student_account", JSON.stringify(account));
        window.dispatchEvent(new Event("vva_student_auth_changed"));
      }

      router.push("/student");
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Visioner Academy</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Student Portal Sign In</h2>
        <p className="text-xs text-slate-400">
          Access your personalized academic records, schedule, and assignments.
        </p>

        {/* Connection Status Indicator */}
        {connectionStatus !== "online" && (
          <div className="mt-4 p-3 bg-yellow-950/60 border border-yellow-500/40 rounded-lg flex items-start gap-2 text-xs text-yellow-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Using Local Cache</p>
              <p>Cloud connection unavailable. Login data may be outdated.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Student ID or Application ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. VVA-UAE-637407"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                💡 Use the ID from your enrollment confirmation email
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                💡 Check your enrollment email for the password provided
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white font-bold text-sm rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Signing in..." : "Sign In to Portal"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-3">
            <div className="text-xs text-slate-400">
              <p>Having trouble? Contact admissions at</p>
              <p className="text-indigo-400 font-semibold">visionervirtualacademy@gmail.com</p>
            </div>
            <Link
              href="/owner"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium block"
            >
              Teacher / Owner Portal Sign In →
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
