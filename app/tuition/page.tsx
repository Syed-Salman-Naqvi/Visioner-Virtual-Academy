"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Calculator,
  Globe,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  CreditCard,
  Laptop,
} from "lucide-react";
import { CURRENCY_RATES } from "@/lib/mockData";

type CurrencyKey = keyof typeof CURRENCY_RATES;

export default function TuitionPage() {
  const [currency, setCurrency] = useState<CurrencyKey>("USD");
  const [track, setTrack] = useState<"cambridge-a-levels" | "cambridge-igcse" | "advanced-placement" | "stem" | "middle">("cambridge-a-levels");
  const [numSubjects, setNumSubjects] = useState<number>(3);
  const [paymentSchedule, setPaymentSchedule] = useState<"annual" | "termly" | "monthly">("annual");
  const [qualifiesScholarship, setQualifiesScholarship] = useState<boolean>(false);

  // Base costs in USD per subject per year
  const baseCostPerSubjectUsd = {
    "cambridge-a-levels": 2400,
    "cambridge-igcse": 2100,
    "advanced-placement": 2500,
    "stem": 2200,
    "middle": 1800,
  };

  const currentRateObj = CURRENCY_RATES[currency];
  const rate = currentRateObj.rate;
  const symbol = currentRateObj.symbol;

  const rawAnnualUsd = baseCostPerSubjectUsd[track] * numSubjects;
  const scholarshipDiscount = qualifiesScholarship ? 0.2 : 0; // 20% merit scholarship
  const finalAnnualUsd = rawAnnualUsd * (1 - scholarshipDiscount);

  // Convert
  const totalLocalAnnual = Math.round(finalAnnualUsd * rate);
  const termlyLocal = Math.round((totalLocalAnnual / 3) * 1.03); // 3% fee for installment
  const monthlyLocal = Math.round((totalLocalAnnual / 10) * 1.05); // 5% fee for installment

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white">
                  Visioner <span className="text-indigo-400">Academy</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  Tuition & Scholarships
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
                href="/student"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                Student Portal
              </Link>
              <Link
                href="/admissions"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center gap-1 transition-all"
              >
                Apply for Aid & Admission <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transparent Global Tuition & Aid</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            International Tuition Calculator
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Calculate your customized tuition in your local currency with transparent payment plans and academic merit scholarship assessment.
          </p>
        </div>
      </section>

      {/* Calculator Main Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Interactive Controls (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-400" />
                Customize Academic Plan
              </h2>

              {/* Currency Selector */}
              <div className="flex items-center gap-2 text-xs">
                <Globe className="w-4 h-4 text-slate-400" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyKey)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none"
                >
                  {Object.entries(CURRENCY_RATES).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 1. Academic Track Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Select Academic Pathway
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: "cambridge-a-levels", label: "Cambridge A-Levels (Grades 11-12)" },
                  { key: "advanced-placement", label: "Advanced Placement (AP) Courses" },
                  { key: "cambridge-igcse", label: "Cambridge IGCSE (Grades 9-10)" },
                  { key: "stem", label: "STEM & Computer Science Accelerator" },
                  { key: "middle", label: "Middle School Foundation (Grades 6-8)" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTrack(item.key as "cambridge-a-levels" | "cambridge-igcse" | "advanced-placement" | "stem" | "middle")}
                    className={`p-3 rounded-xl text-left text-xs transition-all border ${
                      track === item.key
                        ? "bg-indigo-600/25 border-indigo-500 text-white font-semibold shadow-sm"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Number of Subjects Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-bold text-slate-300 uppercase tracking-wider">
                  2. Number of Enrolled Subjects
                </label>
                <span className="font-bold text-indigo-400">{numSubjects} Subjects</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                value={numSubjects}
                onChange={(e) => setNumSubjects(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>1 Subject (Supplemental Tutoring)</span>
                <span>3-4 Subjects (Standard Full-Time)</span>
                <span>6 Subjects (Maximum Honors)</span>
              </div>
            </div>

            {/* 3. Merit Scholarship Checkbox */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={qualifiesScholarship}
                  onChange={(e) => setQualifiesScholarship(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Estimate 20% Academic Merit Scholarship
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Awarded to students with prior GPA &ge; 3.7 or equivalent A/A* academic history upon transcript verification.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Right: Summary Card & Installments (5 cols) */}
          <div className="lg:col-span-5 bg-linear-to-b from-slate-900 to-indigo-950/70 p-6 sm:p-8 rounded-2xl border border-indigo-500/30 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tuition Calculation
                </span>
                <span className="text-xs text-indigo-300 font-semibold">{currentRateObj.name}</span>
              </div>

              {/* Total Figure */}
              <div className="space-y-1">
                <span className="text-xs text-slate-400">Annual Tuition (All {numSubjects} Subjects):</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  {symbol}
                  {totalLocalAnnual.toLocaleString()}
                </div>
                {qualifiesScholarship && (
                  <p className="text-xs text-emerald-400 font-medium">
                    Includes 20% Merit Scholarship Savings ({symbol}
                    {Math.round(rawAnnualUsd * 0.2 * rate).toLocaleString()})
                  </p>
                )}
              </div>

              {/* Payment Schedule Switcher */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-300">
                  Installment & Schedule Options:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setPaymentSchedule("annual")}
                    className={`py-2 rounded-xl text-center border transition-all ${
                      paymentSchedule === "annual"
                        ? "bg-indigo-600 text-white font-bold border-indigo-400"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Annual (Best)
                  </button>
                  <button
                    onClick={() => setPaymentSchedule("termly")}
                    className={`py-2 rounded-xl text-center border transition-all ${
                      paymentSchedule === "termly"
                        ? "bg-indigo-600 text-white font-bold border-indigo-400"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    3 Terms
                  </button>
                  <button
                    onClick={() => setPaymentSchedule("monthly")}
                    className={`py-2 rounded-xl text-center border transition-all ${
                      paymentSchedule === "monthly"
                        ? "bg-indigo-600 text-white font-bold border-indigo-400"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    10 Monthly
                  </button>
                </div>
              </div>

              {/* Payment Breakdown Details */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                {paymentSchedule === "annual" && (
                  <div className="flex justify-between items-center text-white">
                    <span>1 Single Payment / Year:</span>
                    <span className="font-bold text-emerald-400">
                      {symbol}{totalLocalAnnual.toLocaleString()}
                    </span>
                  </div>
                )}
                {paymentSchedule === "termly" && (
                  <div className="flex justify-between items-center text-white">
                    <span>3 Equal Termly Payments of:</span>
                    <span className="font-bold text-indigo-300">
                      {symbol}{termlyLocal.toLocaleString()} / term
                    </span>
                  </div>
                )}
                {paymentSchedule === "monthly" && (
                  <div className="flex justify-between items-center text-white">
                    <span>10 Monthly Payments of:</span>
                    <span className="font-bold text-indigo-300">
                      {symbol}{monthlyLocal.toLocaleString()} / month
                    </span>
                  </div>
                )}
                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Includes live seminars, 1-on-1 tutoring & digital lab licences.</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href={`/admissions?track=${track}&subjects=${numSubjects}`}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
              >
                Apply for Enrollment & Scholarship <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


