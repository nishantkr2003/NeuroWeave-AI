"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/index";
import dynamic from "next/dynamic";

const Orb = dynamic(() => import("@/components/effects/Orb"), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const errs: typeof fieldErrors = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      await login(email, password);
      router.push("/app");
    } catch {
      // error shown from store
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] opacity-15 pointer-events-none">
        <Orb hue={160} forceHoverState backgroundColor="#050507" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] bg-[rgba(13,17,23,0.94)] shadow-[0_35px_90px_rgba(0,0,0,0.48)] backdrop-blur-[14px]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(0,229,160,0.18),transparent_28%)] pointer-events-none" />
        <div className="relative grid min-h-[600px] gap-6 md:grid-cols-[340px_minmax(420px,1fr)]">
          <div className="hidden flex-col justify-between gap-6 border-r border-[var(--border-subtle)] bg-[rgba(10,14,22,0.9)] p-8 md:flex">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-[var(--accent-dim)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Secure access
              </span>
              <div className="space-y-3">
                <h2 className="text-3xl font-display font-bold tracking-tight text-[var(--text-primary)]">
                  Welcome back.
                </h2>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  Sign in to your NeuroWeave-AI workspace and keep your media
                  workflows secure, fast, and intelligent.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[var(--text-secondary)]">
              <p className="font-semibold text-[var(--text-primary)]">
                Your workspace includes:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  <span>
                    Instant media analysis and searchable transcripts.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  <span>Secure uploads with automated format validation.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  <span>AI-powered chat and comparison tools on demand.</span>
                </li>
              </ul>
            </div>

            <p className="text-xs leading-5 text-[var(--text-muted)]">
              Designed for teams who want a premium, polished experience when
              working with audio, video, document, and image intelligence.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            <div className="text-center sm:text-left">
              <Link
                href="/"
                className="inline-flex items-center gap-3 mb-6 text-[var(--accent)]"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[var(--accent)] bg-[rgba(99,102,241,0.08)] text-[var(--accent)]">
                  M
                </span>
                <span className="font-display text-lg font-bold tracking-[0.12em] text-[var(--text-primary)] uppercase">
                  NeuroWeave-AI
                </span>
              </Link>
              <h1 className="text-3xl font-display font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                Sign in to continue
              </h1>
              <p className="mt-3 text-sm text-[var(--text-secondary)] sm:text-base">
                Use your account credentials to unlock smarter media workflows
                across your workspace.
              </p>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
              {error && (
                <ErrorMessage
                  message={error}
                  onDismiss={clearError}
                  className="mb-4"
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="you@domain.com"
                  error={fieldErrors.email}
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="••••••••"
                  error={fieldErrors.password}
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                  size="lg"
                >
                  {isLoading ? "Authenticating..." : "Sign In"}
                </Button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
              No account?{" "}
              <Link
                href="/auth/register"
                className="text-[var(--accent)] font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
