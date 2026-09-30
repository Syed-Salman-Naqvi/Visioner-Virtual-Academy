"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { initializeDefaultAccounts } from "@/lib/seed-data";
import { loginOwner, loginStudent, savePortalSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "owner">("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    initializeDefaultAccounts();
  }, []);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = role === "student"
        ? await loginStudent(identifier, password)
        : await loginOwner(identifier, password);

      if (!user) {
        setError(role === "student" ? "Invalid Student ID/email or password." : "Invalid Owner username/email or password.");
        return;
      }

      savePortalSession(user);
      router.replace(user.role === "owner" ? "/owner" : "/student");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#060813] text-slate-100 flex items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="fixed left-5 top-5 z-10 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0b0f24]/95 px-4 py-2.5 text-sm font-semibold text-slate-300 shadow-lg backdrop-blur transition hover:border-indigo-500 hover:bg-slate-900 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Website
      </Link>

      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0b0f24]/95 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-black">V</div>
          <h1 className="text-xl font-bold">Visioner Virtual Academy</h1>
          <p className="mt-1 text-xs text-slate-400">One global login for your academy portals</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
          {(["student", "owner"] as const).map((item) => (
            <button key={item} type="button" onClick={() => { setRole(item); setError(""); }}
              className={`rounded-lg py-2.5 text-xs font-bold capitalize ${role === item ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
              {item === "owner" ? "Teacher / Owner" : "Student"}
            </button>
          ))}
        </div>

        {error && <div className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">{role === "student" ? "Student ID or registered email" : "Owner username or email"}</label>
            <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} required autoComplete="username"
              placeholder={role === "student" ? "e.g. VVA-INTL-159994" : "owner or admin@visioner.edu"}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
          </div>
          <button disabled={loading} className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-500">New student? Submit an application through Admissions. Once the owner generates your account, the same login works from any device.</p>
      </section>
    </main>
  );
}
