// "use client";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/useAuthStore";
// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// import { ErrorMessage } from "@/components/ui/index";
// import dynamic from "next/dynamic";

// const Orb = dynamic(() => import("@/components/effects/Orb"), { ssr: false });

// export default function RegisterPage() {
//   const router = useRouter();
//   const { register, isLoading, error, clearError } = useAuthStore();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirm: "",
//   });
//   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

//   const set =
//     (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
//       setForm((p) => ({ ...p, [k]: e.target.value }));
//       setFieldErrors((p) => ({ ...p, [k]: "" }));
//     };

//   const validate = () => {
//     const errs: Record<string, string> = {};
//     if (!form.name.trim() || form.name.length < 2)
//       errs.name = "Name must be at least 2 characters";
//     if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
//     if (form.password.length < 8)
//       errs.password = "Password must be at least 8 characters";
//     if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
//       errs.password = "Must contain uppercase, lowercase, and number";
//     if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
//     setFieldErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     clearError();
//     if (!validate()) return;
//     try {
//       await register(form.name, form.email, form.password);
//       router.push("/app");
//     } catch {
//       // error shown from store
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center px-4 py-10">
//       <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
//       <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] opacity-15 pointer-events-none">
//         <Orb hue={160} forceHoverState backgroundColor="#050507" />
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 24 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.45, ease: "easeOut" }}
//         className="relative z-10 w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] bg-[rgba(13,17,23,0.94)] shadow-[0_35px_90px_rgba(0,0,0,0.48)] backdrop-blur-[14px]"
//       >
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(0,229,160,0.18),transparent_28%)] pointer-events-none" />
//         <div className="relative grid min-h-[620px] gap-6 md:grid-cols-[340px_minmax(420px,1fr)]">
//           <div className="hidden flex-col justify-between gap-6 border-r border-[var(--border-subtle)] bg-[rgba(10,14,22,0.9)] p-8 md:flex">
//             <div className="space-y-4">
//               <span className="inline-flex rounded-full bg-[var(--accent-dim)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
//                 New user
//               </span>
//               <div className="space-y-3">
//                 <h2 className="text-3xl font-display font-bold tracking-tight text-[var(--text-primary)]">
//                   Build your AI workspace
//                 </h2>
//                 <p className="text-sm leading-6 text-[var(--text-secondary)]">
//                   Create an account to access secure uploads, AI media analysis,
//                   and collaboration tools in one polished platform.
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-3 text-sm text-[var(--text-secondary)]">
//               <p className="font-semibold text-[var(--text-primary)]">
//                 What you get:
//               </p>
//               <ul className="space-y-3">
//                 <li className="flex gap-3">
//                   <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
//                   <span>Secure media uploads with client-side validation.</span>
//                 </li>
//                 <li className="flex gap-3">
//                   <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
//                   <span>
//                     AI-generated insights from documents, audio, images, and
//                     video.
//                   </span>
//                 </li>
//                 <li className="flex gap-3">
//                   <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
//                   <span>
//                     Fast onboarding with a modern, intuitive interface.
//                   </span>
//                 </li>
//               </ul>
//             </div>

//             <p className="text-xs leading-5 text-[var(--text-muted)]">
//               Your account is backed by privacy-first design and a responsive
//               dashboard built for enterprise-grade media workflows.
//             </p>
//           </div>

//           <div className="p-8 sm:p-10">
//             <div className="text-center sm:text-left">
//               <Link
//                 href="/"
//                 className="inline-flex items-center gap-3 mb-6 text-[var(--accent)]"
//               >
//                 <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[var(--accent)] bg-[rgba(99,102,241,0.08)] text-[var(--accent)]">
//                   M
//                 </span>
//                 <span className="font-display text-lg font-bold tracking-[0.12em] text-[var(--text-primary)] uppercase">
//                   NeuroWeave-AI
//                 </span>
//               </Link>
//               <h1 className="text-3xl font-display font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
//                 Create your account
//               </h1>
//               <p className="mt-3 text-sm text-[var(--text-secondary)] sm:text-base">
//                 Start with a secure login and powerful media intelligence in one
//                 place.
//               </p>
//             </div>

//             <div className="mt-8 rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
//               {error && (
//                 <ErrorMessage
//                   message={error}
//                   onDismiss={clearError}
//                   className="mb-4"
//                 />
//               )}

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <Input
//                   label="Full Name"
//                   type="text"
//                   value={form.name}
//                   onChange={set("name")}
//                   placeholder="Jane Smith"
//                   error={fieldErrors.name}
//                   autoComplete="name"
//                 />
//                 <Input
//                   label="Email"
//                   type="email"
//                   value={form.email}
//                   onChange={set("email")}
//                   placeholder="you@domain.com"
//                   error={fieldErrors.email}
//                   autoComplete="email"
//                 />
//                 <Input
//                   label="Password"
//                   type="password"
//                   value={form.password}
//                   onChange={set("password")}
//                   placeholder="Min 8 chars, A-Z, 0-9"
//                   error={fieldErrors.password}
//                   autoComplete="new-password"
//                 />
//                 <Input
//                   label="Confirm Password"
//                   type="password"
//                   value={form.confirm}
//                   onChange={set("confirm")}
//                   placeholder="Repeat password"
//                   error={fieldErrors.confirm}
//                   autoComplete="new-password"
//                 />

//                 {form.password.length > 0 && (
//                   <div className="space-y-3 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-dim)] p-3 text-sm text-[var(--text-secondary)]">
//                     <p className="font-medium text-[var(--text-primary)]">
//                       Password strength
//                     </p>
//                     <div className="grid gap-2 sm:grid-cols-2">
//                       {[
//                         {
//                           label: "8+ characters",
//                           pass: form.password.length >= 8,
//                         },
//                         {
//                           label: "Uppercase letter",
//                           pass: /[A-Z]/.test(form.password),
//                         },
//                         {
//                           label: "Lowercase letter",
//                           pass: /[a-z]/.test(form.password),
//                         },
//                         { label: "Number", pass: /\d/.test(form.password) },
//                       ].map((item) => (
//                         <div
//                           key={item.label}
//                           className="flex items-center gap-2"
//                         >
//                           <span
//                             className={`inline-flex h-2.5 w-2.5 rounded-full ${item.pass ? "bg-[var(--accent)]" : "bg-[var(--border-dim)]"}`}
//                           />
//                           <span>{item.label}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <Button
//                   type="submit"
//                   className="w-full"
//                   loading={isLoading}
//                   size="lg"
//                 >
//                   {isLoading ? "Creating account..." : "Create Account"}
//                 </Button>
//               </form>
//             </div>

//             <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
//               Already have an account?{" "}
//               <Link
//                 href="/auth/login"
//                 className="text-[var(--accent)] font-semibold hover:underline"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }


/* =========================
   REGISTER PAGE UI REDESIGN
   Replace app/auth/register/page.tsx
========================= */

"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui";
import dynamic from "next/dynamic";

const Orb = dynamic(() => import("@/components/effects/Orb"), { ssr: false });

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [k]: e.target.value }));
      setFieldErrors((prev) => ({ ...prev, [k]: "" }));
    };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.name.trim() || form.name.length < 2) {
      errs.name = "Name must be at least 2 characters";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Enter a valid email";
    }

    if (form.password.length < 8) {
      errs.password = "Minimum 8 characters required";
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      errs.password = "Use uppercase, lowercase and number";
    }

    if (form.password !== form.confirm) {
      errs.confirm = "Passwords do not match";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const passwordChecks = [
    { label: "8+ Characters", pass: form.password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(form.password) },
    { label: "Lowercase", pass: /[a-z]/.test(form.password) },
    { label: "Number", pass: /\d/.test(form.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    try {
      await register(form.name, form.email, form.password);
      router.push("/app");
    } catch {}
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(0,229,160,0.12),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]" />

      <div className="absolute -top-24 -right-24 h-[500px] w-[500px] opacity-20">
        <Orb hue={220} forceHoverState backgroundColor="#050507" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid w-full max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl md:grid-cols-[1fr_540px]"
        >
          {/* Left Branding Section */}
          <div className="hidden flex-col justify-between border-r border-white/10 bg-[#0b0f19]/90 p-10 md:flex">
            <div>
              <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">
                Join NeuroWeave
              </span>

              <h1 className="mt-8 text-5xl font-bold leading-tight">
                Build your
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {" "}
                  AI Workspace
                </span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-8 text-white/65">
                Securely upload, analyze, compare, and chat across documents,
                audio, video, and images with one intelligent system.
              </p>
            </div>

            <div className="space-y-5">
              {[
                "Private cloud-secure media workflows",
                "AI-powered cross-media reasoning",
                "Fast onboarding with enterprise-grade UX",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/75">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  {item}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8">
              {[
                ["10+", "Media Types"],
                ["99%", "Accuracy"],
                ["24/7", "Access"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form Section */}
          <div className="p-6 sm:p-10 md:p-12">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/10 font-bold text-indigo-300">
                N
              </span>
              <span className="text-lg font-bold uppercase tracking-[0.25em]">
                NeuroWeave-AI
              </span>
            </Link>

            <div className="mt-8">
              <h2 className="text-4xl font-bold">Create Account</h2>
              <p className="mt-3 text-white/60">
                Start your premium AI workflow today.
              </p>
            </div>

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-[#0c111b]/85 p-8">
              {error && (
                <ErrorMessage
                  message={error}
                  onDismiss={clearError}
                  className="mb-4"
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={set("name")}
                  type="text"
                  placeholder="John Doe"
                  error={fieldErrors.name}
                />

                <Input
                  label="Email"
                  value={form.email}
                  onChange={set("email")}
                  type="email"
                  placeholder="you@example.com"
                  error={fieldErrors.email}
                />

                <Input
                  label="Password"
                  value={form.password}
                  onChange={set("password")}
                  type="password"
                  placeholder="Create secure password"
                  error={fieldErrors.password}
                />

                <Input
                  label="Confirm Password"
                  value={form.confirm}
                  onChange={set("confirm")}
                  type="password"
                  placeholder="Repeat password"
                  error={fieldErrors.confirm}
                />

                {form.password && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="mb-3 text-sm font-medium">
                      Password Strength
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {passwordChecks.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-2 text-sm text-white/70"
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              item.pass ? "bg-cyan-400" : "bg-white/20"
                            }`}
                          />
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                  size="lg"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-white/55">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-indigo-300 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}