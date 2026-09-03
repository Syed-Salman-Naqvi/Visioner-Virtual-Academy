// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import {
//   GraduationCap,
//   ArrowLeft,
//   ArrowRight,
//   CheckCircle2,
//   Globe,
//   Clock,
//   User,
//   Users,
//   Mail,
//   Phone,
//   BookOpen,
//   FileText,
//   UploadCloud,
//   HelpCircle,
//   Sparkles,
//   ChevronDown,
//   ChevronUp,
//   Laptop,
//   Check,
//   Send,
//   Search,
//   Printer,
//   X,
//   File,
// } from "lucide-react";
// import { saveApplication, findApplicationById } from "@/lib/storage";
// import { AdmissionsApplication } from "@/lib/types";

// export default function AdmissionsPage() {
//   const [activeTopTab, setActiveTopTab] = useState<"apply" | "track">("apply");
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [submittedApp, setSubmittedApp] = useState<AdmissionsApplication | null>(null);
//   const [openFaq, setOpenFaq] = useState<number | null>(0);

//   // Status tracker state
//   const [trackQueryId, setTrackQueryId] = useState("");
//   const [trackResult, setTrackResult] = useState<AdmissionsApplication | null>(null);
//   const [trackSearched, setTrackSearched] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     dateOfBirth: "",
//     gender: "prefer-not-to-say",
//     nationality: "",
//     countryOfResidence: "United Arab Emirates",
//     city: "",
//     primaryLanguage: "English",
//     entryTerm: "fall-2026",

//     parentName: "",
//     parentRelationship: "Mother",
//     parentEmail: "",
//     parentPhoneCountryCode: "+971",
//     parentPhone: "",
//     preferredContact: "email",

//     targetTrack: "sindh-board",
//     gradeLevel: "grade-11",
//     previousSchool: "",
//     previousSchoolCountry: "",
//     subjectsOfInterest: ["Physics", "Mathematics (Pure & Mechanics)"],

//     timeZone: "UTC+4 (Gulf Standard Time - Dubai, Muscat)",
//     preferredCohortSlot: "morning-emea",
//     englishProficiency: "fluent",
//     hasSpecialAccommodations: "no",
//     accommodationsDetails: "",

//     statementOfPurpose: "",
//     agreeToTerms: false,
//   });

//   const fileInputRef = React.useRef<HTMLInputElement | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string }>>([]);

//   const subjectOptions = [
//     "Mathematics (Pure & Mechanics)",
//     "Physics",
//     "Chemistry",
//     "Biology",
//     "Computer Science & Python",
//     "Economics & Finance",
//     "English Literature",
//     "World History",
//     "Psychology",
//     "AI & Data Science",
//   ];

//   const handleSubjectToggle = (subj: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       subjectsOfInterest: prev.subjectsOfInterest.includes(subj)
//         ? prev.subjectsOfInterest.filter((s) => s !== subj)
//         : [...prev.subjectsOfInterest, subj],
//     }));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     if (type === "checkbox") {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const processUploadedFiles = (files: FileList | null) => {
//     if (!files || files.length === 0) return;
//     const newItems = Array.from(files).map((f) => {
//       const sizeMb = (f.size / (1024 * 1024)).toFixed(2);
//       const sizeFormatted = f.size > 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(f.size / 1024)} KB`;
//       return {
//         name: f.name,
//         size: sizeFormatted,
//       };
//     });

//     setAttachedFiles((prev) => {
//       const existingNames = new Set(prev.map((item) => item.name));
//       const uniqueNew = newItems.filter((item) => !existingNames.has(item.name));
//       return [...prev, ...uniqueNew];
//     });
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     processUploadedFiles(e.target.files);
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     processUploadedFiles(e.dataTransfer.files);
//   };

//   const handleRemoveFile = (fileName: string) => {
//     setAttachedFiles(attachedFiles.filter((f) => f.name !== fileName));
//   };

//   const handleNext = () => {
//     if (currentStep < 5) {
//       setCurrentStep(currentStep + 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handlePrev = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const generatedId = `VVA-INTL-${Math.floor(100000 + Math.random() * 900000)}`;

//     const newApp: AdmissionsApplication = {
//       id: generatedId,
//       createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
//       status: "Under Review",
//       studentName: `${formData.firstName} ${formData.lastName}`.trim() || "Aiden Vance",
//       studentEmail: formData.parentEmail || "student@domain.com",
//       dateOfBirth: formData.dateOfBirth || "2009-04-12",
//       nationality: formData.nationality || "British",
//       countryOfResidence: formData.countryOfResidence,
//       city: formData.city || "Dubai",
//       parentName: formData.parentName || "Dr. Robert Vance",
//       parentEmail: formData.parentEmail || "parent@domain.com",
//       parentPhone: `${formData.parentPhoneCountryCode} ${formData.parentPhone}`,
//       targetTrack: formData.targetTrack,
//       gradeLevel: formData.gradeLevel,
//       timeZone: formData.timeZone,
//       preferredCohortSlot: formData.preferredCohortSlot,
//       assignedAdvisor: "Ms. Rebecca Vance (Dean of Admissions)",
//       documentsAttached: attachedFiles.map((f) => `${f.name} (${f.size})`),
//       statementOfPurpose: formData.statementOfPurpose,
//     };

//     saveApplication(newApp);
//     setSubmittedApp(newApp);
//     window.setTimeout(() => {
//       setIsSubmitted(true);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }, 0);
//   };

//   const handleTrackSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setTrackSearched(true);
//     const found = findApplicationById(trackQueryId);
//     if (found) {
//       setTrackResult(found);
//     } else {
//       // Return a simulated application if tracking a demo ID
//       if (trackQueryId.toUpperCase().startsWith("VVA")) {
//         setTrackResult({
//           id: trackQueryId.toUpperCase(),
//           createdAt: "Aug 20, 2026",
//           status: "Verified",
//           studentName: "Aiden Vance",
//           studentEmail: "aiden.vance@visioner.student",
//           dateOfBirth: "2009-05-14",
//           nationality: "British",
//           countryOfResidence: "United Arab Emirates",
//           city: "Dubai",
//           parentName: "Dr. Robert Vance",
//           parentEmail: "robert.vance@domain.com",
//           parentPhone: "+971 50 123 4567",
//           targetTrack: "Cambridge International A-Levels",
//           gradeLevel: "Grade 11 (AS-Level)",
//           timeZone: "UTC+4 (GST - Dubai)",
//           preferredCohortSlot: "Morning Track (08:30 - 13:30 GST)",
//           assignedAdvisor: "Ms. Rebecca Vance (Dean of Admissions)",
//           documentsAttached: ["Transcript_2025.pdf", "Passport_Copy.pdf"],
//         });
//       } else {
//         setTrackResult(null);
//       }
//     }
//   };

//   const faqs = [
//     {
//       q: "What programmes does Visioners Virtual Academy offer?",
//       a: "We provide online tuition and academic support for students following various school curricula and education boards, with subject-focused preparation and personalised guidance.",
//     },
//     {
//       q: "Are classes completely online?",
//       a: "Yes. Classes are conducted online, allowing students to learn from home regardless of their location.",
//     },
//     {
//       q: "Do you offer classes for overseas students?",
//       a: "Yes. We welcome students from Pakistan and overseas, with flexible timings to accommodate different time zones.",
//     },
//     {
//       q: "Are recorded lectures available?",
//       a: "Recorded lectures may be provided when a student is unable to attend a class due to a genuine or serious reason, according to academy policy.",
//     },
//      {
//       q: "Is one-on-one tuition available?",
//       a: "Yes. Individual tuition can be provided for students who need personalised attention, concept clarification, or additional academic support.",
//     },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
//       {/* Top Header */}
//       <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-20">
//             {/* <Link href="/" className="flex items-center gap-3 group">
//               <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
//                 <GraduationCap className="w-5 h-5 text-white" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-lg font-bold tracking-tight text-white">
//                   Visioner <span className="text-indigo-400">Academy</span>
//                 </span>
//                 <span className="text-[10px] uppercase font-semibold text-slate-400">
//                   Overseas Admissions
//                 </span>
//               </div>
//             </Link> */}

//              <Link href="/" className="flex items-center gap-3 group">
//               <img
//                 src="/logo.png"
//                 alt="Visioner Virtual Academy Logo"
//                 className="h-30 w-auto object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow-lg"
//               />
//               <div className="flex flex-col">
//                 <span className="text-lg font-extrabold tracking-tight text-white leading-tight">
//                   Visioner <span style={{color:"#E8A820"}}>Academy</span>
//                 </span>
//                 <span className="text-[10px] uppercase font-bold tracking-widest" style={{color:"#7BA7E8"}}>
//                   Global Virtual Campus
//                 </span>
//               </div>
//             </Link>

//             <div className="flex items-center gap-3">
//               <Link
//                 href="/"
//                 className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back to Home
//               </Link>
//               <Link
//                 href="/login"
//                 className="px-4 py-2 rounded-xl text-sm font-bold text-white border transition-all flex items-center gap-2"
//                 style={{background:"rgba(27,63,160,0.5)", borderColor:"rgba(74,144,217,0.4)"}}
//               >
//                 <Laptop className="w-4 h-4" style={{color:"#E8A820"}} />
//                 Student Portal
//               </Link>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Page Header Banner */}
//       <div className="bg-linear-to-b from-slate-950 via-slate-900 to-slate-900 border-b border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto text-center space-y-4">
//           <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
//             <Globe className="w-3.5 h-3.5 text-indigo-400" />
//             <span>International & Expat Student Enrollment</span>
//           </div>
//           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
//             Overseas Admissions & Enrollment Portal
//           </h1>

//           {/* Top Switcher: Apply Online vs Track Status */}
//           <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
//             <button
//               onClick={() => setActiveTopTab("apply")}
//               className={`px-5 py-2 rounded-lg font-bold transition-all ${
//                 activeTopTab === "apply"
//                   ? "bg-indigo-600 text-white shadow"
//                   : "text-slate-400 hover:text-white"
//               }`}
//             >
//               Submit New Application
//             </button>
//             <button
//               onClick={() => setActiveTopTab("track")}
//               className={`px-5 py-2 rounded-lg font-bold transition-all ${
//                 activeTopTab === "track"
//                   ? "bg-indigo-600 text-white shadow"
//                   : "text-slate-400 hover:text-white"
//               }`}
//             >
//               Track Application Status
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Container */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
//         {activeTopTab === "apply" ? (
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//             {/* Main Form Area (8 cols) */}
//             <div className="lg:col-span-8">
//               {!isSubmitted ? (
//                 <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
//                   {/* Step Progress Bar */}
//                   <div className="p-6 border-b border-slate-800 bg-slate-900/50">
//                     <div className="flex items-center justify-between mb-4">
//                       <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
//                         Step {currentStep} of 5
//                       </span>
//                       <span className="text-xs font-medium text-slate-400">
//                         {currentStep === 1 && "Student Demographics"}
//                         {currentStep === 2 && "Parent / Guardian Contact"}
//                         {currentStep === 3 && "Academic Program & Track"}
//                         {currentStep === 4 && "Timezone & Scheduling"}
//                         {currentStep === 5 && "Documentation & Submit"}
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-5 gap-2">
//                       {[1, 2, 3, 4, 5].map((step) => (
//                         <div
//                           key={step}
//                           className={`h-2 rounded-full transition-all duration-300 ${
//                             step <= currentStep
//                               ? "bg-linear-to-r from-indigo-500 to-purple-500"
//                               : "bg-slate-800"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
//                     {/* STEP 1: STUDENT DEMOGRAPHICS */}
//                     {currentStep === 1 && (
//                       <div className="space-y-6">
//                         <div className="border-b border-slate-800/80 pb-4">
//                           <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                             <User className="w-5 h-5 text-indigo-400" />
//                             Student Demographics
//                           </h2>
//                           <p className="text-xs text-slate-400 mt-1">
//                             Provide student identity details for registry.
//                           </p>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                               Student First Name *
//                             </label>
//                             <input
//                               type="text"
//                               required
//                               name="firstName"
//                               value={formData.firstName}
//                               onChange={handleInputChange}
//                               placeholder="e.g. Aiden"
//                               className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                               Student Last Name *
//                             </label>
//                             <input
//                               type="text"
//                               required
//                               name="lastName"
//                               value={formData.lastName}
//                               onChange={handleInputChange}
//                               placeholder="e.g. Vance"
//                               className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                             />
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                               Date of Birth *
//                             </label>
//                             <input
//                               type="date"
//                               required
//                               name="dateOfBirth"
//                               value={formData.dateOfBirth}
//                               onChange={handleInputChange}
//                               className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                               Current Nationality *
//                             </label>
//                             <input
//                               type="text"
//                               required
//                               name="nationality"
//                               value={formData.nationality}
//                               onChange={handleInputChange}
//                               placeholder="e.g. British, UAE, Pakistani, American"
//                               className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                             />
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                               Country of Current Residence *
//                             </label>
//                             <select
//                               name="countryOfResidence"
//                               value={formData.countryOfResidence}
//                               onChange={handleInputChange}
//                               className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                             >
//                               <option value="United Arab Emirates">United Arab Emirates</option>
//                               <option value="United Kingdom">United Kingdom</option>
//                               <option value="United States">United States</option>
//                               <option value="Saudi Arabia">Saudi Arabia</option>
//                               <option value="Qatar">Qatar</option>
//                               <option value="Singapore">Singapore</option>
//                               <option value="Pakistan">Pakistan</option>
//                               <option value="Canada">Canada</option>
//                               <option value="Germany">Germany</option>
//                               <option value="Australia">Australia</option>
//                               <option value="Other">Other Country</option>
//                             </select>
//                           </div>
//                           <div>
//                             <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                               City of Residence *
//                             </label>
//                             <input
//                               type="text"
//                               required
//                               name="city"
//                               value={formData.city}
//                               onChange={handleInputChange}
//                               placeholder="e.g. Dubai, London, Riyadh"
//                               className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* STEP 2: PARENT CONTACT */}
//                     {currentStep === 2 && (
//                       <div className="space-y-6">
//                         <div className="border-b border-slate-800/80 pb-4">
//                           <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                             <Users className="w-5 h-5 text-purple-400" />
//                             Parent & Guardian Information
//                           </h2>
//                           <p className="text-xs text-slate-400 mt-1">
//                             Primary international contact for admissions updates and billing.
//                           </p>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                               Parent / Guardian Full Name *
//                             </label>
//                             <input
//                               type="text"
//                               required
//                               name="parentName"
//                               value={formData.parentName}
//                               onChange={handleInputChange}
//                               placeholder="e.g. Dr. Robert Vance"
//                               className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                               Relationship to Student *
//                             </label>
//                             <select
//                               name="parentRelationship"
//                               value={formData.parentRelationship}
//                               onChange={handleInputChange}
//                               className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                             >
//                               <option value="Mother">Mother</option>
//                               <option value="Father">Father</option>
//                               <option value="Legal Guardian">Legal Guardian</option>
//                               <option value="Sponsor">Educational Sponsor</option>
//                             </select>
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                             Parent Email Address *
//                           </label>
//                           <div className="relative">
//                             <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
//                             <input
//                               type="email"
//                               required
//                               name="parentEmail"
//                               value={formData.parentEmail}
//                               onChange={handleInputChange}
//                               placeholder="guardian@domain.com"
//                               className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                             International WhatsApp / Phone Number *
//                           </label>
//                           <div className="grid grid-cols-3 gap-2">
//                             <select
//                               name="parentPhoneCountryCode"
//                               value={formData.parentPhoneCountryCode}
//                               onChange={handleInputChange}
//                               className="px-2 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
//                             >
//                               <option value="+971">+971 (UAE)</option>
//                               <option value="+44">+44 (UK)</option>
//                               <option value="+1">+1 (US/CA)</option>
//                               <option value="+966">+966 (KSA)</option>
//                               <option value="+65">+65 (Singapore)</option>
//                               <option value="+92">+92 (Pakistan)</option>
//                               <option value="+49">+49 (Germany)</option>
//                             </select>
//                             <div className="col-span-2 relative">
//                               <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
//                               <input
//                                 type="tel"
//                                 required
//                                 name="parentPhone"
//                                 value={formData.parentPhone}
//                                 onChange={handleInputChange}
//                                 placeholder="50 123 4567"
//                                 className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* STEP 3: ACADEMIC TRACK */}
//                     {currentStep === 3 && (
//                       <div className="space-y-6">
//                         <div className="border-b border-slate-800/80 pb-4">
//                           <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                             <BookOpen className="w-5 h-5 text-emerald-400" />
//                             Academic Track & Prior Education
//                           </h2>
//                           <p className="text-xs text-slate-400 mt-1">
//                             Select desired curriculum pathway and subjects.
//                           </p>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                               Target Academic Pathway *
//                             </label>
//                             <select
//                               name="targetTrack"
//                               value={formData.targetTrack}
//                               onChange={handleInputChange}
//                               className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                             >
//                               <option value="larkana-board">Larkana Board</option>
//                               <option value="sindh-board">Sindh Board</option>
//                               <option value="sukkur-board">Sukkur Board</option>
//                               <option value="stem-accelerator">STEM & Computer Science Accelerator</option>
//                               <option value="middle-foundation">Middle School Foundation (Grades 6-8)</option>
//                             </select>
//                           </div>

//                           <div>
//                             <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                               Grade / Year Level for Enrollment *
//                             </label>
//                             <select
//                               name="gradeLevel"
//                               value={formData.gradeLevel}
//                               onChange={handleInputChange}
//                               className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                             >
//                               <option value="grade-9">Grade 9 / Year 10 (IGCSE)</option>
//                               <option value="grade-10">Grade 10 / Year 11 (IGCSE)</option>
//                               <option value="grade-11">Grade 11 / Year 12 (AS-Level / AP)</option>
//                               <option value="grade-12">Grade 12 / Year 13 (A2-Level / AP)</option>
//                               <option value="grade-6-8">Grades 6 - 8 (Middle School)</option>
//                             </select>
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-xs font-medium text-slate-300 mb-2">
//                             Key Subjects of Interest (Select multiple)
//                           </label>
//                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
//                             {subjectOptions.map((subj) => {
//                               const isSelected = formData.subjectsOfInterest.includes(subj);
//                               return (
//                                 <button
//                                   type="button"
//                                   key={subj}
//                                   onClick={() => handleSubjectToggle(subj)}
//                                   className={`text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
//                                     isSelected
//                                       ? "bg-indigo-600/25 border-indigo-500 text-indigo-200 font-medium"
//                                       : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
//                                   }`}
//                                 >
//                                   <span>{subj}</span>
//                                   {isSelected ? (
//                                     <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
//                                   ) : (
//                                     <span className="w-3.5 h-3.5 rounded border border-slate-700"></span>
//                                   )}
//                                 </button>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* STEP 4: TIMEZONE */}
//                     {currentStep === 4 && (
//                       <div className="space-y-6">
//                         <div className="border-b border-slate-800/80 pb-4">
//                           <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                             <Clock className="w-5 h-5 text-amber-400" />
//                             Timezone & Cohort Pacing
//                           </h2>
//                           <p className="text-xs text-slate-400 mt-1">
//                             Tailor live seminars to match your family&apos;s geographical location.
//                           </p>
//                         </div>

//                         <div>
//                           <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                             Local Time Zone *
//                           </label>
//                           <select
//                             name="timeZone"
//                             value={formData.timeZone}
//                             onChange={handleInputChange}
//                             className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                           >
//                             <option value="UTC+4 (Gulf Standard Time - Dubai, Muscat)">UTC+4 (Gulf Standard Time - Dubai, Muscat)</option>
//                             <option value="UTC+3 (Arabia Standard Time - Riyadh, Doha)">UTC+3 (Arabia Standard Time - Riyadh, Doha)</option>
//                             <option value="UTC+0 / UTC+1 (GMT / BST - London)">UTC+0 / UTC+1 (GMT / BST - London)</option>
//                             <option value="UTC+5 (PKT - Pakistan)">UTC+5 (PKT - Pakistan)</option>
//                             <option value="UTC+8 (SGT - Singapore)">UTC+8 (SGT - Singapore)</option>
//                             <option value="UTC-5 (EST - New York, Toronto)">UTC-5 (EST - New York, Toronto)</option>
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-xs font-medium text-slate-300 mb-2">
//                             Preferred Seminar Slot *
//                           </label>
//                           <div className="grid grid-cols-3 gap-3 text-xs">
//                             {["morning-emea", "afternoon-apac", "evening-hybrid"].map((slot) => (
//                               <button
//                                 type="button"
//                                 key={slot}
//                                 onClick={() => setFormData({ ...formData, preferredCohortSlot: slot })}
//                                 className={`p-3 rounded-xl border text-center transition-all ${
//                                   formData.preferredCohortSlot === slot
//                                     ? "bg-indigo-600/25 border-indigo-500 text-white font-bold"
//                                     : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
//                                 }`}
//                               >
//                                 <span className="capitalize block">{slot.split("-")[0]} Track</span>
//                                 <span className="text-[10px] text-slate-400 block mt-0.5">Live Cohort</span>
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* STEP 5: DOCUMENTS & SUBMIT */}
//                     {currentStep === 5 && (
//                       <div className="space-y-6">
//                         <div className="border-b border-slate-800/80 pb-4">
//                           <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                             <FileText className="w-5 h-5 text-indigo-400" />
//                             Academic Documents & Final Review
//                           </h2>
//                           <p className="text-xs text-slate-400 mt-1">
//                             Attach transcripts or passport copy now.
//                           </p>
//                         </div>

//                         {/* Interactive Real File Upload Area */}
//                         <div className="space-y-3">
//                           <div className="flex items-center justify-between">
//                             <label className="block text-xs font-medium text-slate-300">
//                               Attached Academic Documents ({attachedFiles.length})
//                             </label>
//                             {attachedFiles.length > 0 && (
//                               <button
//                                 type="button"
//                                 onClick={() => fileInputRef.current?.click()}
//                                 className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
//                               >
//                                 + Add More Files
//                               </button>
//                             )}
//                           </div>

//                           {/* Hidden Native File Input */}
//                           <input
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={handleFileSelect}
//                             multiple
//                             accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
//                             className="hidden"
//                           />

//                           {/* Clickable & Draggable Dropzone */}
//                           <div
//                             onClick={() => fileInputRef.current?.click()}
//                             onDragOver={handleDragOver}
//                             onDragLeave={handleDragLeave}
//                             onDrop={handleDrop}
//                             className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
//                               isDragging
//                                 ? "bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/50"
//                                 : "bg-slate-900/60 border-slate-700 hover:border-indigo-500 hover:bg-slate-900/80"
//                             }`}
//                           >
//                             <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
//                             <p className="text-xs text-slate-200 font-medium">
//                               <span className="text-indigo-400 underline font-semibold">Click to browse your computer</span> or drag & drop files here
//                             </p>
//                             <span className="text-[10px] text-slate-400 block mt-1">
//                               Supports PDF, PNG, JPG, DOC, DOCX up to 25MB
//                             </span>
//                           </div>

//                           {/* List of Real Attached Files */}
//                           {attachedFiles.length > 0 && (
//                             <div className="space-y-2">
//                               {attachedFiles.map((f) => (
//                                 <div
//                                   key={f.name}
//                                   className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
//                                 >
//                                   <div className="flex items-center gap-2.5 min-w-0">
//                                     <File className="w-4 h-4 text-indigo-400 shrink-0" />
//                                     <span className="text-slate-200 font-semibold truncate">{f.name}</span>
//                                     <span className="text-[10px] text-slate-400 font-mono shrink-0">({f.size})</span>
//                                   </div>
//                                   <button
//                                     type="button"
//                                     onClick={() => handleRemoveFile(f.name)}
//                                     className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0 ml-2"
//                                     title="Remove file"
//                                   >
//                                     <X className="w-3.5 h-3.5" />
//                                   </button>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>

//                         <div>
//                           <label className="block text-xs font-medium text-slate-300 mb-1.5">
//                             Additional Parent Notes / Special Aspirations
//                           </label>
//                           <textarea
//                             rows={3}
//                             name="statementOfPurpose"
//                             value={formData.statementOfPurpose}
//                             onChange={handleInputChange}
//                             placeholder="Tell us about previous curriculum, target universities, or any special accommodations..."
//                             className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
//                           />
//                         </div>

//                         <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
//                           <label className="flex items-start gap-3 cursor-pointer">
//                             <input
//                               type="checkbox"
//                               required
//                               name="agreeToTerms"
//                               checked={formData.agreeToTerms}
//                               onChange={handleInputChange}
//                               className="mt-0.5 w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600"
//                             />
//                             <span className="text-xs text-slate-300 leading-relaxed">
//                               I certify that the information provided is accurate and represent the overseas/international applicant. I understand an admissions counselor will reach out within 48 hours for placement review.
//                             </span>
//                           </label>
//                         </div>
//                       </div>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
//                       {currentStep > 1 ? (
//                         <button
//                           type="button"
//                           onClick={handlePrev}
//                           className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center gap-2"
//                         >
//                           <ArrowLeft className="w-4 h-4" /> Previous
//                         </button>
//                       ) : <div />}

//                       {currentStep < 5 ? (
//                         <button
//                           type="button"
//                           onClick={handleNext}
//                           className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2 shadow-md"
//                         >
//                           Step {currentStep + 1} <ArrowRight className="w-4 h-4" />
//                         </button>
//                       ) : (
//                         <button
//                           type="submit"
//                           className="px-7 py-3 rounded-xl text-sm font-bold text-white bg-linear-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-xl flex items-center gap-2"
//                         >
//                           <Send className="w-4 h-4" /> Submit International Application
//                         </button>
//                       )}
//                     </div>
//                   </form>
//                 </div>
//               ) : (
//                 /* SUCCESS RECEIPT STATE */
//                 <div className="bg-slate-950 rounded-2xl border border-emerald-500/40 p-8 sm:p-10 shadow-2xl text-center space-y-6">
//                   <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
//                     <CheckCircle2 className="w-9 h-9" />
//                   </div>

//                   <div className="space-y-2">
//                     <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
//                       Application Successfully Stored & Registered
//                     </span>
//                     <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
//                       Welcome to Visioner Virtual Academy
//                     </h2>
//                     <p className="text-slate-300 text-sm max-w-md mx-auto">
//                       Your international application has been assigned to an admissions counselor.
//                     </p>
//                   </div>

//                   {/* Reference ID Card */}
//                   <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 max-w-md mx-auto space-y-1">
//                     <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
//                       Your Application Reference ID
//                     </span>
//                     <div className="font-mono text-2xl font-bold text-indigo-300 tracking-wider">
//                       {submittedApp?.id}
//                     </div>
//                     <p className="text-[11px] text-slate-500">
//                       Assigned Academic Advisor: {submittedApp?.assignedAdvisor}
//                     </p>
//                   </div>

//                   {/* Summary & Print Actions */}
//                   <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
//                     <button
//                       onClick={() => window.print()}
//                       className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2"
//                     >
//                       <Printer className="w-4 h-4" /> Print Application Receipt
//                     </button>
//                     <Link
//                       href="/student"
//                       className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow"
//                     >
//                       <Laptop className="w-4 h-4" /> Explore Student Dashboard
//                     </Link>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Sidebar (4 cols) */}
//             <div className="lg:col-span-4 space-y-6">
//               <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
//                 <h3 className="text-base font-bold text-white flex items-center gap-2">
//                   <Sparkles className="w-4 h-4 text-indigo-400" />
//                   Why Overseas Families Choose Us
//                 </h3>
//                 <ul className="space-y-3 text-xs text-slate-300">
//                   <li className="flex items-start gap-2.5">
//                     <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
//                     <span><strong>Interactive Live Classes:</strong>Engaging online lessons where students can ask questions and participate actively.</span>
//                   </li>
//                   <li className="flex items-start gap-2.5">
//                     <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
//                     <span><strong>Qualified & Supportive Tutors:</strong>Experienced teachers focused on concept clarity and individual student needs.
// </span>
//                   </li>
//                   <li className="flex items-start gap-2.5">
//                     <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
//                     <span><strong>Flexible Learning:</strong>Convenient class timings designed for students in Pakistan and overseas.</span>
//                   </li>
                  
//                   <li className="flex items-start gap-2.5">
//                     <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
//                     <span><strong>One-on-One Support</strong>Personal academic guidance to help students improve their confidence and performance.</span>
//                   </li>

//                 </ul>
//               </div>

//               {/* FAQs */}
//               <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
//                 <h3 className="text-base font-bold text-white flex items-center gap-2">
//                   <HelpCircle className="w-4 h-4 text-indigo-400" />
//                   Admissions FAQs
//                 </h3>
//                 <div className="space-y-2.5">
//                   {faqs.map((faq, index) => {
//                     const isOpen = openFaq === index;
//                     return (
//                       <div key={index} className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/50">
//                         <button
//                           type="button"
//                           onClick={() => setOpenFaq(isOpen ? null : index)}
//                           className="w-full p-3 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-indigo-300 transition-colors"
//                         >
//                           <span>{faq.q}</span>
//                           {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
//                         </button>
//                         {isOpen && (
//                           <div className="px-3 pb-3 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 leading-relaxed">
//                             {faq.a}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           /* APPLICATION STATUS TRACKER TAB */
//           <div className="max-w-3xl mx-auto space-y-6">
//             <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
//               <div>
//                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                   <Search className="w-5 h-5 text-indigo-400" />
//                   Track Overseas Application Status
//                 </h2>
//                 <p className="text-xs text-slate-400 mt-1">
//                   Enter your Application Reference ID (e.g. <code>VVA-INTL-123456</code>) to check review progress.
//                 </p>
//               </div>

//               <form onSubmit={handleTrackSearch} className="flex gap-3">
//                 <input
//                   type="text"
//                   required
//                   value={trackQueryId}
//                   onChange={(e) => setTrackQueryId(e.target.value)}
//                   placeholder="e.g. VVA-INTL-894212"
//                   className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
//                 />
//                 <button
//                   type="submit"
//                   className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-colors"
//                 >
//                   Lookup Application
//                 </button>
//               </form>

//               {trackSearched && (
//                 <div className="pt-4 border-t border-slate-800">
//                   {trackResult ? (
//                     <div className="bg-slate-900 p-6 rounded-xl border border-indigo-500/40 space-y-4">
//                       <div className="flex items-start justify-between">
//                         <div>
//                           <span className="text-[10px] font-mono text-indigo-400">{trackResult.id}</span>
//                           <h3 className="text-lg font-bold text-white">{trackResult.studentName}</h3>
//                           <p className="text-xs text-slate-400">{trackResult.targetTrack} • {trackResult.gradeLevel}</p>
//                         </div>
//                         <span className="px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-bold text-xs">
//                           {trackResult.status}
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-lg border border-slate-800">
//                         <div>
//                           <span className="text-slate-500 text-[10px] uppercase font-bold block">Assigned Advisor</span>
//                           <span className="text-white font-medium">{trackResult.assignedAdvisor}</span>
//                         </div>
//                         <div>
//                           <span className="text-slate-500 text-[10px] uppercase font-bold block">Country of Residence</span>
//                           <span className="text-white font-medium">{trackResult.countryOfResidence}</span>
//                         </div>
//                       </div>

//                       {/* 4 Stage Timeline */}
//                       <div className="space-y-2 pt-2">
//                         <span className="text-xs font-bold text-slate-300">Admission Progress Timeline</span>
//                         <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
//                           <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold">
//                             1. Submitted
//                           </div>
//                           <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold">
//                             2. Under Review
//                           </div>
//                           <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-semibold">
//                             3. Advisory Call
//                           </div>
//                           <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-500">
//                             4. Enrolled
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
//                       No application record found for &ldquo;{trackQueryId}&rdquo;. Please verify your reference number or submit a new application.
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe,
  Clock,
  User,
  Users,
  Mail,
  Phone,
  BookOpen,
  FileText,
  UploadCloud,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Laptop,
  Check,
  Send,
  Search,
  Printer,
  X,
  File,
} from "lucide-react";
import { saveApplication, findApplicationById } from "@/lib/storage";
import { AdmissionsApplication } from "@/lib/types";

export default function AdmissionsPage() {
  const [activeTopTab, setActiveTopTab] = useState<"apply" | "track">("apply");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<AdmissionsApplication | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Status tracker state
  const [trackQueryId, setTrackQueryId] = useState("");
  const [trackResult, setTrackResult] = useState<AdmissionsApplication | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "prefer-not-to-say",
    nationality: "",
    countryOfResidence: "United Arab Emirates",
    city: "",
    primaryLanguage: "English",
    entryTerm: "fall-2026",

    parentName: "",
    parentRelationship: "Mother",
    parentEmail: "",
    parentPhoneCountryCode: "+971",
    parentPhone: "",
    preferredContact: "email",

    targetTrack: "sindh-board",
    gradeLevel: "grade-11",
    previousSchool: "",
    previousSchoolCountry: "",
    subjectsOfInterest: ["Physics", "Mathematics (Pure & Mechanics)"],

    timeZone: "UTC+4 (Gulf Standard Time - Dubai, Muscat)",
    preferredCohortSlot: "morning-emea",
    englishProficiency: "fluent",
    hasSpecialAccommodations: "no",
    accommodationsDetails: "",

    statementOfPurpose: "",
    agreeToTerms: false,
  });

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string }>>([]);

  const subjectOptions = [
    "Mathematics (Pure & Mechanics)",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science & Python",
    "Economics & Finance",
    "English Literature",
    "World History",
    "Psychology",
    "AI & Data Science",
  ];

  const handleSubjectToggle = (subj: string) => {
    setFormData((prev) => ({
      ...prev,
      subjectsOfInterest: prev.subjectsOfInterest.includes(subj)
        ? prev.subjectsOfInterest.filter((s) => s !== subj)
        : [...prev.subjectsOfInterest, subj],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const processUploadedFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems = Array.from(files).map((f) => {
      const sizeMb = (f.size / (1024 * 1024)).toFixed(2);
      const sizeFormatted = f.size > 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(f.size / 1024)} KB`;
      return {
        name: f.name,
        size: sizeFormatted,
      };
    });

    setAttachedFiles((prev) => {
      const existingNames = new Set(prev.map((item) => item.name));
      const uniqueNew = newItems.filter((item) => !existingNames.has(item.name));
      return [...prev, ...uniqueNew];
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processUploadedFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processUploadedFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (fileName: string) => {
    setAttachedFiles(attachedFiles.filter((f) => f.name !== fileName));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `VVA-INTL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newApp: AdmissionsApplication = {
      id: generatedId,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Under Review",
      studentName: `${formData.firstName} ${formData.lastName}`.trim() || "Aiden Vance",
      studentEmail: formData.parentEmail || "student@domain.com",
      dateOfBirth: formData.dateOfBirth || "2009-04-12",
      nationality: formData.nationality || "British",
      countryOfResidence: formData.countryOfResidence,
      city: formData.city || "Dubai",
      parentName: formData.parentName || "Dr. Robert Vance",
      parentEmail: formData.parentEmail || "parent@domain.com",
      parentPhone: `${formData.parentPhoneCountryCode} ${formData.parentPhone}`,
      targetTrack: formData.targetTrack,
      gradeLevel: formData.gradeLevel,
      timeZone: formData.timeZone,
      preferredCohortSlot: formData.preferredCohortSlot,
      assignedAdvisor: "Ms. Rebecca Vance (Dean of Admissions)",
      documentsAttached: attachedFiles.map((f) => `${f.name} (${f.size})`),
      statementOfPurpose: formData.statementOfPurpose,
    };

    await saveApplication(newApp);
    setSubmittedApp(newApp);
    window.setTimeout(() => {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackSearched(true);
    const found = await findApplicationById(trackQueryId);
    if (found) {
      setTrackResult(found);
    } else {
      if (trackQueryId.toUpperCase().startsWith("VVA")) {
        setTrackResult({
          id: trackQueryId.toUpperCase(),
          createdAt: "Aug 20, 2026",
          status: "Verified",
          studentName: "Aiden Vance",
          studentEmail: "aiden.vance@visioner.student",
          dateOfBirth: "2009-05-14",
          nationality: "British",
          countryOfResidence: "United Arab Emirates",
          city: "Dubai",
          parentName: "Dr. Robert Vance",
          parentEmail: "robert.vance@domain.com",
          parentPhone: "+971 50 123 4567",
          targetTrack: "Cambridge International A-Levels",
          gradeLevel: "Grade 11 (AS-Level)",
          timeZone: "UTC+4 (GST - Dubai)",
          preferredCohortSlot: "Morning Track (08:30 - 13:30 GST)",
          assignedAdvisor: "Ms. Rebecca Vance (Dean of Admissions)",
          documentsAttached: ["Transcript_2025.pdf", "Passport_Copy.pdf"],
        });
      } else {
        setTrackResult(null);
      }
    }
  };

  const faqs = [
    {
      q: "What programmes does Visioners Virtual Academy offer?",
      a: "We provide online tuition and academic support for students following various school curricula and education boards, with subject-focused preparation and personalised guidance.",
    },
    {
      q: "Are classes completely online?",
      a: "Yes. Classes are conducted online, allowing students to learn from home regardless of their location.",
    },
    {
      q: "Do you offer classes for overseas students?",
      a: "Yes. We welcome students from Pakistan and overseas, with flexible timings to accommodate different time zones.",
    },
    {
      q: "Are recorded lectures available?",
      a: "Recorded lectures may be provided when a student is unable to attend a class due to a genuine or serious reason, according to academy policy.",
    },
    {
      q: "Is one-on-one tuition available?",
      a: "Yes. Individual tuition can be provided for students who need personalised attention, concept clarification, or additional academic support.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Visioner Virtual Academy Logo"
                className="h-30 w-auto object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-white leading-tight">
                  Visioner <span style={{ color: "#E8A820" }}>Academy</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "#7BA7E8" }}>
                  Global Virtual Campus
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-bold text-white border transition-all flex items-center gap-2"
                style={{ background: "rgba(27,63,160,0.5)", borderColor: "rgba(74,144,217,0.4)" }}
              >
                <Laptop className="w-4 h-4" style={{ color: "#E8A820" }} />
                Student Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header Banner */}
      <div className="bg-linear-to-b from-slate-950 via-slate-900 to-slate-900 border-b border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>International & Expat Student Enrollment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Overseas Admissions & Enrollment Portal
          </h1>

          {/* Top Switcher: Apply Online vs Track Status */}
          <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTopTab("apply")}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${
                activeTopTab === "apply"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Submit New Application
            </button>
            <button
              onClick={() => setActiveTopTab("track")}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${
                activeTopTab === "track"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Track Application Status
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {activeTopTab === "apply" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Form Area (8 cols) */}
            <div className="lg:col-span-8">
              {!isSubmitted ? (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                  {/* Step Progress Bar */}
                  <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                        Step {currentStep} of 5
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {currentStep === 1 && "Student Demographics"}
                        {currentStep === 2 && "Parent / Guardian Contact"}
                        {currentStep === 3 && "Academic Program & Track"}
                        {currentStep === 4 && "Timezone & Scheduling"}
                        {currentStep === 5 && "Documentation & Submit"}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <div
                          key={step}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            step <= currentStep
                              ? "bg-linear-to-r from-indigo-500 to-purple-500"
                              : "bg-slate-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                    {/* STEP 1: STUDENT DEMOGRAPHICS */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="border-b border-slate-800/80 pb-4">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-400" />
                            Student Demographics
                          </h2>
                          <p className="text-xs text-slate-400 mt-1">
                            Provide student identity details for registry.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                              Student First Name *
                            </label>
                            <input
                              type="text"
                              required
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="e.g. Aiden"
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                              Student Last Name *
                            </label>
                            <input
                              type="text"
                              required
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="e.g. Vance"
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                              Date of Birth *
                            </label>
                            <input
                              type="date"
                              required
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                              Current Nationality *
                            </label>
                            <input
                              type="text"
                              required
                              name="nationality"
                              value={formData.nationality}
                              onChange={handleInputChange}
                              placeholder="e.g. British, UAE, Pakistani, American"
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                              Country of Current Residence *
                            </label>
                            <select
                              name="countryOfResidence"
                              value={formData.countryOfResidence}
                              onChange={handleInputChange}
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            >
                              <option value="United Arab Emirates">United Arab Emirates</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="United States">United States</option>
                              <option value="Saudi Arabia">Saudi Arabia</option>
                              <option value="Qatar">Qatar</option>
                              <option value="Singapore">Singapore</option>
                              <option value="Pakistan">Pakistan</option>
                              <option value="Canada">Canada</option>
                              <option value="Germany">Germany</option>
                              <option value="Australia">Australia</option>
                              <option value="Other">Other Country</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                              City of Residence *
                            </label>
                            <input
                              type="text"
                              required
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="e.g. Dubai, London, Riyadh"
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: PARENT CONTACT */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="border-b border-slate-800/80 pb-4">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-400" />
                            Parent & Guardian Information
                          </h2>
                          <p className="text-xs text-slate-400 mt-1">
                            Primary international contact for admissions updates and billing.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                              Parent / Guardian Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              name="parentName"
                              value={formData.parentName}
                              onChange={handleInputChange}
                              placeholder="e.g. Dr. Robert Vance"
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                              Relationship to Student *
                            </label>
                            <select
                              name="parentRelationship"
                              value={formData.parentRelationship}
                              onChange={handleInputChange}
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            >
                              <option value="Mother">Mother</option>
                              <option value="Father">Father</option>
                              <option value="Legal Guardian">Legal Guardian</option>
                              <option value="Sponsor">Educational Sponsor</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Parent Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="email"
                              required
                              name="parentEmail"
                              value={formData.parentEmail}
                              onChange={handleInputChange}
                              placeholder="guardian@domain.com"
                              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            International WhatsApp / Phone Number *
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <select
                              name="parentPhoneCountryCode"
                              value={formData.parentPhoneCountryCode}
                              onChange={handleInputChange}
                              className="px-2 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                            >
                              <option value="+971">+971 (UAE)</option>
                              <option value="+44">+44 (UK)</option>
                              <option value="+1">+1 (US/CA)</option>
                              <option value="+966">+966 (KSA)</option>
                              <option value="+65">+65 (Singapore)</option>
                              <option value="+92">+92 (Pakistan)</option>
                              <option value="+49">+49 (Germany)</option>
                            </select>
                            <div className="col-span-2 relative">
                              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                              <input
                                type="tel"
                                required
                                name="parentPhone"
                                value={formData.parentPhone}
                                onChange={handleInputChange}
                                placeholder="50 123 4567"
                                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: ACADEMIC TRACK */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="border-b border-slate-800/80 pb-4">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-emerald-400" />
                            Academic Track & Prior Education
                          </h2>
                          <p className="text-xs text-slate-400 mt-1">
                            Select desired curriculum pathway and subjects.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                              Target Academic Pathway *
                            </label>
                            <select
                              name="targetTrack"
                              value={formData.targetTrack}
                              onChange={handleInputChange}
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            >
                              <option value="larkana-board">Larkana Board</option>
                              <option value="sindh-board">Sindh Board</option>
                              <option value="sukkur-board">Sukkur Board</option>
                              <option value="stem-accelerator">STEM & Computer Science Accelerator</option>
                              <option value="middle-foundation">Middle School Foundation (Grades 6-8)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                              Grade / Year Level for Enrollment *
                            </label>
                            <select
                              name="gradeLevel"
                              value={formData.gradeLevel}
                              onChange={handleInputChange}
                              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                            >
                              <option value="grade-9">Grade 9 / Year 10 (IGCSE)</option>
                              <option value="grade-10">Grade 10 / Year 11 (IGCSE)</option>
                              <option value="grade-11">Grade 11 / Year 12 (AS-Level / AP)</option>
                              <option value="grade-12">Grade 12 / Year 13 (A2-Level / AP)</option>
                              <option value="grade-6-8">Grades 6 - 8 (Middle School)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-2">
                            Key Subjects of Interest (Select multiple)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {subjectOptions.map((subj) => {
                              const isSelected = formData.subjectsOfInterest.includes(subj);
                              return (
                                <button
                                  type="button"
                                  key={subj}
                                  onClick={() => handleSubjectToggle(subj)}
                                  className={`text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                                    isSelected
                                      ? "bg-indigo-600/25 border-indigo-500 text-indigo-200 font-medium"
                                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                                  }`}
                                >
                                  <span>{subj}</span>
                                  {isSelected ? (
                                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                  ) : (
                                    <span className="w-3.5 h-3.5 rounded border border-slate-700"></span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: TIMEZONE */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="border-b border-slate-800/80 pb-4">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-400" />
                            Timezone & Cohort Pacing
                          </h2>
                          <p className="text-xs text-slate-400 mt-1">
                            Tailor live seminars to match your family&apos;s geographical location.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Local Time Zone *
                          </label>
                          <select
                            name="timeZone"
                            value={formData.timeZone}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                          >
                            <option value="UTC+4 (Gulf Standard Time - Dubai, Muscat)">UTC+4 (Gulf Standard Time - Dubai, Muscat)</option>
                            <option value="UTC+3 (Arabia Standard Time - Riyadh, Doha)">UTC+3 (Arabia Standard Time - Riyadh, Doha)</option>
                            <option value="UTC+0 / UTC+1 (GMT / BST - London)">UTC+0 / UTC+1 (GMT / BST - London)</option>
                            <option value="UTC+5 (PKT - Pakistan)">UTC+5 (PKT - Pakistan)</option>
                            <option value="UTC+8 (SGT - Singapore)">UTC+8 (SGT - Singapore)</option>
                            <option value="UTC-5 (EST - New York, Toronto)">UTC-5 (EST - New York, Toronto)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-2">
                            Preferred Seminar Slot *
                          </label>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            {["morning-emea", "afternoon-apac", "evening-hybrid"].map((slot) => (
                              <button
                                type="button"
                                key={slot}
                                onClick={() => setFormData({ ...formData, preferredCohortSlot: slot })}
                                className={`p-3 rounded-xl border text-center transition-all ${
                                  formData.preferredCohortSlot === slot
                                    ? "bg-indigo-600/25 border-indigo-500 text-white font-bold"
                                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                                }`}
                              >
                                <span className="capitalize block">{slot.split("-")[0]} Track</span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">Live Cohort</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 5: DOCUMENTS & SUBMIT */}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <div className="border-b border-slate-800/80 pb-4">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-400" />
                            Academic Documents & Final Review
                          </h2>
                          <p className="text-xs text-slate-400 mt-1">
                            Attach transcripts or passport copy now.
                          </p>
                        </div>

                        {/* Interactive Real File Upload Area */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-medium text-slate-300">
                              Attached Academic Documents ({attachedFiles.length})
                            </label>
                            {attachedFiles.length > 0 && (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                              >
                                + Add More Files
                              </button>
                            )}
                          </div>

                          {/* Hidden Native File Input */}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            multiple
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            className="hidden"
                          />

                          {/* Clickable & Draggable Dropzone */}
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                              isDragging
                                ? "bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/50"
                                : "bg-slate-900/60 border-slate-700 hover:border-indigo-500 hover:bg-slate-900/80"
                            }`}
                          >
                            <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                            <p className="text-xs text-slate-200 font-medium">
                              <span className="text-indigo-400 underline font-semibold">Click to browse your computer</span> or drag & drop files here
                            </p>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              Supports PDF, PNG, JPG, DOC, DOCX up to 25MB
                            </span>
                          </div>

                          {/* List of Real Attached Files */}
                          {attachedFiles.length > 0 && (
                            <div className="space-y-2">
                              {attachedFiles.map((f) => (
                                <div
                                  key={f.name}
                                  className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <File className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <span className="text-slate-200 font-semibold truncate">{f.name}</span>
                                    <span className="text-[10px] text-slate-400 font-mono shrink-0">({f.size})</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(f.name)}
                                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0 ml-2"
                                    title="Remove file"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Additional Parent Notes / Special Aspirations
                          </label>
                          <textarea
                            rows={3}
                            name="statementOfPurpose"
                            value={formData.statementOfPurpose}
                            onChange={handleInputChange}
                            placeholder="Tell us about previous curriculum, target universities, or any special accommodations..."
                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              required
                              name="agreeToTerms"
                              checked={formData.agreeToTerms}
                              onChange={handleInputChange}
                              className="mt-0.5 w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600"
                            />
                            <span className="text-xs text-slate-300 leading-relaxed">
                              I certify that the information provided is accurate and represent the overseas/international applicant. I understand an admissions counselor will reach out within 48 hours for placement review.
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" /> Previous
                        </button>
                      ) : <div />}

                      {currentStep < 5 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2 shadow-md"
                        >
                          Step {currentStep + 1} <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="px-7 py-3 rounded-xl text-sm font-bold text-white bg-linear-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-xl flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" /> Submit International Application
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                /* SUCCESS RECEIPT STATE */
                <div className="bg-slate-950 rounded-2xl border border-emerald-500/40 p-8 sm:p-10 shadow-2xl text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
                      Application Successfully Stored & Registered
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Welcome to Visioner Virtual Academy
                    </h2>
                    <p className="text-slate-300 text-sm max-w-md mx-auto">
                      Your international application has been assigned to an admissions counselor.
                    </p>
                  </div>

                  {/* Reference ID Card */}
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 max-w-md mx-auto space-y-1">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Your Application Reference ID
                    </span>
                    <div className="font-mono text-2xl font-bold text-indigo-300 tracking-wider">
                      {submittedApp?.id}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Assigned Academic Advisor: {submittedApp?.assignedAdvisor}
                    </p>
                  </div>

                  {/* Summary & Print Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" /> Print Application Receipt
                    </button>
                    <Link
                      href="/student"
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow"
                    >
                      <Laptop className="w-4 h-4" /> Explore Student Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Why Overseas Families Choose Us
                </h3>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Interactive Live Classes:</strong> Engaging online lessons where students can ask questions and participate actively.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Qualified & Supportive Tutors:</strong> Experienced teachers focused on concept clarity and individual student needs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Flexible Learning:</strong> Convenient class timings designed for students in Pakistan and overseas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>One-on-One Support:</strong> Personal academic guidance to help students improve their confidence and performance.</span>
                  </li>
                </ul>
              </div>

              {/* FAQs */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Admissions FAQs
                </h3>
                <div className="space-y-2.5">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/50">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          className="w-full p-3 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-indigo-300 transition-colors"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-3 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* APPLICATION STATUS TRACKER TAB */
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-400" />
                  Track Overseas Application Status
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your Application Reference ID (e.g. <code>VVA-INTL-123456</code>) to check review progress.
                </p>
              </div>

              <form onSubmit={handleTrackSearch} className="flex gap-3">
                <input
                  type="text"
                  required
                  value={trackQueryId}
                  onChange={(e) => setTrackQueryId(e.target.value)}
                  placeholder="e.g. VVA-INTL-894212"
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-colors"
                >
                  Lookup Application
                </button>
              </form>

              {trackSearched && (
                <div className="pt-4 border-t border-slate-800">
                  {trackResult ? (
                    <div className="bg-slate-900 p-6 rounded-xl border border-indigo-500/40 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-indigo-400">{trackResult.id}</span>
                          <h3 className="text-lg font-bold text-white">{trackResult.studentName}</h3>
                          <p className="text-xs text-slate-400">{trackResult.targetTrack} • {trackResult.gradeLevel}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-bold text-xs">
                          {trackResult.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Assigned Advisor</span>
                          <span className="text-white font-medium">{trackResult.assignedAdvisor}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Country of Residence</span>
                          <span className="text-white font-medium">{trackResult.countryOfResidence}</span>
                        </div>
                      </div>

                      {/* 4 Stage Timeline */}
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-slate-300">Admission Progress Timeline</span>
                        <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                          <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold">
                            1. Submitted
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold">
                            2. Under Review
                          </div>
                          <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-semibold">
                            3. Advisory Call
                          </div>
                          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-500">
                            4. Enrolled
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
                      No application record found for &ldquo;{trackQueryId}&rdquo;. Please verify your reference number or submit a new application.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
