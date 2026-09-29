'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getSavedApplications, getSavedStudents } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'owner' | 'parent'>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanId = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanId || !cleanPassword) {
      setError('Please enter both ID/Email and Password.');
      setLoading(false);
      return;
    }

    try {
      let authenticatedUser: any = null;

      // ==========================================
      // 1. OWNER / ADMIN LOGIN
      // ==========================================
      if (role === 'owner') {
        if (
          (cleanId.toLowerCase() === 'owner' || cleanId.toLowerCase() === 'admin@visioner.edu') &&
          cleanPassword === 'admin123'
        ) {
          authenticatedUser = {
            id: 'VVA-OWNER-01',
            name: 'Academy Administrator',
            email: 'admin@visioner.edu',
            role: 'owner',
          };
        } else {
          setError('Invalid Owner/Admin credentials.');
          setLoading(false);
          return;
        }
      }

      // ==========================================
      // 2. STUDENT LOGIN PIPELINE
      // ==========================================
      if (role === 'student') {
        // Step A: Check Supabase 'students' table
        try {
          const { data: dbStudents } = await supabase
            .from('students')
            .select('*')
            .or(`student_id.eq.${cleanId},id.eq.${cleanId},email.eq.${cleanId}`);

          if (dbStudents && dbStudents.length > 0) {
            const matched = dbStudents.find((s: any) => {
              const pass = s.password || s.active_password || s.generated_password || s.generatedPassword;
              return pass === cleanPassword;
            });

            if (matched) {
              authenticatedUser = {
                id: matched.student_id || matched.id || cleanId,
                studentId: matched.student_id || matched.id || cleanId,
                name: matched.name || matched.full_name || matched.student_name || 'Enrolled Student',
                email: matched.email || '',
                program: matched.program || matched.target_program || 'Sindh Board (Grade 11)',
                role: 'student',
              };
            }
          }
        } catch (supabaseErr) {
          console.warn('Supabase students lookup skipped/failed:', supabaseErr);
        }

        // Step B: Check Supabase 'applications' table
        if (!authenticatedUser) {
          try {
            const { data: dbApps } = await supabase
              .from('applications')
              .select('*')
              .or(`generated_student_id.eq.${cleanId},id.eq.${cleanId},student_email.eq.${cleanId},email.eq.${cleanId}`);

            if (dbApps && dbApps.length > 0) {
              const matched = dbApps.find((a: any) => {
                const pass =
                  a.generated_password ||
                  a.generatedPassword ||
                  a.active_password ||
                  a.password ||
                  a.credentials_password;
                return pass === cleanPassword;
              });

              if (matched) {
                authenticatedUser = {
                  id: matched.generated_student_id || matched.id || cleanId,
                  studentId: matched.generated_student_id || matched.id || cleanId,
                  name: matched.student_name || matched.name || 'Enrolled Student',
                  email: matched.student_email || matched.email || '',
                  program: matched.target_program || 'Sindh Board (Grade 11)',
                  role: 'student',
                };
              }
            }
          } catch (appErr) {
            console.warn('Supabase applications lookup skipped/failed:', appErr);
          }
        }

        // Step C: Check LocalStorage Applications
        if (!authenticatedUser) {
          try {
            const localApps = getSavedApplications();
            if (Array.isArray(localApps)) {
              const matched = localApps.find((a: any) => {
                const idMatches =
                  a.generatedStudentId === cleanId ||
                  a.id === cleanId ||
                  a.studentEmail === cleanId;

                const passMatches =
                  a.generatedPassword === cleanPassword ||
                  a.activePassword === cleanPassword ||
                  a.password === cleanPassword;

                return idMatches && passMatches;
              });

              if (matched) {
                authenticatedUser = {
                  id: matched.generatedStudentId || matched.id || cleanId,
                  studentId: matched.generatedStudentId || matched.id || cleanId,
                  name: matched.studentName || matched.name || 'Enrolled Student',
                  email: matched.studentEmail || matched.email || '',
                  program: matched.targetProgram || 'Sindh Board (Grade 11)',
                  role: 'student',
                };
              }
            }
          } catch (localErr) {
            console.warn('Local storage application check error:', localErr);
          }
        }

        // Step D: Check LocalStorage Students
        if (!authenticatedUser) {
          try {
            const localStudents = getSavedStudents();
            if (Array.isArray(localStudents)) {
              const matched = localStudents.find((s: any) => {
                const idMatches = s.id === cleanId || s.studentId === cleanId || s.email === cleanId;
                const passMatches = s.password === cleanPassword || s.generatedPassword === cleanPassword;
                return idMatches && passMatches;
              });

              if (matched) {
                authenticatedUser = {
                  id: matched.id || matched.studentId || cleanId,
                  studentId: matched.id || matched.studentId || cleanId,
                  name: matched.name || matched.studentName || 'Enrolled Student',
                  email: matched.email || '',
                  program: matched.program || 'Sindh Board (Grade 11)',
                  role: 'student',
                };
              }
            }
          } catch (localStuErr) {
            console.warn('Local storage student check error:', localStuErr);
          }
        }

        // Step E: Static Hardcoded Fallback for Testing / Demo Accounts
        if (!authenticatedUser) {
          if (
            (cleanId === 'VVA-INTL-555014' && cleanPassword === 'VVA266412') ||
            (cleanId === 'student@domain.com' && cleanPassword === 'VVA266412')
          ) {
            authenticatedUser = {
              id: 'VVA-INTL-555014',
              studentId: 'VVA-INTL-555014',
              name: 'Syed Muhammad Salman Naqvi',
              email: 'student@domain.com',
              program: 'sindh-board (grade-11)',
              role: 'student',
            };
          } else if (cleanId === 'VVA-2026-8842' && cleanPassword === 'VVA8842') {
            authenticatedUser = {
              id: 'VVA-2026-8842',
              studentId: 'VVA-2026-8842',
              name: 'Aiden Vance',
              email: 'aiden.vance@example.com',
              program: 'Cambridge AS-Level',
              role: 'student',
            };
          }
        }

        if (!authenticatedUser) {
          setError('Invalid Student ID or Password. Please check your generated credentials.');
          setLoading(false);
          return;
        }
      }

      // ==========================================
      // 3. PARENT LOGIN PIPELINE
      // ==========================================
      if (role === 'parent') {
        if (cleanId === 'parent@domain.com' || cleanPassword === 'parent123') {
          authenticatedUser = {
            id: 'VVA-PAR-01',
            name: 'Dr. Robert Vance',
            email: 'parent@domain.com',
            role: 'parent',
          };
        } else {
          setError('Invalid Parent Portal credentials.');
          setLoading(false);
          return;
        }
      }

      // ==========================================
      // SAVE SESSION & REDIRECT
      // ==========================================
      if (authenticatedUser) {
        localStorage.setItem('vva_user', JSON.stringify(authenticatedUser));
        localStorage.setItem('vva_current_user', JSON.stringify(authenticatedUser));
        localStorage.setItem('vva_session', JSON.stringify(authenticatedUser));
        localStorage.setItem('vva_role', authenticatedUser.role);

        // Redirect based on role
        if (role === 'owner') {
          window.location.href = '/owner';
        } else if (role === 'parent') {
          window.location.href = '/parent';
        } else {
          window.location.href = '/student';
        }
      }
    } catch (err: any) {
      console.error('Login process error:', err);
      setError('An unexpected error occurred during sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 flex items-center justify-center px-4 py-12 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md bg-[#0b0f24]/90 border border-slate-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        {/* Header Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg shadow-indigo-500/20 mb-3">
            V
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">Visioner Virtual Academy</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to access your portal</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setRole('student'); setError(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              role === 'student' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => { setRole('parent'); setError(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              role === 'parent' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Parent
          </button>
          <button
            type="button"
            onClick={() => { setRole('owner'); setError(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              role === 'owner' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Teacher/Owner
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium flex items-center space-x-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {role === 'student' ? 'Student ID or Registered Email' : role === 'parent' ? 'Parent Email' : 'Username or Email'}
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                role === 'student' ? 'e.g. VVA-INTL-555014' : role === 'parent' ? 'parent@domain.com' : 'owner'
              }
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Portal</span>
            )}
          </button>
        </form>

        {/* Quick Credentials Info Box */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            New applicant? Submit an application via <a href="/admissions" className="text-indigo-400 hover:underline">Admissions</a> to receive generated portal access.
          </p>
        </div>
      </div>
    </div>
  );
}