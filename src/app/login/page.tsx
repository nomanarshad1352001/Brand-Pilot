"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Kanban,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { productProfile } from "@/lib/mock-data";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@brandpilot.app");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Unable to sign in");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] lg:grid lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-white/10 px-12 py-10 text-white lg:flex lg:flex-col">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400 font-black text-slate-950">
            BP
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">{productProfile.title}</p>
            <p className="text-xs text-slate-400">Wholesale growth command center</p>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-2xl py-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            Built for Amazon wholesale operators
          </div>
          <h1 className="max-w-xl text-5xl font-bold leading-[1.06] tracking-[-0.04em]">
            From first contact to approved account.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            {productProfile.promise}
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-2 gap-3">
            {[
              { icon: Building2, label: "Vendor intelligence" },
              { icon: Kanban, label: "Visual sales pipeline" },
              { icon: Mail, label: "Gmail outreach" },
              { icon: CalendarDays, label: "Smart follow-ups" },
              { icon: Phone, label: "Twilio call tracking" },
              { icon: BarChart3, label: "Conversion KPIs" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-3.5">
                <Icon className="h-4 w-4 text-cyan-300" />
                <span className="text-sm font-medium text-slate-200">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
          <span>BrandPilot demo workspace</span>
          <span>Next.js • Firebase-ready • Google APIs • Twilio</span>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-black text-cyan-300">BP</div>
            <div>
              <p className="font-bold text-slate-950">BrandPilot</p>
              <p className="text-xs text-slate-500">Amazon Wholesale CRM</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure demo access
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to explore a fully populated wholesale acquisition workspace. No database setup is required.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Work email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none ring-cyan-500 transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                <span className="text-xs font-medium text-slate-400">Demo environment</span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-950 outline-none ring-cyan-500 transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Enter workspace <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-900">Demo credentials</p>
                <p className="mt-1 text-sm text-cyan-800">demo@brandpilot.app</p>
                <p className="text-sm text-cyan-800">demo1234</p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            This prototype uses typed dummy data. Actions reset when the demo server restarts.
          </p>
        </div>
      </section>
    </main>
  );
}
